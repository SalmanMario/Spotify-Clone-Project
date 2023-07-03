import {Button, Stack} from '@mui/material';
import {useSpotifyUserContext} from '../contexts/SpotifyUser/SpotifyUserContext';

export function Login() {
  const {loginSpotify} = useSpotifyUserContext();

  return (
    <Stack
      sx={{
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Button onClick={loginSpotify}>Login in to spotify</Button>
    </Stack>
  );
}
