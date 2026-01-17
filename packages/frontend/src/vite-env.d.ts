/// <reference types="vite/client" />

// WHY: Type definitions for Vite environment variables
// This ensures TypeScript knows about VITE_ prefixed env vars
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_ENABLE_ANALYTICS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

