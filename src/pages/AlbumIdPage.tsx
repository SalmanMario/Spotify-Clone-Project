import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  checkUserSavedAlbums,
  getAlbumById,
  removeUsersSavedAlbum,
  saveAlbumForCurrentUser,
} from '../services/spotify/Albums';
import {NavLink, useParams} from 'react-router-dom';
import moment from 'moment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {QueryKeys} from '../utils/enums';
import {routes} from '../routes/routing';
import {Artist} from '../models/Artists';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {Helmet} from 'react-helmet-async';

import {checkUserSavedTracks} from '../services/spotify/Tracks';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {AlbumShowMore} from '../components/Reusable/AlbumShow';
import {getArtistId} from '../services/spotify/Artists';
import {AlbumTracks} from '../components/Reusable/AlbumTracks';
import {ScrollContainerToTop} from '../components/Reusable/ScrollContainerToTop';
import {toast} from 'react-toastify';
import {startResumePlayback} from '../services/spotify/Player';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
export function AlbumIdPage() {
  const {id = ''} = useParams();

  const queryClient = useQueryClient();

  function invalidateTracks() {
    queryClient.invalidateQueries({
      queryKey: QueryKeys.CheckUserSavedAlbums,
    });
    queryClient.invalidateQueries({queryKey: QueryKeys.LikedAlbum});
    queryClient.invalidateQueries({queryKey: QueryKeys.GetUsersSavedAlbums});
  }

  const {data: album, isLoading: albumLoading} = useQuery({
    queryKey: [QueryKeys.GetAlbumById, id],
    queryFn: () => getAlbumById(id),
    onSuccess: () => {
      ScrollContainerToTop('main-view');
    },
  });

  const playSongMutation = useMutation({
    mutationFn: startResumePlayback,
  });

  const artistId = Array.isArray(album?.artists)
    ? album?.artists?.[0]?.id ?? ''
    : '';

  const albumId = album?.id;

  const {data: artistsImage} = useQuery({
    queryKey: [QueryKeys.GetArtistById, artistId],
    queryFn: () => getArtistId(artistId || ''),
  });

  const {data: checkUserAlbumsResult} = useQuery({
    queryKey: [QueryKeys.CheckUserSavedAlbums, id],
    queryFn: () => checkUserSavedAlbums([id]),
  });

  const saveAlbumCurrentUserMutation = useMutation({
    mutationFn: saveAlbumForCurrentUser,
    onSuccess: () => {
      invalidateTracks();
      toast.success('Added to your Albums');
    },
  });

  const removeAlbumCurrentMutation = useMutation({
    mutationFn: removeUsersSavedAlbum,
    onSuccess: () => {
      invalidateTracks();
      toast.success('Removed to your Albums');
    },
  });

  const {data: checkUserTracksResult} = useQuery({
    queryKey: [QueryKeys.SaveTrackForCurrentUser, album],
    queryFn: async () => {
      if (album) {
        // console.log('FETCHING WITH IDS', album);
        const LIMIT = 50;
        const request: Promise<boolean[]>[] = [];
        for (let i = 0; i < album.tracks.items.length; i = i + LIMIT) {
          request.push(
            checkUserSavedTracks(
              album.tracks.items.slice(i, i + LIMIT).map(item => item.id),
            ),
          );
        }
        // [[1,2,3],[4,5,6]].flat() => [1,2,3,4,5,6]
        return (await Promise.all(request)).flat();
      }
      return;
    },
  });

  if (albumLoading || !checkUserTracksResult || !checkUserAlbumsResult) {
    return <CircularProgress />;
  }

  const [checkUsersAlbum] = checkUserAlbumsResult;

  if (!album) {
    return <>Album not found</>;
  }
  return (
    <Box>
      <Box mx={4}>
        <NavigationLeftRight />
      </Box>
      {album && (
        <Box mx={4}>
          <Helmet title={`${album.name} - Album by ${album.artists[0].name}`} />
          <Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <img width={250} height={250} src={album.images[1].url} alt="" />
              <Box mx={2}>
                <Typography my={2} variant="h4">
                  {album.type}
                </Typography>
                <Typography my={2} variant="h1">
                  {album.name}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <img
                    style={{width: 25, height: 25, borderRadius: 50}}
                    src={artistsImage?.images[2].url}
                    alt=""
                  />
                  <NavLink
                    to={routes.artistById({
                      id: (album.artists as Artist[])[0].id,
                    })}
                    className="textUnderline"
                  >
                    <Typography mx={1}>{album.artists[0].name}</Typography>
                  </NavLink>
                  •
                  <Typography mx={1}>
                    {moment(album.release_date).format('YYYY')}
                  </Typography>
                  •<Typography mx={1}>{album.total_tracks} songs</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{display: 'flex', alignItems: 'center'}} mt={4}>
            <PlayCircleFilledWhiteIcon
              fontSize="inherit"
              onClick={() => {
                // TODO need to check if song is playing to display different icon and do different action
                playSongMutation.mutate({
                  position_ms: 0,
                  context_uri: `spotify:album:${albumId}`,
                });
              }}
              style={{
                fontSize: '4rem',
                cursor: 'pointer',
                color: 'rgb(26, 226, 23)',
                marginRight: '1rem',
              }}
            />
            {checkUsersAlbum ? (
              <Button
                onClick={() => removeAlbumCurrentMutation.mutate([album.id])}
              >
                <FavoriteIcon
                  style={{color: 'rgb(26, 226, 23)', fontSize: '2.5rem'}}
                />
              </Button>
            ) : (
              <Button
                onClick={() => saveAlbumCurrentUserMutation.mutate([album.id])}
              >
                <FavoriteBorderIcon style={{fontSize: '2.5rem'}} />
              </Button>
            )}
          </Box>
          <Box mt={4}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                mx: 3,
              }}
            >
              <Typography ml={1.5} color="text.secondary" variant="body1">
                #
              </Typography>
              <Typography ml={1.5} color="text.secondary" variant="body1">
                Title
              </Typography>
              <AccessTimeIcon />
            </Box>
            <Divider sx={{mb: 3}}></Divider>
            <AlbumTracks id={albumId || ''} />
          </Box>
        </Box>
      )}
      <Box mt={4}>
        <AlbumShowMore id={artistId || ''} />
      </Box>
    </Box>
  );
}
