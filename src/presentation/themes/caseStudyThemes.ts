export const CASE_STUDY_THEME_IDS = {
  GENERIC: 'generic',
  DOCUMENT_INTELLIGENCE: 'document-intelligence',
} as const;

export type CaseStudyThemeId =
  (typeof CASE_STUDY_THEME_IDS)[keyof typeof CASE_STUDY_THEME_IDS];

export interface CaseStudyTheme {
  id: CaseStudyThemeId;
  surface: string;
  border: string;
  text: string;
  accent: string;
  headingPrimary: string;
  headingSecondary: string;
  navbarControlSurface: string;
  navbarControlText: string;
  navbarControlBorder?: string;
}

export const CASE_STUDY_THEMES = {
  [CASE_STUDY_THEME_IDS.GENERIC]: {
    id: CASE_STUDY_THEME_IDS.GENERIC,
    surface: '#ffffff',
    border: 'var(--brand-grey-200)',
    text: 'var(--brand-grey-900)',
    accent: 'var(--brand-orange-500)',
    headingPrimary: 'var(--brand-grey-900)',
    headingSecondary: 'var(--brand-grey-900)',
    navbarControlSurface: '#FEFEFE',
    navbarControlText: 'var(--brand-grey-900)',
    navbarControlBorder: 'var(--brand-grey-200)',
  },
  [CASE_STUDY_THEME_IDS.DOCUMENT_INTELLIGENCE]: {
    id: CASE_STUDY_THEME_IDS.DOCUMENT_INTELLIGENCE,
    surface: '#ABBAB9',
    border: 'rgb(61 61 61 / 24%)',
    text: '#1E1E1E',
    accent: 'var(--brand-orange-500)',
    headingPrimary: '#3D3D3D',
    headingSecondary: '#1E1E1E',
    navbarControlSurface: '#FEFEFE',
    navbarControlText: '#1E1E1E',
  },
} as const satisfies Record<CaseStudyThemeId, CaseStudyTheme>;

export function resolveCaseStudyTheme(
  slug: string,
  themeBySlug: Readonly<Partial<Record<string, CaseStudyThemeId>>>
): CaseStudyTheme {
  const themeId = themeBySlug[slug] ?? CASE_STUDY_THEME_IDS.GENERIC;
  return CASE_STUDY_THEMES[themeId];
}

export function getCaseStudyThemeStyle(theme: CaseStudyTheme): string {
  return [
    `--case-surface:${theme.surface}`,
    `--case-border:${theme.border}`,
    `--case-text:${theme.text}`,
    `--case-accent:${theme.accent}`,
    `--case-heading-primary:${theme.headingPrimary}`,
    `--case-heading-secondary:${theme.headingSecondary}`,
  ].join(';');
}
