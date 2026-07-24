import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import { TECHNOLOGY_PRESENTATION, type Project } from '../../../domain/entities/project';
import ProjectOverview from './ProjectOverview.astro';

const genericProject: Project = {
  id: 'generic-project',
  slug: 'generic-project',
  title: 'Generic Project',
  type: 'project',
  year: 2026,
  description: 'A reusable project description.',
  comingSoon: false,
  technologies: [],
};

async function render(project: Project) {
  const container = await AstroContainer.create();
  return container.renderToString(ProjectOverview, { props: { project } });
}

describe('ProjectOverview', () => {
  it('omits optional problem and workflow navigation safely', async () => {
    const html = await render({
      ...genericProject,
      context: undefined,
      workflow: undefined,
      featureRows: undefined,
      technologies: [],
    });

    expect(html).not.toContain('href="#problem"');
    expect(html).not.toContain('href="#workflow"');
    expect(html).not.toContain('id="problem"');
    expect(html).not.toContain('id="workflow"');
    expect(html).toContain('Full cycle — from problem to deployed solution.');
  });

  it('renders generic technologies without a logo safely', async () => {
    const html = await render({
      ...genericProject,
      technologyPresentation: undefined,
      technologies: [{ name: 'Generic Technology', category: 'other' }],
    });
    const stackSection = html.match(/<section id="stack"[\s\S]*?<\/section>/)?.[0] ?? '';

    expect(stackSection).toContain('data-technology-marker');
    expect(stackSection).toContain('>Generic Technology</span>');
    expect(stackSection).not.toContain('data-technical-foundation-intro');
    expect(stackSection).not.toContain('<img');
  });

  it('maps every overview navigation anchor to a rendered section', async () => {
    const html = await render({
      id: 'document-intelligence',
      slug: 'document-intelligence',
      title: 'Document Intelligence Platform',
      type: 'project',
      year: 2026,
      discipline: 'AI Systems',
      description: 'EU-ready document intelligence for financial operations.',
      overview: 'Documents become trusted, actionable operational data.',
      context: 'Financial teams require explainable, validated, and safe operational data.',
      workflow: {
        title: 'A controlled workflow from source document to trusted delivery.',
        subtitle: 'AI accelerates understanding while evidence controls operations.',
        navigationPhrase: 'The controlled path from source document to delivery.',
        steps: [
          { title: 'Capture', description: 'Capture document data safely.' },
          { title: 'Review', description: 'Review document data safely.' },
        ],
      },
      featureRows: {
        heading: 'A common platform core with bounded local intelligence.',
        navigationLabel: 'Platform Core',
        navigationPhrase: 'The platform capabilities that shape the solution.',
        sectionId: 'platform-scope',
        rows: [
          { tag: 'Layer 01', title: 'Vertical Intelligence', description: 'Profiles bind local compliance constraints.' },
          { tag: 'Layer 02', title: 'Trust by Design', description: 'Approved delivery remains auditable.' },
        ],
      },
      technologyPresentation: TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE,
      technologies: Array.from({ length: 12 }, (_, index) => ({ name: `Technology ${index + 1}`, category: 'other' as const })),
      comingSoon: false,
    });

    for (const href of ['#problem', '#workflow', '#platform-scope', '#stack']) {
      expect(html).toMatch(new RegExp(`<a[^>]*href="${href}"`));
      expect(html).toContain(`id="${href.slice(1)}"`);
    }

    expect(html).toContain('The controlled path from source document to delivery.');
    expect(html).toContain('The platform capabilities that shape the solution.');
  });
});
