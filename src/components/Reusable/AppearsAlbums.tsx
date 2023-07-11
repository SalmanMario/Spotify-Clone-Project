import {useQuery} from 'react-query';
import {getArtistAlbums} from '../../services/spotify/Artists';
import {QueryKeys} from '../../utils/enums';
import {Box, Grid, Typography} from '@mui/material';
import {AppearsAlbumCard} from '../HomePage/AppearsAlbumCard';
import {IdProp} from '../../models/common';

export function AppearsAlbums({id = ''}: IdProp) {
  const {data: appearsOn} = useQuery({
    queryKey: [QueryKeys.GetArtistsAlbums, id, 'appears_on'],
    queryFn: async () => {
      const artists = await getArtistAlbums(id, {
        limit: 6,
        include_groups: ['appears_on'],
      });
      return artists;
    },
  });

  return (
    <Box>
      <Typography mx={2} variant="h4">
        Appears On
      </Typography>
      <Grid container sx={{display: 'flex'}}>
        {appearsOn &&
          appearsOn.items.map((data, id) => (
            <AppearsAlbumCard album_group={data} key={id}></AppearsAlbumCard>
          ))}
      </Grid>
    </Box>
  );
}
