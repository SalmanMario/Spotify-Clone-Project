import {useMutation, useQueryClient} from 'react-query';
import {Track} from '../../models/Tracks';
import {
  removeTrackForCurrentUser,
  saveTrackForCurrentUser,
} from '../../services/spotify/Tracks';
import {Box, Typography} from '@mui/material';
import {TransformDuration} from '../Reusable/TransformDuration';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {QueryKeys} from '../../utils/enums';
import {toast} from 'react-toastify';

type TrackProps = {
  isActive: boolean;
  isFavorite: boolean;
  track: Track;
};

export function TrackComponent({isActive, track, isFavorite}: TrackProps) {
  const queryClient = useQueryClient();

  function invalidateTracks() {
    queryClient.invalidateQueries({
      queryKey: QueryKeys.SaveTrackForCurrentUser,
    });
  }

  const saveTrackArtistMutation = useMutation({
    mutationFn: saveTrackForCurrentUser,
    onSuccess: () => {
      invalidateTracks();
      toast.success('Added to Favorite Songs');
    },
  });

  const removeTrackArtistMutation = useMutation({
    mutationFn: removeTrackForCurrentUser,
    onSuccess: () => {
      invalidateTracks();
      toast.success('Removed from Favorite Songs');
    },
  });

  return (
    <Box
      className={`box-container ${isActive ? 'active' : ''}`}
      sx={{display: 'flex', justifyContent: 'space-around'}}
    >
      {!isFavorite ? (
        <FavoriteBorderIcon
          onClick={() => saveTrackArtistMutation.mutate([track.id])}
          className={`favIconActive ${isActive ? 'active' : ''}`}
        />
      ) : (
        <FavoriteIcon
          style={{color: 'rgb(26, 226, 23)'}}
          className="favoriteIcon"
          onClick={() => removeTrackArtistMutation.mutate([track.id])}
        />
      )}
      <Typography mr={1} variant="body1">
        {TransformDuration(track.duration_ms)}
      </Typography>
    </Box>
  );
}
