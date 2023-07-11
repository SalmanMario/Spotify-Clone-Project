import {Playlist} from '../../models/Playlists';
import {PagedElements, SearchOptions} from '../../models/common';
import axiosInstance, {wrapAxiosCall} from '../utils';

/**
 * Get a playlist owned by a Spotify user.
 * @param id playlist_id
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-playlist)
 */
export function getPlaylistById(id: string) {
  return wrapAxiosCall<Playlist>(axiosInstance.get(`/playlists/${id}`));
}

/**
 * Get a list of the playlists owned or followed by the current Spotify user.
 * @param options Pagination options
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists)
 */
export function getCurrentUserPlaylist(options?: SearchOptions) {
  return wrapAxiosCall<PagedElements<Playlist>>(
    axiosInstance.get('/me/playlists', {
      params: options,
    }),
  );
}

/**
 * Add one or more items to a user's playlist.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/add-tracks-to-playlist)
 */
export function addItemsToPlaylist({
  playlist_id,
  uris,
}: {
  playlist_id: string;
  uris: string[];
}) {
  return wrapAxiosCall(
    axiosInstance.post(`/playlists/${playlist_id}/tracks`, {
      uris: uris.map(uri => `spotify:track:${uri}`),
      position: 0,
    }),
  );
}

/**
 * Remove one or more items to a user's playlist.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/remove-tracks-playlist)
 */
export function removeItemsToPlaylist({
  playlist_id,
  uris,
}: {
  playlist_id: string;
  uris: string[];
  tracks: string[];
}) {
  return wrapAxiosCall(
    axiosInstance.post(`/playlists/${playlist_id}/tracks`, {
      tracks: {
        uris: uris.map(uri => `spotify:track:${uri}`),
      },
    }),
  );
}
