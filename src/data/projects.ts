export interface Project {
  company: string;
  role: string;
  duration: string;
  description: string;
  skills: string[];
  type: string;
  images?: { src: string; description?: any }[];
  videoId?: string;
  projectImages?: { src: string; description?: any }[];
}

export const projects: Project[] = [
  {
    company: 'Capgemini',
    role: 'Student Partner - Campus Project',
    duration: 'Apr 2023 - Jun 2023',
    description: "Worked on a project about reserving workspaces for offices with limited amount of desks.",
    skills: ['C#', '.NET', 'MySQL', 'HTML5', 'CSS3', 'Git'],
    type: 'project',
    images: [{ src: '/images/companies/capgemini-logo.png', description: 'Capgemini company logo' }],
  },
  {
    company: 'Q3',
    role: 'Student Partner - Campus Project',
    duration: 'Sep 2023 - Jan 2024',
    description: "Developed a tool for companies to make their company complicit with EU AI act regulations by having them automatically import their used AI tools using API keys.",
    skills: ['Google APIs', 'OpenAI APIs', 'DevOps', 'C#', '.NET', 'Automated Testing', 'Git', 'Agile', 'REST APIs', 'Problem Solving', 'Team Coordination'],
    type: 'project',
    images: [{ src: '/images/companies/q3-logo.jpg', description: 'Q3 company logo' }],
  },
  {
    company: 'Fontys',
    role: 'Student Project',
    duration: 'Feb 2024 - June 2024',
    description: "Developed a 'Smart Classroom' where people can track assets moving around classrooms and track the air quality.",
    skills: ['IoT', '.NET', 'C#', 'MongoDB', 'DevOps', 'Next.js', 'TypeScript', 'Git', 'Agile', 'REST APIs', 'Problem Solving', 'Team Coordination'],
    type: 'project',
    images: [{ src: '/images/companies/fontys-logo.png', description: 'Fontys company logo' }],
    videoId: '5hxuvkYApc8',
    projectImages: [{ src: '/images/projects/showcase/smart-classroom.png', description: 'Smart Classroom overview and demo screenshots.' }],
  },
  {
    company: 'Yookr',
    role: 'Software Development Intern',
    duration: 'Sept 2024 - Feb 2025',
    description: 'Developed monitoring application that keeps track of logs for services to track warnings, errors and application health.',
    skills: ['React', 'Node.js', 'JavaScript', 'MySQL', 'Next.js', 'Git', 'Agile', 'REST APIs', 'Problem Solving', 'Team Coordination', 'Rust', 'Actix-web', 'Docker', 'Figma'],
    type: 'internship',
    images: [{ src: '/images/companies/yookr-logo.jpg', description: 'Yookr company logo' }],
    projectImages: [{ src: '/images/projects/showcase/yookr-internship.png', description: 'Yookr internship project — monitoring dashboard screenshot.' }],
  },
  {
    company: 'BDO',
    role: 'Student Partner - Campus Project',
    duration: 'Feb 2025 - June 2025',
    description: 'Developed a tool that can compare database schemes daily and post a changelog to a teams channel to notify the software team of changes from the data team.',
    skills: ['Node.js', 'TypeScript', 'SQL', 'Azure', 'DevOps', 'Git', 'Agile', 'REST APIs', 'Problem Solving', 'Team Coordination'],
    type: 'project',
    images: [{ src: '/images/companies/bdo-logo.png', description: 'BDO company logo' }],
    projectImages: [
      { src: '/images/projects/showcase/bdo-database-validator.png', description: 'BDO database validator — architecture and UI screenshot.' },
      { src: '/images/presentation.jpeg', description: 'Me presenting at the BDO office after successfully completing the project.' },
      { src: '/images/projects/jordy-linkedin-reaction.png', description: 'Reaction from our stakeholder to the project' },
    ],
  },
  {
    company: 'Yookr',
    role: 'Software Developer',
    duration: 'March 2025 - now',
    description: "I am mainly a backend developer working on multiple projects to do with Internet of Things, APIs and .",
    skills: ['MySQL', 'Next.js', 'Git', 'REST APIs', 'Problem Solving', 'Team Coordination', 'Rust', 'Actix-web', 'Docker', 'Kubernetes', 'IoT', 'LoRaWAN'],
    type: 'job',
    images: [{ src: '/images/companies/yookr-logo.jpg', description: 'Yookr company logo' }],
    projectImages: [{ src: '/images/projects/yookrpresentation.jpg', description: 'Presentation at an event where we showcase what Yookr employees have been working on.' }],
  },
];

export const personalInfo = {
  name: 'Youri van Baal',
  title: 'Fullstack development Student',
  subtitle: "Passionate about building applications that can help people.",
  email: 'siel@poppythorn.nl',
  secondaryEmail: 'y.vanbaal@student.fontys.nl',
  phone: '(+31) 6 28817868',
  status: 'Available for Internship Opportunities',
};

