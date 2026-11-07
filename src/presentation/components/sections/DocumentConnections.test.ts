// @vitest-environment node
import { createRequire } from 'node:module';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import mdxRenderer from '@astrojs/mdx/server.js';
import { beforeAll, describe, expect, it } from 'vitest';
import DocumentConnections, { type Props } from './DocumentConnections.astro';
import ArticleContent, * as articleModule from '../../../content/case-studies/document-intelligence.mdx';

interface ParsedHtml {
  window: Pick<Window, 'document'>;
}

interface HtmlParserModule {
  JSDOM: new (html: string) => ParsedHtml;
}

const { JSDOM } = createRequire(import.meta.url)('jsdom') as HtmlParserModule;
const editorialExports: Record<string, unknown> = articleModule;
const connectionData = editorialExports.connections as Props;
const mainEdges = [
  ['Usuario', 'Next.js / BFF', 'HTTPS + sesión Clerk'],
  ['Next.js / BFF', 'API Go', 'HTTP REST + JWT'],
  ['API Go', 'Temporal', 'mediante gRPC y mTLS'],
  ['Temporal', 'Workers Python', 'Task Queues'],
];
const branchEdges = [
  ['API Go / Workers Python', 'API Go', 'PostgreSQL', 'mediante pgx'],
  ['API Go / Workers Python', 'API Go', 'Amazon S3', 'mediante API S3'],
  ['API Go / Workers Python', 'API Go', 'Clerk', 'mediante HTTPS/JWKS'],
  ['API Go / Workers Python', 'Workers Python', 'API Go interna', 'mediante HTTP + token de servicio'],
  ['API Go / Workers Python', 'Workers Python', 'Gateway FastAPI', 'mediante HTTP'],
  ['API Go / Workers Python', 'Workers Python', 'S3', 'mediante API S3'],
  ['Gateway FastAPI / Worker de Layout/OCR', 'Gateway FastAPI', 'Amazon Bedrock', 'mediante LiteLLM'],
  ['Gateway FastAPI / Worker de Layout/OCR', 'Gateway FastAPI', 'vLLM/Qwen', 'mediante API compatible con OpenAI'],
  ['Gateway FastAPI / Worker de Layout/OCR', 'Worker de Layout/OCR', 'GLM-OCR', 'mediante API compatible con OpenAI'],
];

let html: string;
let document: Document;

const text = (element: Element | null) => element?.textContent?.trim();

beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(DocumentConnections, { props: { ...connectionData, lang: 'es' } });
  document = new JSDOM(html).window.document;
});

describe('DocumentConnections', () => {
  it('uses the supplied language for Spanish editorial data', async () => {
    const container = await AstroContainer.create();
    const translated = new JSDOM(await container.renderToString(DocumentConnections, {
      props: { ...connectionData, lang: 'es' },
    })).window.document;
    expect(translated.querySelector('[role="group"]')?.getAttribute('lang')).toBe('es');
  });

  it('marks the actual Spanish MDX map with its content language', async () => {
    const container = await AstroContainer.create();
    container.addServerRenderer({ renderer: mdxRenderer });
    const article = new JSDOM(await container.renderToString(ArticleContent)).window.document;
    expect(article.querySelector('#document-connections')?.getAttribute('lang')).toBe('es');
  });

  it('renders alternate groups, nodes, mechanisms, queues and accessible labels', async () => {
    const container = await AstroContainer.create();
    const alternate = new JSDOM(await container.renderToString(DocumentConnections, {
      props: {
        label: 'Alternate map',
        mainFlowHeading: 'Import route',
        queueLabel: 'Import queues',
        requestFlow: [
          { name: 'Importer', mechanism: 'Local pipe', queues: ['Batch', 'Priority'] },
          { name: 'Archive' },
        ],
        branchSections: [{
          id: 'alternate-group', title: 'Storage access',
          sources: [{ id: 'alternate-source', name: 'Archiver', targets: [{ name: 'Disk', mechanism: 'File I/O' }] }],
        }],
      } satisfies Props,
    })).window.document;
    expect(alternate.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Alternate map');
    expect(alternate.querySelector('[role="group"]')?.getAttribute('lang')).toBe('en');
    expect(Array.from(alternate.querySelectorAll('h3'), text)).toEqual(['Import route', 'Storage access']);
    expect(Array.from(alternate.querySelectorAll('ol > li > strong'), text)).toEqual(['Importer', 'Archive']);
    expect(alternate.querySelector('.queue-categories')?.getAttribute('aria-label')).toBe('Import queues');
    expect(Array.from(alternate.querySelectorAll('.queue-categories li'), text)).toEqual(['Batch', 'Priority']);
    expect(text(alternate.querySelector('#alternate-source'))).toBe('Archiver');
    expect(text(alternate.querySelector('ul[aria-labelledby="alternate-source"] strong'))).toBe('Disk');
    expect(Array.from(alternate.querySelectorAll('.connection-mechanism'), text)).toEqual(['Local pipe', 'File I/O']);
    expect(alternate.body.textContent).not.toMatch(/Temporal|Bedrock|Clerk/);
  });

  it('names the diagram and presents three editorial groups at H3 level', () => {
    expect(document.querySelector('[role="group"]')?.getAttribute('aria-label'))
      .toBe('Conexiones y protocolos');
    expect(Array.from(document.querySelectorAll('h3'), text))
      .toEqual(['Conexiones y protocolos', 'API Go / Workers Python', 'Gateway FastAPI / Worker de Layout/OCR']);
    expect(document.querySelector('h1, h2, h5, h6')).toBeNull();
  });

  it.each(mainEdges)('connects %s to %s using exactly %s in the ordered spine', (source, target, mechanism) => {
    const nodes = Array.from(document.querySelectorAll('ol > li'));
    const index = nodes.findIndex((node) => text(node.querySelector('strong')) === source);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(text(nodes[index + 1]?.querySelector('strong') ?? null)).toBe(target);
    expect(text(nodes[index]?.querySelector('.connection-mechanism') ?? null)).toBe(mechanism);
  });

  it.each(branchEdges)('associates %s: %s to %s with exactly %s', (group, source, target, mechanism) => {
    const section = Array.from(document.querySelectorAll('section'))
      .find((entry) => text(entry.querySelector('h3')) === group);
    const heading = Array.from(section?.querySelectorAll('h4') ?? [])
      .find((entry) => text(entry) === source);
    expect(heading).toBeDefined();
    const branches = section?.querySelector(`ul[aria-labelledby="${heading?.id}"]`);
    const edge = Array.from(branches?.children ?? [])
      .find((entry) => text(entry.querySelector('strong')) === target);
    expect(edge).toBeDefined();
    expect(text(edge?.querySelector('.connection-mechanism') ?? null)).toBe(mechanism);
    expect(edge?.querySelector('[aria-hidden="true"], [hidden]')).toBeNull();
  });

  it('contains only the thirteen supplied routes and keeps queue categories adjacent to Temporal', () => {
    expect(document.querySelectorAll('ol > li')).toHaveLength(5);
    expect(document.querySelectorAll('.connection-mechanism')).toHaveLength(13);
    expect(document.querySelectorAll('h4 + ul > li')).toHaveLength(9);
    const temporal = Array.from(document.querySelectorAll('ol > li'))
      .find((node) => text(node.querySelector('strong')) === 'Temporal');
    expect(text(temporal?.querySelector('.connection-mechanism') ?? null)).toBe('Task Queues');
    expect(Array.from(temporal?.querySelectorAll('ul > li') ?? [], text))
      .toEqual(['Procesamiento general.', 'Procesamiento con GPU.', 'Layout y OCR.']);
    expect(document.querySelectorAll('h4')).toHaveLength(4);
    expect(text(document.querySelector('ol > li:last-child'))).toBe('Workers Python');
  });

  it('adds no runtime, hidden protocol text, embeds, decorative accessible arrows, or custom assets', () => {
    expect(document.querySelector('script, astro-island, img, svg, iframe, canvas, link, [hidden]')).toBeNull();
    expect(document.querySelector('.connection-mechanism[aria-hidden="true"]')).toBeNull();
    expect(html).not.toMatch(/\s(?:on\w+|client:\w+)=/i);
    expect(document.body.textContent).not.toMatch(/[→↓▼│├└]/);
  });

  it('does not invent branches, links or queues for a terminal-only supplied flow', async () => {
    const container = await AstroContainer.create();
    const alternate = new JSDOM(await container.renderToString(DocumentConnections, {
      props: { ...connectionData, requestFlow: [{ name: 'Terminal' }], branchSections: [] } satisfies Props,
    })).window.document;
    expect(alternate.querySelectorAll('ol > li')).toHaveLength(1);
    expect(alternate.querySelector('.request-link, .queue-categories, .branch-group')).toBeNull();
    expect(alternate.querySelectorAll('h3')).toHaveLength(1);
    expect(alternate.body.textContent).not.toMatch(/Temporal|Bedrock/);
  });

  it('resolves every group and list accessible reference to its visible heading', () => {
    for (const element of document.querySelectorAll('[aria-labelledby]')) {
      const id = element.getAttribute('aria-labelledby') ?? '';
      expect(document.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
      expect(document.getElementById(id)?.textContent?.trim()).not.toBe('');
    }
    expect(document.querySelector('.queue-categories')?.getAttribute('aria-label')).toBe('Las colas principales de Temporal separan:');
  });
});

describe('DocumentConnections integration', () => {
  it('binds every exported connection inside a closed disclosure before System Limits', async () => {
    const container = await AstroContainer.create();
    container.addServerRenderer({ renderer: mdxRenderer });
    const article = new JSDOM(await container.renderToString(ArticleContent)).window.document;
    const diagram = article.querySelector('#document-connections');
    expect(article.querySelectorAll('#document-connections')).toHaveLength(1);
    expect(diagram?.outerHTML).toBe(document.querySelector('#document-connections')?.outerHTML);
    const disclosure = diagram?.closest('details');
    expect(disclosure?.hasAttribute('open')).toBe(false);
    expect(text(disclosure?.querySelector(':scope > summary') ?? null)).toBe('Conexions & Protocols');
    const outerDisclosures = Array.from(article.querySelectorAll('details')).filter((entry) => !entry.parentElement?.closest('details'));
    const limits = outerDisclosures[outerDisclosures.indexOf(disclosure!) + 1];
    expect(text(limits?.querySelector(':scope > summary') ?? null)).toBe('System Limits');
    expect(limits?.hasAttribute('open')).toBe(false);
    expect(article.querySelectorAll('#document-connections .connection-mechanism')).toHaveLength(13);
    expect(article.querySelectorAll('#document-connections .queue-categories li')).toHaveLength(3);
  });
});
