import {Box, Button, Divider, Typography} from '@mui/material';
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
          gridTemplateColumns: 'auto 1fr 1fr 1fr auto', // Updated grid template columns
          alignItems: 'center',
          mt: 4,
          mx: 4,
        }}
      >
        <Typography sx={{width: '30px', textAlign: 'right'}} variant="body1">
          #
        </Typography>
        <Typography pl={2} variant="body1">
          Title
        </Typography>
        <Typography pl={4} variant="body1">
          Album
        </Typography>
        <Typography variant="body1">Date Added</Typography>
        <Box mr={4}>
          <AccessTimeIcon></AccessTimeIcon>
        </Box>
      </Box>
      <Divider sx={{mb: 4}}></Divider>
      {getUserTracksSaved &&
        getUserTracksSaved.items.map((data, id) => (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto 1fr 1fr 1fr auto', // Updated grid template columns
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
            <img src={data.track.album.images[2].url} alt="" />
            <Box ml={2}>
              <NavLink
                to={routes.trackById({id: data.track.id})}
                style={{textDecoration: 'none', color: 'inherit'}}
                className="textUnderline"
              >
                <Typography variant="h6">{data.track.name}</Typography>
              </NavLink>
              <NavLink
                to={routes.artistById({id: data.track.artists[0].id})}
                style={{textDecoration: 'none', color: 'inherit'}}
                className="textUnderline"
              >
                <Typography variant="body1">
                  {data.track.artists[0].name}
                </Typography>
              </NavLink>
            </Box>
            <NavLink
              to={routes.albumById({id: data.track.album.id})}
              style={{textDecoration: 'none', color: 'inherit'}}
              className="textUnderline"
            >
              <Typography variant="body1">{data.track.album.name}</Typography>
            </NavLink>
            <Typography variant="body1">
              {moment(data.added_at).format('MMM D, YYYY')}
            </Typography>
            <Box mr={3}>
              <Typography variant="body1">
                <Button
                  onClick={() =>
                    removeTrackArtistMutation.mutate([data.track.id])
                  }
                >
                  <FavoriteIcon
                    style={{color: 'rgb(26, 226, 23)', fontSize: '1.5rem'}}
                  ></FavoriteIcon>
                </Button>
                {TransformDuration(data.track.duration_ms)}
              </Typography>
            </Box>
          </Box>
        ))}
    </Box>
  );
}
