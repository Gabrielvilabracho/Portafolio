import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import { TECHNOLOGY_PRESENTATION, type ProjectTechnology } from '../../../domain/entities/project';
import TechnicalFoundation from './TechnicalFoundation.astro';

async function render(technologies: ProjectTechnology[], presentation?: typeof TECHNOLOGY_PRESENTATION.EDITORIAL_NINE) {
  const container = await AstroContainer.create();
  return container.renderToString(TechnicalFoundation, { props: { technologies, presentation } });
}

describe('TechnicalFoundation', () => {
  it('renders the editorial-nine technology geometry and applies explicit dark-mode logo inversion', async () => {
    const technologies = Array.from({ length: 9 }, (_, index) => ({
      name: `Technology ${index + 1}`,
      category: 'other' as const,
      logo: `/imagenes/technologies/technology-${index + 1}.svg`,
      invertInDarkMode: index === 0,
    }));
    const html = await render(technologies, TECHNOLOGY_PRESENTATION.EDITORIAL_NINE);

    expect(html).toContain('id="stack"');
    expect(html).toContain('data-technical-foundation-intro');
    expect(html).toContain('md:grid-cols-3');
    expect(html).toContain('md:col-span-3 lg:col-span-6');
    expect(html.match(/data-technology-cell/g)).toHaveLength(9);
    expect(html.match(/lg:col-span-3/g)).toHaveLength(6);
    expect(html.match(/lg:col-span-4/g)).toHaveLength(3);
    expect(html.match(/min-height: 10.5rem/g)).toHaveLength(10);
    expect(html).toContain('src="/imagenes/technologies/technology-1.svg"');
    expect(html).toMatch(/src="\/imagenes\/technologies\/technology-1\.svg"[^>]*class="[^"\n]*dark:invert"/);
    expect(html).toMatch(/src="\/imagenes\/technologies\/technology-2\.svg"[^>]*class="h-10 w-10 shrink-0 object-contain object-right"/);
    expect(html).toContain('id="technical-foundation-heading"');
  });

  it('falls back to the generic layout when editorial-nine content does not contain nine technologies', async () => {
    const html = await render(
      Array.from({ length: 8 }, (_, index) => ({ name: `Technology ${index + 1}`, category: 'other' as const })),
      TECHNOLOGY_PRESENTATION.EDITORIAL_NINE,
    );

    expect(html).not.toContain('data-technical-foundation-intro');
    expect(html).toContain('md:grid-cols-2');
    expect([...html.matchAll(/lg:col-span-(?:12|6|4)/g)].map((match) => match[0])).toEqual([
      'lg:col-span-4',
      'lg:col-span-4',
      'lg:col-span-4',
      'lg:col-span-4',
      'lg:col-span-4',
      'lg:col-span-4',
      'lg:col-span-6',
      'lg:col-span-6',
    ]);
  });

  it.each([
    [1, ['lg:col-span-12']],
    [4, ['lg:col-span-6', 'lg:col-span-6', 'lg:col-span-6', 'lg:col-span-6']],
    [5, ['lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-6', 'lg:col-span-6']],
    [7, ['lg:col-span-4', 'lg:col-span-4', 'lg:col-span-4', 'lg:col-span-6', 'lg:col-span-6', 'lg:col-span-6', 'lg:col-span-6']],
    [9, Array.from({ length: 9 }, () => 'lg:col-span-4')],
  ])('renders a generic %i-technology stack with balanced desktop rows', async (count, expectedDesktopSpans) => {
    const html = await render(Array.from({ length: count }, (_, index) => ({ name: `Technology ${index + 1}`, category: 'other' })));
    const desktopSpans = [...html.matchAll(/lg:col-span-(?:12|6|4)/g)].map((match) => match[0]);

    expect(html).toContain('>The technologies and tools that power this project.</h2>');
    expect(html).not.toContain('data-technical-foundation-intro');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('undefined');
    expect(desktopSpans).toEqual(expectedDesktopSpans);
  });
});
