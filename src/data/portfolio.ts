import data from './portfolio.json';

export interface Media {
  src: string;
  description?: string;
}

export interface Skill {
  name: string;
  usage: string;
}

export interface Project {
  id: string;
  company: string;
  title: string;
  role: string;
  duration: string;
  description: string;
  type: string;
  skills: Skill[];
  images?: Media[];
  projectImages?: Media[];
  projectVideo?: Media[];
  videoId?: string;
  url?: string;
  caseStudy?: {
    problem: string;
    contributions: string[];
    approach: string;
    result: string;
  };
}

export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  status: string;
  linkedin: string;
  resumeUrl: string;
  heroSummary: string;
  contactMessage: string;
}

export interface PortfolioContent {
  personalInfo: PersonalInfo;
  featuredProjectIds: string[];
  projects: Project[];
}

export const portfolioContent: PortfolioContent = data;
