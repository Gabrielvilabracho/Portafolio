import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import CaseStudyLayout from './CaseStudyLayout.astro';

describe('CaseStudyLayout', () => {
  it('renders the editorial document structure and optional summary', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CaseStudyLayout, {
      props: { title: 'Case study title', summary: 'Editorial summary.' },
      slots: { default: '<h2>Rendered content heading</h2><p>Rendered content body.</p>' },
    });

    expect(html).toContain('data-case-study-layout');
    expect(html).toContain('data-case-study-content');
    expect(html).toContain('<article');
    expect(html).toContain('<header');
    expect(html).toMatch(/<h1[^>]*>Case study title<\/h1>/);
    expect(html).toContain('Editorial summary.');
    expect(html).toContain('Rendered content heading');
    expect(html).toContain('Rendered content body.');
  });

  it('omits the summary when it is not provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(CaseStudyLayout, {
      props: { title: 'Case study title' },
    });

    expect(html).not.toContain('case-study-summary');
  });
});
