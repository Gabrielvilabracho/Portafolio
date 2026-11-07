import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
const sourceRoot = resolve(projectRoot, 'src');
const publicRoot = resolve(projectRoot, 'public');
const sourceExtensions = new Set(['.astro', '.ts', '.tsx', '.md', '.mdx', '.css']);
const imageExtension = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)(?:[?#].*)?$/i;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      return ['__tests__', '__fixtures__', 'fixtures'].includes(entry.name) ? [] : sourceFiles(path);
    }
    return entry.isFile() && sourceExtensions.has(extname(path)) && !/\.(?:test|spec)\./.test(entry.name)
      ? [path]
      : [];
  });
}

// Inspect literals rather than rendered props: this also covers nested withBase()
// calls, CSS masks/backgrounds, content frontmatter, and linked MDX diagrams.
function imageReferences(source: string): string[] {
  const withoutBaseTemplates = source.replace(
    /\$\{import\.meta\.env\.BASE_URL(?:\.replace\([^{}\n]*\))?\}\/?/g,
    '/',
  );
  const patterns = [
    /(["'`])(\/(?!\/)[^"'`\r\n<>]*?)\1/g,
    /\burl\(\s*(\/(?!\/)[^\s)"'`]+)\s*\)/g,
    /^\s*(?:src|image|logo|poster):\s*(\/(?!\/)[^\r\n]+?)\s*$/gm,
    /!?\[[^\]\n]*\]\((\/(?!\/)[^)\n]+)\)/g,
  ];

  return [...new Set(patterns.flatMap((pattern, index) =>
    [...withoutBaseTemplates.matchAll(pattern)]
      .map((match) => match[index === 0 ? 2 : 1])
      .filter((path) => imageExtension.test(path)),
  ))];
}

function publicFile(path: string, base = import.meta.env.BASE_URL): string {
  let pathname = path.split(/[?#]/, 1)[0];
  const prefix = base.replace(/\/$/, '');
  if (prefix && pathname.startsWith(`${prefix}/`)) pathname = pathname.slice(prefix.length);
  return resolve(publicRoot, `.${decodeURIComponent(pathname)}`);
}

describe('public image references', () => {
  it('extracts image literals across runtime source formats', () => {
    const source = [
      `<img src={withBase('/icons/envelope.svg')} />`,
      "maskImage: `url('${withBase('/icons/marker.svg')}')`",
      'background-image: url(/imagenes/photos/portrait.jpg);',
      '        src: /imagenes/art/strangers.svg',
      "src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/imagenes/web_pices/Frame%209-2.svg`}",
      '![Diagram](/diagrams/document-intelligence/connections-case-study.png)',
      '<link rel="icon" href="/favicon.ico" />',
    ].join('\n');

    expect(imageReferences(source)).toEqual(expect.arrayContaining([
      '/icons/envelope.svg', '/icons/marker.svg', '/imagenes/photos/portrait.jpg',
      '/imagenes/art/strangers.svg', '/imagenes/web_pices/Frame%209-2.svg',
      '/diagrams/document-intelligence/connections-case-study.png', '/favicon.ico',
    ]));
    expect(imageReferences(source)).toHaveLength(7);
  });

  it('ignores external images, data URIs, fragments, and non-image paths', () => {
    expect(imageReferences([
      'src="https://example.com/missing.png"',
      "withBase('//cdn.example.com/missing.svg')",
      "url('data:image/svg+xml,<svg></svg>')",
      'href="#missing.svg"',
      "withBase('/countries.geojson')",
    ].join('\n'))).toEqual([]);
  });

  it('resolves existing images, ICO, and spaces with base, query, and fragment removed', () => {
    for (const path of [
      '/Portafolio/favicon.ico?v=1#icon',
      '/Portafolio/imagenes/web_pices/Frame%209-2.svg?theme=light#diagram',
      '/Portafolio/imagenes/web_pices/Frame 9-2.svg',
    ]) {
      expect(statSync(publicFile(path, '/Portafolio/')).isFile(), path).toBe(true);
    }
  });

  it('resolves every local image literal in real non-test source to an existing public file', () => {
    const missing: string[] = [];
    let checked = 0;
    for (const file of sourceFiles(sourceRoot)) {
      for (const path of imageReferences(readFileSync(file, 'utf8'))) {
        checked += 1;
        const target = publicFile(path);
        if (!existsSync(target) || !statSync(target).isFile()) {
          missing.push(`${relative(projectRoot, file)}: ${path}`);
        }
      }
    }

    expect(checked).toBeGreaterThan(0);
    expect(missing, 'Missing public images referenced by runtime source').toEqual([]);
  });
});
