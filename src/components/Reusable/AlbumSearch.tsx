import {useState} from 'react';
import {QueryKeys} from '../../utils/enums';
import {getArtistAlbums} from '../../services/spotify/Artists';
import {useQuery} from 'react-query';
import {Box, Grid, Typography} from '@mui/material';
import {ArtistAlbumsCard} from '../HomePage/ArtistAlbumsCard';
import {IdProp} from '../../models/common';

export function AlbumSearch({id = ''}: IdProp) {
  const [showAllAlbums] = useState(false);

  const {data: artistAlbums} = useQuery({
    queryKey: [QueryKeys.GetArtistsAlbums, id, 'album'],
    queryFn: async () => {
      const artists = await getArtistAlbums(id, {
        limit: 50,
        include_groups: ['album'],
      });
      artists.items.sort((a, b) =>
        a.release_date.localeCompare(b.release_date),
      );
      return artists;
    },
  });

  const displayedAlbums = showAllAlbums
    ? artistAlbums?.items
    : artistAlbums?.items.slice(0, 7);

  return (
    <Box>
      <Box mx={2} sx={{display: 'flex'}}>
        <Typography mt={4} variant="h4">
          Albums
        </Typography>
      </Box>
      <Grid sx={{display: 'flex'}}>
        {displayedAlbums &&
          displayedAlbums.map(album => (
            <ArtistAlbumsCard key={album.id} album={album} />
          ))}
      </Grid>
    </Box>
  );
}
