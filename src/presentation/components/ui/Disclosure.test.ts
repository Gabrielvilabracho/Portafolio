import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Disclosure from './Disclosure.astro';

async function render(defaultOpen = false, readable?: boolean) {
  const container = await AstroContainer.create();
  return container.renderToString(Disclosure, {
    props: { title: 'Read more', defaultOpen, readable },
    slots: { default: '<p>Disclosure content</p>' },
  });
}

describe('Disclosure', () => {
  it('renders a closed native disclosure with its supplied content by default', async () => {
    const html = await render();

    expect(html).toMatch(/<details[^>]*class="disclosure[^>]*>/);
    expect(html.match(/<details[^>]*class="([^"]*)"/)?.[1]).toBe('disclosure');
    expect(html).not.toMatch(/<details[^>]*\sopen(?:=|\s|>)/);
    expect(html).toMatch(/<summary[^>]*class="disclosure__trigger[^>]*>/);
    expect(html).toContain('Read more');
    expect(html).toContain('<p>Disclosure content</p>');
    expect(html).toMatch(/class="disclosure__indicator" aria-hidden="true"[^>]*>/);
    expect(html).not.toContain('role="checkbox"');
  });

  it('renders open when defaultOpen is true', async () => {
    const html = await render(true);

    expect(html).toMatch(/<details[^>]*\sopen(?:=|\s|>)/);
  });

  it('keeps omitted and explicitly false readable props identical', async () => {
    expect(await render(false, false)).toBe(await render());
  });

  it.each([false, true])('adds only the opt-in root class with defaultOpen=%s', async (defaultOpen) => {
    const html = await render(defaultOpen, true);

    expect(html.match(/<details[^>]*class="([^"]*)"/)?.[1])
      .toBe('disclosure disclosure--readable');
    expect(html.replace('class="disclosure disclosure--readable"', 'class="disclosure"'))
      .toBe(await render(defaultOpen));
  });
});
