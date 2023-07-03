/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_CLIENT_ID: string;
  VITE_REDIRECT_URL: string;
  VITE_WEBPLAYBACK_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
