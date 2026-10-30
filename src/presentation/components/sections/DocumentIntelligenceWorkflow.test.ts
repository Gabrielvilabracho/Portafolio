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
      problem: 'Financial teams need safe operational data.',
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
  it('promotes the first two workflow steps beside the compact problem and workflow introduction', async () => {
    const html = await render();

    expect(html).toContain('data-document-intelligence-workflow');
    expect(html).toContain('lg:grid-cols-12');
    expect(html).toMatch(/Problem[\s\S]*?Ingest[\s\S]*?Understand/);
    expect(html).toContain('max-width: 30ch');
  });

  it('pairs the platform core content with the client-mounted architecture viewer', async () => {
    const html = await render();

    expect(html).toContain('id="platform-scope"');
    expect(html).toContain('A common platform core with bounded local intelligence.');
    expect(html).toContain('data-interactive-svg-viewer');
    expect(html).toContain('client="load"');
    expect(html).toContain('aria-label="Zoom in"');
    expect(html).toContain('aria-label="Zoom out"');
    expect(html).toContain('aria-label="Reset zoom"');
    expect(html).toContain('src="/imagenes/Frame 9-2.svg"');
    expect(html).toContain('alt="Document Intelligence platform architecture and operational workflow"');
    expect(html).toContain('data-svg-viewer-viewport');
    expect(html).toContain('object-contain');
  });
});
