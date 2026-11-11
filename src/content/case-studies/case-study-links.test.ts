import { readFile, readdir } from 'node:fs/promises';
import { extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { caseStudySchema, projectSchema } from '../../content.config';
import { LOCALES } from '../../utils/i18n';
import {
  getCaseStudyDetailPath,
  getCaseStudyStaticPaths,
  getProjectCaseStudyDetailPath,
} from '../../utils/caseStudyRoutes';

const caseStudiesDirectory = new URL('./', import.meta.url);
const projectsDirectory = new URL('../projects/', import.meta.url);

async function discoverMarkdownFiles(directory: URL): Promise<URL[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async (entry) => {
    const entryUrl = new URL(entry.name, directory);

    if (entry.isDirectory()) {
      return discoverMarkdownFiles(new URL(`${entry.name}/`, directory));
    }

    return entry.isFile() && ['.md', '.mdx'].includes(extname(entry.name)) ? [entryUrl] : [];
  }));

  return nestedFiles.flat().sort((left, right) => left.href.localeCompare(right.href));
}

function contentId(directory: URL, file: URL): string {
  const path = relative(fileURLToPath(directory), fileURLToPath(file));
  return path.slice(0, -extname(path).length);
}

async function parseFrontmatter(file: URL): Promise<unknown> {
  const source = await readFile(file, 'utf8');
  const lines = source.split('\n');

  expect(lines.shift()).toBe('---');

  const closingDelimiter = lines.indexOf('---');
  expect(closingDelimiter).toBeGreaterThanOrEqual(0);

  return parse(lines.slice(0, closingDelimiter).join('\n'));
}

describe('Case-study link integrity', () => {
  it('validates case-study routes and declared project links across all locales', async () => {
    const [caseStudyFiles, projectFiles] = await Promise.all([
      discoverMarkdownFiles(caseStudiesDirectory),
      discoverMarkdownFiles(projectsDirectory),
    ]);
    const [caseStudies, projects] = await Promise.all([
      Promise.all(caseStudyFiles.map(async (file) => ({
        id: contentId(caseStudiesDirectory, file),
        data: caseStudySchema.parse(await parseFrontmatter(file)),
      }))),
      Promise.all(projectFiles.map(async (file) => ({
        id: contentId(projectsDirectory, file),
        data: projectSchema.parse(await parseFrontmatter(file)),
      }))),
    ]);

    expect(getCaseStudyStaticPaths(caseStudies).map(({ params }) => params.slug)).toEqual(
      caseStudies.map(({ data }) => data.slug),
    );

    for (const project of projects) {
      if (!project.data.caseStudySlug) continue;

      const caseStudy = caseStudies.find(({ data }) => data.slug === project.data.caseStudySlug);
      expect(caseStudy, `Expected ${project.id} to reference an existing case study.`).toBeDefined();

      if (!caseStudy) continue;

      for (const locale of LOCALES) {
        expect(getProjectCaseStudyDetailPath(project.data, caseStudies, locale)).toBe(
          getCaseStudyDetailPath(caseStudy, locale),
        );
      }
    }
  });
});
