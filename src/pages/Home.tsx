import {Box, Button, Grid, Typography} from '@mui/material';
import {useSpotifyUserContext} from '../contexts/SpotifyUser/SpotifyUserContext';
import {Helmet} from 'react-helmet-async';
import {useQuery} from 'react-query';
import {getUsersTopItems} from '../services/spotify/Users';
import {QueryKeys} from '../utils/enums';
import {UsersTopTracks} from '../components/HomePage/UsersTopTracks';
import {UsersTopArtists} from '../components/HomePage/UserTopArtists';

export function Home() {
  const {profile, loginSpotify} = useSpotifyUserContext();

  const {data: userTopItems} = useQuery({
    queryKey: [QueryKeys.GetUsersTopItems],
    queryFn: () =>
      getUsersTopItems('tracks', {
        limit: 6,
      }),
  });

  const {data: userTopArtists} = useQuery({
    queryKey: [QueryKeys.GetUsersTopItemsArtists],
    queryFn: () =>
      getUsersTopItems('artists', {
        limit: 6,
      }),
  });

  return (
    <Box>
      <Helmet title="Home" />
      <Typography mx={3} variant="h1">
        Home Page
      </Typography>
      {/* Favorite songs */}
      <Box sx={{my: 4}}>
        <Typography mx={3} variant="h5">
          Your favorites songs!
        </Typography>
        <Grid container sx={{display: 'flex'}}>
          {userTopItems &&
            userTopItems.items
              .filter(track => track.album && !Array.isArray(track.album))
              .map(track => (
                <UsersTopTracks key={track.id} data={track}></UsersTopTracks>
              ))}
        </Grid>
      </Box>
      <Box sx={{my: 4}}>
        {/* Favorite Artists */}
        <Typography mx={3} variant="h5">
          Your favorite artists!
        </Typography>
        <Grid container sx={{display: 'flex'}}>
          {userTopArtists &&
            userTopArtists.items.map(artists => (
              <UsersTopArtists key={artists.id} data={artists} />
            ))}
        </Grid>
      </Box>
      {/* Here is the loggin */}
      {profile ? (
        <Box>
          User is logged in with {profile.display_name}
          {profile.images.length && (
            <img
              style={{width: 100, height: 100}}
              src={profile.images[0].url}
            />
          )}
        </Box>
      ) : (
        <Box>
          <Button onClick={loginSpotify}>Login in to spotify</Button>
        </Box>
      )}
    </Box>
  );
}
