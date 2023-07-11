import {Box, Typography} from '@mui/material';
import {NavLink, useNavigate} from 'react-router-dom';
import {Artist} from '../../models/Artists';
import {routes} from '../../routes/routing';

export function FollowingArtist({data}: {data: Artist}) {
  const navigate = useNavigate();

  const goToArtistPage = () => {
    navigate(`/artist/${data.id}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box className="hover-box">
      <NavLink
        to={routes.artistById({id: data.id})}
        style={{textDecoration: 'none', color: 'inherit'}}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            m: 1,
          }}
          onClick={goToArtistPage}
        >
          {data.images && (
            <img
              className="libraryArtistImg"
              src={data.images[0].url}
              alt={data.name}
            />
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 1,
            }}
          >
            <Typography variant="h6">{data.name}</Typography>
            <Typography variant="body2">{data.type}</Typography>
          </Box>
        </Box>
      </NavLink>
    </Box>
  );
}
