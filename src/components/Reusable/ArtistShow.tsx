import {Box, Button, Grid, Typography} from '@mui/material';
import {useQuery} from 'react-query';
import {QueryKeys} from '../../utils/enums';
import {getArtistsRelatedArtists} from '../../services/spotify/Artists';
import {useState} from 'react';
import {routes, useNavigation} from '../../routes/routing';
import {RelatedArtists} from '../HomePage/RelatedArtists';
import {IdProp} from '../../models/common';

export function ArtistShowMore({id = ''}: IdProp) {
  const [showAllRelatedArtists] = useState(false);

  const {navigate} = useNavigation();

  const {data: relatedArtist} = useQuery({
    queryKey: [QueryKeys.GetArtistsRelatedArtists, id],
    queryFn: () => getArtistsRelatedArtists(id),
  });

  const showArtistRelated = () => {
    navigate(routes.artistIdRelated, {id: id});
  };

  const displayRelatedArtists = showAllRelatedArtists
    ? relatedArtist?.artists
    : relatedArtist?.artists.slice(0, 6);
  return (
    <Box>
      <Box mx={2} sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h4">Fans also like</Typography>
        {!showAllRelatedArtists &&
          relatedArtist &&
          relatedArtist.artists.length > 6 && (
            <Button onClick={showArtistRelated}>Show More</Button>
          )}
      </Box>
      <Grid container sx={{display: 'flex'}}>
        {displayRelatedArtists &&
          displayRelatedArtists.map(artist => (
            <RelatedArtists key={artist.id} artists={artist} />
          ))}
      </Grid>
    </Box>
  );
}
