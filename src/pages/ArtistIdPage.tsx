import {Box, Button, CircularProgress, Grid, Typography} from '@mui/material';
import {NavLink, useParams} from 'react-router-dom';
import {
  getArtistAlbums,
  getArtistId,
  getArtistTopTracks,
  getArtistsRelatedArtists,
} from '../services/spotify/Artists';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {Helmet} from 'react-helmet-async';
import {ArtistAlbumsCard} from '../components/HomePage/ArtistAlbumsCard';
import moment from 'moment';
import {
  checkFollowArtistOrUser,
  followArtistOrUser,
  unfollowArtistOrUser,
} from '../services/spotify/Users';
import {QueryKeys} from '../utils/enums';
import {routes} from '../routes/routing';
import {Album} from '../models/Albums';
import {NavigationLeftRight} from '../components/Reusable/NavigationLeftRight';
import {TransformDuration} from '../components/Reusable/TransformDuration';
import {useState} from 'react';
import {RelatedArtists} from '../components/HomePage/RelatedArtists';

export function ViewArtist() {
  const {id = ''} = useParams();

  const [showAll, setShowAll] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);
  const [showAllRelatedArtists, setShowAllRelatedArtists] = useState(false);

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

  const {data: artistTracks} = useQuery({
    queryKey: [QueryKeys.GetArtistTopTrack, id],
    queryFn: () => getArtistTopTracks(id),
  });

  const {data: relatedArtist} = useQuery({
    queryKey: [QueryKeys.GetArtistsRelatedArtists, id],
    queryFn: () => getArtistsRelatedArtists(id),
  });

  const {data: artistAlbums} = useQuery({
    queryKey: [QueryKeys.GetArtistsAlbums, id],
    queryFn: async () => {
      const artists = await getArtistAlbums(id, {
        limit: 50,
        include_groups: ['album'],
      });
      artists.items.sort();
      return artists;
    },
  });
  const followArtistMutation = useMutation({
    mutationFn: followArtistOrUser,
    onSuccess: () => {
      invalidateArtistData();
    },
  });

  const unfollowArtistMutation = useMutation({
    mutationFn: unfollowArtistOrUser,
    onSuccess: () => {
      invalidateArtistData();
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

  const displayedAlbums = showAllAlbums
    ? artistAlbums?.items
    : artistAlbums?.items.slice(0, 6);

  const displayRelatedArtists = showAllRelatedArtists
    ? relatedArtist?.artists
    : relatedArtist?.artists.slice(0, 6);

  const handleToggleAlbums = () => {
    setShowAllAlbums(!showAllAlbums);
  };

  const handleShowArtists = () => {
    setShowAllRelatedArtists(!showAllRelatedArtists);
  };

  const [checkFollowArtist] = checkFollowArtistResult;

  const displayedTracks = showAll
    ? artistTracks?.tracks
    : artistTracks?.tracks.slice(0, 5);

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
      {/* Here is the artist popular tracks */}
      <Typography mt={8} mx={3} variant="h4">
        Popular
      </Typography>
      {displayedTracks &&
        displayedTracks.map((track, index) => (
          <Box
            className="hover-box"
            key={track.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto auto 1fr 1fr auto',
              alignItems: 'center',
              mx: 2,
              my: 2,
            }}
          >
            <Typography
              variant="h6"
              mx={2}
              sx={{width: '30px', textAlign: 'right'}}
            >
              {index + 1}
            </Typography>
            <Box my={1}>
              <img
                className="artistIdPopular"
                src={(track.album as Album).images[2].url}
                alt={track.name}
              />
            </Box>
            <NavLink
              to={routes.trackById({id: track.id})}
              style={{textDecoration: 'none', color: 'white'}}
              className="textUnderline"
            >
              <Typography variant="h6" ml={2}>
                {track.name}
              </Typography>
            </NavLink>
            <Box>
              <Typography variant="body1">
                {moment((track.album as Album).release_date).format('YYYY')}
              </Typography>
            </Box>
            <Box>
              <Typography mr={4} variant="body1">
                {TransformDuration(track.duration_ms)}
              </Typography>
            </Box>
          </Box>
        ))}
      <Box mx={3} mb={5}>
        {!showAll && artistTracks && artistTracks.tracks.length > 5 && (
          <Button onClick={() => setShowAll(true)}>Show More</Button>
        )}
        {showAll && (
          <Button onClick={() => setShowAll(false)}>Show Less</Button>
        )}
      </Box>
      <Box mx={2} sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h4">Albums</Typography>
        {!showAllAlbums && artistAlbums && artistAlbums.items.length > 6 && (
          <Button onClick={handleToggleAlbums}>Show More</Button>
        )}
        {showAllAlbums && (
          <Button onClick={handleToggleAlbums}>Show Less</Button>
        )}
      </Box>
      <Grid container sx={{display: 'flex', justifyContent: 'center'}}>
        {displayedAlbums &&
          displayedAlbums.map(album => (
            <ArtistAlbumsCard key={album.id} album={album} />
          ))}
      </Grid>
      <Box mx={2} sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h4">Fans also like</Typography>
        {!showAllRelatedArtists &&
          relatedArtist &&
          relatedArtist.artists.length > 6 && (
            <Button onClick={handleShowArtists}>Show More</Button>
          )}
        {showAllRelatedArtists && (
          <Button onClick={handleShowArtists}>Show Less</Button>
        )}
      </Box>
      <Grid container sx={{display: 'flex', justifyContent: 'center'}}>
        {displayRelatedArtists &&
          displayRelatedArtists.map(data => (
            <RelatedArtists key={data.id} artists={data} />
          ))}
      </Grid>
    </Box>
  );
}
