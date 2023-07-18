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
import {routes} from '../routes/routing';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {Helmet} from 'react-helmet-async';
import {TransformDuration} from '../components/Reusable/TransformDuration';
import {ArtistShowMore} from '../components/Reusable/ArtistShow';
import {AlbumShowMore} from '../components/Reusable/AlbumShow';
import {PopularTrack} from '../components/Reusable/PopularTrack';
import {toast} from 'react-toastify';
import {AppearsAlbums} from '../components/Reusable/AppearsAlbums';
import {getArtistId} from '../services/spotify/Artists';
import {AlbumTracks} from '../components/Reusable/AlbumTracks';
import {ScrollContainerToTop} from '../components/Reusable/ScrollContainerToTop';

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
    onSuccess: () => {
      ScrollContainerToTop('main-view');
    },
  });

  const artistId = Array.isArray(trackById?.artists)
    ? trackById?.artists?.[0]?.id
    : null;

  const {data: artistsImage} = useQuery({
    queryKey: [QueryKeys.GetArtistById, artistId],
    queryFn: () => getArtistId(artistId || ''),
  });

  const saveTrackArtistMutation = useMutation({
    mutationFn: saveTrackForCurrentUser,
    onSuccess: () => {
      invalidateTracks();
      toast.success('Added to Favorite Songs');
    },
  });

  const removeTrackArtistMutation = useMutation({
    mutationFn: removeTrackForCurrentUser,
    onSuccess: () => {
      invalidateTracks();
      toast.success('Removed from Favorite Songs');
    },
  });

  const {data: checkUserTracksResult} = useQuery({
    queryKey: [QueryKeys.SaveTrackForCurrentUser, id],
    queryFn: () => checkUserSavedTracks([id]),
    onSuccess: () => {
      ScrollContainerToTop('main-view');
    },
  });

  if (!checkUserTracksResult) {
    return <CircularProgress />;
  }

  const albumId = Array.isArray(trackById?.album)
    ? trackById?.album?.[0]?.id
    : trackById?.album?.id;

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
    <Box>
      <Box mx={4}>
        <NavigationLeftRight />
      </Box>
      {trackById && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '2rem',
          }}
        >
          <Helmet
            title={`${trackById.name} - by ${trackById.artists[0].name}`}
          />
          <img
            src={trackById.album?.images[1].url}
            style={{width: 250, height: 250}}
            alt=""
          />
          <Box mx={2}>
            <Typography my={2} variant="h6">
              {trackById.type}
            </Typography>
            <Typography my={2} variant="h1">
              {trackById.name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                style={{height: 25, width: 25, borderRadius: 50}}
                src={artistsImage?.images[2].url}
                alt=""
              />
              <NavLink
                to={routes.artistById({id: trackById.artists[0].id})}
                className="textUnderline"
              >
                <Typography mx={1} variant="body1" fontWeight={700}>
                  {trackById.artists[0].name}
                </Typography>
              </NavLink>
              •
              <NavLink
                to={routes.albumById({id: trackById.album?.id ?? ''})}
                className="textUnderline"
              >
                <Typography mx={1} variant="body1">
                  {trackById.album?.name}
                </Typography>
              </NavLink>
              •
              <Typography mx={1} variant="body1">
                {moment(trackById.album?.release_date).format('YYYY')}
              </Typography>
              •
              <Typography ml={1} variant="body1">
                {TransformDuration(trackById.duration_ms)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      <Box m={4}>
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
      {/* Here are the artist popular tracks */}
      <PopularTrack id={artistId || ''} />
      {/* Redirect to see all artists albums */}
      <AlbumShowMore id={artistId || ''} />
      {/* Redirect to see all artist related */}
      <ArtistShowMore id={artistId || ''} />
      {/* Artists Appears_on albums */}
      <AppearsAlbums id={artistId || ''} />
      {/* Album with Tracks */}
      <AlbumTracks id={albumId || ''} />
    </Box>
  );
}
