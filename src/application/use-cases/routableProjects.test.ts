import { describe, it, expect } from 'vitest';
import { routableProjects } from './routableProjects';
import type { Project } from '../../domain/entities/project';

function makeProject(overrides: Partial<Project> & Pick<Project, 'slug'>): Project {
  return {
    id: overrides.slug,
    title: `Title ${overrides.slug}`,
    type: 'project',
    description: 'A description',
    technologies: [],
    comingSoon: false,
    year: 2024,
    ...overrides,
  };
}

describe('routableProjects', () => {
  it('excludes comingSoon projects', () => {
    const projects = [
      makeProject({ slug: 'live-one' }),
      makeProject({ slug: 'teaser', comingSoon: true }),
      makeProject({ slug: 'live-two' }),
    ];

    const result = routableProjects(projects);

    expect(result.map((p) => p.slug)).toEqual(['live-one', 'live-two']);
  });

  it('includes everything when nothing is comingSoon', () => {
    const projects = [makeProject({ slug: 'a' }), makeProject({ slug: 'b' })];

    expect(routableProjects(projects)).toEqual(projects);
  });

  it('returns an empty array when every project is comingSoon', () => {
    const projects = [
      makeProject({ slug: 'a', comingSoon: true }),
      makeProject({ slug: 'b', comingSoon: true }),
    ];

    expect(routableProjects(projects)).toEqual([]);
  });

  it('returns an empty array for empty input', () => {
    expect(routableProjects([])).toEqual([]);
  });
});
