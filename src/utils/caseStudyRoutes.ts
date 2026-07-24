import type { Locale } from './i18n';
import { localizePath } from './i18n';
import { routableSlugSchema } from '../domain/validation/routableSlug';

export interface CaseStudyReference {
  id: string;
  data: {
    slug: string;
  };
}

export function getCaseStudyStaticPaths<T extends CaseStudyReference>(caseStudies: readonly T[]) {
  return caseStudies.map((caseStudy) => {
    const slug = routableSlugSchema.parse(caseStudy.data.slug);

    return {
      params: { slug },
      props: { caseStudy },
    };
  });
}

export function findCaseStudyBySlug<T extends CaseStudyReference>(
  caseStudySlug: string | undefined,
  caseStudies: readonly T[]
): T | undefined {
  if (!caseStudySlug) return undefined;
  return caseStudies.find((caseStudy) => caseStudy.data.slug === caseStudySlug);
}

export function getCaseStudyDetailPath(caseStudy: CaseStudyReference, locale: Locale): string {
  const slug = routableSlugSchema.parse(caseStudy.data.slug);
  return localizePath(`/case-studies/${slug}`, locale);
}

export function getProjectCaseStudyDetailPath<T extends CaseStudyReference>(
  project: { caseStudySlug?: string },
  caseStudies: readonly T[],
  locale: Locale
): string | undefined {
  const caseStudy = findCaseStudyBySlug(project.caseStudySlug, caseStudies);
  return caseStudy ? getCaseStudyDetailPath(caseStudy, locale) : undefined;
}
