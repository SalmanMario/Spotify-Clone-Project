import {Album} from '../../models/Albums';
import {Artist} from '../../models/Artists';
import {Track} from '../../models/Tracks';
import {IncludeGroups, PagedElements, SearchOptions} from '../../models/common';
import axiosInstance, {wrapAxiosCall} from '../utils';

/**
 * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
 * @param id artist_id
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-an-artist)
 */
export function getArtistId(id: string) {
  return wrapAxiosCall<Artist>(axiosInstance.get(`/artists/${id}`));
}

/**
 * Get Spotify catalog information about an artist's top tracks by country.
 * @param id The Spotify ID of the artist.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-an-artists-top-tracks)
 */
export function getArtistTopTracks(id: string) {
  return wrapAxiosCall<{
    tracks: Track[];
  }>(axiosInstance.get(`/artists/${id}/top-tracks?market=US`));
}

/**
 * Get Spotify catalog information about an artist's albums.
 * @param id The Spotify ID of the artist.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-an-artists-albums)
 */
export function getArtistAlbums(
  id: string,
  options: SearchOptions & {
    market?: string;
    include_groups?: IncludeGroups[];
  } = {
    market: 'US',
    include_groups: ['album'],
  },
) {
  return wrapAxiosCall<PagedElements<Album>>(
    axiosInstance.get(`/artists/${id}/albums`, {
      params: {
        ...options,
        include_groups: options.include_groups?.join(','),
      },
    }),
  );
}

/**
 * Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community's listening history.
 * @param id The Spotify ID of the artist.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-an-artists-related-artists)
 */
export function getArtistsRelatedArtists(id: string) {
  return wrapAxiosCall<PagedElements<Artist>>(
    axiosInstance.get(`/artists/${id}/related-artists`),
  );
}
