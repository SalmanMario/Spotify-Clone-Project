import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import {useParams} from 'react-router-dom';
import {getPlaylistById} from '../services/spotify/Playlists';
import {useMutation, useQuery} from 'react-query';
import {QueryKeys} from '../utils/enums';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {Playlist} from '../components/Playlist/Playlist';
import {startResumePlayback} from '../services/spotify/Player';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {Helmet} from 'react-helmet-async';

export function UserPlaylist() {
  const {id = ''} = useParams();

  const {data: playlist, isLoading: playlistLoading} = useQuery({
    queryKey: [QueryKeys.GetPlaylistById, id],
    queryFn: () => getPlaylistById(id),
  });

  const playSongMutation = useMutation({
    mutationFn: startResumePlayback,
  });

  if (playlistLoading) {
    return <CircularProgress />;
  }

  if (!playlist) {
    return <>Playlist not found</>;
  }

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
          <Typography variant="body1">{playlist.type}</Typography>
          <Typography variant="h1">{playlist.name}</Typography>
          <Typography variant="body1">
            {playlist.owner.display_name} * {playlist.followers.total} likes, *{' '}
            {playlist.tracks.total} songs
          </Typography>
        </Box>
      </Box>
      <Box>
        <IconButton size="large">
          <PlayCircleFilledWhiteIcon
            fontSize="inherit"
            onClick={() => {
              // TODO need to check if song is playing to display different icon and do different action
              playSongMutation.mutate({
                position_ms: 0,
                context_uri: `spotify:playlist:${playlist.id}`,
              });
            }}
          />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr 1fr 1fr auto', // Updated grid template columns
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Typography ml={3} variant="body1">
          #
        </Typography>
        <Typography ml={2} variant="body1">
          Title
        </Typography>
        <Typography ml={6} variant="body1">
          Album
        </Typography>
        <Typography ml={2.5} variant="body1">
          Date added
        </Typography>
        <Box mr={4}>
          <AccessTimeIcon></AccessTimeIcon>
        </Box>
      </Box>
      <Divider sx={{mb: 4}}></Divider>
      {playlist &&
        playlist.tracks.items.map((item, id) => (
          <Playlist
            track={item.track}
            key={id}
            position={id + 1}
            onPlayTrack={() => {
              playSongMutation.mutate({
                position_ms: 0,
                uris: [`spotify:track:${item.track.id}`],
              });
            }}
          />
        ))}
    </Box>
  );
}
