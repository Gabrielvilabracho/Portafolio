import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import WorkflowGrid from './WorkflowGrid.astro';

async function render(count: number) {
  const container = await AstroContainer.create();
  return container.renderToString(WorkflowGrid, {
    props: {
      title: 'Workflow',
      steps: Array.from({ length: count }, (_, index) => ({ title: `Step ${index + 1}`, description: 'Description.' })),
    },
  });
}

describe('WorkflowGrid', () => {
  it.each([
    [2, 'md:grid-cols-2'],
    [3, 'md:grid-cols-3'],
    [4, 'md:grid-cols-2 lg:grid-cols-4'],
    [5, 'md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-5'],
    [6, 'md:grid-cols-2 lg:grid-cols-3'],
  ])('uses a balanced responsive layout contract for %i workflow steps', async (count, expectedClasses) => {
    const html = await render(count);

    expect(html).toContain(expectedClasses);
    expect(html.match(/<h3/g)).toHaveLength(count);
  });

  it('uses the five-step responsive workflow composition', async () => {
    const html = await render(5);

    expect(html).toContain('grid grid-cols-1 gap-px bg-brand-grey-700 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-5');
    expect(html.match(/bg-dark-surface lg:col-span-2 xl:col-span-1/g)).toHaveLength(3);
    expect(html).toMatch(/<div class="[^"\n]*bg-dark-surface lg:col-span-3 xl:col-span-1"[^>]*>[\s\S]*?<h3[^>]*>Step 4<\/h3>/);
    expect(html).toMatch(/<div class="[^"\n]*bg-dark-surface md:col-span-2 lg:col-span-3 xl:col-span-1"[^>]*>[\s\S]*?<h3[^>]*>Step 5<\/h3>/);
    expect(html.match(/md:col-span-2/g)).toHaveLength(1);
    expect(html.match(/lg:col-span-3/g)).toHaveLength(2);
    expect(html.match(/xl:col-span-1/g)).toHaveLength(5);
  });
});
