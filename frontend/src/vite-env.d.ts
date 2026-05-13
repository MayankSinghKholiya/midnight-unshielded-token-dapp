/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.png' {
  const src: string;
  export default src;
}
