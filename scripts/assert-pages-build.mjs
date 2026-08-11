import { readdir, readFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';

const baseArgument = process.argv.find((argument) => argument.startsWith('--base='));
if (!baseArgument) throw new Error('Expected a GitHub Pages base path via --base=/repository-name.');

const configuredBase = baseArgument.slice('--base='.length).replace(/\/$/, '');
if (!configuredBase.startsWith('/') || configuredBase === '/') {
  throw new Error('The GitHub Pages base path must be a non-root path beginning with /.');
}

const pagesSite = 'https://gabrielvilabracho.github.io';
const distDirectory = resolve('dist');
const assetExtensions = '(?:avif|gif|ico|jpe?g|mp4|otf|png|svg|ttf|webm|webp|woff2?)';
const escapedBase = configuredBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const baseWithoutLeadingSlash = configuredBase.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rootRelativeAsset = new RegExp(
  `(?:\\b(?:href|poster|src)\\s*=\\s*["']|\\burl\\(\\s*["']?)\\/(?!${baseWithoutLeadingSlash}(?:/|["']))[^"')\\s]+\\.${assetExtensions}(?:[?#][^"')\\s]*)?`,
  'gi'
);
const duplicateBase = new RegExp(`${escapedBase}/+${baseWithoutLeadingSlash}(?:/|["')?#])`, 'gi');

async function getBuildFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? getBuildFiles(path) : [path];
  }));

  return nestedFiles.flat();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertMatches(content, relativePath, description, pattern) {
  if (!pattern.test(content)) {
    throw new Error(`${relativePath}: missing ${description}.`);
  }
}

const buildFiles = await getBuildFiles(distDirectory);
const textFiles = buildFiles.filter((path) => ['.css', '.html'].includes(extname(path)));
const violations = [];

for (const file of textFiles) {
  const content = await readFile(file, 'utf8');
  const relativePath = relative(distDirectory, file);

  for (const match of content.matchAll(rootRelativeAsset)) {
    violations.push(`${relativePath}: root-relative public asset URL ${match[0]}`);
  }

  for (const match of content.matchAll(duplicateBase)) {
    violations.push(`${relativePath}: duplicate base path ${match[0]}`);
  }
}

if (violations.length) {
  throw new Error(`GitHub Pages build output contains invalid base paths:\n${violations.join('\n')}`);
}

const localePaths = ['', 'es/', 'pt/', 'ru/'];
for (const localePath of localePaths) {
  const relativePath = `${localePath}index.html`;
  const content = await readFile(resolve(distDirectory, relativePath), 'utf8');
  const homeHref = `${configuredBase}/${localePath}`;
  const contactHref = `${configuredBase}/${localePath}contact/`;

  assertMatches(
    content,
    relativePath,
    `Navbar home link to ${homeHref}`,
    new RegExp(`<a\\b(?=[^>]*\\bhref="${escapeRegExp(homeHref)}")[^>]*>\\s*<img\\b(?=[^>]*\\balt="GV")[^>]*>`, 'i')
  );
  assertMatches(
    content,
    relativePath,
    `Navbar contact link to ${contactHref}`,
    new RegExp(`<a\\b(?=[^>]*\\bhref="${escapeRegExp(contactHref)}")[^>]*>\\s*Contact\\s*</a>`, 'i')
  );
}

const contactPagePath = 'contact/index.html';
const contactPage = await readFile(resolve(distDirectory, contactPagePath), 'utf8');
const thankYouUrl = `${pagesSite}${configuredBase}/thank-you`;
assertMatches(
  contactPage,
  contactPagePath,
  `FormSubmit _next confirmation URL ${thankYouUrl}`,
  new RegExp(`<input\\b(?=[^>]*\\bname="_next")(?=[^>]*\\bvalue="${escapeRegExp(thankYouUrl)}")[^>]*>`, 'i')
);

console.log(`GitHub Pages build-output assertions passed for ${configuredBase}.`);
