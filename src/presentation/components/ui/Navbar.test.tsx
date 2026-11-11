import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  CASE_STUDY_THEME_IDS,
  CASE_STUDY_THEMES,
  resolveCaseStudyTheme,
  type CaseStudyThemeId,
} from '../../themes/caseStudyThemes';
import Navbar, { resolveNavbarPresentation } from './Navbar';

const REGISTERED_THEME_BY_SLUG = {
  'document-intelligence': CASE_STUDY_THEME_IDS.DOCUMENT_INTELLIGENCE,
} as const satisfies Partial<Record<string, CaseStudyThemeId>>;

describe('resolveCaseStudyTheme', () => {
  it('resolves the generic theme for an unregistered case-study slug', () => {
    const theme = resolveCaseStudyTheme('ai-support-agent', REGISTERED_THEME_BY_SLUG);

    expect(theme).toBe(CASE_STUDY_THEMES.generic);
  });

  it('resolves a specifically registered case-study theme', () => {
    const theme = resolveCaseStudyTheme('document-intelligence', REGISTERED_THEME_BY_SLUG);

    expect(theme).toBe(CASE_STUDY_THEMES['document-intelligence']);
  });
});

describe('Navbar', () => {
  it('keeps the default navbar unthemed and its controls unboxed', () => {
    const html = renderToStaticMarkup(<Navbar currentLocale="en" currentPath="/work/example" />);

    expect(html).not.toContain('data-case-theme');
    expect(html).not.toContain('data-navbar-control-boxed');
  });

  it('marks a case-study theme and boxes the GV and Contact controls separately', () => {
    const theme = CASE_STUDY_THEMES['document-intelligence'];
    const html = renderToStaticMarkup(
      <Navbar
        currentLocale="en"
        currentPath="/case-studies/document-intelligence"
        caseStudyTheme={theme}
      />
    );

    expect(html).toContain('data-case-theme="document-intelligence"');
    expect(html).toContain(`background-color:${theme.surface}`);
    expect(html).toMatch(/<a[^>]*data-navbar-control="gv"[^>]*data-navbar-control-boxed="true"/);
    expect(html).toMatch(/<a[^>]*data-navbar-control="contact"[^>]*data-navbar-control-boxed="true"/);
    expect(html).not.toMatch(/data-navbar-control="language"[^>]*data-navbar-control-boxed/);
  });

  it('keeps generic case-study controls visible against the light surface', () => {
    const theme = resolveCaseStudyTheme('ai-support-agent', REGISTERED_THEME_BY_SLUG);
    const html = renderToStaticMarkup(
      <Navbar currentLocale="en" currentPath="/case-studies/ai-support-agent" caseStudyTheme={theme} />
    );

    expect(html).toContain('data-case-theme="generic"');
    expect(html).toMatch(/data-navbar-control="gv"[^>]*data-navbar-control-boxed="true"/);
    expect(html).toMatch(/data-navbar-control="contact"[^>]*data-navbar-control-boxed="true"/);
    expect(html).toContain(`border:1px solid ${theme.navbarControlBorder}`);
  });

  it('lets dark sections override the themed canvas without inverting boxed controls', () => {
    const theme = CASE_STUDY_THEMES['document-intelligence'];
    const presentation = resolveNavbarPresentation(theme, true, 0.85);

    expect(presentation.backgroundColor).toBe('rgba(12, 12, 12, 0.85)');
    expect(presentation.textColor).toBe('#ffffff');
    expect(presentation.controlTextColor).toBe(theme.navbarControlText);
    expect(presentation.logoFilter).toBe('none');
  });
});
