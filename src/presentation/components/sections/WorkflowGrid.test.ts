import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import type { ProjectWorkflowArtwork } from '../../../domain/entities/project';
import WorkflowGrid from './WorkflowGrid.astro';

const mappedStepArtwork = {
  src: '/imagenes/mapped-workflow.svg',
  className: 'pointer-events-none absolute right-0 bottom-0 z-0 h-auto w-[min(50%,10rem)]',
} satisfies ProjectWorkflowArtwork;

interface RenderOptions {
  stepTitles?: string[];
  artworkByStepIndex?: Record<number, ProjectWorkflowArtwork>;
}

async function render(count: number, { stepTitles, artworkByStepIndex }: RenderOptions = {}) {
  const container = await AstroContainer.create();
  return container.renderToString(WorkflowGrid, {
    props: {
      title: 'Workflow',
      steps: Array.from({ length: count }, (_, index) => ({
        title: stepTitles?.[index] ?? `Step ${index + 1}`,
        description: 'Description.',
        artwork: artworkByStepIndex?.[index],
      })),
    },
  });
}

describe('WorkflowGrid', () => {
  it.each([2, 3, 4, 5, 6])('renders every step in a %i-step workflow', async (count) => {
    const html = await render(count);

    expect(html.match(/<h3/g)).toHaveLength(count);
    expect(html).toContain(`Step ${count}`);
  });

  it('numbers a five-step workflow sequentially', async () => {
    const html = await render(5);

    expect(html).toContain('>01</span>');
    expect(html).toContain('>05</span>');
  });

  it('renders optional step artwork with the decoration safety contract', async () => {
    const html = await render(2, {
      stepTitles: ['A renamed display title', 'Unmapped'],
      artworkByStepIndex: { 0: mappedStepArtwork },
    });

    expect(html.match(/src="\/imagenes\/mapped-workflow.svg"/g)).toHaveLength(1);
    expect(html).toContain('alt="" aria-hidden="true"');
  });

  it('keeps the five-step layout responsive from tablet through wide screens', async () => {
    const html = await render(5);

    expect(html).toContain('md:grid-cols-2');
    expect(html).toContain('lg:grid-cols-6');
    expect(html).toContain('xl:grid-cols-5');
    expect(html.match(/md:col-span-2/g)).toHaveLength(1);
    expect(html.match(/(?:^|\s)lg:col-span-2(?:\s|")/g)).toHaveLength(4);
    expect(html.match(/(?:^|\s)lg:col-span-3(?:\s|")/g)).toHaveLength(2);
    expect(html.match(/xl:col-span-1/g)).toHaveLength(5);
  });
});
