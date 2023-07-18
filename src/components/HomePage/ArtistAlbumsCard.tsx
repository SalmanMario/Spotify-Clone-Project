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
      <Card sx={{maxWidth: 175, m: 2}}>
        <CardActionArea>
          <CardMedia
            component="img"
            className="cardImg"
            image={album.images[1].url}
            alt={album.name}
          />
          <CardContent>
            <Typography className="overflowTextAlbums">{album.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {moment(album.release_date).format('YYYY')} * {album.type}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </NavLink>
  );
}
