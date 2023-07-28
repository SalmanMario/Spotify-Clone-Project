import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import {NavLink, useParams} from 'react-router-dom';
import {getPlaylistById} from '../services/spotify/Playlists';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {QueryKeys} from '../utils/enums';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {Helmet} from 'react-helmet-async';
import {checkUserSavedTracks} from '../services/spotify/Tracks';
import {
  checkFollowPlaylist,
  followPlaylist,
  getCurrentUserProfile,
  unfollowPlaylist,
} from '../services/spotify/Users';
import {toast} from 'react-toastify';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {startResumePlayback} from '../services/spotify/Player';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import {TrackComponent} from '../components/HomePage/TrackComponent';
import moment from 'moment';
import {useState} from 'react';
import {routes} from '../routes/routing';

export function UserPlaylist() {
  const {id = ''} = useParams();

  const queryClient = useQueryClient();

  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  const {data: playlist, isLoading: playlistLoading} = useQuery({
    queryKey: [QueryKeys.GetPlaylistById, id],
    queryFn: () => getPlaylistById(id),
  });

  const {data: myUser} = useQuery({
    queryKey: [QueryKeys.GetUserProfile],
    queryFn: () => getCurrentUserProfile(),
  });

  const playSongMutation = useMutation({
    mutationFn: startResumePlayback,
  });

  const {data: checkUserTracksResult} = useQuery({
    queryKey: [QueryKeys.SaveTrackForCurrentUser, playlist],
    queryFn: async () => {
      if (playlist) {
        const LIMIT = 50;
        const request: Promise<boolean[]>[] = [];
        for (let i = 0; i < playlist.tracks.items.length; i = i + LIMIT) {
          request.push(
            checkUserSavedTracks(
              playlist.tracks.items
                .slice(i, i + LIMIT)
                .map(item => item.track.id),
            ),
          );
        }
        return (await Promise.all(request)).flat();
      }
      return [];
    },
  });

  function invalidatePlaylistData() {
    queryClient.invalidateQueries({
      queryKey: QueryKeys.CheckFollowPlaylist,
    });
    queryClient.invalidateQueries({
      queryKey: QueryKeys.CurrentUserPlaylist,
    });
  }

  const myUserId = myUser?.id ?? '';
  const ownerId = playlist?.owner.id;

  const {data: checkPlaylistFollow} = useQuery({
    queryKey: [QueryKeys.CheckFollowPlaylist, myUserId],
    queryFn: () => {
      if (myUserId) {
        return checkFollowPlaylist(id, myUserId);
      }
      return null;
    },
  });

  const followPlaylistMutation = useMutation(followPlaylist, {
    onSuccess: () => {
      invalidatePlaylistData();
      toast.success('Added to your Playlist');
    },
  });

  const unfollowPlaylistMutation = useMutation(unfollowPlaylist, {
    onSuccess: () => {
      invalidatePlaylistData();
      toast.success('Removed from your Playlist');
    },
  });

  if (playlistLoading || !checkUserTracksResult || !checkPlaylistFollow) {
    return <CircularProgress />;
  }

  if (!playlist) {
    return <>Playlist not found</>;
  }

  const [checkPlaylist] = checkPlaylistFollow;

  return (
    <Box m={4}>
      <Helmet title={`${playlist.name} by ${playlist.owner.display_name}`} />
      <Box mb={4}>
        <NavigationLeftRight />
      </Box>
      <Box sx={{display: 'flex', alignItems: 'center'}}>
        <img
          style={{width: 232, height: 232}}
          src={playlist.images[0].url}
          alt=""
        />
        <Box ml={2}>
          <Typography my={2} variant="body1">
            {playlist.type}
          </Typography>
          <Typography my={2} variant="h1">
            {playlist.name}
          </Typography>
          <Typography my={2} variant="body1">
            {playlist.owner.display_name} •{' '}
            {playlist.followers.total.toLocaleString()} likes •{' '}
            {playlist.tracks.total} songs
          </Typography>
        </Box>
      </Box>
      <Box sx={{display: 'flex', alignItems: 'center'}} mt={4}>
        <PlayCircleFilledWhiteIcon
          fontSize="inherit"
          onClick={() => {
            // TODO need to check if song is playing to display different icon and do different action
            playSongMutation.mutate({
              position_ms: 0,
              context_uri: `spotify:playlist:${playlist.id}`,
            });
          }}
          style={{
            fontSize: '4rem',
            cursor: 'pointer',
            color: 'rgb(26, 226, 23)',
            marginRight: '1rem',
          }}
        />
        {ownerId !== myUserId && (
          <Button
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={() =>
              checkPlaylist
                ? unfollowPlaylistMutation.mutate(id)
                : followPlaylistMutation.mutate(id)
            }
          >
            {checkPlaylist ? (
              <FavoriteIcon
                style={{
                  color: 'rgb(26, 226, 23)',
                  fontSize: '2rem',
                }}
              />
            ) : (
              <FavoriteBorderIcon
                style={{fontSize: '2rem', marginTop: '0.4rem'}}
              />
            )}
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto auto 1.25fr 1fr 0.75fr 0.25fr',
          alignItems: 'center',
          mt: 4,
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
        <Box ml={5} color="text.secondary">
          <AccessTimeIcon></AccessTimeIcon>
        </Box>
      </Box>
      <Divider sx={{mb: 4}}></Divider>
      {playlist &&
        playlist.tracks.items.map((item, id) => {
          const isActive = selectedBox === id;
          const isHovering = activeTrackId === id;
          return (
            <Box
              className={isActive ? 'selected' : 'hover-box'} // Use CSS classes for hover effect
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
                      context_uri: `spotify:playlist:${playlist.id}`,
                      offset: {
                        position: id,
                      },
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
