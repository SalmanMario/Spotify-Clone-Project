import {Box, Button, CircularProgress, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import {getArtistId} from '../services/spotify/Artists';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {Helmet} from 'react-helmet-async';
import {
  checkFollowArtistOrUser,
  followArtistOrUser,
  unfollowArtistOrUser,
} from '../services/spotify/Users';
import {QueryKeys} from '../utils/enums';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {AlbumShowMore} from '../components/Reusable/AlbumShow';
import {ArtistShowMore} from '../components/Reusable/ArtistShow';
import {PopularTrack} from '../components/Reusable/PopularTrack';
import {toast} from 'react-toastify';
import {AppearsAlbums} from '../components/Reusable/AppearsAlbums';

export function ViewArtist() {
  const {id = ''} = useParams();

  const queryClient = useQueryClient();

  function invalidateArtistData() {
    queryClient.invalidateQueries({
      queryKey: QueryKeys.CheckFollowArtistOrUser,
    });
    queryClient.invalidateQueries({queryKey: QueryKeys.FollowedArtists});
  }

  const {data: artist, isLoading: artistLoading} = useQuery({
    queryKey: [QueryKeys.GetArtistById, id],
    queryFn: () => getArtistId(id),
  });

  // const {data: artistTracks} = useQuery({
  //   queryKey: [QueryKeys.GetArtistTopTrack, id],
  //   queryFn: () => getArtistTopTracks(id),
  // });

  // const {data: relatedArtist} = useQuery({
  //   queryKey: [QueryKeys.GetArtistsRelatedArtists, id],
  //   queryFn: () => getArtistsRelatedArtists(id),
  // });

  // const {data: artistAlbums} = useQuery({
  //   queryKey: [QueryKeys.GetArtistsAlbums, id],
  //   queryFn: async () => {
  //     const artists = await getArtistAlbums(id, {
  //       limit: 50,
  //       include_groups: ['album'],
  //     });
  //     artists.items.sort();
  //     return artists;
  //   },
  // });

  const followArtistMutation = useMutation({
    mutationFn: followArtistOrUser,
    onSuccess: () => {
      invalidateArtistData();
      toast.success('Added to your Artists');
    },
  });

  const unfollowArtistMutation = useMutation({
    mutationFn: unfollowArtistOrUser,
    onSuccess: () => {
      invalidateArtistData();
      toast.success('Removed from your Artists');
    },
  });

  const {data: checkFollowArtistResult} = useQuery({
    queryKey: [QueryKeys.CheckFollowArtistOrUser, id],
    queryFn: () => checkFollowArtistOrUser([id]),
  });

  if (artistLoading || !checkFollowArtistResult) {
    return <CircularProgress />;
  }
  if (!artist) {
    return <>Artist not found</>;
  }

  const [checkFollowArtist] = checkFollowArtistResult;

  if (artistLoading) {
    return <CircularProgress />;
  }

  return (
    <Box m={4}>
      <NavigationLeftRight />
      {/* Here is the artist page with photo and name */}
      <Helmet title={`${artist.name}`} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {artist.images && artist.images[0] && (
          <img
            style={{
              height: 275,
              width: 275,
              borderRadius: '50%',
            }}
            src={artist.images[0].url}
            alt={artist.name}
          />
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mx: 2,
          }}
        >
          <Typography variant="h1">{artist.name}</Typography>
          <Typography variant="h5">
            {artist.followers.total.toLocaleString()} followers
          </Typography>
        </Box>
      </Box>
      <Box m={4}>
        {checkFollowArtist ? (
          <Button
            variant="outlined"
            onClick={() => unfollowArtistMutation.mutate([id])}
          >
            Unfollow Artist
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => followArtistMutation.mutate([id])}
          >
            Follow Artist
          </Button>
        )}
      </Box>
      {/* Here are the artist popular tracks */}
      <PopularTrack id={id} />
      {/* Redirect to see all artists albums */}
      <AlbumShowMore id={id} />
      {/* Redirect to see all artist related */}
      <ArtistShowMore id={id} />
      {/* Artists Appears_on albums */}
      <AppearsAlbums id={id} />
    </Box>
  );
}
