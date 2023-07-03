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
