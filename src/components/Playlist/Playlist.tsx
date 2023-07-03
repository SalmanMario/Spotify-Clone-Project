import {Box, IconButton, Typography} from '@mui/material';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';
import moment from 'moment';
import {Track} from '../../models/Tracks';

export type PlaylistProps = {
  track: Track;
  position: number;
  onPlayTrack: () => void;
};
export function Playlist({track, position, onPlayTrack}: PlaylistProps) {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  function millisToMinutesAndSeconds(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto auto 1fr 1fr 1fr auto', // Updated grid template columns
        alignItems: 'center',
        my: 2,
      }}
      className="hover-box"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {isHovering ? (
        <IconButton
          size="small"
          onClick={() => {
            onPlayTrack();
          }}
        >
          <PlayCircleFilledWhiteIcon fontSize="inherit" />
        </IconButton>
      ) : (
        <Typography
          mr={2}
          sx={{width: '30px', textAlign: 'right'}}
          variant="body1"
        >
          {position}
        </Typography>
      )}
      <img src={track.album.images[2].url} alt="" />
      <Box ml={2}>
        <NavLink
          to={routes.trackById({id: track.id})}
          style={{textDecoration: 'none', color: 'inherit'}}
          className="textUnderline"
        >
          <Typography variant="h6">{track.name}</Typography>
        </NavLink>
        <NavLink
          to={routes.artistById({id: track.artists[0].id})}
          style={{textDecoration: 'none', color: 'inherit'}}
          className="textUnderline"
        >
          <Typography variant="body1">{track.artists[0].name}</Typography>
        </NavLink>
      </Box>
      <NavLink
        to={routes.albumById({id: track.album.id})}
        style={{textDecoration: 'none', color: 'inherit'}}
        className="textUnderline"
      >
        <Typography variant="body1">{track.album.name}</Typography>
      </NavLink>
      <Typography variant="body1">
        {moment(track.added_at).format('MMM D, YYYY')}
      </Typography>
      <Typography variant="body1">
        {millisToMinutesAndSeconds(track.duration_ms)}
      </Typography>
    </Box>
  );
}
