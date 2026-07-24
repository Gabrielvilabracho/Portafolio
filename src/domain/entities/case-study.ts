export const CASE_STUDY_KIND = {
  PROJECT: 'project',
  USE_CASE: 'use-case',
} as const;

export type CaseStudyKind = (typeof CASE_STUDY_KIND)[keyof typeof CASE_STUDY_KIND];
