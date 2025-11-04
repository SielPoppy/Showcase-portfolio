import React from 'react';
import ProjectCard from './ProjectCard';
import { projects, featuredProjectIds } from '../data/projects';
import type { Project } from '../data/projects';
import MoreProjects from './MoreProjects';

type Props = {
  onOpenVideo: (video: { url: string; title?: string; description?: React.ReactNode }) => void;
  onOpenImages: (images: any[]) => void;
};

export default function FeaturedProjects({ onOpenVideo, onOpenImages }: Props) {
  const featured: Project[] = featuredProjectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => !!p);
  // Non-featured list is now handled within MoreProjects component to keep this lean

  return (
    <section id="featured-projects" className="featured-section">
      <div className="featured-overlay" aria-hidden />

      <div className="featured-container">
        <div aria-hidden className="featured-spacer-top" />

        <div className="text-center space-y-4">
          <h2 className="featured-title">Projects &amp; Experiences</h2>


          <h3 className="featured-subtitle">Highlighted projects</h3>
        </div>

        {/* Featured project cards */}
        <div className="mt-8">
          <div className="featured-grid">
            {featured.map((p) => (
              <div key={p.id} className="project-card-wrap">
                <ProjectCard project={p} onOpenVideo={onOpenVideo} onOpenImages={onOpenImages} />
              </div>
            ))}
          </div>
        </div>

        {/* Non-featured projects as image tiles with hover overlay (extracted component) */}
        <MoreProjects onOpenImages={onOpenImages} onOpenVideo={onOpenVideo} />
        <div className="featured-spacer-bottom" />
      </div>
    </section>
  );
}
