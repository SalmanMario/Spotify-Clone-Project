import {Box, Divider, Typography} from '@mui/material';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {QueryKeys} from '../utils/enums';
import {
  getUsersSavedTracks,
  removeTrackForCurrentUser,
} from '../services/spotify/Tracks';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {Helmet} from 'react-helmet-async';
import SpotifyFavoriteImage from '../img/Spotify Favorite Song.jpg';
import moment from 'moment';
import {TransformDuration} from '../components/Reusable/TransformDuration';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {NavLink} from 'react-router-dom';
import {routes} from '../routes/routing';

export function CollectionTracks() {
  const {data: getUserTracksSaved} = useQuery({
    queryKey: [QueryKeys.GetUsersSavedTracks],
    queryFn: () => getUsersSavedTracks(),
  });

  const queryClient = useQueryClient();

  function invalidateTracks() {
    queryClient.invalidateQueries({
      queryKey: QueryKeys.SaveTrackForCurrentUser,
    });
    queryClient.invalidateQueries({queryKey: QueryKeys.LikedTrack});
    queryClient.invalidateQueries({queryKey: QueryKeys.GetUsersSavedTracks});
  }

  const removeTrackArtistMutation = useMutation({
    mutationFn: removeTrackForCurrentUser,
    onSuccess: () => {
      invalidateTracks();
    },
  });

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
          gridTemplateColumns: 'auto 1.42fr 0.85fr 0.8fr 0.1fr',
          alignItems: 'center',
          mt: 4,
          mx: 4,
        }}
      >
        <Typography ml={3} color="text.secondary" variant="body1">
          #
        </Typography>
        <Typography ml={2} color="text.secondary" variant="body1">
          Title
        </Typography>
        <Typography ml={2} color="text.secondary" variant="body1">
          Album
        </Typography>
        <Typography ml={2} color="text.secondary" variant="body1">
          Date Added
        </Typography>
        <Box mr={4}>
          <AccessTimeIcon />
        </Box>
      </Box>
      <Divider sx={{mb: 4}}></Divider>
      {getUserTracksSaved &&
        getUserTracksSaved.items.map((item, id) => (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto 1.5fr 1fr 0.75fr 0.3fr',
              alignItems: 'center',
              my: 2,
              mx: 4,
            }}
            className="hover-box"
            key={id}
          >
            <Typography
              mr={2}
              sx={{width: '30px', textAlign: 'right'}}
              variant="body1"
            >
              {id + 1}
            </Typography>
            <img src={item.track.album.images[2].url} alt="" />
            <Box ml={2}>
              <NavLink
                to={routes.trackById({id: item.track.id})}
                className="textUnderline"
              >
                <Typography variant="h6">{item.track.name}</Typography>
              </NavLink>
              <NavLink
                to={routes.artistById({id: item.track.artists[0].id})}
                className="textUnderline"
              >
                <Typography variant="body1">
                  {item.track.artists[0].name}
                </Typography>
              </NavLink>
            </Box>
            <NavLink
              to={routes.albumById({id: item.track.album.id})}
              className="textUnderline"
            >
              <Typography variant="body1">{item.track.album.name}</Typography>
            </NavLink>
            <Typography variant="body1">
              {moment(item.added_at).format('MMM D, YYYY')}
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-around'}} mr={3}>
              <FavoriteIcon
                className="favoriteIcon"
                style={{color: 'rgb(26, 226, 23)', fontSize: '1.5rem'}}
                onClick={() =>
                  removeTrackArtistMutation.mutate([item.track.id])
                }
              ></FavoriteIcon>
              <Typography variant="body1">
                {TransformDuration(item.track.duration_ms)}
              </Typography>
            </Box>
          </Box>
        ))}
    </Box>
  );
}
