import {Box, Paper, Typography} from '@mui/material';
import {getFollowedArtists} from '../../services/spotify/Users';
import {ShowArtist} from './ShowArtist';
import {NavLink} from 'react-router-dom';
import {useQuery} from 'react-query';
import {getCurrentUserPlaylist} from '../../services/spotify/Playlists';
import {QueryKeys} from '../../utils/enums';
import {routes} from '../../routes/routing';
import LikedSong from '../../img/Spotify Favorite Song.jpg';
import {getUserSavedAlbum} from '../../services/spotify/Albums';

export function Library() {
  const {data: getUsersAlbum} = useQuery({
    queryKey: [QueryKeys.GetUsersSavedAlbums],
    queryFn: () => getUserSavedAlbum(),
  });

  const {data: followingArtists, isLoading: followingArtistsLoading} = useQuery(
    {
      queryKey: [QueryKeys.FollowedArtists],
      queryFn: () => getFollowedArtists({type: 'artist', limit: 50}),
    },
  );

  const {data: userPlaylist, isLoading: profileLoading} = useQuery({
    queryKey: [QueryKeys.CurrentUserPlaylist],
    queryFn: () => getCurrentUserPlaylist(),
  });

  if (profileLoading || followingArtistsLoading) {
    return null;
  }

  return (
    <Paper
      sx={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <Typography variant="h4">Library</Typography>
      <Box
        sx={{
          overflow: 'auto',
        }}
      >
        <NavLink
          style={{textDecoration: 'none', color: 'inherit'}}
          to={routes.collectionTracks()}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              m: 1,
            }}
            className="hover-box"
          >
            <img style={{width: 60, height: 60}} src={LikedSong} alt="" />
            <Box m={1}>
              <Typography variant="h6">Liked Songs</Typography>
              <Typography variant="body2">Playlist</Typography>
            </Box>
          </Box>
        </NavLink>
        {getUsersAlbum?.items.map((data, index) => (
          <Box key={index}>
            <NavLink
              to={routes.albumById({id: data.album.id})}
              style={{textDecoration: 'none', color: 'inherit'}}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  m: 1,
                }}
              >
                {data.album.images.length > 0 && (
                  <img
                    style={{width: '60px', height: '60px'}}
                    src={data.album.images[0].url}
                    alt={data.album.name}
                  />
                )}
                <Box sx={{display: 'flex', flexDirection: 'column', m: 1}}>
                  <Typography variant="h6">{data.album.name}</Typography>
                  <Typography variant="body2">
                    Playlist * {data.album.artists[0].name}
                  </Typography>
                </Box>
              </Box>
            </NavLink>
          </Box>
        ))}
        {userPlaylist?.items.map(data => (
          <Box className="hover-box" key={data.id}>
            <NavLink
              to={routes.playlistById({id: data.id})}
              style={{textDecoration: 'none', color: 'inherit'}}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  m: 1,
                }}
              >
                {data.images.length && (
                  <img
                    style={{width: '60px', height: '60px'}}
                    src={data.images[0].url}
                    alt={data.name}
                  />
                )}
                <Box sx={{display: 'flex', flexDirection: 'column', m: 1}}>
                  <Typography variant="h6">{data.name}</Typography>
                  <Typography variant="body2">
                    Playlist * {data.owner.display_name}
                  </Typography>
                </Box>
              </Box>
            </NavLink>
          </Box>
        ))}
        <ShowArtist artists={followingArtists?.artists.items ?? []} />
      </Box>
    </Paper>
  );
}
