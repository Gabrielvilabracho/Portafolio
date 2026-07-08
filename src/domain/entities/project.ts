export interface ProjectLink {
  label: string;
  url: string;
  type: 'github' | 'demo' | 'article' | 'other';
}

export interface Project {
  id: string;
  title: string;
  type: 'case' | 'project';
  description: string;
  image?: string;
  technologies: string[];
  discipline?: string;
  focus?: string;
  mark?: string;
  order?: number;
  comingSoon: boolean;
  links?: ProjectLink[];
  year: number;
  slug: string;
}
