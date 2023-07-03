import {Track} from './Tracks';

export type Device = {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
};

export type CurrentlyPlayingTrack = {
  item: Track;
  progress_ms: number;
  timestamp: number;
};

export type PlaybackState = {
  device: Device;
  item: Track;
  is_playing: boolean;
  progress_ms: number;
  repeat_state: 'off' | 'on';
  shuffle_state: boolean;
  timestamp: number;
};
