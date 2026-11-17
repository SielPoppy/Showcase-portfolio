import type { PortfolioContent } from './portfolio';

export class ContentError extends Error {}

function record(value: unknown, keys: string[], label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some((key) => !keys.includes(key))) {
    throw new ContentError(`${label} has unsupported fields or is not an object.`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string, required = true): asserts value is string {
  if (typeof value !== 'string' || value.length > 12000 || (required && !value.trim())) throw new ContentError(`${label} must contain text (maximum 12,000 characters).`);
}

function list(value: unknown, label: string, maximum = 100): unknown[] {
  if (!Array.isArray(value) || value.length > maximum) throw new ContentError(`${label} must be a list with at most ${maximum} entries.`);
  return value;
}

function link(value: unknown, label: string, local = false, required = false) {
  text(value, label, required);
  if (!value && !required) return;
  if (local && /^\/(?!\/)[\w/.,% -]+$/.test(value) && !value.split('/').some((part) => part === '..')) return;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password) return;
  } catch { /* Report an actionable validation message below. */ }
  throw new ContentError(`${label} must be an HTTPS URL${local ? ' or a local /path' : ''}.`);
}

export function validatePortfolio(value: unknown): asserts value is PortfolioContent {
  const root = record(value, ['personalInfo', 'featuredProjectIds', 'projects'], 'Portfolio');
  const personal = record(root.personalInfo, ['name', 'title', 'subtitle', 'email', 'phone', 'status', 'linkedin', 'resumeUrl', 'heroSummary', 'contactMessage'], 'Profile');
  for (const key of ['name', 'title', 'subtitle', 'email', 'phone', 'status', 'heroSummary', 'contactMessage']) text(personal[key], `Profile ${key}`);
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(personal.email as string)) throw new ContentError('Enter a valid primary email.');
  link(personal.linkedin, 'LinkedIn', false, true);
  link(personal.resumeUrl, 'CV link', true, true);
  const ids = new Set<string>();
  for (const entry of list(root.projects, 'Projects')) {
    const project = record(entry, ['id', 'company', 'title', 'role', 'duration', 'description', 'type', 'skills', 'images', 'projectImages', 'projectVideo', 'videoId', 'url', 'caseStudy'], 'Project');
    for (const key of ['id', 'company', 'title', 'role', 'duration', 'description', 'type']) text(project[key], `Project ${key}`);
    const id = project.id as string;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) throw new ContentError('Project IDs must be unique lowercase words separated by hyphens.');
    ids.add(id);
    const skillNames = new Set<string>();
    for (const entry of list(project.skills, 'Project skills', 60)) {
      const skill = record(entry, ['name', 'usage'], 'Skill');
      text(skill.name, 'Skill name'); text(skill.usage, 'Skill contribution', false);
      if (skillNames.has(skill.name.toLowerCase())) throw new ContentError('Remove duplicate skills within a project.');
      skillNames.add(skill.name.toLowerCase());
    }
    for (const key of ['images', 'projectImages', 'projectVideo']) {
      if (project[key] === undefined) continue;
      for (const entry of list(project[key], key, 50)) {
        const media = record(entry, ['src', 'description'], 'Media');
        link(media.src, 'Media URL', key !== 'projectVideo', true);
        if (media.description !== undefined) text(media.description, 'Media caption', false);
      }
    }
    if (project.url !== undefined) link(project.url, 'Project website');
    if (project.videoId !== undefined && (typeof project.videoId !== 'string' || !/^[\w-]{11}$/.test(project.videoId))) throw new ContentError('YouTube IDs must contain 11 letters, numbers, underscores, or hyphens.');
    if (project.caseStudy !== undefined) {
      const study = record(project.caseStudy, ['problem', 'contributions', 'approach', 'result'], 'Case study');
      for (const key of ['problem', 'approach', 'result']) text(study[key], `Case study ${key}`, false);
      for (const item of list(study.contributions, 'Contributions', 30)) text(item, 'Contribution', false);
    }
  }
  const featured = list(root.featuredProjectIds, 'Featured projects');
  if (featured.some((id) => typeof id !== 'string' || !ids.has(id)) || new Set(featured).size !== featured.length) throw new ContentError('Featured projects must reference existing projects once each.');
}
