
export interface SkillCategory {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const skillCategories = {
  "Programming Languages": {
    name: "Programming Languages",
    color: "text-blue-800",
    bgColor: "bg-blue-100 hover:bg-blue-200",
    borderColor: "border-blue-300"
  },
  "Frontend Technologies": {
    name: "Frontend Technologies", 
    color: "text-green-800",
    bgColor: "bg-green-100 hover:bg-green-200",
    borderColor: "border-green-300"
  },
  "Backend Technologies": {
    name: "Backend Technologies",
    color: "text-red-800", 
    bgColor: "bg-red-100 hover:bg-red-200",
    borderColor: "border-red-300"
  },
  "Databases & Storage": {
    name: "Databases & Storage",
    color: "text-orange-800",
    bgColor: "bg-orange-100 hover:bg-orange-200",
    borderColor: "border-orange-300"
  },
  "Cloud & DevOps": {
    name: "Cloud & DevOps",
    color: "text-indigo-800",
    bgColor: "bg-indigo-100 hover:bg-indigo-200",
    borderColor: "border-indigo-300"
  },
  "Design & UX Tools": {
    name: "Design & UX Tools",
    color: "text-pink-800",
    bgColor: "bg-pink-100 hover:bg-pink-200",
    borderColor: "border-pink-300"
  },
  "Development Tools": {
    name: "Development Tools",
    color: "text-gray-800",
    bgColor: "bg-gray-100 hover:bg-gray-200",
    borderColor: "border-gray-300"
  },
  "IoT & Embedded": {
    name: "IoT & Embedded",
    color: "text-amber-900",
    
    bgColor: "bg-amber-300 hover:bg-amber-400 shadow-sm",
    borderColor: "border-amber-400"
  },
  "Soft Skills": {
    name: "Soft Skills",
    color: "text-purple-800",
    bgColor: "bg-purple-100 hover:bg-purple-200",
    borderColor: "border-purple-300"
  },
  "Personal Skills": {
    name: "Personal Skills",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100 hover:bg-yellow-200",
    borderColor: "border-yellow-300"
  }
} as const;

// Skill mapping to categories
export const skillMapping: Record<string, keyof typeof skillCategories> = {
  // Programming Languages
  "TypeScript": "Programming Languages",
  "JavaScript": "Programming Languages", 
  "Python": "Programming Languages",
  "Java": "Programming Languages",
  "C++": "Programming Languages",
  "C#": "Programming Languages",
  "Rust": "Programming Languages",
  
  // Frontend Technologies
  "React": "Frontend Technologies",
  "Next.js": "Frontend Technologies",
  "HTML5": "Frontend Technologies",
  "CSS3": "Frontend Technologies",
  "Tailwind CSS": "Frontend Technologies",
  
  
  "Node.js": "Backend Technologies",
  "Express.js": "Backend Technologies",
  ".NET": "Backend Technologies",
  ".Net": "Backend Technologies",
  "Actix-web": "Backend Technologies",
  "REST APIs": "Backend Technologies",
  
  
  "MongoDB": "Databases & Storage",
  "SQL": "Databases & Storage",
  "MySQL": "Databases & Storage",
  "SQL Server": "Databases & Storage",
  "DynamoDB": "Databases & Storage",
  "S3": "Databases & Storage",
  "Firebase": "Databases & Storage",
  
  
  "AWS": "Cloud & DevOps",
  "Azure": "Cloud & DevOps",
  "Lambda": "Cloud & DevOps",
  "CloudFormation": "Cloud & DevOps",
  "DevOps": "Cloud & DevOps",
  "Serverless": "Cloud & DevOps",
  "API Gateway": "Cloud & DevOps",
  "CloudWatch": "Cloud & DevOps",
  "Docker": "Cloud & DevOps",
  "Kubernetes": "Cloud & DevOps",
  "Webhooks": "Cloud & DevOps",
  
  
  "Figma": "Design & UX Tools",
  "UI/UX Design": "Design & UX Tools",
  "Wireframing": "Design & UX Tools",
  "Prototyping": "Design & UX Tools",
  "User Research": "Design & UX Tools",
  
  
  "Git": "Development Tools",
  "GitHub": "Development Tools",
  "Jest": "Development Tools",
  "Jira": "Development Tools",
  "Slack": "Development Tools",
  "Automated Testing": "Development Tools",
  "OpenAI APIs": "Development Tools",
  "Google APIs": "Development Tools",
  
  
  "Agile": "Soft Skills",
  "Scrum": "Soft Skills",
  "Project Management": "Soft Skills",
  "Team Leadership": "Soft Skills",
  "Team Coordination": "Soft Skills",
  "Testing": "Soft Skills",
  
  
  "Problem Solving": "Personal Skills",
  "Goal Setting": "Personal Skills", 
  "Discipline": "Personal Skills",
  "Strategic Planning": "Personal Skills",
  "Quick Decision Making": "Personal Skills",
  "Persistence": "Personal Skills",
  "Global Perspective": "Personal Skills",
  "Cultural Awareness": "Personal Skills",
  "Research Skills": "Personal Skills",
  "IoT Integration": "Personal Skills",
  "System Design": "Personal Skills",
  "Automation": "Personal Skills",
  "Time Management": "Personal Skills",
  "Technical Writing": "Personal Skills",
  
  "IoT": "IoT & Embedded",
  "LoRaWAN": "IoT & Embedded"
 };


export function getSkillCategory(skill: string): SkillCategory {
  const categoryKey = skillMapping[skill];
  if (categoryKey && skillCategories[categoryKey]) {
    return skillCategories[categoryKey];
  }
  
  
  return {
    name: "Other",
    color: "text-slate-700",
    bgColor: "bg-slate-50 hover:bg-slate-100", 
    borderColor: "border-slate-200"
  };
}


export function getSkillsByCategory(categoryKey: keyof typeof skillCategories): string[] {
  return Object.entries(skillMapping)
    .filter(([_, category]) => category === categoryKey)
    .map(([skill, _]) => skill);
}