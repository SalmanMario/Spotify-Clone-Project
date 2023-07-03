/**
 * Query keys can be as simple as a string, or as complex as an array of many strings and nested objects.
 * * [API Link](https://tanstack.com/query/v4/docs/react/guides/query-keys)
 */

export enum QueryKeys {
  GetArtistTopTrack = 'GetArtistTopTrack',
  GetArtistById = 'GetArtistById',
  GetTrackById = 'GetTrackById',
  GetArtistsAlbums = 'GetArtistsAlbums',
  CurrentUserPlaylist = 'CurrentUserPlaylist',
  FollowedArtists = 'FollowedArtists',
  LikedTrack = 'LikedTrack',
  GetAlbumById = 'GetAlbumById',
  GetPlaylistById = 'GetPlaylistById',
  CheckFollowArtistOrUser = 'CheckFollowArtistOrUser',
  GetUsersTopItems = 'GetUsersTopItems',
  GetUsersTopItemsArtists = 'GetUsersTopItemsArtists',
  SaveTrackForCurrentUser = 'SaveTrackForCurrentUser',
  GetUsersSavedTracks = 'GetUsersSavedTracks',
  GetAvailableDevices = 'GetAvailableDevices',
  GetPlaybackState = 'GetPlaybackState',
  GetCurrentlyPlayingTrack = 'GetCurrentlyPlayingTrack',
  GetArtistsRelatedArtists = 'GetArtistsRelatedArtists',
  GetTrackIdLyric = 'GetTrackIdLyric',
}
