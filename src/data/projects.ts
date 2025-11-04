export interface Project {
  company: string;
  title: string;
  role: string;
  duration: string;
  description: string;
  skills: Skill[];
  // unique identifier used to reference projects (for featuring, linking, etc.)
  id: string;
  // note: each skill includes a read-only `usage` placeholder describing how it was used
  type: string;
  images?: { src: string; description?: any }[];
  videoId?: string;
  // Optional list of videos similar to images, each with its own description
  projectVideo?: { src: string; description?: any }[];
  projectImages?: { src: string; description?: any }[];
}

export interface Skill {
  name: string;
  // placeholder/read-only description of how the skill was used in that project
  usage: string;
}

export const projects: Project[] = [
  {
    id: 'capgemini-deskmate',
    company: 'Capgemini',
    title: 'Deskmate',
    role: 'Partner Project',
    duration: 'Apr 2023 - Jun 2023',
    description: "Worked on a project about reserving workspaces for offices with limited amount of desks. For this project I worked on creating the backend logic and the database that manages the desks.",
    skills: [
      { name: 'C#', usage: 'Implemented backend business logic and APIs.' },
      { name: '.NET', usage: 'Built services and web endpoints using .NET.' },
      { name: 'MySQL', usage: 'Designed and queried the relational DB schema.' },
      { name: 'Git', usage: 'Version control and collaboration.' },
    ],
    type: 'project',
    images: [{ src: '/images/companies/capgemini-logo.webp', description: 'Capgemini company logo' }],
    projectImages: [{ src: '/images/projects/showcase/deskmate.webp', description: 'Deskmate application screenshot showing desk reservation interface.' }],
  },
  {
    id: 'q3-cloudaiscanner',
    company: 'Q3',
    title: 'CloudAIScanner',
    role: 'Partner Project',
    duration: 'Sep 2023 - Jan 2024',
    description: "Developed a tool for companies to make their company complicit with EU AI act regulations by having them automatically import their used AI tools using API keys. For this I researched how to get data from the APIs and created the backend logic to process and store this data.",
    skills: [
      { name: 'Google APIs', usage: 'Got as much relevant data as possible from the API about AI tools used by an account.' },
      { name: 'OpenAI APIs', usage: 'Got as much relevant data as possible from the API about AI tools used by an account.' },
      { name: 'DevOps', usage: 'CI/CD pipelines and deployment automation.' },
      { name: 'C#', usage: 'Core application logic.' },
      { name: '.NET', usage: 'Framework for services.' },
      { name: 'Automated Testing', usage: 'Unit and integration tests. They ran using GitHub Actions.' },
      { name: 'Git', usage: 'Source control.' },
      { name: 'Agile', usage: 'Sprint planning, retrospectives, and daily stand-ups.' },
      { name: 'REST APIs', usage: 'Designed and implemented HTTP APIs.' },
      { name: 'Problem Solving', usage: 'Troubleshot integration issues.' },
      { name: 'Research', usage: 'Investigated API capabilities and limitations.' },
      { name: 'Team Coordination', usage: 'Coordinated work between team members and our stakeholders.' },
    ],
    type: 'project',
    images: [{ src: '/images/companies/q3-logo.webp', description: 'Q3 company logo' }],
    projectImages: [
      { src: '/images/projects/showcase/cloudaiscanner.webp', description: 'Here you can see details about a specific tool that you used.' },
      { src: '/images/projects/showcase/cais.webp', description: 'CloudAIScanner overview where you see all the AI tools used by the currently logged in user.' }],
  },
  {
    id: 'fontys-smart-classroom',
    company: 'Fontys',
    title: 'Smart Classroom',
    role: 'Partner Project',
    duration: 'Feb 2024 - June 2024',
    description: "Developed a 'Smart Classroom' where people can track assets moving around classrooms and track the air quality. I worked on receiving the data from the gateway devices, storing it and displaying it in a web application.",
    skills: [
      { name: 'IoT', usage: 'We used Bluetooth Low Energy (BLE) for device communication.' },
      { name: '.NET', usage: 'Backend services for data ingestion.' },
      { name: 'C#', usage: 'Server-side logic.' },
      { name: 'MongoDB', usage: 'All the sensor data was stored in MongoDB.' },
      { name: 'Next.js', usage: 'Frontend UI and dashboards.' },
      { name: 'TypeScript', usage: 'We used TypeScript for type-safe code.' },
      { name: 'Git', usage: 'Version control done using GitLab.' },
      { name: 'Agile', usage: 'Team process.' },
      { name: 'REST APIs', usage: 'APIs for device communication.' },
      { name: 'Problem Solving', usage: 'Hardware & software troubleshooting. This was necessary for integrating various components since there was not a lot of documentation.' },
      { name: 'Team Coordination', usage: 'Collaborated with hardware and software teams from different semesters to combine our knowledge and experience.' },
    ],
    type: 'project',
    images: [{ src: '/images/companies/fontys-logo.webp', description: 'Fontys company logo' }],
    projectVideo: [
      {
        src: 'https://youtu.be/5hxuvkYApc8',
        description: 'Feature walkthrough: asset tracking in real time; air-quality sensing with a Thingy:52; live movement of sensors on the map; an inventory-style device list; editing device names; sorting the list; choosing which columns to show; adding a new device; reading the legend; and filtering by device type.',
      },
    ],
    projectImages: [{ src: '/images/projects/showcase/smart-classroom.webp', description: 'Smart Classroom screenshot from the demo video showing the dashboard with all the sensors, beacons and tags.' }],
  },
  {
    id: 'yookr-internship',
    company: 'Yookr',
    title: 'Yookr Monitoring Tool',
    role: 'Software Development Intern',
    duration: 'Sept 2024 - Feb 2025',
    description: 'Developed monitoring application that keeps track of logs for services to track warnings, errors and application health. This was meant as a working prototype that could be improved on later on when the architecture was fully developed and tested. This was fully developped by me.',
    skills: [
      { name: 'React', usage: 'Built interactive monitoring dashboard.' },
      { name: 'Node.js', usage: 'Backend APIs.' },
      { name: 'JavaScript', usage: 'Frontend functionality.' },
      { name: 'MySQL', usage: 'Relational storage for config & metrics.' },
      { name: 'Next.js', usage: 'Server-side rendering for web UI.' },
      { name: 'Git', usage: 'Source control.' },
      { name: 'Agile', usage: 'Sprint-driven development.' },
      { name: 'REST APIs', usage: 'Service endpoints.' },
      { name: 'Problem Solving', usage: 'Debugging production issues.' },
      { name: 'Team Coordination', usage: 'Cross-team communication.' },
      { name: 'Rust', usage: 'High-performance service components.' },
      { name: 'Actix-web', usage: 'Rust web framework for microservices.' },
      { name: 'Docker', usage: 'Containerized services. The logs were also gotten from there.' },
      { name: 'Figma', usage: 'Design & prototyping.' },
    ],
    type: 'internship',
    images: [{ src: '/images/companies/yookr-logo.webp', description: 'Yookr company logo' }],
    projectImages: [
      { src: '/images/projects/showcase/monitoringtool.webp', description: 'This image shows the health and current status of the monitored services. This was colour coded based on warning and error logs, with black being fully down.' },
      { src: '/images/projects/showcase/monitoringtool-performance.webp', description: 'Here you can see the page that tracked performance metrics for each environment and service.' },
    ],
  },
  {
    id: 'bdo-database-validator',
    company: 'BDO',
    title: 'Database Schema Validator',
    role: 'Partner Project',
    duration: 'Feb 2025 - June 2025',
    description: 'Developed a tool that can compare database schemes daily and post a changelog to a teams channel to notify the software team of changes from the data team. I was the main architect of the getting the right data from the databases using queries build into MySQL and MSSQL that can get schema information per row.',
    skills: [
      { name: 'Node.js', usage: 'Automation scripts and services.' },
      { name: 'TypeScript', usage: 'Typed development for reliability.' },
      { name: 'SQL', usage: 'MSSQL and MySQL queries to get schema information neatly sorted into rows.' },
      { name: 'Azure', usage: 'Cloud resources and functions.' },
      { name: 'DevOps', usage: 'CI/CD and automation.' },
      { name: 'Git', usage: 'Version control.' },
      { name: 'Agile', usage: 'Team ceremonies.' },
      { name: 'REST APIs', usage: 'Service endpoints.' },
      { name: 'Problem Solving', usage: 'Investigations and diagnostics.' },
      { name: 'Team Coordination', usage: 'Stakeholder communication.' },
    ],
    type: 'project',
    images: [{ src: '/images/companies/bdo-logo.webp', description: 'BDO company logo' }],
    projectImages: [
      { src: '/images/projects/showcase/bdo-database-validator.webp', description: 'Image showing the general design and idea of the database validator.' },
      { src: '/images/projects/presentation.webp', description: 'Me presenting at the BDO office after successfully completing the project.' },
      { src: '/images/projects/jordy-linkedin-reaction.webp', description: 'Reaction from our stakeholder after the project' },
    ],
  },
  {
    id: 'yookr-backend',
    company: 'Yookr',
    title: 'Various Backend Services',
    role: 'Software Developer',
    duration: 'March 2025 - now',
    description: "I was hired quickly after completing my internship here and am mainly a backend developer working on multiple projects that contain IoT and APIs. This includes working on services that receive data from sensors and storing it in databases and creating various APIs",
    skills: [
      { name: 'MySQL', usage: 'Operational storage for services.' },
      { name: 'Next.js', usage: 'I mainly use Next.js here for building our frontend applications.' },
      { name: 'Git', usage: 'Version control.' },
      { name: 'REST APIs', usage: 'Service interfaces.' },
      { name: 'Problem Solving', usage: 'Making sure that the wishes of customers and stakeholders are met.' },
      { name: 'Team Coordination', usage: 'We are a small team with a lot of part-time members so we need good coordination and communication to ensure everyone is on the same page.' },
      { name: 'Rust', usage: 'Performance-critical backend components.' },
      { name: 'Actix-web', usage: 'Rust web framework that I use for most backend projects.' },
      { name: 'Docker', usage: 'Containers for deployment.' },
      { name: 'Kubernetes', usage: 'I use Kubernetes to manage containerized applications in a microservices architecture.' },
      { name: 'IoT', usage: 'We have various IoT devices that I have to make work together seamlessly.' },
      { name: 'LoRaWAN', usage: 'Long-range device communication that some of our IoT devices use. I have experience on managing LoRaWAN networks and devices.' },
    ],
    type: 'job',
    images: [{ src: '/images/companies/yookr-logo.webp', description: 'Yookr company logo' }],
    projectImages: [{ src: '/images/projects/yookrpresentation.webp', description: 'Presentation at an event where we showcase what Yookr employees have been working on to the public.' }],
  },
];

// Configure which projects are featured on the main page. Update these IDs to change featured projects.
export const featuredProjectIds: string[] = [
  'bdo-database-validator',
  'yookr-backend',
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

