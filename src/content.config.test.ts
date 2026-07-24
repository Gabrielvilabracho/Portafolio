import { describe, expect, it } from 'vitest';
import { TECHNOLOGY_PRESENTATION } from './domain/entities/project';
import { caseStudySchema, projectSchema } from './content.config';

const baseProject = {
  title: 'Schema Project',
  year: 2026,
  description: 'Schema validation fixture.',
};

const technologies = (count: number) => Array.from({ length: count }, (_, index) => ({
  name: `Technology ${index + 1}`,
  category: 'other' as const,
}));

describe('project content schema', () => {
  it('keeps technology lists unconstrained for every presentation mode', () => {
    expect(projectSchema.safeParse({
      ...baseProject,
      technologyPresentation: TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE,
      technologies: technologies(12),
    }).success).toBe(true);

    expect(projectSchema.safeParse({
      ...baseProject,
      technologyPresentation: TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE,
      technologies: technologies(8),
    }).success).toBe(true);
    expect(projectSchema.safeParse({ ...baseProject, technologies: technologies(1) }).success).toBe(true);
    expect(projectSchema.safeParse({ ...baseProject, technologies: technologies(12) }).success).toBe(true);
  });

  it('accepts a case study link only when it uses a routable slug', () => {
    expect(projectSchema.safeParse({ ...baseProject, caseStudySlug: 'document-intelligence' }).success).toBe(true);
    expect(projectSchema.safeParse({ ...baseProject, caseStudySlug: 'Document Intelligence' }).success).toBe(false);
  });

});

describe('case study content schema', () => {
  it('supports project and use-case studies with a routable detail slug', () => {
    expect(caseStudySchema.safeParse({ title: 'A project study', slug: 'document-intelligence', kind: 'project' }).success).toBe(true);
    expect(caseStudySchema.safeParse({ title: 'A use-case study', slug: 'support-automation', kind: 'use-case' }).success).toBe(true);
  });

  it('rejects an invalid detail slug', () => {
    expect(caseStudySchema.safeParse({ title: 'Invalid relation', slug: 'Document Intelligence' }).success).toBe(false);
  });
});
