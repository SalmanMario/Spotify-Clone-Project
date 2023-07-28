import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import {useMutation, useQuery} from 'react-query';
import {QueryKeys} from '../utils/enums';
import {
  checkUserSavedTracks,
  getUsersSavedTracks,
} from '../services/spotify/Tracks';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {Helmet} from 'react-helmet-async';
import SpotifyFavoriteImage from '../img/Spotify Favorite Song.jpg';
import moment from 'moment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {NavLink} from 'react-router-dom';
import {routes} from '../routes/routing';
import {useState} from 'react';
import {startResumePlayback} from '../services/spotify/Player';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import {TrackComponent} from '../components/HomePage/TrackComponent';

export function CollectionTracks() {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  const {data} = useQuery({
    queryKey: [QueryKeys.GetUsersSavedTracks],
    queryFn: async () => {
      const userSavedTracks = await getUsersSavedTracks();
      if (userSavedTracks) {
        const LIMIT = 50;
        const request: Promise<boolean[]>[] = [];
        for (let i = 0; i < userSavedTracks.items.length; i = i + LIMIT) {
          request.push(
            checkUserSavedTracks(
              userSavedTracks.items
                .slice(i, i + LIMIT)
                .map(item => item.track.id),
            ),
          );
        }
        const trackResults = (await Promise.all(request)).flat();
        return [userSavedTracks, trackResults] as const;
      }
      return [];
    },
    initialData: [],
  });

  const playSongMutation = useMutation({
    mutationFn: startResumePlayback,
  });

  if (!data) {
    return <CircularProgress />;
  }
  const [getUserTracksSaved, checkUserTracksResult] = data;

  return (
    <Box>
      <Box px={4} py={1} className="gradientBox">
        <NavigationLeftRight />
        <Box>
          <Helmet title="Liked Songs" />
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <img
              style={{width: 232, height: 232}}
              src={SpotifyFavoriteImage}
              alt="Liked Songs"
            />
            <Box m={2}>
              <Typography variant="body1">Playlist</Typography>
              <Typography variant="h1">Liked Song</Typography>
              <Typography variant="body1">
                {getUserTracksSaved?.total} songs
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto 1.25fr 1fr 0.75fr 0.25fr',
          alignItems: 'center',
          mt: 4,
          mx: 2,
        }}
      >
        <Typography
          mr={2}
          sx={{width: '30px', textAlign: 'right'}}
          variant="body1"
          color="text.secondary"
        >
          #
        </Typography>
        <Typography color="text.secondary" width={50} variant="body1">
          Title
        </Typography>
        <Box sx={{width: 50, height: 25}}></Box>
        <Typography ml={1} color="text.secondary" variant="body1">
          Album
        </Typography>
        <Typography ml={1} color="text.secondary" variant="body1">
          Date added
        </Typography>
        <Box ml={8} color="text.secondary">
          <AccessTimeIcon></AccessTimeIcon>
        </Box>
      </Box>
      <Divider sx={{mb: 4}}></Divider>
      {getUserTracksSaved &&
        getUserTracksSaved.items.map((item, id) => {
          const isActive = selectedBox === id;
          const isHovering = activeTrackId === id;
          return (
            <Box
              className={`${selectedBox === id ? 'selected' : 'hover-box'}`}
              onClick={() => setSelectedBox(id)}
              key={id}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto auto 1.25fr 1fr 0.75fr 0.25fr',
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
                      uris: [`spotify:track:${item.track.id}`],
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
              <img src={item.track.album.images[2].url} alt="" />
              <Box sx={{display: 'flex'}} ml={2}>
                <Box>
                  <NavLink
                    to={routes.trackById({id: item.track.id})}
                    className="textUnderline"
                  >
                    <Typography className="ellipsis" variant="h6">
                      {item.track.name}
                    </Typography>
                  </NavLink>
                  <NavLink
                    to={routes.artistById({id: item.track.artists[0].id})}
                    className="textUnderline"
                  >
                    <Typography color="text.secondary" variant="body1">
                      {item.track.artists[0].name}
                    </Typography>
                  </NavLink>
                </Box>
              </Box>
              <Box color="text.secondary" sx={{display: 'flex'}}>
                <NavLink
                  to={routes.albumById({id: item.track.album.id})}
                  className="textUnderline"
                >
                  <Typography className="ellipsis" variant="body1">
                    {item.track.album.name}
                  </Typography>
                </NavLink>
              </Box>
              <Typography color="text.secondary" variant="body1">
                {moment(item.added_at).format('MMM D, YYYY')}
              </Typography>
              <Box>
                <TrackComponent
                  isFavorite={checkUserTracksResult[id]}
                  isActive={isActive}
                  track={item.track}
                />
              </Box>
            </Box>
          );
        })}
    </Box>
  );
}
