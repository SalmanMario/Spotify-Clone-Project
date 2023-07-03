import {Track} from '../../models/Tracks';
import {PagedElements} from '../../models/common';
import axiosInstance, {wrapAxiosCall} from '../utils';
/**
 * Get Spotify catalog information for a single track identified by its unique Spotify ID.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-track)
 */
export function getTrackId(id: string) {
  return wrapAxiosCall<Track>(axiosInstance.get(`/tracks/${id}`));
}

/**
 * Get a list of the songs saved in the current Spotify user's 'Your Music' library.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-users-saved-tracks)
 */
export function getUsersSavedTracks() {
  return wrapAxiosCall<
    PagedElements<{
      added_at: number;
      track: Track;
    }>
  >(
    axiosInstance.get('/me/tracks', {
      params: {
        limit: 50,
      },
    }),
  );
}

/**
 * Save one or more tracks to the current user's 'Your Music' library.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/save-tracks-user)
 */
export function saveTrackForCurrentUser(ids: string[]) {
  return wrapAxiosCall<Track>(
    axiosInstance.put(`/me/tracks`, undefined, {
      params: {
        ids: ids.join(','),
      },
    }),
  );
}

/**
 * Remove one or more tracks from the current user's 'Your Music' library.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/remove-tracks-user)
 */
export function removeTrackForCurrentUser(ids: string[]) {
  return wrapAxiosCall<Track>(
    axiosInstance.delete(`/me/tracks`, {
      params: {
        ids: ids.join(','),
      },
    }),
  );
}

/**
 * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/check-users-saved-tracks)
 */
export function checkUserSavedTracks<T extends readonly unknown[] | []>(
  ids: T,
) {
  return wrapAxiosCall<{
    -readonly [K in keyof T]: boolean;
  }>(
    axiosInstance.get(`/me/tracks/contains`, {
      params: {
        ids: ids.join(','),
      },
    }),
  );
}
