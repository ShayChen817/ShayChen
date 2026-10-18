/** Prefix public assets and routes for either the local root or a Pages project path. */
export function sitePath(path: string) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
