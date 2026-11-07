import { createRequire } from 'node:module';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import mdxRenderer from '@astrojs/mdx/server.js';
import { beforeAll, describe, expect, it } from 'vitest';
import DocumentComponentsTable, { type Props } from './DocumentComponentsTable.astro';
import Disclosure from '../ui/Disclosure.astro';
import ArticleContent, * as articleModule from '../../../content/case-studies/document-intelligence.mdx';

interface ParsedHtml {
  window: Pick<Window, 'document'>;
}

interface HtmlParserModule {
  JSDOM: new (html: string) => ParsedHtml;
}

// Use the installed parser without introducing a separate declaration dependency.
const { JSDOM } = createRequire(import.meta.url)('jsdom') as HtmlParserModule;
const editorialExports: Record<string, unknown> = articleModule;
const inventory = editorialExports.componentInventory as Props;
const expectedRows = [
  ['Portal web y BFF', 'Next.js 15, React 19, TypeScript, Clerk'],
  ['API y control central', 'Go, Chi, pgx, Temporal SDK'],
  ['Orquestación', 'Temporal'],
  ['Workers documentales', 'Python, Temporal SDK, ONNX Runtime, httpx'],
  ['Gateway de IA', 'FastAPI, LiteLLM'],
  ['Backend principal de IA', 'Amazon Bedrock'],
  ['Backend opcional de IA', 'vLLM, API compatible con OpenAI, Qwen VLM'],
  ['Layout y OCR', 'PP-DocLayoutV3, PaddleOCR, GLM-OCR'],
  ['Base de datos', 'Amazon RDS, PostgreSQL, pgvector'],
  ['Búsqueda vectorial', 'pgvector, KNN por coseno, HNSW'],
  ['Almacenamiento de archivos', 'Amazon S3, adaptador compatible con S3'],
  ['Revisión humana', 'Next.js + API Go'],
  ['Exportación', 'Go, CSV, JSON, XML y formatos compatibles con SAF-T'],
  ['Observabilidad', 'Sentry, CloudWatch, Prometheus, Grafana, OpenTelemetry y logs estructurados'],
];

let html: string;
let document: Document;

beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(DocumentComponentsTable, { props: { ...inventory } });
  document = new JSDOM(html).window.document;
});

describe('DocumentComponentsTable', () => {
  it('renders supplied rows, headers, note and accessible label instead of article defaults', async () => {
    const container = await AstroContainer.create();
    const alternate = new JSDOM(await container.renderToString(DocumentComponentsTable, {
      props: {
        label: 'Alternate inventory',
        componentHeading: 'Service',
        technologiesHeading: 'Implementation',
        components: [{ name: 'Archive <service>', technologies: 'Local & offline', note: 'Preview only.' }],
      } satisfies Props,
    })).window.document;
    expect(alternate.querySelector('table')?.getAttribute('aria-label')).toBe('Alternate inventory');
    expect(Array.from(alternate.querySelectorAll('thead th'), (cell) => cell.textContent))
      .toEqual(['Service', 'Implementation']);
    expect(alternate.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(alternate.querySelector('tbody th')?.textContent).toBe('Archive <service>');
    expect(alternate.querySelector('td')?.textContent).toContain('Local & offline');
    expect(alternate.querySelector('small')?.textContent).toBe('Preview only.');
    expect(alternate.body.textContent).not.toContain('SAF-T');
  });

  it('renders exactly fourteen editorial component and technology pairs in order', () => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));

    expect(rows).toHaveLength(14);
    rows.forEach((row, index) => {
      expect(row.querySelector('th')?.textContent?.trim()).toBe(expectedRows[index][0]);
      expect(row.querySelector('td')?.textContent?.trim()).toContain(expectedRows[index][1]);
      expect(row.querySelectorAll('th, td')).toHaveLength(2);
    });
  });

  it('retains table and header relationships when the mobile layout stacks rows', () => {
    expect(document.querySelectorAll('table')).toHaveLength(1);
    expect(document.querySelector('table')?.getAttribute('aria-label')).toBe('COMPONENTS AND TECNOLOGIES');
    expect(Array.from(document.querySelectorAll('thead th'), (cell) => cell.textContent?.trim()))
      .toEqual(['Componente', 'Tecnologías']);
    expect(document.querySelectorAll('thead th[scope="col"]')).toHaveLength(2);
    expect(document.querySelectorAll('tbody th[scope="row"]')).toHaveLength(14);
    expect(document.querySelector('[role="table"]')).not.toBeNull();
    expect(document.querySelectorAll('tbody [role="row"]')).toHaveLength(14);
    expect(document.querySelectorAll('[role="rowheader"]')).toHaveLength(14);
    expect(document.querySelectorAll('[role="columnheader"]')).toHaveLength(2);
    expect(document.querySelectorAll('[role="cell"]')).toHaveLength(14);
    expect(document.querySelector('[aria-hidden="true"], [role="presentation"], [role="none"]')).toBeNull();
  });

  it('labels the alternative backend as optional rather than primary', () => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));

    expect(rows.find((row) => row.querySelector('th')?.textContent === 'Backend opcional de IA')?.textContent)
      .toContain('vLLM, API compatible con OpenAI, Qwen VLM');
    expect(rows.find((row) => row.querySelector('th')?.textContent === 'Backend principal de IA')?.textContent)
      .toContain('Amazon Bedrock');
  });

  it('distinguishes operational export from planned CSV/XML delivery', () => {
    const row = Array.from(document.querySelectorAll('tbody tr'))
      .find((entry) => entry.querySelector('th')?.textContent === 'Exportación');
    const text = row?.querySelector('td')?.textContent?.replace(/\s+/g, ' ');

    expect(text).toContain('Approved documents can currently be delivered through the direct API as canonical JSON or a SAF-T-compatible pilot envelope.');
    expect(text).toContain('CSV rendering exists in the codebase but is currently rejected by the direct service allowlist.');
    expect(text).toContain('XML is supported as profile configuration, but no operational XML renderer or HTTP delivery route is currently wired.');
  });

  it('adds no runtime JavaScript, hydration, images, icons, or embeds', () => {
    expect(document.querySelector('script, astro-island, img, svg, iframe, canvas')).toBeNull();
    expect(html).not.toMatch(/\s(?:on\w+|client:\w+)=/i);
  });

  it('does not invent notes or rows when they are absent from the supplied inventory', async () => {
    const container = await AstroContainer.create();
    const alternate = new JSDOM(await container.renderToString(DocumentComponentsTable, {
      props: { ...inventory, components: [{ name: 'Only row', technologies: 'Only technology' }] } satisfies Props,
    })).window.document;
    expect(alternate.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(alternate.querySelector('small')).toBeNull();
    expect(alternate.body.textContent).not.toContain('SAF-T');
  });

  it('works inside the existing native, initially closed disclosure', async () => {
    const container = await AstroContainer.create();
    const disclosure = new JSDOM(await container.renderToString(Disclosure, {
      props: { title: 'Components & Technologies' },
      slots: { default: html },
    })).window.document;

    expect(disclosure.querySelector('details')?.hasAttribute('open')).toBe(false);
    expect(disclosure.querySelector('summary')?.textContent?.trim()).toBe('Components & Technologies');
    expect(disclosure.querySelectorAll('details table tbody tr')).toHaveLength(14);
    expect(disclosure.querySelector('script, astro-island')).toBeNull();
  });
});

describe('DocumentComponentsTable integration', () => {
  it('binds all exported inventory data in the actual MDX between lifecycle and connections', async () => {
    const container = await AstroContainer.create();
    container.addServerRenderer({ renderer: mdxRenderer });
    const article = new JSDOM(await container.renderToString(ArticleContent)).window.document;
    expect(article.querySelectorAll('#document-components-table')).toHaveLength(1);
    expect(article.querySelector('#document-components-table')?.outerHTML)
      .toBe(document.querySelector('table')?.outerHTML);
    const disclosure = article.querySelector('table')?.closest('details');
    expect(disclosure?.hasAttribute('open')).toBe(false);
    expect(disclosure?.querySelector(':scope > summary')?.textContent?.trim()).toBe('COMPONENTS AND TECNOLOGIES');
    const summaries = Array.from(article.querySelectorAll('details'))
      .filter((entry) => !entry.parentElement?.closest('details'))
      .map((entry) => entry.querySelector(':scope > summary')?.textContent?.trim());
    const index = summaries.indexOf('COMPONENTS AND TECNOLOGIES');
    expect(summaries.slice(index - 1, index + 2))
      .toEqual(['LIFECYCLE *(STEP BY STEP)*', 'COMPONENTS AND TECNOLOGIES', 'Conexions & Protocols']);
  });
});
