import {useEffect} from 'react';
import {getTokens} from '../services/spotify/Authorization';
import cache from '../utils/Cache';
import {useSearchParams} from 'react-router-dom';

export type UseCodeVerifierProps = {
  onTokenSuccess: () => void;
};

export function useCodeVerifier({onTokenSuccess}: UseCodeVerifierProps) {
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      if (!cache.code_verifier) {
        console.warn('No code verifier present');
        return;
      }
      getTokens({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: import.meta.env.VITE_REDIRECT_URL,
        client_id: import.meta.env.VITE_CLIENT_ID,
        code_verifier: cache.code_verifier,
      }).then(tokens => {
        cache.tokens = {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        };
        onTokenSuccess();
        // fetchUserProfile();
      });
    }
  }, [onTokenSuccess, searchParams]);
}
