import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import {useQuery} from 'react-query';
import {QueryKeys} from '../utils/enums';
import {SearchFeature} from '../services/spotify/Search';
import {useQueryParams} from './useQueryParams';
import {useSearchParams} from 'react-router-dom';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {useEffect, useState} from 'react';

export function Search() {
  const [searchText, setSearchText] = useQueryParams({
    initialValue: '',
    key: '',
    transformer: String,
    resetOn: '',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchText = event.target.value;
    setSearchParams(query => {
      query.delete('page');
      if (query.has('search')) {
        query.set('search', searchText);
      } else {
        query.append('search', searchText);
      }
      return query;
    });
    setSearchText(searchText);
  }

  const {data: search, isLoading} = useQuery(
    [QueryKeys.Search, debouncedSearchText], // Use the debounced search text as a dependency
    () => SearchFeature(debouncedSearchText),
    {
      enabled: !!debouncedSearchText,
    },
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  console.log(search);
  return (
    <Box mx={2}>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <NavigationLeftRight />
        <TextField
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          style={{marginLeft: '8px'}}
        />
      </Box>
      {searchText && (
        <Grid container>
          <Grid mx={2} bgcolor={'grey'} item md={4}>
            <Typography variant="h4">Top result</Typography>
            <img
              style={{borderRadius: '50%', width: 100, height: 100}}
              src={search && search.artists.items[0].images[2].url}
              alt=""
            />
            <Typography variant="h4">
              {search && search.artists.items[0].name}
            </Typography>
            <Typography variant="h4">
              {search && search.artists.items[0].type}
            </Typography>
          </Grid>
          <Grid mx={2} item md={7}>
            <Grid>
              <Typography variant="h4">Songs</Typography>
              {search &&
                search.tracks.items.slice(0, 4).map((song, index) => (
                  <Box sx={{display: 'flex', my: 2}} key={index}>
                    <img src={song.album.images[2].url} alt="" />
                    <Box mx={2}>
                      <Typography variant="h6">{song.name}</Typography>
                      <Typography variant="body1">
                        {song.artists[0].name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
