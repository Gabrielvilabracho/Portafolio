import { describe, it, expect } from 'vitest';
import { LOCALES, DEFAULT_LOCALE, stripLocalePrefix, localizePath, type Locale } from './i18n';

describe('constants', () => {
  it('exposes the supported locales with English as default', () => {
    expect(LOCALES).toEqual(['en', 'es', 'pt', 'ru']);
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

describe('stripLocalePrefix', () => {
  it('returns root for root', () => {
    expect(stripLocalePrefix('/')).toBe('/');
  });

  it('collapses a bare locale segment to root', () => {
    expect(stripLocalePrefix('/es')).toBe('/');
    expect(stripLocalePrefix('/es/')).toBe('/');
  });

  it('removes the locale prefix from nested paths', () => {
    expect(stripLocalePrefix('/es/work/x/')).toBe('/work/x/');
  });

  it('leaves non-locale lookalikes untouched', () => {
    expect(stripLocalePrefix('/estimate')).toBe('/estimate');
    expect(stripLocalePrefix('/russia-project/')).toBe('/russia-project/');
  });

  it('leaves unprefixed paths untouched', () => {
    expect(stripLocalePrefix('/work/x/')).toBe('/work/x/');
    expect(stripLocalePrefix('/contact')).toBe('/contact');
  });

  it('strips only the first locale segment (current single-strip behavior)', () => {
    expect(stripLocalePrefix('/es/es/x')).toBe('/es/x');
  });
});

describe('localizePath', () => {
  it('always emits a trailing slash', () => {
    expect(localizePath('/contact', 'es')).toBe('/es/contact/');
    expect(localizePath('/contact', 'en')).toBe('/contact/');
  });

  it('handles the root path', () => {
    expect(localizePath('/', 'es')).toBe('/es/');
    expect(localizePath('/', 'en')).toBe('/');
  });

  it('re-localizes an already localized path', () => {
    expect(localizePath('/es/work/x/', 'pt')).toBe('/pt/work/x/');
    expect(localizePath('/ru/contact/', 'en')).toBe('/contact/');
  });

  it('is idempotent', () => {
    const cases: ReadonlyArray<readonly [string, Locale]> = [
      ['/contact', 'es'],
      ['/', 'en'],
      ['/es/work/x/', 'pt'],
      ['/ru/contact/', 'en'],
      ['/work/x', 'ru'],
    ];
    for (const [path, locale] of cases) {
      const once = localizePath(path, locale);
      expect(localizePath(once, locale)).toBe(once);
    }
  });
});
