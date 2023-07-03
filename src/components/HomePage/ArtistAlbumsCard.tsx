import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import moment from 'moment';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';
import {Album} from '../../models/Albums';

export type ArtistAlbumsCardProps = {
  album: Album;
};
export function ArtistAlbumsCard({album}: ArtistAlbumsCardProps) {
  return (
    <NavLink
      to={routes.albumById({id: album.id})}
      style={{textDecoration: 'none'}}
    >
      <Card sx={{maxWidth: 200, mx: 2, my: 2}}>
        <CardActionArea>
          <CardMedia
            component="img"
            className="cardImg"
            sx={{padding: '1rem'}}
            image={album.images[1].url}
            alt={album.name}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h3"
              sx={{
                height: '2rem',
                lineHeight: '2rem',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontSize: '1.2rem',
                whiteSpace: 'nowrap',
              }}
            >
              {album.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {moment(album.release_date).format('YYYY')} * {album.type}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </NavLink>
  );
}
