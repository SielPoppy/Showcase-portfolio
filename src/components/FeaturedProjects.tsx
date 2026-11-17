import { useState } from 'react';
import ProjectCard, { type ProjectCardProps } from './ProjectCard';
import type { PortfolioContent } from '../data/portfolio';
import { isTechnicalSkill } from './utils/skillCategories';
import MoreProjects from './MoreProjects';

export default function FeaturedProjects({ projects, featuredProjectIds, ...actions }: Omit<ProjectCardProps, 'project'> & Pick<PortfolioContent, 'projects' | 'featuredProjectIds'>) {
  const technologies = [...new Set(projects.flatMap((project) => project.skills.filter((skill) => isTechnicalSkill(skill.name)).map((skill) => skill.name)))].sort();
  const [technology, setTechnology] = useState('');
  const [query, setQuery] = useState('');
  const filtered = projects.filter((project) => (!technology || project.skills.some((skill) => skill.name === technology)) &&
    `${project.title} ${project.company} ${project.description} ${project.skills.map((skill) => skill.name).join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()));
  const featured = featuredProjectIds.flatMap((id) => filtered.filter((project) => project.id === id));
  const other = filtered.filter((project) => !featuredProjectIds.includes(project.id));

  return <section id="featured-projects" className="featured-section">
    <div className="featured-overlay" aria-hidden="true" />
    <div className="featured-container">
      <div className="text-center space-y-4">
        <h2 className="featured-title">Projects &amp; Experience</h2>
        <p>Backend engineering, practical automation, and creative full-stack applications.</p>
      </div>
      <div className="project-filters" role="search" aria-label="Filter projects">
        <label>Search projects<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Project, company, or technology" /></label>
        <label>Technology<select value={technology} onChange={(event) => setTechnology(event.target.value)}><option value="">All technologies</option>{technologies.map((name) => <option key={name}>{name}</option>)}</select></label>
        {(query || technology) && <button className="work-action" onClick={() => { setQuery(''); setTechnology(''); }}>Clear filters</button>}
      </div>
      <p role="status">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}{query || technology ? ' found' : ' to explore'}</p>
      {featured.length > 0 && <><h3 className="featured-subtitle">Highlighted projects</h3><div className="work-grid">{featured.map((project) => <ProjectCard key={project.id} project={project} {...actions} />)}</div></>}
      <MoreProjects projects={other} {...actions} />
      {filtered.length === 0 && <p>No projects match these filters. Try another technology or clear your search.</p>}
    </div>
  </section>;
}
