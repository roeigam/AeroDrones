interface ImportMetaEnv {
  /** Web3Forms access key (public by design). Set it in .env locally and in the host's env settings. */
  readonly PUBLIC_WEB3FORMS_KEY?: string;
  /** Production origin, e.g. https://aerodrones.co.il (used for canonical + og:url + og:image). */
  readonly SITE_URL?: string;
  /** "1" only in `npm run build:offline` (file:// copy for the client). Set by scripts/build-offline.mjs. */
  readonly PUBLIC_OFFLINE_BUILD?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
