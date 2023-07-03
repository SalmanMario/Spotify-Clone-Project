import {FC} from 'react';
import {
  SpotifyUserContext,
  useSpotifyUser,
  useSpotifyUserContext,
} from './SpotifyUserContext';

export const SpotifyUserContextProvider: FC = ({children}) => {
  const spotifyProfile = useSpotifyUser();
  return (
    <SpotifyUserContext.Provider value={spotifyProfile}>
      {children}
    </SpotifyUserContext.Provider>
  );
};

export const SpotifyUserLoader: FC = ({children}) => {
  const {checkedSession} = useSpotifyUserContext();
  if (!checkedSession) {
    return null;
  }
  return <>{children}</>;
};
