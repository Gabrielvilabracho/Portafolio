import { describe, expect, it } from 'vitest';
import { getProjectCaseStudyDetailPath, getCaseStudyStaticPaths } from './caseStudyRoutes';

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
