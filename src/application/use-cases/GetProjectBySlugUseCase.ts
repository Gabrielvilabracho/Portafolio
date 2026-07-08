import type { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import type { Project } from '../../domain/entities/project';

export class GetProjectBySlugUseCase {
  constructor(private repository: IProjectRepository) {}

  async execute(slug: string): Promise<Project | null> {
    return this.repository.getBySlug(slug);
  }
}