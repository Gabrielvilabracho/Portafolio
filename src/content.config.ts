import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';
import { CASE_STUDY_KIND } from './domain/entities/case-study';
import { TECHNOLOGY_PRESENTATION } from './domain/entities/project';
import { routableSlugSchema } from './domain/validation/routableSlug';

const metric = z.object({
  label: z.string(),
  value: z.string(),
  delta: z.string().optional(),
});

const link = z.object({
  label: z.string(),
  url: z.string(),
  type: z.enum(['github', 'demo', 'article', 'other']).default('other'),
});

const technology = z.object({
  name: z.string(),
  role: z.string().optional(),
  category: z.enum(['language', 'framework', 'infrastructure', 'ai', 'data', 'other']).default('other'),
  logo: z.string().optional(),
  logoLabel: z.string().optional(),
  invertInDarkMode: z.boolean().optional(),
});

const workflowStep = z.object({
  title: z.string(),
  description: z.string(),
  artwork: z.object({
    src: z.string(),
    className: z.string(),
  }).optional(),
});

const workflow = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  navigationPhrase: z.string().optional(),
  steps: z.array(workflowStep).min(2).max(6),
});

const featureRow = z.object({
  tag: z.string(),
  title: z.string(),
  description: z.string(),
});

const featureRows = z.object({
  heading: z.string(),
  navigationLabel: z.string().optional(),
  navigationPhrase: z.string().optional(),
  sectionId: z.string().optional(),
  rows: z.array(featureRow).min(1),
});

export const projectSchema = z.object({
  title: z.string(),
  type: z.enum(['case', 'project']).default('project'),
  year: z.number(),
  discipline: z.string().optional(),
  focus: z.string().optional(),
  description: z.string(),
  mark: z.string().optional(),
  order: z.number().optional(),
  image: z.string().optional(),
  comingSoon: z.boolean().default(false),
  caseStudySlug: routableSlugSchema.optional(),
  overview: z.string().optional(),
  context: z.string().optional(),
  approach: z.string().optional(),
  differentiator: z.string().optional(),
  workflow: workflow.optional(),
  featureRows: featureRows.optional(),
  linksLabel: z.string().optional(),
  technologyPresentation: z.literal(TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE).optional(),
  architecture: z.object({
    description: z.string(),
    diagram: z.string().optional(),
  }).optional(),
  technologies: z.array(technology).optional(),
  metrics: z.array(metric).optional(),
  demo: z.object({
    type: z.enum(['video', 'gif', 'image']),
    src: z.string(),
    caption: z.string().optional(),
  }).optional(),
  lessons: z.string().optional(),
  future: z.string().optional(),
  links: z.array(link).optional(),
});

export const caseStudySchema = z.object({
  title: z.string(),
  slug: routableSlugSchema,
  summary: z.string().optional(),
  kind: z.enum([CASE_STUDY_KIND.PROJECT, CASE_STUDY_KIND.USE_CASE]).default(CASE_STUDY_KIND.PROJECT),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: projectSchema,
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: caseStudySchema,
});

export const collections = { projects, caseStudies };
