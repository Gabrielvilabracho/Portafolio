import type { Project } from '../entities/project';

export interface IProjectRepository {
  getAll(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
}