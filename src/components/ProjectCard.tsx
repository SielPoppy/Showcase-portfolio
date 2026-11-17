import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, X } from 'lucide-react';
import type { Project } from '../data/portfolio';
import { isTechnicalSkill } from './utils/skillCategories';

export type ProjectCardProps = {
  project: Project;
  onOpenVideo: (video: { url: string; title?: string; description?: React.ReactNode }) => void;
  onOpenImages: (images: NonNullable<Project['images']>) => void;
};

export default function ProjectCard({ project, onOpenImages, onOpenVideo }: ProjectCardProps) {
  const images = [...(project.projectImages ?? []), ...(project.images ?? [])]
    .filter((image, index, all) => !image.src.includes('/images/companies/') && all.findIndex((item) => item.src === image.src) === index);
  const logo = project.images?.find((image) => image.src.includes('/images/companies/'));
  const video = project.projectVideo?.[0];
  const technologies = project.skills.filter((skill) => isTechnicalSkill(skill.name));

  return (
    <Dialog.Root>
      <article className="work-card" id={project.id}>
        <Dialog.Trigger asChild>
          <button className="work-card-preview" aria-label={`View project: ${project.title}`}>
            {images[0] ? <img src={images[0].src} alt="" loading="lazy" width="640" height="360" /> : <span>{project.company}</span>}
            <span className="work-preview-label">View project <ArrowUpRight size={18} aria-hidden="true" /></span>
          </button>
        </Dialog.Trigger>
        <div className="work-card-body">
          <div className="work-meta">{logo && <img src={logo.src} alt="" width="48" height="32" />}<span>{project.company} · {project.duration}</span></div>
          <h3><Dialog.Trigger className="work-title-button">{project.title}</Dialog.Trigger></h3>
          <p className="work-role">{project.role}</p>
          <p>{project.description}</p>
          <ul className="technology-list" aria-label="Technologies">
            {technologies.map((skill) => <li key={skill.name}>{skill.name}</li>)}
          </ul>
          <div className="work-actions">
            <Dialog.Trigger className="work-action primary">View project</Dialog.Trigger>
            {images.length > 0 && <button className="work-action" onClick={() => onOpenImages(images)}>Screenshots</button>}
            {(video || project.videoId) && <button className="work-action" onClick={() => onOpenVideo({ url: video?.src ?? `https://www.youtube.com/embed/${project.videoId}`, title: project.title, description: video?.description ?? project.description })}>Watch demo</button>}
            {project.url && <a className="work-action" href={project.url} target="_blank" rel="noopener noreferrer">Live site <ArrowUpRight size={16} aria-hidden="true" /></a>}
          </div>
        </div>
      </article>
      <Dialog.Portal>
        <Dialog.Overlay className="project-dialog-overlay" />
        <Dialog.Content className="project-dialog">
          <Dialog.Close className="project-dialog-close" aria-label="Close project"><X size={22} /></Dialog.Close>
          <p className="work-meta">{project.company} · {project.role} · {project.duration}</p>
          <Dialog.Title>{project.title}</Dialog.Title>
          <Dialog.Description>{project.description}</Dialog.Description>
          {project.caseStudy && <div className="case-study">
            {project.caseStudy.problem.trim() && <><h3>The problem</h3><p>{project.caseStudy.problem}</p></>}
            {project.caseStudy.contributions.some((item) => item.trim()) && <><h3>My contribution</h3><ul>{project.caseStudy.contributions.filter((item) => item.trim()).map((item, index) => <li key={index}>{item}</li>)}</ul></>}
            {project.caseStudy.approach.trim() && <><h3>How it works</h3><p>{project.caseStudy.approach}</p></>}
            {project.caseStudy.result.trim() && <><h3>Result</h3><p>{project.caseStudy.result}</p></>}
          </div>}
          <h3>Tools and contributions</h3>
          <dl className="project-skill-list">{project.skills.map((skill) => <div key={skill.name}><dt>{skill.name}</dt><dd>{skill.usage}</dd></div>)}</dl>
          {project.url && <a className="work-action primary" href={project.url} target="_blank" rel="noopener noreferrer">Visit live site <ArrowUpRight size={16} aria-hidden="true" /></a>}
          {images.length > 0 && <section aria-label="Project screenshots" className="project-evidence">
            <h3>Project evidence</h3>
            {images.map((image) => <figure key={image.src}><img src={image.src} alt={typeof image.description === 'string' ? image.description : project.title} loading="lazy" />{image.description && <figcaption>{image.description}</figcaption>}</figure>)}
          </section>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
