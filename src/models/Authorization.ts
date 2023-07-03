export type Tokens = {
  access_token: string;
  /**
   * usually `3600` seconds
   */
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

export type RequestTokensPayload = {
  grant_type: 'authorization_code';
  code: string;
  redirect_uri: string;
  client_id: string;
  code_verifier: string;
};

export type RefreshTokenPayload = {
  grant_type: 'refresh_token';
  refresh_token: string;
  client_id: string;
};
