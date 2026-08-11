/** Resolve a public static asset URL beneath Astro's configured base path. */
export function withBase(path: string, base = import.meta.env.BASE_URL): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;

  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const basePath = normalizedBase.slice(0, -1);

  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    return path;
  }

  return `${normalizedBase}${path.slice(1)}`;
}

/** Remove Astro's configured base path before processing an application route. */
export function stripBase(pathname: string, base = import.meta.env.BASE_URL): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const basePath = normalizedBase.slice(0, -1);

  if (!basePath) return pathname;
  if (pathname === basePath) return '/';
  return pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
}
