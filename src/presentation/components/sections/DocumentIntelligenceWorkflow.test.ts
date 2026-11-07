import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as reactContainerRenderer } from '@astrojs/react/container-renderer';
import { describe, expect, it } from 'vitest';
import DocumentIntelligenceWorkflow from './DocumentIntelligenceWorkflow.astro';

async function render() {
  const renderers = await loadRenderers([reactContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  return container.renderToString(DocumentIntelligenceWorkflow, {
    props: {
      problemTitle: 'Problem',
      problemSubtitle: 'Financial teams need safe operational data.',
      workflow: {
        title: 'A controlled workflow from source document to trusted delivery.',
        subtitle: 'Evidence and review govern operational delivery.',
        steps: [
          { title: 'Ingest', description: 'Capture the source.' },
          { title: 'Understand', description: 'Extract structured fields.' },
          { title: 'Validate', description: 'Apply deterministic rules.' },
          { title: 'Review', description: 'Route high-risk cases.' },
          { title: 'Deliver', description: 'Release approved data.' },
        ],
      },
      featureRows: {
        heading: 'A common platform core with bounded local intelligence.',
        sectionId: 'platform-scope',
        rows: [
          { tag: 'Layer 01', title: 'Vertical Intelligence', description: 'Profiles bind local constraints.' },
          { tag: 'Layer 02', title: 'Trust by Design', description: 'Every approved delivery remains auditable.' },
        ],
      },
    },
  });
}

describe('DocumentIntelligenceWorkflow', () => {
  it('renders the problem and workflow introduction above five equal workflow steps', async () => {
    const html = await render();

    expect(html).toContain('data-document-intelligence-workflow');
    expect(html).toContain('lg:grid-cols-12');
    expect(html).toContain('gap-px border-b border-brand-grey-700 bg-brand-grey-700 md:grid-cols-2 lg:grid-cols-5');
    expect(html).toMatch(/Problem[\s\S]*?A controlled workflow[\s\S]*?Ingest[\s\S]*?Understand/);
  });

  it('pairs the platform core content with the client-mounted architecture viewer', async () => {
    const html = await render();

    expect(html).toContain('id="platform-scope"');
    expect(html).toContain('id="platform-scope" class="grid grid-cols-1 lg:grid-cols-5');
    expect(html).toContain('class="lg:col-span-2 lg:border-r');
    expect(html).toContain('class="relative flex w-full items-center justify-center overflow-hidden bg-[#18191B] lg:col-span-3"');
    expect(html).toContain('A common platform core with bounded local intelligence.');
    expect(html).toContain('data-interactive-svg-viewer');
    expect(html).toContain('client="load"');
    expect(html).toContain('aria-label="Zoom in"');
    expect(html).toContain('aria-label="Zoom out"');
    expect(html).toContain('aria-label="Reset zoom"');
    expect(html).toContain('src="/imagenes/web_pices/Frame 9-4.svg"');
    expect(html).toContain('alt="Document Intelligence platform architecture and operational workflow"');
    expect(html).toContain('data-svg-viewer-viewport');
    expect(html).toContain('object-contain');
  });
});
