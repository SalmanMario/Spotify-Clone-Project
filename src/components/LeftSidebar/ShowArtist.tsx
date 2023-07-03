import {Box} from '@mui/material';
import {FollowingArtist} from './FollowingArtists';
import {Artist} from '../../models/Artists';

export function ShowArtist({artists}: {artists: Artist[]}) {
  return (
    <Box>
      {artists.map(data => (
        <FollowingArtist key={data.id} data={data} />
      ))}
    </Box>
  );
}
