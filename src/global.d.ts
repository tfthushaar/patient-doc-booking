// global types

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_LOGIN_TYPE: string;
  readonly VITE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
