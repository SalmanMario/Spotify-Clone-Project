import {Artist} from '../../models/Artists';
import {Track} from '../../models/Tracks';
import {UserProfile} from '../../models/Users';
import {PagedElements, TimeRange} from '../../models/common';
import axiosInstance, {wrapAxiosCall} from '../utils';

/**
 * Get detailed profile information about the current user (including the current user's username).
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-current-users-profile)
 */
export function getCurrentUserProfile() {
  return wrapAxiosCall<UserProfile>(axiosInstance.get('/me'));
}

/**
 * Get the current user's followed artists.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-followed)
 */
export function getFollowedArtists(params: {
  type: 'artist';
  after?: string;
  limit?: number;
}) {
  return wrapAxiosCall<{
    artists: PagedElements<Artist>;
  }>(
    axiosInstance.get(`/me/following`, {
      params,
    }),
  );
}

/**
 * Remove the current user as a follower of one or more artists or other Spotify users.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/unfollow-artists-users)
 */
export function unfollowArtistOrUser(
  ids: string[],
  type: 'artist' | 'user' = 'artist',
) {
  return wrapAxiosCall<Artist>(
    axiosInstance.delete(`/me/following`, {
      params: {
        type,
        ids: ids.join(','),
      },
    }),
  );
}

/**
 * Add the current user as a follower of one or more artists or other Spotify users.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/follow-artists-users)
 */
export function followArtistOrUser(
  ids: string[],
  type: 'artist' | 'user' = 'artist',
) {
  return wrapAxiosCall<Artist>(
    axiosInstance.put(`/me/following`, undefined, {
      params: {
        type,
        ids: ids.join(','),
      },
    }),
  );
}

/**
 * Check to see if the current user is following one or more artists or other Spotify users.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/check-current-user-follows)
 */
export function checkFollowArtistOrUser<T extends readonly unknown[] | []>(
  ids: T,
  type: 'artist' | 'user' = 'artist',
) {
  return wrapAxiosCall<{
    -readonly [K in keyof T]: boolean;
  }>(
    axiosInstance.get(`/me/following/contains`, {
      params: {
        type,
        ids: ids.join(','),
      },
    }),
  );
}

type UserTopItemsSearchQuery = {
  time_range?: TimeRange;
  limit?: number;
  offset?: number;
};
/**
 * Get the current user's top artists or tracks based on calculated affinity.
 * * [API Link](https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks)
 */
export function getUsersTopItems(
  type: 'artists',
  params?: UserTopItemsSearchQuery,
): PagedElements<Artist>;
export function getUsersTopItems(
  type: 'tracks',
  params?: UserTopItemsSearchQuery,
): PagedElements<Track>;
export function getUsersTopItems(
  type: 'artists' | 'tracks',
  params?: UserTopItemsSearchQuery,
) {
  return wrapAxiosCall(
    axiosInstance.get(`/me/top/${type}`, {
      params,
    }),
  ) as unknown;
}
