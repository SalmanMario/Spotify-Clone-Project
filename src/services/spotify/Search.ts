import {Album} from '../../models/Albums';
import {Artist} from '../../models/Artists';
import {Track} from '../../models/Tracks';
import {PagedElements} from '../../models/common';
import axiosInstance, {wrapAxiosCall} from '../utils';
export interface SearchResult {
  artists: PagedElements<Artist>;
  albums: PagedElements<Album>;
  tracks: PagedElements<Track>;
}

export type SearchFeatureQuery = {
  /**
   * Your search query.
   */
  q: string;
  type?: Array<'artist' | 'album' | 'track'>;
  limit?: number;
  offset?: number;
};

/**
 * Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/search)
 */
export function SearchFeature({
  q,
  limit = 10,
  offset = 0,
  type = ['album', 'artist', 'track'],
}: SearchFeatureQuery) {
  return wrapAxiosCall<SearchResult>(
    axiosInstance.get(`search`, {
      params: {
        q,
        limit,
        offset,
        type: type.join(','),
      },
    }),
  );
}
