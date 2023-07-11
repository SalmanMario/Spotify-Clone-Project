import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import moment from 'moment';
import {Track} from '../../models/Tracks';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';

export function UsersTopTracks({data}: {data: Track}) {
  if (!data.album || Array.isArray(data.album)) {
    return <></>;
  }

  return (
    <NavLink
      to={routes.trackById({id: data.id})}
      style={{textDecoration: 'none', color: 'white'}}
    >
      <Box mx={2}>
        <Card sx={{width: 200, my: 2}}>
          <CardActionArea>
            <CardMedia
              component="img"
              image={data.album?.images[0].url}
              alt={data.name}
              style={{padding: '1rem'}}
            />
            <CardContent>
              <Typography className="overflowTextAlbums">
                {data.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {moment(data.album.release_date).format('YYYY')} * {data.type}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </NavLink>
  );
}
