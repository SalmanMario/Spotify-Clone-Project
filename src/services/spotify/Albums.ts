import {Album} from '../../models/Albums';
import axiosInstance, {wrapAxiosCall} from '../utils';

/**
 * Get Spotify catalog information for a single album.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-an-album)
 */
export function getAlbumById(id: string) {
  return wrapAxiosCall<Album>(axiosInstance.get(`/albums/${id}?market=US`));
}
