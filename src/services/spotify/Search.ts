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

export function SearchFeature(searchTerm: string) {
  return wrapAxiosCall<SearchResult>(
    axiosInstance.get(
      `search?q=${searchTerm}&type=artist%2Calbum%2Ctrack&market=US`,
    ),
  );
}
