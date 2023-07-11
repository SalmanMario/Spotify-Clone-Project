import {NavLink} from 'react-router-dom';
import {Artist} from '../../models/Artists';
import {routes} from '../../routes/routing';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

export type artistRelatedProp = {
  artist: Artist;
};

export function ArtistRelatedCard({artist}: artistRelatedProp) {
  return (
    <NavLink
      to={routes.artistById({id: artist.id})}
      style={{textDecoration: 'none'}}
    >
      <Card sx={{maxWidth: 200, m: 2}}>
        <CardActionArea>
          <CardMedia
            component="img"
            className="cardImg relatedArtists"
            image={artist.images[1].url}
            alt={artist.name}
          />
          <CardContent>
            <Typography className="overflowTextAlbums">
              {artist.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </NavLink>
  );
}
