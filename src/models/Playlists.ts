import {Track} from './Tracks';
import type {
  Image,
  Followers,
  ExternalUrls,
  Owner,
  PagedElements,
} from './common';

export type Playlist = {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: PagedElements<{
    added_at: string;
    primary_color: string | null;
    track: Track;
  }>;
  type: string;
  uri: string;
};
