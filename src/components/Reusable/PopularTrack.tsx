import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import {useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import {QueryKeys} from '../../utils/enums';
import {getArtistTopTracks} from '../../services/spotify/Artists';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';
import {TrackComponent} from '../HomePage/TrackComponent';
import {checkUserSavedTracks} from '../../services/spotify/Tracks';
import {Album} from '../../models/Albums';
import moment from 'moment';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import {startResumePlayback} from '../../services/spotify/Player';

export type IdPropPlaylist = {
  id: string;
};

export function PopularTrack({id = ''}: IdPropPlaylist) {
  const [showAll, setShowAll] = useState(false);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  const playSongMutation = useMutation({
    mutationFn: startResumePlayback,
  });

  const {data: artistTracks} = useQuery({
    queryKey: [QueryKeys.GetArtistTopTrack, id],
    queryFn: () => getArtistTopTracks(id),
  });

  const {data: checkUserTracksResult} = useQuery({
    queryKey: [QueryKeys.SaveTrackForCurrentUser, artistTracks],
    queryFn: async () => {
      if (artistTracks) {
        const LIMIT = 50;
        const request: Promise<boolean[]>[] = [];
        for (let i = 0; i < artistTracks.tracks.length; i = i + LIMIT) {
          request.push(
            checkUserSavedTracks(
              artistTracks.tracks.slice(i, i + LIMIT).map(item => item.id),
            ),
          );
        }
        return (await Promise.all(request)).flat();
      }
      return;
    },
  });

  if (!checkUserTracksResult) {
    return <CircularProgress />;
  }

  const displayedTracks = showAll
    ? artistTracks?.tracks
    : artistTracks?.tracks.slice(0, 5);

  if (!checkUserTracksResult) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography mt={8} mx={3} variant="h4">
        Popular
      </Typography>
      {displayedTracks &&
        displayedTracks.map((track, id) => {
          const isActive = selectedBox === id;
          const isHovering = activeTrackId === id;
          return (
            <Box
              className={`${selectedBox === id ? 'selected' : 'hover-box'}`}
              onClick={() => setSelectedBox(id)}
              key={track.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto auto 1fr 1fr 0.2fr',
                alignItems: 'center',
                mx: 2,
                my: 2,
              }}
              onMouseEnter={() => setActiveTrackId(id)}
              onMouseLeave={() => setActiveTrackId(null)}
            >
              {isHovering ? (
                <IconButton
                  size="small"
                  onClick={() => {
                    playSongMutation.mutate({
                      position_ms: 0,
                      uris: [`spotify:track:${track.id}`],
                    });
                  }}
                  style={{width: 45, height: 45}}
                >
                  <PlayCircleFilledWhiteIcon fontSize="inherit" />
                </IconButton>
              ) : (
                <Typography
                  mr={2}
                  sx={{width: '30px', textAlign: 'right'}}
                  variant="body1"
                >
                  {id + 1}
                </Typography>
              )}
              <Box my={1}>
                <img
                  className="artistIdPopular"
                  src={(track.album as Album).images[2].url}
                  alt={track.name}
                />
              </Box>
              <Box>
                <Box className="boxForMargin">
                  <NavLink
                    to={routes.trackById({id: track.id})}
                    className="textUnderline"
                  >
                    <Typography variant="h6" ml={2}>
                      {track.name}
                    </Typography>
                  </NavLink>
                </Box>
              </Box>
              <Box>
                <Typography variant="body1" color="text.secondary">
                  {moment((track.album as Album).release_date).format('YYYY')}
                </Typography>
              </Box>
              <Box>
                <TrackComponent
                  isFavorite={checkUserTracksResult[id]}
                  isActive={isActive}
                  track={track}
                />
              </Box>
            </Box>
          );
        })}
      <Box mx={3} mb={5}>
        {!showAll && artistTracks && artistTracks.tracks.length > 5 && (
          <Button onClick={() => setShowAll(true)}>Show More</Button>
        )}
        {showAll && (
          <Button onClick={() => setShowAll(false)}>Show Less</Button>
        )}
      </Box>
    </Box>
  );
}
