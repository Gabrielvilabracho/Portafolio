import { readdir, readFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

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

function assertOrdered(content, relativePath, descriptionsAndPatterns) {
  let previousIndex = -1;

  for (const [description, pattern] of descriptionsAndPatterns) {
    const match = pattern.exec(content);
    if (!match) {
      throw new Error(`${relativePath}: missing ${description}.`);
    }

    if (match.index <= previousIndex) {
      throw new Error(`${relativePath}: ${description} is out of order.`);
    }

    previousIndex = match.index;
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
    `ICO favicon at ${configuredBase}/favicon.ico`,
    new RegExp(`<link\\b(?=[^>]*\\brel="icon")(?=[^>]*\\btype="image/x-icon")(?=[^>]*\\bhref="${escapeRegExp(`${configuredBase}/favicon.ico`)}")[^>]*>`, 'i')
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

const caseStudyPath = 'case-studies/ai-support-agent/index.html';
const caseStudyPage = await readFile(resolve(distDirectory, caseStudyPath), 'utf8');
assertMatches(
  caseStudyPage,
  caseStudyPath,
  'rendered Markdown heading',
  /<h2 id="what-this-demonstrates">What this demonstrates<\/h2>/
);
assertMatches(
  caseStudyPage,
  caseStudyPath,
  'rendered Markdown content',
  /The localized detail page renders Markdown content and remains linked from the associated project\./
);

const documentIntelligencePath = 'case-studies/document-intelligence/index.html';
const documentIntelligencePage = await readFile(
  resolve(distDirectory, documentIntelligencePath),
  'utf8'
);
assertOrdered(documentIntelligencePage, documentIntelligencePath, [
  ['components inventory before the PNG diagram', /<table\b[^>]*\bid="document-components-table"/],
  ['linked PNG before the connections map', /<a\b[^>]*\bhref="[^"]*\/diagrams\/document-intelligence\/connections-case-study\.png"/],
  ['connections map after the PNG diagram', /<div\b[^>]*\bid="document-connections"/],
]);
const article = new JSDOM(documentIntelligencePage, { url: `${pagesSite}${configuredBase}/case-studies/document-intelligence/` }).window.document;
const text = (element) => element?.textContent?.trim();
const heroImagePath = `${configuredBase}/imagenes/art/invoice-blue-marketing.jpeg`;
const heroImage = article.querySelector(`img.case-study-hero-image[src="${heroImagePath}"]`);
assert.ok(heroImage, 'Document Intelligence hero image must use the configured base path');
assert.equal(heroImage.getAttribute('width'), '1872');
assert.equal(heroImage.getAttribute('height'), '2272');
assert.ok(
  heroImage.compareDocumentPosition(article.querySelector('.case-study-kicker'))
    & article.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
  'Document Intelligence hero image must render before the Case study kicker'
);
const outerDisclosures = Array.from(article.querySelectorAll('details'))
  .filter((entry) => !entry.parentElement?.closest('details'));
assert.deepEqual(outerDisclosures.map((entry) => text(entry.querySelector(':scope > summary'))), [
  'GOVERNANCE AND MULTI-TENANT SECURITY',
  'OPERATIONAL FLOW & EVIDENCE LEVELS',
  'LIFECYCLE *(STEP BY STEP)*',
  'COMPONENTS AND TECNOLOGIES',
  'Conexions & Protocols',
  'System Limits',
]);
assert.ok(outerDisclosures.every((entry) => !entry.hasAttribute('open')), 'Editorial disclosures must start closed');
for (const [selector, summary] of [
  ['.document-lifecycle', 'LIFECYCLE *(STEP BY STEP)*'],
  ['#document-components-table', 'COMPONENTS AND TECNOLOGIES'],
  ['#document-connections', 'Conexions & Protocols'],
]) {
  assert.equal(article.querySelectorAll(selector).length, 1, `Exactly one ${selector}`);
  assert.equal(text(article.querySelector(selector)?.closest('details')?.querySelector(':scope > summary')), summary);
}
assert.equal(article.querySelectorAll('.document-lifecycle ol > li').length, 5);
assert.equal(article.querySelectorAll('#document-components-table tbody tr').length, 14);
assert.equal(article.querySelectorAll('#document-components-table th[scope="row"]').length, 14);
assert.equal(article.querySelectorAll('#document-components-table th[scope="col"]').length, 2);
assert.equal(article.querySelectorAll('#document-connections ol > li').length, 5);
assert.equal(article.querySelectorAll('#document-connections .request-link').length, 4);
assert.equal(article.querySelectorAll('#document-connections .branches > li').length, 9);
assert.equal(article.querySelectorAll('#document-connections .connection-mechanism').length, 13);
assert.equal(article.querySelectorAll('#document-connections .queue-categories li').length, 3);
assert.equal(article.querySelector('#document-connections')?.getAttribute('lang'), 'es');
const diagramPath = `${configuredBase}/diagrams/document-intelligence/connections-case-study.png`;
const diagramLinks = article.querySelectorAll(`a[href="${diagramPath}"]`);
assert.equal(diagramLinks.length, 1, 'One base-safe full-size PNG link');
const diagramLink = diagramLinks[0];
assert.equal(diagramLink.getAttribute('target'), '_blank');
assert.ok(diagramLink.relList.contains('noopener') && diagramLink.relList.contains('noreferrer'));
assert.equal(diagramLink.getAttribute('aria-label'), 'Open the full-size connections diagram in a new tab');
const diagramImage = diagramLink.querySelector('img');
assert.equal(diagramImage?.getAttribute('src'), diagramPath);
assert.equal(diagramImage?.getAttribute('alt'), 'Platform components, connections, and communication protocols.');
assert.equal(diagramImage?.getAttribute('loading'), 'lazy');
assert.equal(diagramImage?.getAttribute('decoding'), 'async');
assert.equal(diagramImage?.getAttribute('width'), '2712');
assert.equal(diagramImage?.getAttribute('height'), '1020');

const spanishProjectPath = 'es/work/ai-support-agent/index.html';
const spanishProjectPage = await readFile(resolve(distDirectory, spanishProjectPath), 'utf8');
assertMatches(
  spanishProjectPage,
  spanishProjectPath,
  'localized case-study link',
  new RegExp(`<a[^>]*href="${escapeRegExp(`${configuredBase}/es/case-studies/ai-support-agent/`)}"[^>]*>[\\s\\S]*?<span>Read the case study<\\/span>`)
);

for (const locale of ['es', 'pt', 'ru']) {
  const localeCaseStudyPath = `${locale}/${caseStudyPath}`;
  const localeCaseStudyPage = await readFile(resolve(distDirectory, localeCaseStudyPath), 'utf8');
  assertMatches(
    localeCaseStudyPage,
    localeCaseStudyPath,
    'rendered Markdown content',
    /This is intentionally generic placeholder content, included only to demonstrate the case-study template\./
  );
  assertMatches(
    localeCaseStudyPage,
    localeCaseStudyPath,
    'rendered Markdown heading',
    /<h2 id="what-this-demonstrates">What this demonstrates<\/h2>/
  );
}

console.log(`GitHub Pages build-output assertions passed for ${configuredBase}.`);
