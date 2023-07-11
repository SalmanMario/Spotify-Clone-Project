/**
 * Query keys can be as simple as a string, or as complex as an array of many strings and nested objects.
 * * [API Link](https://tanstack.com/query/v4/docs/react/guides/query-keys)
 */

export enum QueryKeys {
  // Artist
  GetArtistById = 'GetArtistById',
  GetUsersTopItemsArtists = 'GetUsersTopItemsArtists',
  GetArtistsRelatedArtists = 'GetArtistsRelatedArtists',
  FollowedArtists = 'FollowedArtists',
  CheckFollowArtistOrUser = 'CheckFollowArtistOrUser',
  // Track
  GetArtistTopTrack = 'GetArtistTopTrack',
  GetTrackById = 'GetTrackById',
  GetUsersSavedTracks = 'GetUsersSavedTracks',
  LikedTrack = 'LikedTrack',
  SaveTrackForCurrentUser = 'SaveTrackForCurrentUser',
  // Album
  GetArtistsAlbums = 'GetArtistsAlbums',
  GetAlbumById = 'GetAlbumById',
  GetUsersSavedAlbums = 'GetUsersSavedAlbums',
  SaveAlbumForCurrentUser = 'SaveAlbumForCurrentUser',
  LikedAlbum = 'LikedAlbum',
  RemoveUsersSavedAlbum = 'RemoveUsersSavedAlbum',
  CheckUserSavedAlbums = 'CheckUserSavedAlbums',
  // Playlist
  GetPlaylistById = 'GetPlaylistById',
  GetUsersTopItems = 'GetUsersTopItems',
  GetCurrentUsersPlaylists = 'GetCurrentUsersPlaylists',
  AddItemsToPlaylist = 'AddItemsToPlaylist',
  CurrentUserPlaylist = 'CurrentUserPlaylist',
  LikedPlaylist = 'LikedPlaylist',
  // Users
  CheckFollowPlaylist = 'CheckFollowPlaylist',
  FollowPlaylist = 'FollowPlaylist',
  GetUserProfile = 'GetUserProfile',
  //
  GetAvailableDevices = 'GetAvailableDevices',
  GetPlaybackState = 'GetPlaybackState',
  Search = 'Search',
}
