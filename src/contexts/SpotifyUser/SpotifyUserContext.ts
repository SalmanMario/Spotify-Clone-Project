import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import {UserProfile} from '../../models/Users';
import {getCurrentUserProfile} from '../../services/spotify/Users';
import {authorizeUser} from '../../services/spotify/Authorization';
import {useCodeVerifier} from '../../hooks';
import {routes, useNavigation} from '../../routes/routing';

export const SpotifyUserContext = createContext<
  ReturnType<typeof useSpotifyUser>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
>(null!);

export const useSpotifyUserContext = () => useContext(SpotifyUserContext);

export function useSpotifyUser() {
  const [checkedSession, setCheckedSession] = useState(false);

  const [profile, setProfile] = useState<UserProfile>();

  const {navigate} = useNavigation();
  useCodeVerifier({
    onTokenSuccess: useCallback(() => {
      fetchUserProfile();
      navigate(routes.home);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  });

  const fetchUserProfile = useCallback(() => {
    getCurrentUserProfile().then(profile => {
      setProfile(profile);
    });
  }, []);
  // initial fetching
  useEffect(() => {
    getCurrentUserProfile()
      .then(profile => {
        setProfile(profile);
        // token is alright, user is logged in
      })
      .catch(() => {
        // most likely user is not logged in
      })
      .finally(() => {
        setCheckedSession(true);
        // finalized init, we can display the UI
      });
  }, []);

  async function loginSpotify() {
    const authURL = await authorizeUser();
    window.location.assign(authURL);
  }

  return {
    checkedSession,
    profile,
    fetchUserProfile,
    loginSpotify,
    userIsLoggedIn: !!profile,
  };
}
