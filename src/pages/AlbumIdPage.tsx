import {Box, Divider, Typography} from '@mui/material';
import {useQuery} from 'react-query';
import {getAlbumById} from '../services/spotify/Albums';
import {NavLink, useParams} from 'react-router-dom';
import moment from 'moment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {QueryKeys} from '../utils/enums';
import {routes} from '../routes/routing';
import {Artist} from '../models/Artists';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {Helmet} from 'react-helmet-async';
import {TransformDuration} from '../components/Reusable/TransformDuration';

export function AlbumIdPage() {
  const {id = ''} = useParams();
  const {data: album} = useQuery({
    queryKey: [QueryKeys.GetAlbumById, id],
    queryFn: () => getAlbumById(id),
  });

  return (
    <Box m={4}>
      <Box>
        <NavigationLeftRight />
      </Box>
      {album && (
        <Box>
          <Helmet title={`${album.name} - Album by ${album.artists[0].name}`} />
          <Box>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <img width={250} height={250} src={album.images[1].url} alt="" />
              <Box mx={2}>
                <Typography variant="h4">{album.type}</Typography>
                <Typography variant="h1">{album.name}</Typography>
                <Typography variant="body1">
                  <NavLink
                    to={routes.artistById({
                      id: (album.artists as Artist[])[0].id,
                    })}
                    style={{textDecoration: 'none', color: 'white'}}
                    className="textUnderline"
                  >
                    {album.artists[0].name} *{' '}
                  </NavLink>
                  {moment(album.release_date).format('YYYY')} *{' '}
                  {album.total_tracks} songs
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box mt={8}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                mx: 3,
              }}
            >
              <Typography ml={1.5} variant="body1">
                #
              </Typography>
              <Typography ml={1.5} variant="body1">
                Title
              </Typography>
              <AccessTimeIcon style={{marginRight: 8}} />
            </Box>
            <Divider sx={{mb: 3}}></Divider>
            {album.tracks.items.map((data, index) => (
              <Box
                key={data.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'center',
                  my: 2,
                }}
                className="hover-box"
              >
                <Typography
                  variant="h6"
                  mx={2}
                  sx={{width: '30px', textAlign: 'right'}}
                >
                  {index + 1}
                </Typography>
                <Box>
                  <NavLink
                    to={routes.trackById({id: data.id})}
                    style={{textDecoration: 'none', color: 'white'}}
                    className="textUnderline"
                  >
                    <Typography variant="h6">{data.name}</Typography>
                  </NavLink>
                  <NavLink
                    to={routes.artistById({
                      id: (data.artists as Artist[])[0].id,
                    })}
                    style={{textDecoration: 'none', color: 'white'}}
                    className="textUnderline"
                  >
                    <Typography variant="body1">
                      {(data.artists as Artist[])[0].name}
                    </Typography>
                  </NavLink>
                </Box>
                <Typography mr={4} variant="body1">
                  {TransformDuration(data.duration_ms)}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box mt={4}>
            <Typography variant="body1">
              {moment(album.release_date).format('MMMM D, YYYY')}
            </Typography>
            {album.copyrights.map((data, id) => (
              <Box key={id}>
                <Typography variant="body1">{data.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
