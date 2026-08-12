import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { caseStudySchema, projectSchema } from '../../content.config';
import type { Project } from '../../domain/entities/project';
import { LOCALES } from '../../utils/i18n';
import { getCaseStudyDetailPath, getCaseStudyStaticPaths, getProjectCaseStudyDetailPath } from '../../utils/caseStudyRoutes';

const caseStudyUrl = new URL('./ai-support-agent.md', import.meta.url);
const projectUrl = new URL('../projects/ai-support-agent.md', import.meta.url);

function frontmatter(source: string): string {
  const lines = source.split('\n');
  expect(lines.shift()).toBe('---');

  const closingDelimiter = lines.indexOf('---');
  expect(closingDelimiter).toBeGreaterThanOrEqual(0);

  return lines.slice(0, closingDelimiter).join('\n');
}

describe('AI Support Agent example case study', () => {
  it('generates localized detail paths and links from its project', async () => {
    const caseStudySource = await readFile(caseStudyUrl, 'utf8');
    const projectSource = await readFile(projectUrl, 'utf8');
    const caseStudy = {
      id: 'ai-support-agent',
      data: caseStudySchema.parse(parse(frontmatter(caseStudySource))),
    };
    const projectData = projectSchema.parse(parse(frontmatter(projectSource)));

    expect(getCaseStudyStaticPaths([caseStudy])).toEqual([
      expect.objectContaining({ params: { slug: 'ai-support-agent' } }),
    ]);
    expect(LOCALES.map((locale) => getCaseStudyDetailPath(caseStudy, locale))).toEqual([
      '/case-studies/ai-support-agent/',
      '/es/case-studies/ai-support-agent/',
      '/pt/case-studies/ai-support-agent/',
      '/ru/case-studies/ai-support-agent/',
    ]);

    const project: Project = {
      id: 'ai-support-agent',
      slug: 'ai-support-agent',
      title: projectData.title,
      type: projectData.type,
      description: projectData.description,
      year: projectData.year,
      comingSoon: projectData.comingSoon,
      technologies: projectData.technologies ?? [],
      caseStudySlug: projectData.caseStudySlug,
    };
    const projectCaseStudyHref = getProjectCaseStudyDetailPath(project, [caseStudy], 'es');

    expect(projectCaseStudyHref).toBe('/es/case-studies/ai-support-agent/');

  });
});
