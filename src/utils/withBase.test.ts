import { describe, expect, it } from 'vitest';
import { stripBase, withBase } from './withBase';

describe('withBase', () => {
  it('prefixes root-relative public assets with the configured base path', () => {
    expect(withBase('/imagenes/cross-background.svg', '/Portafolio/')).toBe(
      '/Portafolio/imagenes/cross-background.svg'
    );
  });

  it('preserves external URLs and paths already prefixed with the base', () => {
    expect(withBase('https://example.com/image.svg', '/Portafolio/')).toBe('https://example.com/image.svg');
    expect(withBase('//cdn.example.com/image.svg', '/Portafolio/')).toBe('//cdn.example.com/image.svg');
    expect(withBase('/Portafolio/favicon.svg', '/Portafolio/')).toBe('/Portafolio/favicon.svg');
  });

  it('removes the base path before resolving application routes', () => {
    expect(stripBase('/Portafolio/', '/Portafolio/')).toBe('/');
    expect(stripBase('/Portafolio/es/contact/', '/Portafolio/')).toBe('/es/contact/');
  });
});
