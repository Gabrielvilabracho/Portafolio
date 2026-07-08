import type { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import type { Project } from '../../domain/entities/project';

export class GetProjectsUseCase {
  constructor(private repository: IProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.repository.getAll();
  }
}
