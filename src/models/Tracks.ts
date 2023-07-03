import {Album} from './Albums';
import {Artist} from './Artists';
import {ExternalIds, ExternalUrls, Restrictions} from './common';

export type Track = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  added_at: number;
  href: string;
  id: string;
  is_playable: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linked_from: Record<keyof any, any>;
  restrictions: Restrictions;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};
