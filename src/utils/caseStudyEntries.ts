import { getCollection, type CollectionEntry } from 'astro:content';

const caseStudyFiles = import.meta.glob('../content/case-studies/**/*.{md,mdx}');

export async function getCaseStudies(): Promise<CollectionEntry<'caseStudies'>[]> {
  if (Object.keys(caseStudyFiles).length === 0) return [];
  return getCollection('caseStudies');
}
