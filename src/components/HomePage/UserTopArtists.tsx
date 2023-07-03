import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import {Artist} from '../../models/Artists';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';

export function UsersTopArtists({data}: {data: Artist}) {
  return (
    <NavLink
      to={routes.artistById({id: data.id})}
      style={{textDecoration: 'none'}}
    >
      <Box mx={2}>
        <Card sx={{maxWidth: 200, my: 2}}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="200"
              style={{padding: '1rem'}}
              image={data.images[1].url}
              alt={data.name}
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
                }}
              >
                {data.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.genres[0]} , {data.genres[1]}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </NavLink>
  );
}
