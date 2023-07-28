import {useMutation, useQuery} from 'react-query';
import {IdProp} from '../../models/common';
import {QueryKeys} from '../../utils/enums';
import {
  checkUserSavedAlbums,
  getAlbumById,
} from '../../services/spotify/Albums';
import {Box, CircularProgress, IconButton, Typography} from '@mui/material';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';
import {Artist} from '../../models/Artists';
import {TrackComponent} from '../HomePage/TrackComponent';
import {useState} from 'react';
import {checkUserSavedTracks} from '../../services/spotify/Tracks';
import moment from 'moment';
import {startResumePlayback} from '../../services/spotify/Player';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

export function AlbumTracks({id = ''}: IdProp) {
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

  const {data: album} = useQuery({
    queryKey: [QueryKeys.GetAlbumById, id],
    queryFn: () => getAlbumById(id),
  });

  const playSongMutation = useMutation({
    mutationFn: startResumePlayback,
  });

  const {data: checkUserAlbumsResult} = useQuery({
    queryKey: [QueryKeys.CheckUserSavedAlbums, id],
    queryFn: () => checkUserSavedAlbums([id]),
  });

  const {data: checkUserTracksResult} = useQuery({
    queryKey: [QueryKeys.SaveTrackForCurrentUser, album],
    queryFn: async () => {
      if (album) {
        // console.log('FETCHING WITH IDS', album);
        const LIMIT = 50;
        const request: Promise<boolean[]>[] = [];
        for (let i = 0; i < album.tracks.items.length; i = i + LIMIT) {
          request.push(
            checkUserSavedTracks(
              album.tracks.items.slice(i, i + LIMIT).map(item => item.id),
            ),
          );
        }
        // [[1,2,3],[4,5,6]].flat() => [1,2,3,4,5,6]
        return (await Promise.all(request)).flat();
      }
      return;
    },
  });

  if (!checkUserTracksResult || !checkUserAlbumsResult) {
    return <CircularProgress />;
  }

  return (
    <Box mt={4}>
      {album && (
        <NavLink
          className="textUnderline"
          to={routes.albumById({id: album.id})}
        >
          <Box
            bgcolor={'rgb(62, 62, 62)'}
            sx={{display: 'flex', alignItems: 'center'}}
          >
            <img
              style={{width: 75, height: 75}}
              src={album.images[1].url}
              alt={album.name}
            />
            <Box sx={{display: 'flex', flexDirection: 'column', mx: 2}}>
              <Typography variant="body2">From the album</Typography>
              <Typography variant="h6">{album.name}</Typography>
            </Box>
          </Box>
        </NavLink>
      )}
      {album &&
        album.tracks.items.map((data, id) => {
          const isActive = selectedBox === id;
          const isHovering = activeTrackId === id;
          return (
            <Box key={data.id}>
              <Box
                className={`${selectedBox === id ? 'selected' : 'hover-box'}`}
                onClick={() => setSelectedBox(id)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr 0.1fr',
                  alignItems: 'center',
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
                        uris: [`spotify:track:${data.id}`],
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
                <Box className="boxForMargin">
                  <NavLink
                    to={routes.trackById({id: data.id})}
                    className="textUnderline"
                  >
                    <Typography variant="h6">{data.name}</Typography>
                  </NavLink>
                  <NavLink
                    to={routes.artistById({
                      id: (data.artists as Artist[])[0].id,
                    })}
                    className="textUnderline"
                  >
                    <Typography variant="body1" color="text.secondary">
                      {(data.artists as Artist[])[0].name}
                    </Typography>
                  </NavLink>
                </Box>
                <Box>
                  <TrackComponent
                    isFavorite={checkUserTracksResult[id]}
                    isActive={isActive}
                    track={data}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      <Box mt={4}>
        <Typography variant="body1">
          {moment(album?.release_date).format('MMMM D, YYYY')}
        </Typography>
        {album?.copyrights.map((data, id) => (
          <Box key={id}>
            <Typography variant="body1">{data.text}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
