import { createRequire } from 'node:module';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getProjectCaseStudyDetailPath, getCaseStudyStaticPaths } from './caseStudyRoutes';
import ProjectPage from '../pages/work/[slug].astro';

interface ParsedHtml {
  window: Pick<Window, 'document'>;
}

interface HtmlParserModule {
  JSDOM: new (html: string) => ParsedHtml;
}

// Use the installed parser without introducing a separate declaration dependency.
const { JSDOM } = createRequire(import.meta.url)('jsdom') as HtmlParserModule;

// This route receives params rather than props; its generated props type is never.
const projectPageFactory = ProjectPage as unknown as Parameters<AstroContainer['renderToString']>[0];

vi.mock('./di', () => ({
  getProjectsUseCase: { execute: async () => [] },
  getProjectBySlugUseCase: { execute: async (slug: string) => ({
    id: slug, slug, title: 'Example project', description: 'Example description',
    type: 'project', year: 2026, comingSoon: false, technologies: [],
    caseStudySlug: slug === 'linked' ? 'support-automation' : undefined,
  }) },
}));
vi.mock('./caseStudyEntries', () => ({
  getCaseStudies: async () => [{ id: 'support-automation', data: { slug: 'support-automation' } }],
}));

afterEach(() => vi.unstubAllEnvs());

describe('project page case-study navigation boundary', () => {
  it.each(['/', '/Portafolio/'])('prefixes a resolved CTA exactly once for base %s', async (base) => {
    vi.stubEnv('BASE_URL', base);
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const renderedHtml = await container.renderToString(projectPageFactory, { params: { slug: 'linked' } });
    // Container scripts may include the checkout directory, not a public navigation URL.
    const html = `${renderedHtml}<script type="module" src="/home/runner/work/Portafolio/Portafolio/src/pages/work/[slug].astro"></script>`;
    const document = new JSDOM(html).window.document;
    const href = document.querySelector('[data-case-study-link] a')?.getAttribute('href');
    expect(href).toBe(`${base}case-studies/support-automation/`);
    expect(href).not.toContain('/Portafolio/Portafolio/');
  });

  it('omits the CTA when no detail route resolves under a non-root base', async () => {
    vi.stubEnv('BASE_URL', '/Portafolio/');
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(projectPageFactory, { params: { slug: 'unlinked' } });
    expect(html).not.toContain('data-case-study-link');
    expect(html).not.toContain('/undefined');
  });
});

describe('case study routes', () => {
  const caseStudies = [
    { id: 'deep-dives/document-intelligence', data: { slug: 'document-intelligence' } },
    { id: 'support-automation', data: { slug: 'support-automation' } },
  ];

  it('creates a locale-correct detail path for a nested collection entry linked by a project', () => {
    const [path] = getCaseStudyStaticPaths(caseStudies);
    const project = { caseStudySlug: 'document-intelligence' };

    expect(path.params).toEqual({ slug: 'document-intelligence' });
    expect(getProjectCaseStudyDetailPath(project, caseStudies, 'es')).toBe('/es/case-studies/document-intelligence/');
  });

  it('does not expose a detail link when the project has no matching case study', () => {
    expect(getProjectCaseStudyDetailPath({ caseStudySlug: 'missing-case-study' }, caseStudies, 'es')).toBeUndefined();
  });
});
