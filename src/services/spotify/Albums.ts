import {Album} from '../../models/Albums';
import {PagedElements} from '../../models/common';
import axiosInstance, {wrapAxiosCall} from '../utils';

/**
 * Get Spotify catalog information for a single album.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-an-album)
 */
export function getAlbumById(id: string) {
  return wrapAxiosCall<Album>(axiosInstance.get(`/albums/${id}?market=US`));
}

/**
 * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-users-saved-albums)
 */
export function getUserSavedAlbum() {
  return wrapAxiosCall<PagedElements<Album>>(axiosInstance.get('/me/albums'));
}

/**
 * Save one or more albums to the current user's 'Your Music' library.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/save-albums-user)
 */
export function saveAlbumForCurrentUser(ids: string[]) {
  return wrapAxiosCall<Album>(
    axiosInstance.put('/me/albums', undefined, {
      params: {
        ids: ids.join(','),
      },
    }),
  );
}

/**
 * Remove one or more albums from the current user's 'Your Music' library.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/remove-albums-user)
 */
export function removeUsersSavedAlbum(ids: string[]) {
  return wrapAxiosCall<Album>(
    axiosInstance.delete('/me/albums', {
      params: {
        ids: ids.join(','),
      },
    }),
  );
}

/**
 * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/check-users-saved-albums)
 */
export function checkUserSavedAlbums<T extends readonly unknown[] | []>(
  ids: T,
) {
  return wrapAxiosCall<{
    -readonly [K in keyof T]: boolean;
  }>(
    axiosInstance.get('/me/albums/contains', {
      params: {
        ids: ids.join(','),
      },
    }),
  );
}
