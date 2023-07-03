import {Box, Button, CircularProgress, Typography} from '@mui/material';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {QueryKeys} from '../utils/enums';
import {NavLink, useParams} from 'react-router-dom';
import {
  checkUserSavedTracks,
  getTrackId,
  removeTrackForCurrentUser,
  saveTrackForCurrentUser,
} from '../services/spotify/Tracks';
import moment from 'moment';
import {getArtistTopTracks} from '../services/spotify/Artists';
import {routes} from '../routes/routing';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {Album} from '../models/Albums';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {Helmet} from 'react-helmet-async';
import {TransformDuration} from '../components/Reusable/TransformDuration';

export function TrackIdPage() {
  const {id = ''} = useParams();

  const queryClient = useQueryClient();

  function invalidateTracks() {
    queryClient.invalidateQueries({
      queryKey: QueryKeys.SaveTrackForCurrentUser,
    });
    queryClient.invalidateQueries({queryKey: QueryKeys.LikedTrack});
  }

  const {data: trackById} = useQuery({
    queryKey: [QueryKeys.GetTrackById, id],
    queryFn: () => getTrackId(id),
  });

  const artistId = Array.isArray(trackById?.artists)
    ? trackById?.artists?.[0]?.id
    : null;

  const {data: artistTracks} = useQuery({
    // query keys should remain unchanged
    queryKey: [QueryKeys.GetArtistTopTrack, artistId],
    queryFn: () => {
      if (!artistId) {
        return;
      }
      return getArtistTopTracks(artistId);
    },
  });

  const saveTrackArtistMutation = useMutation({
    mutationFn: saveTrackForCurrentUser,
    onSuccess: () => {
      invalidateTracks();
    },
  });

  const removeTrackArtistMutation = useMutation({
    mutationFn: removeTrackForCurrentUser,
    onSuccess: () => {
      invalidateTracks();
    },
  });

  const {data: checkUserTracksResult} = useQuery({
    queryKey: [QueryKeys.SaveTrackForCurrentUser, id],
    queryFn: () => checkUserSavedTracks([id]),
  });

  if (!checkUserTracksResult) {
    return <CircularProgress />;
  }

  const [checkUserTracks] = checkUserTracksResult;

  if (Array.isArray(trackById?.album)) {
    return (
      <>
        <Typography>
          TrackById Album is an array, should be handled differently{' '}
        </Typography>
      </>
    );
  }
  if (!Array.isArray(trackById?.artists)) {
    return (
      <>
        <Typography>
          TrackById Album is an array, should be handled differently{' '}
        </Typography>
      </>
    );
  }
  return (
    <Box m={4}>
      <NavigationLeftRight />
      {trackById && (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Helmet
            title={`${trackById.name} - by ${trackById.artists[0].name}`}
          />
          <img src={trackById.album?.images[1].url} alt="" />
          <Box mx={2}>
            <Typography my={4} variant="h6">
              {trackById.type}
            </Typography>
            <Typography my={4} variant="h1">
              {trackById.name}
            </Typography>
            <Typography my={4} variant="body1">
              <NavLink
                to={routes.artistById({id: trackById.artists[0].id})}
                style={{textDecoration: 'none', color: 'white'}}
                className="textUnderline"
              >
                {trackById.artists[0].name}
              </NavLink>
              * {''}
              {moment(trackById.album?.release_date).format('YYYY')} *{' '}
              {TransformDuration(trackById.duration_ms)}
            </Typography>
          </Box>
        </Box>
      )}
      <Box mt={4}>
        {checkUserTracks ? (
          <Button onClick={() => removeTrackArtistMutation.mutate([id])}>
            <FavoriteIcon
              style={{color: 'rgb(26, 226, 23)', fontSize: '2.5rem'}}
            ></FavoriteIcon>
          </Button>
        ) : (
          <Button onClick={() => saveTrackArtistMutation.mutate([id])}>
            <FavoriteBorderIcon
              style={{fontSize: '2.5rem'}}
            ></FavoriteBorderIcon>
          </Button>
        )}
      </Box>
      <Typography mt={8} mx={3} variant="h4">
        Popular
      </Typography>
      {artistTracks &&
        artistTracks.tracks.map((track, index) => (
          <Box
            key={track.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto 1fr 1fr auto',
              alignItems: 'center',
              my: 2,
            }}
            className="hover-box"
          >
            <Typography
              variant="h6"
              mx={2}
              sx={{width: '30px', textAlign: 'right'}}
            >
              {index + 1}
            </Typography>
            <Box my={1}>
              <img
                className="artistIdPopular"
                src={(track.album as Album)?.images[2].url}
                alt={track.name}
              />
            </Box>
            <NavLink
              to={routes.trackById({id: track.id})}
              className="textUnderline"
            >
              <Typography variant="h6" ml={2}>
                {track.name}
              </Typography>
            </NavLink>
            <Typography variant="body1" ml={2}>
              {moment((track.album as Album)?.release_date).format('YYYY')}
            </Typography>
            <Typography mr={3} variant="body1">
              {TransformDuration(track.duration_ms)}
            </Typography>
          </Box>
        ))}
      <Typography variant="h4">
        Popular Release by {trackById?.artists[0].name}
      </Typography>
    </Box>
  );
}
