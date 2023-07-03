import {Box} from '@mui/material';
import {Navigation} from './Navigation';
import {Library} from './Library';

export type LeftsidebarProps = {
  spacing: string;
};
export function LeftSidebar(props: LeftsidebarProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: props.spacing,
        gridArea: 'left-sidebar',
        gridTemplateRows: 'auto 1fr',
        overflow: 'hidden',
      }}
    >
      <Navigation />
      <Library />
    </Box>
  );
}
