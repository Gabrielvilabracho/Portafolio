import type { Project } from '../../domain/entities/project';

/**
 * Returns the projects that should get a dedicated route/page.
 * Projects flagged as `comingSoon` are listed in grids but must not
 * generate a detail page, so they are excluded here.
 */
export function routableProjects(projects: Project[]): Project[] {
  return projects.filter((project) => !project.comingSoon);
}
