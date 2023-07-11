export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface IdProp {
  id?: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: string;
  total: number;
}

export interface Restrictions {
  reason: string;
}

export interface Copyright {
  text: string;
  type: string;
}

export interface ExternalIds {
  isrc: string;
  ean: string;
  upc: string;
}

export interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

export interface Owner {
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

export type PagedElements<T> = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: T[];
  artists: T[];
};

export type SearchOptions = {
  limit?: number;
  offset?: number;
};

export type IncludeGroups = 'album' | 'single' | 'appears_on' | 'compilation';

/**
 * Over what time frame the affinities are computed.
 * Valid values:
 * * `long_term` (calculated from several years of data and including all new data as it becomes available),
 * * `medium_term` (approximately last 6 months),
 * * `short_term` (approximately last 4 weeks).
 */
export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
