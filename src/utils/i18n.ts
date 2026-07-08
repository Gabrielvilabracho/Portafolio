export const LOCALES = ['en', 'es', 'pt', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

const NON_DEFAULT_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

/** Remove a leading locale segment from a pathname ('/es/work/x' -> '/work/x'). */
export function stripLocalePrefix(pathname: string): string {
  for (const locale of NON_DEFAULT_LOCALES) {
    if (pathname === `/${locale}` || pathname === `/${locale}/`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/** Ensure a pathname ends with a trailing slash, matching Astro's built directory URLs. */
function withTrailingSlash(pathname: string): string {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/** Map a pathname to its equivalent in the given locale (default locale stays unprefixed). */
export function localizePath(pathname: string, locale: Locale): string {
  const basePath = withTrailingSlash(stripLocalePrefix(pathname));
  if (locale === DEFAULT_LOCALE) return basePath;
  return basePath === '/' ? `/${locale}/` : `/${locale}${basePath}`;
}
