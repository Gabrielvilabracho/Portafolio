import { createRequire } from 'node:module';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import DocumentLifecycle, { type Props } from './DocumentLifecycle.astro';
import mdxRenderer from '@astrojs/mdx/server.js';
import ArticleContent, * as articleModule from '../../../content/case-studies/document-intelligence.mdx';
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';

const stageLabels = ['Intake', 'Extraction', 'Validation', 'Review & Approval', 'Export'];
// Astro's wildcard MDX declaration omits custom exports; runtime binding is tested below.
const editorialExports: Record<string, unknown> = articleModule;
const lifecycle = editorialExports.lifecycle as Props;

interface ParsedHtml {
  window: Pick<Window, 'document'>;
}

interface HtmlParserModule {
  JSDOM: new (html: string, options?: { url: string }) => ParsedHtml;
}

const { JSDOM } = createRequire(import.meta.url)('jsdom') as HtmlParserModule;

async function render() {
  const container = await AstroContainer.create();
  return container.renderToString(DocumentLifecycle, { props: { ...lifecycle } });
}

function listItems(html: string) {
  return Array.from(html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g), (match) => match[1]);
}

describe('DocumentLifecycle', () => {
  it('renders alternate editorial stages and the supplied accessible label', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(DocumentLifecycle, {
      props: {
        label: 'Alternate process',
        stages: [{ label: 'Receive <input>', description: 'Keep & inspect the source.' }],
      } satisfies Props,
    });
    expect(html).toContain('aria-label="Alternate process"');
    expect(listItems(html)).toHaveLength(1);
    expect(html).toContain('Receive &lt;input&gt;');
    expect(html).toContain('Keep &amp; inspect the source.');
    expect(html).not.toContain('Human review of the evidence');
  });

  it('renders five native ordered stages with the approved labels', async () => {
    const html = await render();

    expect(html.match(/<ol\b/g)).toHaveLength(1);
    expect(html).toMatch(/<ol\b[^>]*aria-label="Document lifecycle"/);
    expect(listItems(html)).toHaveLength(5);
    const labels = Array.from(html.matchAll(/<strong\b[^>]*>(.*?)<\/strong>/g),
      (match) => match[1].replaceAll('&amp;', '&'));
    expect(labels).toEqual(stageLabels);
    expect(html).not.toMatch(/role="(?:presentation|none)"/);
  });

  it('keeps visual numbering and connectors out of duplicated accessible text', async () => {
    const html = await render();

    expect(listItems(html)).toHaveLength(5);
    for (const item of listItems(html)) {
      const text = item.replace(/<[^>]*>/g, '');
      expect(text).not.toMatch(/\b0[1-5]\b/);
    }
    expect(html).not.toMatch(/<li\b[^>]*(?:aria-hidden|aria-label)=/);
  });

  it('summarizes extraction and validation without bypassing required human approval', async () => {
    const steps = listItems(await render()).map((item) => item.replace(/<[^>]*>/g, ''));

    expect(steps[0]).toMatch(/receive the document/i);
    expect(steps[1]).toMatch(/header, line items, and totals/i);
    expect(steps[2]).toMatch(/consistency and business rules/i);
    expect(steps[3]).toMatch(/human review.*required.*approval/i);
    expect(steps[4]).toMatch(/deliver the approved output/i);
    expect(steps.join(' ')).not.toMatch(/automatic approval|fully integrated|production-ready ERP/i);
  });

  it('renders static content without client scripts, embeds, or icons', async () => {
    const html = await render();

    expect(html).not.toMatch(/<(?:script|iframe|astro-island|svg|img|canvas)\b/i);
    expect(html).not.toMatch(/\s(?:onclick|onload|client:\w+)=/i);
  });

  it('renders an empty supplied stage list without falling back to article copy', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(DocumentLifecycle, {
      props: { label: 'No stages', stages: [] } satisfies Props,
    });
    expect(listItems(html)).toHaveLength(0);
    expect(html).not.toContain('Intake');
  });
});

describe('real MDX editorial integration', () => {
  let articleHtml: string;
  let document: Document;

  beforeAll(async () => {
    const container = await AstroContainer.create();
    container.addServerRenderer({ renderer: mdxRenderer });
    articleHtml = await container.renderToString(ArticleContent);
    document = new JSDOM(articleHtml, { url: 'https://example.test/case-studies/document-intelligence/' }).window.document;
  });

  it('exports the three editorial objects rather than hiding data in renderers', () => {
    expect(editorialExports.lifecycle).toBeDefined();
    expect(editorialExports.componentInventory).toBeDefined();
    expect(editorialExports.connections).toBeDefined();
  });

  it('renders the actual MDX without an extra H1, empty headings or runtime scripts', () => {
    expect(document.body.textContent).toContain('TURNING PROBABILISTIC EXTRACTION');
    expect(document.querySelector('h1, script, astro-island')).toBeNull();
    expect(Array.from(document.querySelectorAll('h2, h3, h4, h5, h6'))
      .every((heading) => Boolean(heading.textContent?.trim()))).toBe(true);
  });

  it('renders exactly one H1 when the actual article is slotted into its layout', async () => {
    const container = await AstroContainer.create();
    const layout = new JSDOM(await container.renderToString(CaseStudyLayout, {
      props: { title: articleModule.frontmatter.title },
      slots: { default: articleHtml },
    }), { url: 'https://example.test/case-studies/document-intelligence/' }).window.document;
    expect(layout.querySelectorAll('h1')).toHaveLength(1);
    expect(layout.querySelector('h1')?.textContent).toBe('Document Intelligence Platform');
    expect(layout.querySelectorAll('.document-lifecycle li')).toHaveLength(5);
    expect(layout.querySelector('script, astro-island')).toBeNull();
  });

  it.each([
    ['LIFECYCLE *(STEP BY STEP)*', '.document-lifecycle'],
    ['COMPONENTS AND TECNOLOGIES', '#document-components-table'],
    ['Conexions & Protocols', '#document-connections'],
  ] as const)('keeps %s inside its initially closed disclosure', (summary, selector) => {
    const disclosure = document.querySelector(selector)?.closest('details');
    expect(disclosure?.matches('details.disclosure')).toBe(true);
    expect(disclosure?.hasAttribute('open')).toBe(false);
    expect(disclosure?.querySelector(':scope > summary')?.textContent?.trim()).toBe(summary);
    expect(disclosure?.querySelector(':scope > .disclosure__content')).not.toBeNull();
    expect(disclosure?.querySelectorAll(selector)).toHaveLength(1);
    if (selector === '.document-lifecycle') {
      expect(disclosure?.querySelector('h2')?.textContent).toBe('The Document Lifecycle');
    }
  });

  it('preserves the six outer native disclosures without obsolete typography overrides', () => {
    const outer = Array.from(document.querySelectorAll('details')).filter((entry) => !entry.parentElement?.closest('details'));
    expect(outer).toHaveLength(6);
    expect(outer.map((entry) => entry.querySelector(':scope > summary')?.textContent?.trim()))
      .toEqual([
        'GOVERNANCE AND MULTI-TENANT SECURITY',
        'OPERATIONAL FLOW & EVIDENCE LEVELS',
        'LIFECYCLE *(STEP BY STEP)*',
        'COMPONENTS AND TECNOLOGIES',
        'Conexions & Protocols',
        'System Limits',
      ]);
    expect(outer.every((entry) => !entry.hasAttribute('open'))).toBe(true);
    expect(document.querySelectorAll('details.disclosure--readable')).toHaveLength(0);
    expect(document.querySelectorAll('details')).toHaveLength(17);
  });

  it('binds the exported stages into the actual article before the detailed Intake section', async () => {
    const standalone = new JSDOM(await render()).window.document;
    const overview = document.querySelector('.document-lifecycle');
    expect(overview?.outerHTML).toBe(standalone.querySelector('.document-lifecycle')?.outerHTML);
    expect(overview?.nextElementSibling?.textContent).toBe('Intake');
    expect(overview?.nextElementSibling?.tagName).toBe('H3');
    expect(document.querySelectorAll('.document-lifecycle li')).toHaveLength(5);
  });

  it('preserves all eleven nested evidence controls and thirteen code examples', () => {
    const evidence = Array.from(document.querySelectorAll('details'))
      .filter((entry) => /^(Code|Database) evidence:/.test(entry.querySelector('summary')?.textContent?.trim() ?? ''));
    expect(evidence.map((entry) => entry.querySelector('summary')?.textContent?.trim())).toEqual([
      'Code evidence: workers/temporal-python/activities/hocr.py',
      'Database evidence: db/migrations/tenant_template/0001_documents.up.sql',
      'Code evidence: workers/temporal-python/activities/validator.py',
      'Code evidence: services/api/internal/store/review_store.go',
      'Code evidence: db/migrations/tenant_template/0001_documents.up.sql',
      'Code evidence: workers/temporal-python/workflows/document_processing_workflow.py',
      'Code evidence: workers/temporal-python/activities/validator.py',
      'Code evidence: Approval-blocking evidence',
      'Code evidence: Reviewer-protection evidence',
      'Code evidence: Audit evidence',
      'Code evidence: services/api/internal/export/export_service.go',
    ]);
    for (const disclosure of evidence) {
      expect(disclosure.parentElement?.closest('details')).not.toBeNull();
      expect(disclosure.classList.contains('disclosure--readable')).toBe(false);
      expect(disclosure.hasAttribute('open')).toBe(false);
      expect(disclosure.querySelector('pre code')).not.toBeNull();
    }
    expect(document.querySelectorAll('pre code')).toHaveLength(13);
    expect(document.querySelector('#the-document-lifecycle')?.closest('details')?.querySelectorAll('details')).toHaveLength(7);
    expect(document.querySelector('#operational-flow-and-evidence-levels')?.closest('details')
      ?.querySelectorAll('details')).toHaveLength(4);
  });

  it('retains review-policy wording and export limitations without silently reconciling them', () => {
    const text = document.body.textContent;
    expect(text).toContain('If the validator detects an anomaly, a human intervenes.');
    expect(text).toContain('Every processed document transitions to ready_for_review.');
    expect(text).toContain('Review does not happen “only if necessary.”');
    expect(text).toContain('CSV rendering exists in the codebase but is currently rejected by the direct service allowlist.');
    expect(text).toContain('XML is supported as profile configuration, but no operational XML renderer or HTTP delivery route is currently wired.');
    expect(text).toContain('canonical_json');
    expect(text).toContain('saft_pt_compatible');
  });

  it('preserves eight Spanish boundaries in System Limits and the threshold disclaimer paragraphs', () => {
    const boundary = Array.from(document.querySelectorAll('details'))
      .find((entry) => entry.querySelector(':scope > summary')?.textContent?.trim() === 'System Limits');
    expect(boundary?.hasAttribute('open')).toBe(false);
    const bullets = Array.from(boundary?.querySelectorAll('ul > li') ?? [], (entry) => entry.textContent?.trim());
    expect(bullets).toEqual([
      'Límite público: únicamente el portal Next.js y el API Go están expuestos a usuarios.',
      'Límite interno: FastAPI, workers, OCR y servicios de inferencia permanecen dentro de la red privada.',
      'Autoridad de datos: solamente el API Go escribe directamente en PostgreSQL y controla los estados del documento.',
      'Aislamiento por tenant: PostgreSQL separa los datos por esquemas y S3 mediante prefijos de objetos.',
      'Orquestación: Temporal coordina procesos y reintentos, pero no es la fuente de verdad de los documentos.',
      'Proveedores externos: Clerk gestiona identidad y Bedrock proporciona inferencia administrada.',
      'Componentes opcionales: vLLM/Qwen y el pipeline PP-DocLayoutV3/GLM-OCR requieren activación explícita.',
      'Exportación: el sistema genera y registra archivos para ERP',
    ]);
    const thresholds = boundary?.nextElementSibling;
    expect(thresholds?.tagName).toBe('P');
    expect(thresholds?.textContent).toBe('5% overall field accuracy, 90% per-field accuracy, no more than 2% nulls, and zero mathematical errors. It evaluates field values, source evidence, review routing, export readiness, validation failures, and total reconciliation.');
    expect(thresholds?.nextElementSibling?.textContent).toBe('These values are configured thresholds. They are not proof that the platform has achieved those results in production.');
  });
});
