import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SectionsGrid from './SectionsGrid.astro';

async function render(sections: { number: string; title: string; phrase: string; href: string }[]) {
  const container = await AstroContainer.create();
  return container.renderToString(SectionsGrid, { props: { sections } });
}

describe('SectionsGrid', () => {
  it('sizes section navigation from its actual entry count', async () => {
    const oneSection = await render([{ number: '01', title: 'Stack', phrase: 'Technology roles.', href: '#stack' }]);
    const threeSections = await render([
      { number: '01', title: 'Problem', phrase: 'The challenge.', href: '#problem' },
      { number: '02', title: 'Workflow', phrase: 'The process.', href: '#workflow' },
      { number: '03', title: 'Stack', phrase: 'Technology roles.', href: '#stack' },
    ]);

    expect(oneSection).toContain('md:grid-cols-1');
    expect(oneSection).toContain('lg:grid-cols-1');
    expect(threeSections).toContain('md:grid-cols-2');
    expect(threeSections).toContain('lg:grid-cols-3');
    expect(threeSections).not.toContain('border border-brand-grey-200');
  });
});
