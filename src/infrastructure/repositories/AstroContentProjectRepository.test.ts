import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { getCollection, type CollectionEntry } from 'astro:content';
import { AstroContentProjectRepository } from './AstroContentProjectRepository';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

type ProjectEntry = CollectionEntry<'projects'>;
type ProjectData = ProjectEntry['data'];

const mockedGetCollection = getCollection as unknown as MockedFunction<
  () => Promise<ProjectEntry[]>
>;

function makeEntry(
  id: string,
  data: Partial<ProjectData> & Pick<ProjectData, 'title' | 'year' | 'description'>
): ProjectEntry {
  return {
    id,
    collection: 'projects',
    data: {
      type: 'project',
      comingSoon: false,
      ...data,
    },
  } as ProjectEntry;
}

beforeEach(() => {
  mockedGetCollection.mockReset();
});

describe('AstroContentProjectRepository', () => {
  describe('getAll — mapping', () => {
    it('maps entry data to the domain Project shape', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('ai-support-agent', {
          title: 'AI Support Agent',
          type: 'case',
          year: 2025,
          description: 'An agent that answers support tickets.',
          image: '/imagenes/agent.png',
          discipline: 'AI Engineering',
          focus: 'Automation',
          mark: 'A1',
          order: 2,
          comingSoon: true,
          overview: 'A richer overview.',
          context: 'A specific project problem.',
          workflow: {
            title: 'Trusted workflow',
            subtitle: 'Controlled delivery.',
            steps: [{ title: 'Ingest', description: 'Capture the source.' }],
          },
          featureRows: {
            heading: 'Trust controls',
            sectionId: 'trust',
            rows: [{ tag: 'Layer 01', title: 'Evidence', description: 'Keep source evidence.' }],
          },
          linksLabel: '02 — Explore',
          technologies: [
            { name: 'TypeScript', role: 'language', category: 'language', logo: '/imagenes/technologies/typescript.svg', logoLabel: 'TypeScript logo', invertInDarkMode: true },
            { name: 'LangGraph', category: 'ai' },
          ],
          links: [{ label: 'Demo', url: 'https://example.com', type: 'demo' }],
        }),
      ]);

      const repository = new AstroContentProjectRepository();
      const [project] = await repository.getAll();

      expect(project).toEqual({
        id: 'ai-support-agent',
        title: 'AI Support Agent',
        type: 'case',
        description: 'An agent that answers support tickets.',
        image: '/imagenes/agent.png',
        technologies: [
          { name: 'TypeScript', role: 'language', category: 'language', logo: '/imagenes/technologies/typescript.svg', logoLabel: 'TypeScript logo', invertInDarkMode: true },
          { name: 'LangGraph', category: 'ai' },
        ],
        discipline: 'AI Engineering',
        focus: 'Automation',
        mark: 'A1',
        order: 2,
        comingSoon: true,
        links: [{ label: 'Demo', url: 'https://example.com', type: 'demo' }],
        overview: 'A richer overview.',
        context: 'A specific project problem.',
        workflow: {
          title: 'Trusted workflow',
          subtitle: 'Controlled delivery.',
          steps: [{ title: 'Ingest', description: 'Capture the source.' }],
        },
        featureRows: {
          heading: 'Trust controls',
          sectionId: 'trust',
          rows: [{ tag: 'Layer 01', title: 'Evidence', description: 'Keep source evidence.' }],
        },
        linksLabel: '02 — Explore',
        year: 2025,
        slug: 'ai-support-agent',
      });
    });

    it('preserves technology metadata for detailed project rendering', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('tech-project', {
          title: 'Tech Project',
          year: 2024,
          description: 'Tech mapping check.',
          technologies: [
            { name: 'Astro', category: 'framework', logo: '/imagenes/technologies/astro.svg', logoLabel: 'Astro logo', invertInDarkMode: true },
            { name: 'Postgres', category: 'data' },
          ],
        }),
      ]);

      const repository = new AstroContentProjectRepository();
      const [project] = await repository.getAll();

      expect(project?.technologies).toEqual([
        { name: 'Astro', category: 'framework', logo: '/imagenes/technologies/astro.svg', logoLabel: 'Astro logo', invertInDarkMode: true },
        { name: 'Postgres', category: 'data' },
      ]);
    });

    it('preserves the editorial-nine technology presentation metadata', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('editorial-nine-project', {
          title: 'Editorial Project',
          year: 2024,
          description: 'Editorial technology mapping check.',
          technologyPresentation: 'editorial-nine',
          technologies: Array.from({ length: 9 }, (_, index) => ({
            name: `Technology ${index + 1}`,
            category: 'other' as const,
          })),
        }),
      ]);

      const repository = new AstroContentProjectRepository();
      const [project] = await repository.getAll();

      expect(project?.technologyPresentation).toBe('editorial-nine');
    });

    it('maps missing optional fields to undefined and missing technologies to an empty array', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('minimal', {
          title: 'Minimal',
          year: 2024,
          description: 'Only required fields.',
        }),
      ]);

      const repository = new AstroContentProjectRepository();
      const [project] = await repository.getAll();

      expect(project?.image).toBeUndefined();
      expect(project?.discipline).toBeUndefined();
      expect(project?.focus).toBeUndefined();
      expect(project?.mark).toBeUndefined();
      expect(project?.order).toBeUndefined();
      expect(project?.links).toBeUndefined();
      expect(project?.technologies).toEqual([]);
    });

    it('uses the entry id as the slug', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('my-entry-id', {
          title: 'Slug Check',
          year: 2024,
          description: 'Slug comes from the entry id.',
        }),
      ]);

      const repository = new AstroContentProjectRepository();
      const [project] = await repository.getAll();

      expect(project?.slug).toBe('my-entry-id');
      expect(project?.id).toBe('my-entry-id');
    });
  });

  describe('getAll — sort contract', () => {
    it('sorts by year descending', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('old', { title: 'Old', year: 2022, description: 'd' }),
        makeEntry('new', { title: 'New', year: 2025, description: 'd' }),
        makeEntry('mid', { title: 'Mid', year: 2024, description: 'd' }),
      ]);

      const repository = new AstroContentProjectRepository();
      const projects = await repository.getAll();

      expect(projects.map((p) => p.slug)).toEqual(['new', 'mid', 'old']);
    });

    it('breaks year ties by slug ascending', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('zeta-project', { title: 'Zeta', year: 2024, description: 'd' }),
        makeEntry('alpha-project', { title: 'Alpha', year: 2024, description: 'd' }),
        makeEntry('mid-project', { title: 'Mid', year: 2024, description: 'd' }),
      ]);

      const repository = new AstroContentProjectRepository();
      const projects = await repository.getAll();

      expect(projects.map((p) => p.slug)).toEqual([
        'alpha-project',
        'mid-project',
        'zeta-project',
      ]);
    });

    it('applies the tie-break only within the same year', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('b-2024', { title: 'B', year: 2024, description: 'd' }),
        makeEntry('a-2023', { title: 'A', year: 2023, description: 'd' }),
        makeEntry('a-2024', { title: 'A', year: 2024, description: 'd' }),
      ]);

      const repository = new AstroContentProjectRepository();
      const projects = await repository.getAll();

      expect(projects.map((p) => p.slug)).toEqual(['a-2024', 'b-2024', 'a-2023']);
    });
  });

  describe('getBySlug', () => {
    it('returns the project matching the slug', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('first', { title: 'First', year: 2024, description: 'd' }),
        makeEntry('second', { title: 'Second', year: 2023, description: 'd' }),
      ]);

      const repository = new AstroContentProjectRepository();
      const project = await repository.getBySlug('second');

      expect(project?.title).toBe('Second');
      expect(project?.slug).toBe('second');
    });

    it('returns null for an unknown slug', async () => {
      mockedGetCollection.mockResolvedValue([
        makeEntry('only', { title: 'Only', year: 2024, description: 'd' }),
      ]);

      const repository = new AstroContentProjectRepository();
      const project = await repository.getBySlug('does-not-exist');

      expect(project).toBeNull();
    });
  });
});
