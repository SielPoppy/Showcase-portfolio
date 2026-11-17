import type { Project } from '../data/portfolio';
import ProjectCard, { type ProjectCardProps } from './ProjectCard';

type Props = Omit<ProjectCardProps, 'project'> & { projects: Project[] };

export default function MoreProjects({ projects, ...actions }: Props) {
  if (projects.length === 0) return null;
  return <div className="additional-work">
    <h3 className="featured-subtitle">More projects</h3>
    <div className="work-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} {...actions} />)}</div>
  </div>;
}
