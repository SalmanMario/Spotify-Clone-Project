import {
  RefreshTokenPayload,
  RequestTokensPayload,
  Tokens,
} from '../../models/Authorization';
import cache from '../../utils/Cache';
import {generateCodeChallenge, generateRandomString} from '../../utils/PCKE';
import axios from 'axios';
import {scopes} from './scopes';
const codeVerifier = generateRandomString(128);

export function authorizeUser() {
  return new Promise<string>(res => {
    generateCodeChallenge(codeVerifier).then(codeChallenge => {
      const state = generateRandomString(16);
      const scope = scopes.join(' ');

      cache.code_verifier = codeVerifier;

      const args = new URLSearchParams({
        response_type: 'code',
        client_id: import.meta.env.VITE_CLIENT_ID,
        scope: scope,
        redirect_uri: import.meta.env.VITE_REDIRECT_URL,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
      });

      res('https://accounts.spotify.com/authorize?' + args);
    });
  });
}

export async function getTokens(body: RequestTokensPayload): Promise<Tokens>;
export async function getTokens(body: RefreshTokenPayload): Promise<Tokens>;
export async function getTokens(
  body: RequestTokensPayload | RefreshTokenPayload,
) {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams(body),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  return response.data as Tokens;
}
