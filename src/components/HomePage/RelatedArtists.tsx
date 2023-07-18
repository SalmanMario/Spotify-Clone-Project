import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import {Artist} from '../../models/Artists';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';

export function RelatedArtists({artists}: {artists: Artist}) {
  return (
    <NavLink
      to={routes.artistById({id: artists.id})}
      style={{textDecoration: 'none'}}
    >
      <Card sx={{maxWidth: 175, m: 2}}>
        <CardActionArea>
          <CardMedia
            component="img"
            className="cardImg relatedArtists"
            image={artists.images[0].url}
            alt={artists.name}
          />
          <CardContent>
            <Typography className="overflowTextAlbums">
              {artists.name}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {artists.type}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </NavLink>
  );
}
