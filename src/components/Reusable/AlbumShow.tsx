import {useState} from 'react';
import {QueryKeys} from '../../utils/enums';
import {getArtistAlbums} from '../../services/spotify/Artists';
import {useQuery} from 'react-query';
import {Box, Button, Grid, Typography} from '@mui/material';
import {ArtistAlbumsCard} from '../HomePage/ArtistAlbumsCard';
import {routes, useNavigation} from '../../routes/routing';
import {IdProp} from '../../models/common';

export function AlbumShowMore({id = ''}: IdProp) {
  const [showAllAlbums] = useState(false);

  const {navigate} = useNavigation();

  const {data: artistAlbums} = useQuery({
    queryKey: [QueryKeys.GetArtistsAlbums, id, 'album'],
    queryFn: async () => {
      const artists = await getArtistAlbums(id, {
        limit: 50,
        include_groups: ['album'],
      });
      artists.items.sort();
      return artists;
    },
  });

  const showMoreAlbumRedirection = () => {
    navigate(routes.artistIdDiscographyAlbum, {id: id});
  };

  const displayedAlbums = showAllAlbums
    ? artistAlbums?.items
    : artistAlbums?.items.slice(0, 6);

  return (
    <Box>
      <Box mx={2} sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h4">Albums</Typography>
        {!showAllAlbums && artistAlbums && artistAlbums.items.length > 6 && (
          <Button onClick={showMoreAlbumRedirection}>Show More</Button>
        )}
      </Box>
      <Grid container sx={{display: 'flex'}}>
        {displayedAlbums &&
          displayedAlbums.map(album => (
            <ArtistAlbumsCard key={album.id} album={album} />
          ))}
      </Grid>
    </Box>
  );
}
