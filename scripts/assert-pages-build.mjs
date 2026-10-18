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
    `SVG favicon at ${configuredBase}/favicon.svg`,
    new RegExp(`<link\\b(?=[^>]*\\brel="icon")(?=[^>]*\\btype="image/svg\\+xml")(?=[^>]*\\bhref="${escapeRegExp(`${configuredBase}/favicon.svg`)}")[^>]*>`, 'i')
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
  [
    'components section before the connections and protocols section',
    /<h2 id="3-components-technologies-and-responsibilities">3\. Components, technologies, and responsibilities<\/h2>/
  ],
  [
    'connections and protocols heading after the components section',
    /<h2 id="4-conexiones-y-protocolos">4\. Conexiones y protocolos<\/h2>/
  ],
  [
    'renumbered security section after the diagram',
    /<h2 id="5-security-privacy-and-audit-controls">5\. Security, privacy, and audit controls<\/h2>/
  ]
]);
assertMatches(
  documentIntelligencePage,
  documentIntelligencePath,
  'semantic diagram figure with an accessible caption reference',
  /<figure\b(?=[^>]*\bclass="case-study-diagram")(?=[^>]*\baria-labelledby="connections-and-protocols-caption")[^>]*>/i
);
assertMatches(
  documentIntelligencePage,
  documentIntelligencePath,
  'lazy-loaded Connections and Protocols iframe with the base-safe light-theme source',
  /<iframe\b(?=[^>]*\bclass="case-study-diagram__frame")(?=[^>]*\bsrc="\/Portafolio\/diagrams\/document-intelligence\/connections-and-protocols\.html\?embed=1&amp;theme=light")(?=[^>]*\btitle="Connections and Protocols — Document Intelligence architecture diagram")(?=[^>]*\bloading="lazy")[^>]*>/i
);
assertMatches(
  documentIntelligencePage,
  documentIntelligencePath,
  'diagram figcaption',
  /<figcaption\b[^>]*\bid="connections-and-protocols-caption"[^>]*>[\s\S]*?<\/figcaption>/i
);
assertMatches(
  documentIntelligencePage,
  documentIntelligencePath,
  'standalone Connections and Protocols artifact link',
  /<a\b(?=[^>]*\bhref="\/Portafolio\/diagrams\/document-intelligence\/connections-and-protocols\.html\?theme=light")[^>]*>\s*Open the standalone diagram\s*<\/a>/i
);

const spanishProjectPath = 'es/work/ai-support-agent/index.html';
const spanishProjectPage = await readFile(resolve(distDirectory, spanishProjectPath), 'utf8');
assertMatches(
  spanishProjectPage,
  spanishProjectPath,
  'localized case-study link',
  /<a[^>]*href="\/es\/case-studies\/ai-support-agent\/"[^>]*>[\s\S]*?<span>Read the case study<\/span>/
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
