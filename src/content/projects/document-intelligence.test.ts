import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { projectSchema } from '../../content.config';
import { TECHNOLOGY_PRESENTATION } from '../../domain/entities/project';

const documentIntelligenceUrl = new URL('./document-intelligence.md', import.meta.url);

const expectedTechnologies = [
  { name: 'Next.js', role: 'Operations and review interface', logo: '/imagenes/technologies/nextjs.svg' },
  { name: 'Go', role: 'Core services and deterministic validation', logo: '/imagenes/technologies/go.svg' },
  { name: 'PostgreSQL', role: 'Operational data and audit records', logo: '/imagenes/technologies/postgresql.svg' },
  { name: 'TypeScript', role: 'Type-safe application and integration contracts', logo: '/imagenes/technologies/typescript.svg' },
  { name: 'Trigger.dev', role: 'Scheduled sweeps and asynchronous jobs', logo: '/imagenes/technologies/trigger-dev.svg' },
  { name: 'LangGraph', role: 'Stateful AI extraction and review routing', logo: '/imagenes/technologies/langgraph.svg' },
  { name: 'Temporal', role: 'Durable workflow orchestration', logo: '/imagenes/technologies/temporal.svg' },
  { name: 'Python', role: 'document-processing workers and AI integration', logo: '/imagenes/technologies/python.svg' },
  { name: 'OCR', role: 'text recognition with source evidence', logo: '/imagenes/technologies/tesseract.svg' },
  { name: 'MinIO', role: 'S3-compatible document and artifact storage', logo: '/imagenes/technologies/minio.svg' },
  { name: 'Qdrant', role: 'vector search and retrieval', logo: '/imagenes/technologies/qdrant.svg' },
  { name: 'Log', role: 'workflow traceability and operational insight', logo: '/imagenes/technologies/opentelemetry.svg' },
];

const expectedWorkflowArtwork = [
  { title: 'Ingest', src: '/imagenes/strangers.svg' },
  { title: 'Understand', src: '/imagenes/figure-profile.svg' },
  { title: 'Validate', src: '/imagenes/prakash-thombre.svg' },
  { title: 'Review', src: '/imagenes/retrato.svg' },
  { title: 'Deliver', src: '/imagenes/figure-motion.svg' },
];

function frontmatter(source: string): string {
  const lines = source.split('\n');
  expect(lines.shift()).toBe('---');

  const closingDelimiter = lines.indexOf('---');
  expect(closingDelimiter).toBeGreaterThanOrEqual(0);

  return lines.slice(0, closingDelimiter).join('\n');
}

describe('Document Intelligence content contract', () => {
  it('parses the actual frontmatter with the project schema', async () => {
    const source = await readFile(documentIntelligenceUrl, 'utf8');
    const result = projectSchema.safeParse(parse(frontmatter(source)));

    expect(result.success).toBe(true);
  });

  it('keeps the editorial-twelve technology presentation, order, roles, and local logos', async () => {
    const source = await readFile(documentIntelligenceUrl, 'utf8');
    const result = projectSchema.safeParse(parse(frontmatter(source)));

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error('Document Intelligence frontmatter must satisfy projectSchema.');
    }

    expect(result.data.technologyPresentation).toBe(TECHNOLOGY_PRESENTATION.EDITORIAL_TWELVE);
    expect(result.data.technologies).toHaveLength(12);
    expect(result.data.technologies?.map(({ name, role, logo }) => ({ name, role, logo }))).toEqual(expectedTechnologies);
    result.data.technologies?.forEach(({ logo }) => {
      expect(logo?.startsWith('/imagenes/technologies/')).toBe(true);
    });
  });

  it('maps each workflow step to its intended public artwork URL', async () => {
    const source = await readFile(documentIntelligenceUrl, 'utf8');
    const result = projectSchema.safeParse(parse(frontmatter(source)));

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error('Document Intelligence frontmatter must satisfy projectSchema.');
    }

    expect(result.data.workflow?.steps.map(({ title, artwork }) => ({ title, src: artwork?.src }))).toEqual(expectedWorkflowArtwork);
  });
});
