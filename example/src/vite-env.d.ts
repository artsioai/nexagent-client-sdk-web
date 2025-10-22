/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NEXAGENT_PUBLIC_KEY: string
  readonly VITE_NEXAGENT_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 