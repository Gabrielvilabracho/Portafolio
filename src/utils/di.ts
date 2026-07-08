import { AstroContentProjectRepository } from '../infrastructure/repositories/AstroContentProjectRepository';
import { GetProjectsUseCase } from '../application/use-cases/GetProjectsUseCase';
import { GetProjectBySlugUseCase } from '../application/use-cases/GetProjectBySlugUseCase';

const repository = new AstroContentProjectRepository();

export const getProjectsUseCase = new GetProjectsUseCase(repository);
export const getProjectBySlugUseCase = new GetProjectBySlugUseCase(repository);
