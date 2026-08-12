import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import EditorialCard from './EditorialCard.astro';

describe('EditorialCard', () => {
  it('renders the mark and metadata as independently addressable layout regions', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(EditorialCard, {
      props: {
        label: 'Document Intelligence Platform',
        mark: 'P-01',
        meta: [
          { color: 'orange', text: '2026' },
          { color: 'grey', text: 'Astro + TypeScript' },
        ],
        href: '/work/document-intelligence',
      },
    });

    expect(html).toContain('data-editorial-card-content');
    expect(html).toContain('data-editorial-card-mark');
    expect(html).toContain('data-editorial-card-metadata');
    expect(html).toMatch(/grid-template-rows:\s*max-content max-content/);
    expect(html).toMatch(/display:\s*flow-root/);
    expect(html).toContain('P-01');
    expect(html).toContain('2026');
    expect(html).toContain('Astro + TypeScript');
  });
});
