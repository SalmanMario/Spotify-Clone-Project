import {Route, Routes} from 'react-router-dom';
import {AppLayout} from '../pages/layouts/AppLayout';
import {Home} from '../pages/Home';
import {ViewArtist} from '../pages/ArtistIdPage';
import {UserPlaylist} from '../pages/UserPlaylist';
import {AlbumIdPage} from '../pages/AlbumIdPage';
import {route, routes} from './routing';
import {Login} from '../pages/Login';
import {ConnectedGuard} from '../pages/guards/ConnectedGuard';
import {TrackIdPage} from '../pages/TrackIdPage';
import {CollectionTracks} from '../pages/CollectionTracks';

export function Router() {
  return (
    <Routes>
      <Route element={<ConnectedGuard />}>
        <Route element={<AppLayout />}>
          <Route path={route(routes.home)} element={<Home />} />
          <Route
            path={route(routes.artistById, ['id'])}
            element={<ViewArtist />}
          />
          <Route
            path={route(routes.playlistById, ['id'])}
            element={<UserPlaylist />}
          />
          <Route
            path={route(routes.albumById, ['id'])}
            element={<AlbumIdPage />}
          />
          <Route
            path={route(routes.trackById, ['id'])}
            element={<TrackIdPage />}
          />
          <Route
            path={route(routes.collectionTracks)}
            element={<CollectionTracks />}
          ></Route>
        </Route>
      </Route>
      <Route path={route(routes.login)} element={<Login />} />
    </Routes>
  );
}
