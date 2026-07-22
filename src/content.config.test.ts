import { describe, expect, it } from 'vitest';
import { TECHNOLOGY_PRESENTATION } from './domain/entities/project';
import { projectSchema } from './content.config';

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
      technologyPresentation: TECHNOLOGY_PRESENTATION.EDITORIAL_NINE,
      technologies: technologies(9),
    }).success).toBe(true);

    expect(projectSchema.safeParse({
      ...baseProject,
      technologyPresentation: TECHNOLOGY_PRESENTATION.EDITORIAL_NINE,
      technologies: technologies(8),
    }).success).toBe(true);
    expect(projectSchema.safeParse({ ...baseProject, technologies: technologies(1) }).success).toBe(true);
    expect(projectSchema.safeParse({ ...baseProject, technologies: technologies(12) }).success).toBe(true);
  });
});
