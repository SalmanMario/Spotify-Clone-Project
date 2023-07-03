import {useEffect, useMemo, useState} from 'react';
import cache from '../utils/Cache';
import {useQuery} from 'react-query';
import {QueryKeys} from '../utils/enums';
import {getPlaybackState} from '../services/spotify/Player';

export function useWebplaySDK() {
  const [player, setPlayer] = useState<Spotify.Player>();
  const [active, setActive] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [track, setTrack] = useState<Spotify.Track>();

  const [position, setPosition] = useState(0);

  const {data: playbackState} = useQuery({
    queryKey: [QueryKeys.GetPlaybackState, track],
    queryFn: () => {
      return getPlaybackState();
    },
  });

  useEffect(() => {
    // dev only
    if (player) {
      return;
    }
    const spotifyPlayerURL = 'https://sdk.scdn.co/spotify-player.js';
    const token = cache.tokens?.access_token;
    if (!token) {
      console.warn('Trying to init webpack without token');
      return;
    }
    const script = document.createElement('script');
    script.src = spotifyPlayerURL;
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: import.meta.env.VITE_WEBPLAYBACK_NAME,
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });
      player.connect().then(() => {
        setPlayer(player);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [start, stop] = useMemo(() => {
    if (!track) {
      return ['', ''] as const;
    }
    function formatMillisecondsToTime(milliseconds: number) {
      // Calculate the hours, minutes, and seconds
      const hours = Math.floor(milliseconds / 3600000);
      const minutes = Math.floor((milliseconds % 3600000) / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);

      // Pad single digits with leading zeros
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      function checkForEmpty(value: string) {
        if (value === '00') {
          return '';
        }
        return `${value}:`;
      }
      // Return the formatted time as a string
      return (
        checkForEmpty(formattedHours) +
        checkForEmpty(formattedMinutes) +
        formattedSeconds
      );
    }
    return [
      formatMillisecondsToTime(position),
      formatMillisecondsToTime(track.duration_ms),
    ] as const;
  }, [position, track]);

  useEffect(() => {
    if (!player) {
      return;
    }

    function handlePlayerStateChanged(state: Spotify.PlaybackState) {
      if (!state) {
        return;
      }

      setTrack(state.track_window.current_track);
      setPaused(state.paused);
      setPosition(state.position);
      player?.getCurrentState().then(state => {
        setActive(!!state);
      });
    }

    player.addListener('player_state_changed', handlePlayerStateChanged);
    return () => {
      player.removeListener('player_state_changed', handlePlayerStateChanged);
      player.disconnect();
    };
  }, [player]);

  useEffect(() => {
    if (paused || !track) {
      return;
    }
    const interval = setInterval(() => {
      setPosition(position => position + 1000);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [paused, track]);

  return {
    player,
    active,
    track,
    paused,
    position,
    setPosition,
    start,
    stop,
    playbackState,
  };
}
