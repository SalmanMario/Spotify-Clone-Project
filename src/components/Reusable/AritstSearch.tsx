import {Box, Grid, Typography} from '@mui/material';
import {useQuery} from 'react-query';
import {QueryKeys} from '../../utils/enums';
import {getArtistsRelatedArtists} from '../../services/spotify/Artists';
import {useState} from 'react';
import {RelatedArtists} from '../HomePage/RelatedArtists';
import {IdProp} from '../../models/common';

export function ArtistSearch({id = ''}: IdProp) {
  const [showAllRelatedArtists] = useState(false);

  const {data: relatedArtist} = useQuery({
    queryKey: [QueryKeys.GetArtistsRelatedArtists, id],
    queryFn: () => getArtistsRelatedArtists(id),
  });

  const displayRelatedArtists = showAllRelatedArtists
    ? relatedArtist?.artists
    : relatedArtist?.artists.slice(0, 7);
  return (
    <Box>
      <Box m={2} sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h4">Fans also like</Typography>
      </Box>
      <Grid sx={{display: 'flex'}}>
        {displayRelatedArtists &&
          displayRelatedArtists.map(artist => (
            <RelatedArtists key={artist.id} artists={artist} />
          ))}
      </Grid>
    </Box>
  );
}
