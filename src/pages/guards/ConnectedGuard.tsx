import {Navigate, Outlet} from 'react-router-dom';
import {useSpotifyUserContext} from '../../contexts/SpotifyUser/SpotifyUserContext';
import {routes} from '../../routes/routing';

export const ConnectedGuard = () => {
  const {userIsLoggedIn} = useSpotifyUserContext();
  if (!userIsLoggedIn) {
    return <Navigate to={routes.login()} replace />;
  }
  return <Outlet />;
};
