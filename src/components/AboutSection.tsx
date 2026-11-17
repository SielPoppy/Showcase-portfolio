import type React from 'react';
import { HobbyImagesProvider, useHobbyImages } from './HobbyImagesProvider';
import { Globe, Gamepad2, Dumbbell, Home, BookOpen } from 'lucide-react';

interface Hobby {
  name: string;
  icon: React.ReactNode;
  description: string;
  skills: string[];
  color: string;
}

const hobbies: Hobby[] = [
  {
    name: 'Geography',
    icon: <Globe className="w-6 h-6" />,
    description:
      "Fascinated by world cultures, maps, and geopolitical dynamics. One of my main concerns that I try to work on is climate change and how people can lessen their carbon footprint.",
    skills: ['Data Visualization', 'Weather systems and predictions', 'Analytics', 'Research'],
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    name: 'Gaming',
    icon: <Gamepad2 className="w-6 h-6" />,
    description: 'I play all kinds of games, from competitive shooters to expansive RPGs.',
    skills: ['Strategic Thinking', 'Team Coordination', 'Performance Optimization', 'User Experience'],
    color: 'bg-green-100 text-green-800 border-green-300'
  },
  {
    name: 'Fitness',
    icon: <Dumbbell className="w-6 h-6" />,
    description:
      "Originally meant as a way to lose weight, fitness has become a core part of my life that teaches me discipline and perseverance.",
    skills: ['Discipline', 'Goal Setting', 'Time Management', 'Persistence'],
    color: 'bg-red-100 text-red-800 border-red-300'
  },
  {
    name: 'Smart Home',
    icon: <Home className="w-6 h-6" />,
    description:
      "Originally meant as gift to help my mom, I have slowly been building up my home to be a smart home for various conveniences that make the lives of my mom and myself easier. My plan for later on is to create my own devices to make even more things automated and easier to use.",
    skills: ['IoT Integration', 'Automation', 'Network Setup', 'Hardware Integration'],
    color: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  {
    name: 'Education',
    icon: <BookOpen className="w-6 h-6" />,
    description:
      "I have a passion for education and everything around it, I have done multiple internships teaching Geography in the past but while that study didn't fit me I do like the field as a whole and enjoy teaching people things.",
    skills: ['Teaching', 'Curriculum design', 'Continuous learning', 'Mentorship'],
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  }
];

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function AboutSectionContent() {
  const images = useHobbyImages();
  return <section id="about" className="about-section">
    <div className="about-overlay" aria-hidden="true" />
    <div className="about-container interests-container">
      <div className="about-header">
        <h2 className="about-title">About Me</h2>
        <p className="about-subtitle">Away from the keyboard: the interests that keep me curious.</p>
      </div>
      <div className="interests-grid">
        {hobbies.map((hobby) => <details className="interest-card" key={hobby.name}>
          <summary>{hobby.icon}<span>{hobby.name}</span><span className="interest-expand" aria-hidden="true">+</span></summary>
          <div className="interest-content">
            <p>{hobby.description}</p>
            <ul className="technology-list" aria-label="Related skills">{hobby.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
            <div className="interest-photos">{(images[slugify(hobby.name)] ?? []).slice(0, 2).map((image) => <figure key={image.url}><img src={image.url} alt={image.title} loading="lazy" /><figcaption>{image.title}</figcaption></figure>)}</div>
          </div>
        </details>)}
      </div>
    </div>
  </section>;
}

export function AboutSection() {
  return <HobbyImagesProvider><AboutSectionContent /></HobbyImagesProvider>;
}
