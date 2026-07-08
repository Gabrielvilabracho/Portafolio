import { getCollection, type CollectionEntry } from 'astro:content';
import type { IProjectRepository } from '../../domain/repositories/IProjectRepository';
import type { Project } from '../../domain/entities/project';

export class AstroContentProjectRepository implements IProjectRepository {
  async getAll(): Promise<Project[]> {
    const entries = await getCollection('projects');
    return entries
      .map(toProject)
      .sort((a, b) => b.year - a.year || a.slug.localeCompare(b.slug));
  }

  async getBySlug(slug: string): Promise<Project | null> {
    const all = await this.getAll();
    return all.find((p) => p.slug === slug) ?? null;
  }
}

function toProject(entry: CollectionEntry<'projects'>): Project {
  const data = entry.data;
  return {
    id: entry.id,
    title: data.title,
    type: data.type,
    description: data.description,
    image: data.image,
    technologies: data.technologies?.map((tech) => tech.name) ?? [],
    discipline: data.discipline,
    focus: data.focus,
    mark: data.mark,
    order: data.order,
    comingSoon: data.comingSoon,
    links: data.links,
    year: data.year,
    slug: entry.id,
  };
}
