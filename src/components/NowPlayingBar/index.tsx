import {Alert, Box, Button, Stack} from '@mui/material';
import {useMutation, useQuery} from 'react-query';
import {QueryKeys} from '../../utils/enums';
import {
  getAvailableDevices,
  transferPlayback,
} from '../../services/spotify/Player';
import {withPlabackContext} from '../../contexts/PlaybackSDK/withPlayback';
import {TrackDisplay} from './TrackDisplay';
import {usePlaybackSDKContext} from '../../contexts/PlaybackSDK/PlaybackSDKContext';

function NowPlayingBar() {
  const {active, player, track, playbackState} = usePlaybackSDKContext();

  const {data: availableDevices} = useQuery({
    queryKey: [QueryKeys.GetAvailableDevices],
    queryFn: getAvailableDevices,
  });

  const transferPlaybackMutation = useMutation({
    mutationFn: transferPlayback,
  });

  console.log({playbackState, availableDevices});

  // const currentlyPlayingDevice =
  // console.log({data});

  console.log({player, track, active});
  if (!player) {
    return null;
  }

  return (
    <Box
      sx={{flexGrow: 1}}
      style={{
        gridArea: 'now-playing-bar',
      }}
    >
      {track ? (
        <TrackDisplay />
      ) : playbackState ? (
        <Stack direction="row">
          <Alert severity="success">
            Currentyl Playing on {playbackState.device.name}. Playing{' '}
            {playbackState.item.name}
          </Alert>
          <Button
            onClick={() => {
              const thisDevice = availableDevices?.devices.find(
                device => device.name === import.meta.env.VITE_WEBPLAYBACK_NAME,
              );
              if (!thisDevice) {
                console.warn('Attemtping to play on a fucked device');
                return;
              }
              transferPlaybackMutation.mutate(thisDevice.id);
            }}
          >
            Play on this device
          </Button>
        </Stack>
      ) : null}
    </Box>
  );
}

const AppBar = withPlabackContext(NowPlayingBar);
export default AppBar;
