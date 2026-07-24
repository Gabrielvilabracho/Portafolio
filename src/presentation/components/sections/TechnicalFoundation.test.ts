import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import { TECHNOLOGY_PRESENTATION, type ProjectTechnology } from '../../../domain/entities/project';
import TechnicalFoundation from './TechnicalFoundation.astro';

async function render(technologies: ProjectTechnology[], presentation?: typeof TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE) {
  const container = await AstroContainer.create();
  return container.renderToString(TechnicalFoundation, { props: { technologies, presentation } });
}

describe('TechnicalFoundation', () => {
  it('renders editorial content with technology markers and accessible logos', async () => {
    const technologies = Array.from({ length: 12 }, (_, index) => ({
      name: `Technology ${index + 1}`,
      category: 'other' as const,
      logo: `/imagenes/technologies/technology-${index + 1}.svg`,
      logoLabel: `Technology ${index + 1} logo`,
      invertInDarkMode: index === 0,
    }));
    const html = await render(technologies, TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE);

    expect(html).toContain('id="stack"');
    expect(html).toContain('data-technical-foundation-intro');
    expect(html.match(/data-technology-cell/g)).toHaveLength(12);
    expect(html).toContain('src="/imagenes/technologies/technology-1.svg"');
    expect(html).toContain('alt="Technology 1 logo"');
    expect(html).toContain('The technologies and tools that power this project.');
    expect(html).toContain('md:grid-cols-3');
    expect(html).toContain('lg:grid-cols-12');
    expect(html).toContain('md:col-span-3');
    expect(html).toContain('lg:row-span-2');
    expect(html.match(/lg:col-span-3/g)).toHaveLength(7);
    expect(html.match(/lg:col-span-2/g)).toHaveLength(6);
  });

  it('falls back to the generic layout when editorial-twelve content does not contain twelve technologies', async () => {
    const html = await render(
      Array.from({ length: 8 }, (_, index) => ({ name: `Technology ${index + 1}`, category: 'other' as const })),
      TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE,
    );

    expect(html).not.toContain('data-technical-foundation-intro');
    expect(html.match(/data-technology-cell/g)).toHaveLength(8);
    expect(html).toContain('md:grid-cols-2');
    expect(html).toContain('lg:grid-cols-12');
  });

  it.each([
    [1],
    [4],
    [5],
    [7],
    [9],
  ])('renders a generic %i-technology stack safely', async (count) => {
    const html = await render(Array.from({ length: count }, (_, index) => ({ name: `Technology ${index + 1}`, category: 'other' })));

    expect(html).toContain('>The technologies and tools that power this project.</h2>');
    expect(html).not.toContain('data-technical-foundation-intro');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('undefined');
    expect(html.match(/data-technology-cell/g)).toHaveLength(count);
  });
});
