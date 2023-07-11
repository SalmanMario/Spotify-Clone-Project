import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';
import {Album} from '../../models/Albums';
import moment from 'moment';

interface AlbumGroupProp {
  album_group: Album;
}

export function AppearsAlbumCard({album_group}: AlbumGroupProp) {
  return (
    <NavLink
      to={routes.albumById({id: album_group.id})}
      style={{textDecoration: 'none'}}
    >
      <Card sx={{maxWidth: 200, m: 2}}>
        <CardActionArea>
          <CardMedia
            component="img"
            className="cardImg"
            sx={{padding: '1rem'}}
            image={album_group.images[1].url}
            alt={album_group.name}
          />
          <CardContent>
            <Typography className="overflowTextAlbums">
              {album_group.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {moment(album_group.release_date).format('YYYY')} *{' '}
              {album_group.type}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </NavLink>
  );
}
