import {
  CurrentlyPlayingTrack,
  Device,
  PlaybackState,
} from '../../models/Player';
import axiosInstance, {wrapAxiosCall} from '../utils';

/**
 * Get information about the user’s current playback state, including track or episode, progress, and active device.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback)
 */
export function getPlaybackState() {
  return wrapAxiosCall<PlaybackState>(axiosInstance.get(`/me/player`));
}

/**
 * Transfer playback to a new device and determine if it should start playing.
 * @param deviceId device ID for playback
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/transfer-a-users-playback)
 */
export function transferPlayback(deviceId: string) {
  return wrapAxiosCall(
    axiosInstance.put('/me/player', {
      device_ids: [deviceId],
      play: true,
    }),
  );
}

/**
 * Get information about a user’s available devices.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-a-users-available-devices)
 */
export function getAvailableDevices() {
  return wrapAxiosCall<{
    devices: Device[];
  }>(axiosInstance.get(`/me/player/devices`));
}

/**
 * Get the object currently being played on the user's Spotify account.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track)
 */
export function getCurrentlyPlayingTrack() {
  return wrapAxiosCall<CurrentlyPlayingTrack>(
    axiosInstance.get('/me/player/currently-playing'),
  );
}

/**
 * Toggle shuffle on or off for user’s playback.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/toggle-shuffle-for-users-playback)
 */
export function PlayerShuffle({
  state,
  device_id,
}: {
  state: boolean;
  device_id?: string;
}) {
  const url = `/me/player/shuffle?state=${state}`;
  const deviceIdParam = device_id ? `&device_id=${device_id}` : '';
  return wrapAxiosCall<PlaybackState>(
    axiosInstance.put(`${url}${deviceIdParam}`),
  );
}

/**
 * Set the repeat mode for the user's playback. Options are repeat-track, repeat-context, and off.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/set-repeat-mode-on-users-playback)
 */
export function RepeatMode({
  state,
  device_id,
}: {
  state: string;
  device_id?: string;
}) {
  const url = `/me/player/repeat?state=${state}`;
  const deviceIdParam = device_id ? `&device_id=${device_id}` : '';
  return wrapAxiosCall<PlaybackState>(
    axiosInstance.put(`${url}${deviceIdParam}`),
  );
}

/**
 * Start a new context or resume current playback on the user's active device.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback)
 */
export function startResumePlayback(options: {
  /**
   * Optional. Spotify URI of the context to play. Valid contexts are albums, artists & playlists. {context_uri:"spotify:album:1Je1IMUlBXcx1Fz0WE7oPT"}
   */
  context_uri?: string;
  /**
   * Optional. A JSON array of the Spotify track URIs to play. For example: {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]}
   */
  uris?: string[];
  offset?: {
    uri?: string;
    position: number;
  };
  position_ms: number;
}) {
  return wrapAxiosCall(axiosInstance.put('/me/player/play', options));
}
