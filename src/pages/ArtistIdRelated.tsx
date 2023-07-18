import {Box, Grid, Typography} from '@mui/material';
import {useQuery} from 'react-query';
import {QueryKeys} from '../utils/enums';
import {useParams} from 'react-router-dom';
import {getArtistsRelatedArtists} from '../services/spotify/Artists';
import {ArtistRelatedCard} from '../components/HomePage/ArtistRelatedCard';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {ScrollContainerToTop} from '../components/Reusable/ScrollContainerToTop';

export function ArtistRelated() {
  const {id = ''} = useParams();

  const {data: relatedArtist} = useQuery({
    queryKey: [QueryKeys.GetArtistsRelatedArtists, id],
    queryFn: () => getArtistsRelatedArtists(id),
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
        Fans Also Like
      </Typography>
      <Grid container sx={{display: 'flex'}}>
        {relatedArtist &&
          relatedArtist.artists.map((data, id) => (
            <ArtistRelatedCard artist={data} key={id} />
          ))}
      </Grid>
    </Box>
  );
}
