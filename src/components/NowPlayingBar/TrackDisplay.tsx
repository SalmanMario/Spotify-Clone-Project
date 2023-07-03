import {Box, Grid, IconButton, Slider, Stack, Typography} from '@mui/material';
import {
  PauseCircle,
  PlayCircle,
  SkipNext,
  SkipPrevious,
  VolumeDown,
  VolumeUp,
} from '@mui/icons-material';
import {SliderComponent} from './Slider';
import {usePlaybackSDKContext} from '../../contexts/PlaybackSDK/PlaybackSDKContext';
import {useState} from 'react';

export function TrackDisplay() {
  const {player, paused, start, position, setPosition, track} =
    usePlaybackSDKContext();

  const [volume, setVolume] = useState<number>(0.5);

  if (!player || !track) {
    return <></>;
  }

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    player.setVolume(newValue);
    setVolume(newValue);
  };
  return (
    <Grid container>
      <Grid
        sx={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}
        item
        md={4}
      >
        <img style={{width: 56, height: 56}} src={track.album.images[1].url} />
        <Box sx={{display: 'flex', flexDirection: 'column', mx: 3}}>
          <Typography variant="h6">{track.name}</Typography>
          <Typography variant="body2" className="now-playing__artist">
            {track.artists[0].name}
          </Typography>
        </Box>
      </Grid>
      <Grid item md={5}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            size="large"
            onClick={() => {
              player.previousTrack();
            }}
          >
            <SkipPrevious fontSize="inherit" />
          </IconButton>
          <IconButton size="large" onClick={() => player.togglePlay()}>
            {paused ? (
              <PlayCircle fontSize="inherit" />
            ) : (
              <PauseCircle fontSize="inherit" />
            )}
          </IconButton>
          <IconButton
            size="large"
            onClick={() => {
              player.nextTrack();
            }}
          >
            <SkipNext fontSize="inherit" />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>{start}</Typography>
          <SliderComponent
            position={position}
            duration={track.duration_ms}
            setPosition={setPosition}
            onNewPosition={position => {
              player.seek(position);
            }}
          />
          <Typography>{stop}</Typography>
        </Box>
      </Grid>
      <Grid
        sx={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}
        item
        md={3}
      >
        <Box sx={{width: 200}}>
          <Stack spacing={2} direction="row" sx={{mb: 1}} alignItems="center">
            <VolumeDown />
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              sx={{color: 'white'}}
              aria-label="Volume"
            />
            <VolumeUp />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
