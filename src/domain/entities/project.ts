export const TECHNOLOGY_PRESENTATION = {
  EDITORIAL_TWELVE: 'editorial-twelve',
} as const;

export type TechnologyPresentation = (typeof TECHNOLOGY_PRESENTATION)[keyof typeof TECHNOLOGY_PRESENTATION];

export interface ProjectLink {
  label: string;
  url: string;
  type: 'github' | 'demo' | 'article' | 'other';
}

export interface ProjectTechnology {
  name: string;
  role?: string;
  category: 'language' | 'framework' | 'infrastructure' | 'ai' | 'data' | 'other';
  logo?: string;
  logoLabel?: string;
  invertInDarkMode?: boolean;
}

export interface ProjectWorkflowStep {
  title: string;
  description: string;
  artwork?: ProjectWorkflowArtwork;
}

export interface ProjectWorkflowArtwork {
  src: string;
  className: string;
}

export interface ProjectWorkflow {
  title: string;
  subtitle?: string;
  navigationPhrase?: string;
  steps: ProjectWorkflowStep[];
}

export interface ProjectFeatureRow {
  tag: string;
  title: string;
  description: string;
}

export interface ProjectFeatureRows {
  heading: string;
  navigationLabel?: string;
  navigationPhrase?: string;
  sectionId?: string;
  rows: ProjectFeatureRow[];
}

export interface Project {
  id: string;
  title: string;
  type: 'case' | 'project';
  description: string;
  image?: string;
  technologies: ProjectTechnology[];
  discipline?: string;
  focus?: string;
  mark?: string;
  order?: number;
  comingSoon: boolean;
  links?: ProjectLink[];
  overview?: string;
  context?: string;
  workflow?: ProjectWorkflow;
  featureRows?: ProjectFeatureRows;
  linksLabel?: string;
  technologyPresentation?: TechnologyPresentation;
  year: number;
  slug: string;
}
