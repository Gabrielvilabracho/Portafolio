import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { projectSchema } from '../../content.config';
import { TECHNOLOGY_PRESENTATION } from '../../domain/entities/project';

const documentIntelligenceUrl = new URL('./document-intelligence.md', import.meta.url);

const expectedTechnologies = [
  { name: 'TS', role: 'Type-safe application and integration contracts', logo: '/imagenes/technologies/typescript.svg' },
  { name: 'Go', role: 'Core services and deterministic validation', logo: '/imagenes/technologies/go.svg' },
  { name: 'Templ', role: 'Durable workflow orchestration', logo: '/imagenes/technologies/temporal.svg' },
  { name: 'Trigger', role: 'Scheduled sweeps and asynchronous jobs', logo: '/imagenes/technologies/trigger-dev.svg' },
  { name: 'Python', role: 'document-processing workers and AI integration', logo: '/imagenes/technologies/python.svg' },
  { name: 'LangGraph', role: 'Stateful AI extraction and review routing', logo: '/imagenes/technologies/langgraph.svg' },
  { name: 'DLA Paddle Paddle', role: 'Deep learning and document AI', logo: '/imagenes/technologies/paddlepaddle.svg' },
  { name: 'Qwen-VL', role: 'OCR and document understanding', logo: '/imagenes/technologies/qwen.svg' },
  { name: 'Postgres', role: 'Operational data and audit records', logo: '/imagenes/technologies/postgresql.svg' },
  { name: 'S3', role: 'S3-compatible document and artifact storage', logo: '/imagenes/technologies/amazon-s3.svg' },
  { name: 'K8s', role: 'Container orchestration and deployment', logo: '/imagenes/technologies/kubernetes.svg' },
  { name: 'Log', role: 'workflow traceability and operational insight', logo: '/imagenes/technologies/opentelemetry.svg' },
];

const expectedSecondaryTechnologies = [
  { name: 'Next', role: 'Operations and review interface', category: 'framework', logo: '/imagenes/technologies/nextjs.svg', invertInDarkMode: true },
  { name: 'FastAPI', role: 'High-performance service APIs', category: 'framework', logo: '/imagenes/technologies/fastapi.svg' },
  { name: 'LiteLLM', role: 'Unified AI model gateway', category: 'ai', logo: '/imagenes/technologies/litellm.svg' },
  { name: 'Bedrock', role: 'Managed foundation model platform', category: 'ai', logo: '/imagenes/technologies/bedrock.svg' },
  { name: 'vLLM', role: 'High-throughput LLM inference', category: 'ai', logo: '/imagenes/technologies/vllm.svg' },
  { name: 'Docker', role: 'Container packaging and runtime', category: 'infrastructure', logo: '/imagenes/technologies/docker.svg' },
  { name: 'AWS', role: 'Cloud infrastructure and managed services', category: 'infrastructure', logo: '/imagenes/technologies/amazon-web-services-light.svg' },
  { name: 'RDS', role: 'Managed relational database service', category: 'data', logo: '/imagenes/technologies/RDS.svg' },
  { name: 'KEDA', role: 'Event-driven workload autoscaling', category: 'infrastructure', logo: '/imagenes/technologies/keda.svg' },
  { name: 'Smith', role: 'LLM tracing and evaluation', category: 'ai', logo: '/imagenes/technologies/langsmith.svg' },
  { name: 'Sentry', role: 'Application error monitoring and diagnostics', category: 'infrastructure', logo: '/imagenes/technologies/sentry.svg' },
  { name: 'Grafana', role: 'Metrics dashboards and observability', category: 'infrastructure', logo: '/imagenes/technologies/grafana.svg' },
];

const expectedTechnologyNames = ['DLA Paddle Paddle', 'Go', 'K8s', 'LangGraph', 'Log', 'Postgres', 'Python', 'Qwen-VL', 'S3', 'TS', 'Templ', 'Trigger'];
const expectedSecondaryTechnologyNames = ['AWS', 'Bedrock', 'Docker', 'FastAPI', 'Grafana', 'KEDA', 'LiteLLM', 'Next', 'RDS', 'Sentry', 'Smith', 'vLLM'];

const expectedWorkflowArtwork = [
  { title: 'Ingest', src: '/imagenes/art/strangers.svg' },
  { title: 'Understand', src: '/imagenes/art/figure-profile.svg' },
  { title: 'Validate', src: '/imagenes/art/prakash-thombre.svg' },
  { title: 'Review', src: '/imagenes/art/retrato.svg' },
  { title: 'Deliver', src: '/imagenes/art/figure-motion.svg' },
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

  it('keeps separate Problem title and subtitle content', async () => {
    const source = await readFile(documentIntelligenceUrl, 'utf8');
    const result = projectSchema.safeParse(parse(frontmatter(source)));

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error('Document Intelligence frontmatter must satisfy projectSchema.');
    }

    expect(result.data.context).toEqual({
      title: 'Financial teams require explainable, validated, and safe data for operations.',
      subtitle: 'Not raw documents text extraction that cannot be traced, checked, or trusted downstream.',
    });
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
    expect(result.data.technologies?.map(({ name }) => name).sort()).toEqual(expectedTechnologyNames);
    result.data.technologies?.forEach(({ logo }) => {
      expect(logo?.startsWith('/imagenes/technologies/')).toBe(true);
    });
  });

  it('keeps the supporting technology narrative, fields, and complete name set', async () => {
    const source = await readFile(documentIntelligenceUrl, 'utf8');
    const result = projectSchema.safeParse(parse(frontmatter(source)));

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error('Document Intelligence frontmatter must satisfy projectSchema.');
    }

    expect(result.data.secondaryTechnologies).toHaveLength(12);
    expect(result.data.secondaryTechnologies).toEqual(expectedSecondaryTechnologies);
    expect(result.data.secondaryTechnologies?.map(({ name }) => name).sort()).toEqual(expectedSecondaryTechnologyNames);
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
