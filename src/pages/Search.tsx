import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
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
import {TrackComponent} from '../components/HomePage/TrackComponent';
import {checkUserSavedTracks} from '../services/spotify/Tracks';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

export function Search() {
  const [searchText, setSearchText] = useQueryParams({
    initialValue: '',
    key: '',
    transformer: String,
    resetOn: '',
  });

  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  const playSongMutation = useMutation({
    mutationFn: startResumePlayback,
  });

  const {data: search, isLoading: isLoading} = useQuery(
    [QueryKeys.Search, debouncedSearchText],
    () =>
      SearchFeature({
        q: debouncedSearchText,
      }),
    {
      enabled: !!debouncedSearchText,
    },
  );

  // vezi ca nu merge play la melodie skip previous etc mikgsnaikolgskp[;'

  const {data: checkUserTracksResult} = useQuery({
    queryKey: [QueryKeys.SaveTrackForCurrentUser, search],
    queryFn: async () => {
      if (search) {
        const LIMIT = 50;
        const request: Promise<boolean[]>[] = [];
        for (let i = 0; i < search.tracks.items.length; i = i + LIMIT) {
          request.push(
            checkUserSavedTracks(
              search.tracks.items.slice(i, i + LIMIT).map(item => item.id),
            ),
          );
        }
        return (await Promise.all(request)).flat();
      }
      return [];
    },
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

  if (isLoading || !checkUserTracksResult) {
    return <CircularProgress />;
  }

  const artistId = search?.artists?.items[0]?.id || '';

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
              {search.tracks.items.slice(0, 4).map((item, id) => {
                const isActive = selectedBox === id;
                const isHovering = activeTrackId === id;
                return (
                  <Box
                    className={`${
                      selectedBox === id ? 'selected' : 'hover-box'
                    }`}
                    onClick={() => setSelectedBox(id)}
                    key={id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto auto 1fr 0.15fr',
                      alignItems: 'center',
                      mx: 2,
                      my: 2,
                    }}
                    onMouseEnter={() => setActiveTrackId(id)}
                    onMouseLeave={() => setActiveTrackId(null)}
                  >
                    {isHovering ? (
                      <IconButton
                        size="small"
                        onClick={() => {
                          playSongMutation.mutate({
                            position_ms: 0,
                            uris: [`spotify:track:${item.id}`],
                          });
                        }}
                        style={{width: 45, height: 45}}
                      >
                        <PlayCircleFilledWhiteIcon fontSize="inherit" />
                      </IconButton>
                    ) : (
                      <Typography
                        mr={2}
                        sx={{width: '30px', textAlign: 'right'}}
                        variant="body1"
                      >
                        {id + 1}
                      </Typography>
                    )}
                    <img
                      style={{width: 45, height: 45}}
                      src={item.album.images[2].url}
                      alt=""
                    />
                    <Box sx={{display: 'flex'}} ml={2}>
                      <Box>
                        <NavLink
                          to={routes.trackById({id: item.id})}
                          className="textUnderline"
                        >
                          <Typography className="ellipsis" variant="h6">
                            {item.name}
                          </Typography>
                        </NavLink>
                        <NavLink
                          to={routes.artistById({id: item.artists[0].id})}
                          className="textUnderline"
                        >
                          <Typography color="text.secondary" variant="body1">
                            {item.artists[0].name}
                          </Typography>
                        </NavLink>
                      </Box>
                    </Box>
                    <Box>
                      <TrackComponent
                        isFavorite={checkUserTracksResult[id]}
                        isActive={isActive}
                        track={item}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      )}
      <AlbumSearch id={artistId} />
      <ArtistSearch id={artistId} />
    </Box>
  );
}
