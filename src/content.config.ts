import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

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
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
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
    overview: z.string().optional(),
    context: z.string().optional(),
    approach: z.string().optional(),
    differentiator: z.string().optional(),
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
  }),
});

export const collections = { projects };
