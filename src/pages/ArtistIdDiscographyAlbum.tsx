import {Box, Grid, Typography} from '@mui/material';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {useQuery} from 'react-query';
import {getArtistAlbums} from '../services/spotify/Artists';
import {QueryKeys} from '../utils/enums';
import {useParams} from 'react-router-dom';
import {ArtistAlbumsCard} from '../components/HomePage/ArtistAlbumsCard';
import {ScrollContainerToTop} from '../components/Reusable/ScrollContainerToTop';

export function ArtistIdDiscographyAlbum() {
  const {id = ''} = useParams();

  const {data: artistAlbums} = useQuery({
    queryKey: [QueryKeys.GetArtistsAlbums, id],
    queryFn: async () => {
      const artists = await getArtistAlbums(id, {
        limit: 50,
        include_groups: ['album'],
      });
      return artists;
    },
    onSuccess: () => {
      ScrollContainerToTop('#main-view');
    },
  });

  return (
    <Box>
      <Box mx={4}>
        <NavigationLeftRight />
      </Box>
      <Typography m={2} variant="h4">
        {artistAlbums?.items[0].artists[0].name}
      </Typography>
      <Grid container sx={{display: 'flex'}}>
        {artistAlbums &&
          artistAlbums.items.map((data, id) => (
            <ArtistAlbumsCard album={data} key={id} />
          ))}
      </Grid>
    </Box>
  );
}
