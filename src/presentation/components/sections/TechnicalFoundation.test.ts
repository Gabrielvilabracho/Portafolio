import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import { TECHNOLOGY_PRESENTATION, type ProjectTechnology } from '../../../domain/entities/project';
import TechnicalFoundation from './TechnicalFoundation.astro';

async function render(
  technologies: ProjectTechnology[],
  presentation?: typeof TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE,
  secondaryTechnologies?: ProjectTechnology[],
) {
  const container = await AstroContainer.create();
  return container.renderToString(TechnicalFoundation, { props: { technologies, presentation, secondaryTechnologies } });
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
    expect(html).toContain('The Stack and tools that power this project.');
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

  it('renders a divided secondary technology grid after the editorial grid', async () => {
    const primaryTechnologies = Array.from({ length: 12 }, (_, index) => ({ name: `Technology ${index + 1}`, category: 'other' as const }));
    const secondaryTechnologies = [
      { name: 'KEDA', category: 'infrastructure' as const, logo: '/imagenes/technologies/keda.svg' },
      { name: 'AWS', category: 'infrastructure' as const, logo: '/imagenes/technologies/amazon-web-services-light.svg' },
      { name: 'Next.js', category: 'framework' as const, logo: '/imagenes/technologies/nextjs.svg' },
      { name: 'LiteLLM', category: 'ai' as const, logo: '/imagenes/technologies/litellm.svg' },
      { name: 'FastAPI', category: 'framework' as const, logo: '/imagenes/technologies/fastapi.svg' },
      { name: 'Docker', category: 'infrastructure' as const, logo: '/imagenes/technologies/docker.svg' },
      { name: 'Amazon RDS', category: 'data' as const, logo: '/imagenes/technologies/RDS.svg' },
      { name: 'vLLM', category: 'ai' as const, logo: '/imagenes/technologies/vllm.svg' },
      { name: 'Sentry', category: 'infrastructure' as const, logo: '/imagenes/technologies/sentry.svg' },
      { name: 'LangSmith', category: 'ai' as const, logo: '/imagenes/technologies/langsmith.svg' },
      { name: 'Grafana', category: 'infrastructure' as const, logo: '/imagenes/technologies/grafana.svg' },
      { name: 'Amazon Bedrock', category: 'ai' as const, logo: '/imagenes/technologies/bedrock.svg' },
    ];

    const html = await render(primaryTechnologies, TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE, secondaryTechnologies);

    expect(html).toContain('data-secondary-technology-grid');
    expect(html).toContain('grid-cols-1');
    expect(html).toContain('md:grid-cols-3');
    expect(html).toContain('lg:grid-cols-6');
    expect(html).toContain('border-t');
    expect(html.match(/data-secondary-technology-cell/g)).toHaveLength(12);
    expect(html).toMatch(/Technology 12[\s\S]*?data-secondary-technology-grid[\s\S]*?KEDA[\s\S]*?AWS[\s\S]*?Next\.js[\s\S]*?LiteLLM[\s\S]*?FastAPI[\s\S]*?Docker[\s\S]*?Amazon RDS[\s\S]*?vLLM[\s\S]*?Sentry[\s\S]*?LangSmith[\s\S]*?Grafana[\s\S]*?Amazon Bedrock/);
  });

  it.each([
    [1],
    [4],
    [5],
    [7],
    [9],
  ])('renders a generic %i-technology stack safely', async (count) => {
    const html = await render(Array.from({ length: count }, (_, index) => ({ name: `Technology ${index + 1}`, category: 'other' })));

    expect(html).toContain('>The Stack and tools that power this project.</h2>');
    expect(html).not.toContain('data-technical-foundation-intro');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('undefined');
    expect(html.match(/data-technology-cell/g)).toHaveLength(count);
  });
});
