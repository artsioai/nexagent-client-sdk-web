/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEXTAGENT_PUBLIC_KEY: string
  readonly VITE_NEXTAGENT_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 