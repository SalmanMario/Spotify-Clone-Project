import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import {useMutation, useQuery} from 'react-query';
import {QueryKeys} from '../utils/enums';
import {SearchFeature} from '../services/spotify/Search';
import {useEffect, useState} from 'react';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {useQueryParams} from './useQueryParams';
import {NavLink} from 'react-router-dom';
import {routes} from '../routes/routing';
import {AlbumSearch} from '../components/Reusable/AlbumSearch';
import {ArtistSearch} from '../components/Reusable/AritstSearch';
import {startResumePlayback} from '../services/spotify/Player';
import {SearchPlaylist} from '../components/Playlist/SearchPlaylist';

export function Search() {
  const [searchText, setSearchText] = useQueryParams({
    initialValue: '',
    key: '',
    transformer: String,
    resetOn: '',
  });

  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  const playSongMutation = useMutation({
    mutationFn: startResumePlayback,
  });

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
    setSearchText(searchText);
  }

  const {data: search, isLoading: isLoading} = useQuery(
    [QueryKeys.Search, debouncedSearchText],
    () => SearchFeature(debouncedSearchText),
    {
      enabled: !!debouncedSearchText,
    },
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  const artistId = search?.artists?.items[0]?.id || '';

  console.log(search);
  return (
    <Box>
      <Box mx={2} sx={{display: 'flex', alignItems: 'center'}}>
        <NavigationLeftRight />
        <TextField
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          style={{marginLeft: '8px'}}
        />
      </Box>
      {searchText && search && (
        <Grid container>
          <Grid mx={2} item md={4}>
            <Typography variant="h5">Top result</Typography>
            {search.artists.items[0] && (
              <NavLink
                className="textUnderline"
                to={routes.artistById({id: artistId})}
              >
                <Grid className="hover-box" bgcolor={'#181818'}>
                  <img
                    style={{
                      borderRadius: '50%',
                      width: 100,
                      height: 100,
                      margin: '2rem 0 0 1rem',
                    }}
                    src={search.artists.items[0]?.images[2]?.url}
                    alt={search.artists.items[0]?.name}
                  />
                  <Box sx={{display: 'flex'}}>
                    <Box m={2} pb={2}>
                      <Typography pb={2} fontSize={'2rem'} variant="h5">
                        {search.artists.items[0]?.name}
                      </Typography>
                      <Button
                        sx={{
                          backgroundColor: 'black',
                          color: 'inherit',
                          borderRadius: 10,
                          fontSize: 12,
                          '&:hover': {
                            background: 'black',
                          },
                        }}
                        variant="contained"
                      >
                        {search.artists.items[0]?.type}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </NavLink>
            )}
          </Grid>
          <Grid mx={2} item md={7}>
            <Typography mb={2} variant="h5">
              Songs
            </Typography>
            <Grid>
              {search.tracks.items.slice(0, 4).map((song, id) => (
                <Box key={id}>
                  <SearchPlaylist
                    track={song}
                    key={id}
                    position={id + 1}
                    onPlayTrack={() => {
                      playSongMutation.mutate({
                        position_ms: 0,
                        uris: [`spotify:track:${song.id}`],
                      });
                    }}
                  />
                </Box>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
      <AlbumSearch id={artistId} />
      <ArtistSearch id={artistId} />
    </Box>
  );
}
