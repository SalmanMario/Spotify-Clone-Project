import {Artist} from './Artists';
import {Track} from './Tracks';
import type {
  Copyright,
  ExternalIds,
  ExternalUrls,
  Image,
  PagedElements,
  Restrictions,
} from './common';

export type Album = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions: Restrictions;
  type: string;
  uri: string;
  copyrights: Copyright[];
  external_ids: ExternalIds;
  genres: string[];
  label: string;
  popularity: number;
  artists: Artist[];
  tracks: PagedElements<Track>;
  album: Album;
};
