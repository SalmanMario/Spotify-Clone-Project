import {Box, Paper, useTheme} from '@mui/material';
import {Outlet} from 'react-router-dom';
import {LeftSidebar} from '../../components/LeftSidebar';
import NowPlayingBar from '../../components/NowPlayingBar';

const APP_LAYOUT_SPACING = 1;

export function AppLayout() {
  const theme = useTheme();
  return (
    <Box
      className="AppLayout"
      sx={{
        gap: theme.spacing(APP_LAYOUT_SPACING),
      }}
      p={APP_LAYOUT_SPACING}
    >
      <LeftSidebar spacing={theme.spacing(APP_LAYOUT_SPACING)} />
      <Paper
        style={{
          gridArea: 'main-view',

          overflow: 'auto',
        }}
      >
        <Outlet />
      </Paper>
      <NowPlayingBar />
    </Box>
  );
}
