import React from 'react';
import {AboutSection} from './components/AboutSection';
import {SkillLegend} from './components/SkillLegend';
import {SkillBadge} from './components/SkillBadge';
import {SideNavbar} from './components/SideNavbar';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './components/ui/card';
import {Badge} from './components/ui/badge';
import {Button} from './components/ui/button';
import {ImageWithFallback} from './components/figma/ImageWithFallback';
import {getSkillCategory} from './components/utils/skillCategories';

// Icons from Lucide
import {
    Activity,
    Bike,
    Calendar,
    Code2,
    Compass,
    Database,
    Download,
    Dumbbell,
    Footprints,
    Globe,
    Heart,
    Linkedin,
    Mail,
    Map,
    MapPin,
    Mountain,
    Navigation,
    Route,
    Sun,
    Target,
    Terminal,
    Timer,
    TreePine,
    Trophy,
    Watch,
    Waves,
    Zap
} from 'lucide-react';

// Images are in public/images/companies — reference them by root-relative URLs (Vite copies public/ to dist/)
const capgeminiLogo = '/images/companies/capgemini-logo.png';
const q3Logo = '/images/companies/q3-logo.jpg';
const fontysLogo = '/images/companies/fontys-logo.png';
const yookrLogo = '/images/companies/yookr-logo.jpg';
const bdoLogo = '/images/companies/bdo-logo.png';

// Floating icons background component with geography, fitness, and tech icons
function FloatingEmojis() {
  const icons = [
    // Geography & Travel Icons
    { icon: <Map className="w-5 h-5 text-purple-600" />, delay: '0s', duration: '20s', left: '10%', top: '10%', animation: 'float' },
    { icon: <Compass className="w-4 h-4 text-pink-600" />, delay: '5s', duration: '25s', left: '20%', top: '25%', animation: 'drift' },
    { icon: <Globe className="w-5 h-5 text-purple-500" />, delay: '10s', duration: '18s', left: '80%', top: '15%', animation: 'float' },
    { icon: <Mountain className="w-5 h-5 text-black" />, delay: '15s', duration: '22s', left: '70%', top: '30%', animation: 'drift' },
    { icon: <Navigation className="w-4 h-4 text-pink-500" />, delay: '3s', duration: '19s', left: '30%', top: '40%', animation: 'float' },
    { icon: <Route className="w-5 h-5 text-purple-600" />, delay: '8s', duration: '24s', left: '60%', top: '50%', animation: 'drift' },
    { icon: <TreePine className="w-4 h-4 text-black" />, delay: '12s', duration: '21s', left: '40%', top: '60%', animation: 'float' },
    { icon: <MapPin className="w-4 h-4 text-pink-600" />, delay: '6s', duration: '23s', left: '90%', top: '70%', animation: 'drift' },
    
    // Fitness & Health Icons
    { icon: <Dumbbell className="w-5 h-5 text-purple-500" />, delay: '18s', duration: '20s', left: '5%', top: '80%', animation: 'float' },
    { icon: <Activity className="w-4 h-4 text-pink-600" />, delay: '2s', duration: '26s', left: '85%', top: '45%', animation: 'drift' },
    { icon: <Heart className="w-4 h-4 text-pink-500" />, delay: '14s', duration: '17s', left: '15%', top: '65%', animation: 'float' },
    { icon: <Target className="w-5 h-5 text-purple-600" />, delay: '7s', duration: '19s', left: '95%', top: '85%', animation: 'drift' },
    { icon: <Trophy className="w-4 h-4 text-purple-600" />, delay: '11s', duration: '23s', left: '25%', top: '75%', animation: 'float' },
    { icon: <Timer className="w-4 h-4 text-black" />, delay: '4s', duration: '21s', left: '75%', top: '55%', animation: 'drift' },
    { icon: <Bike className="w-5 h-5 text-pink-500" />, delay: '16s', duration: '18s', left: '45%', top: '35%', animation: 'float' },
    { icon: <Footprints className="w-4 h-4 text-purple-500" />, delay: '9s', duration: '24s', left: '65%', top: '20%', animation: 'drift' },
    { icon: <Watch className="w-4 h-4 text-black" />, delay: '13s', duration: '20s', left: '35%', top: '90%', animation: 'float' },
    { icon: <Zap className="w-4 h-4 text-pink-600" />, delay: '1s', duration: '25s', left: '55%', top: '5%', animation: 'drift' },
    
    // Essential Tech Icons (reduced)
    { icon: <Code2 className="w-4 h-4 text-purple-500" />, delay: '17s', duration: '22s', left: '12%', top: '50%', animation: 'float' },
    { icon: <Database className="w-4 h-4 text-black" />, delay: '19s', duration: '26s', left: '88%', top: '35%', animation: 'drift' },
    { icon: <Terminal className="w-4 h-4 text-pink-500" />, delay: '22s', duration: '20s', left: '92%', top: '10%', animation: 'float' },
    
    // Nature & Environment
    { icon: <Sun className="w-5 h-5 text-purple-600" />, delay: '25s', duration: '24s', left: '8%', top: '95%', animation: 'drift' },
    { icon: <Waves className="w-4 h-4 text-black" />, delay: '28s', duration: '18s', left: '50%', top: '85%', animation: 'float' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((item, index) => (
        <div
          key={index}
          className={`absolute animate-${item.animation} transition-opacity duration-1000`}
          style={{
            left: item.left,
            top: item.top,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [modalImages, setModalImages] = React.useState([]);
  const [modalImageIndex, setModalImageIndex] = React.useState(0);

  const projects = [
    {
      company: "Capgemini",
      role: "Student Partner - Campus Project",
      duration: "Apr 2023 - Jun 2023",
      location: "Fontys Campus",
      description: "Worked on a project about reserving workspaces for offices with limited amount of desks.",
      skills: ["C#", ".NET", "MySQL", "HTML5", "CSS3", "Git"],
      type: "project",
      images: [
        { src: capgeminiLogo, description: 'Capgemini company logo' }
      ]
    },
    {
      company: "Q3",
      role: "Student Partner - Campus Project",
      duration: "Sep 2023 - Jan 2024",
      location: "Fontys Campus",
      description: "Developed a tool for companies to make their company complicit with EU AI act regulations by having them automatically import their used AI tools using API keys.",
      skills: ["Google APIs", "OpenAI APIs", "DevOps", "C#", ".NET", "Automated Testing", "Git", "Agile", "REST APIs", "Problem Solving", "Team Coordination"],
      type: "project",
      images: [
        { src: q3Logo, description: 'Q3 company logo' }
      ]
    },
    {
      company: "Fontys",
      role: "Student Project",
      duration: "Feb 2024 - June 2024",
      location: "Fontys Campus",
      description: "Developed a 'Smart Classroom' where people can track assets moving around classrooms and track the air quality.",
      skills: ["IoT", ".NET", "C#", "MongoDB", "DevOps", "Next.js", "TypeScript", "Git", "Agile", "REST APIs", "Problem Solving", "Team Coordination"],
      type: "project",
      images: [
        { src: fontysLogo, description: 'Fontys company logo' }
      ],
      videoId: '5hxuvkYApc8'
    },
      {
          company: "Yookr",
          role: "Software Development Intern",
          duration: "Sept 2024 - Feb 2025",
          location: "Horst, NL",
          description: "Developed monitoring application that keeps track of logs for services to track warnings, errors and application health.",
          skills: ["React", "Node.js", "JavaScript", "MySQL", "Next.js", "Git", "Agile", "REST APIs", "Problem Solving", "Team Coordination", "Rust", "Actix-web", "Docker", "Figma"],
          type: "internship",
          images: [
            { src: yookrLogo, description: 'Yookr company logo' }
          ],
      },
      {
        company: "BDO",
        role: "Student Partner - Campus Project",
        duration: "Feb 2025 - June 2025",
        location: "Fontys Campus",
        description: "Developed a tool that can compare database schemes daily and post a changelog to a teams channel to notify the software team of changes from the data team.",
        skills: ["Node.js", "TypeScript", "SQL", "Azure", "DevOps", "Git", "Agile", "REST APIs", "Problem Solving", "Team Coordination"],
        type: "project",
        images: [
          { src: bdoLogo, description: 'BDO company logo' }
        ],
        projectImages: [
          { src: '/images/projects/bdopresentation.jpeg', description: 'Me presenting at the BDO office after successfully completing the project.' },
            { src: '/images/projects/jordy-linkedin-reaction.png', description: <a href="https://www.linkedin.com/feed/update/urn:li:activity:7348464092577251328?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7348464092577251328%2C7348475789023100928%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287348475789023100928%2Curn%3Ali%3Aactivity%3A7348464092577251328%29" target="_blank" rel="noopener noreferrer">Reaction from our stakeholder to the project</a> }
        ]
      },
      {
          company: "Yookr",
          role: "Software Developer",
          duration: "March 2025 - now",
          location: "Horst, NL",
          description: "I am mainly a backend developer working on multiple projects to do with Internet of Things, APIs and .",
          skills: ["MySQL", "Next.js", "Git", "REST APIs", "Problem Solving", "Team Coordination", "Rust", "Actix-web", "Docker", "Kubernetes", "IoT", "LoRaWAN"],
          type: "job",
          images: [
            { src: yookrLogo, description: 'Yookr company logo' }
          ],
          projectImages: [
            { src: '/images/projects/yookrpresentation.jpg', description: 'Presentation at an event where we showcase what Yookr employees have been working on.' }
          ]
      },
  ];

  const personalInfo = {
    name: "Youri van Baal",
    title: "Fullstack development Student",
    subtitle: "Passionate about building applications that can help people.",
    location: "Horst, The Netherlands",
    email: "siel@poppythorn.nl",
    secondaryEmail: "y.vanbaal@student.fontys.nl",
    phone: "(+31) 6 28817868",
    status: "Available for Internship Opportunities"
  };

  // Filter projects based on selected category
  const filteredProjects = selectedCategory 
    ? projects.filter(project => 
        project.skills.some(skill => 
          getSkillCategory(skill).name === selectedCategory
        )
      )
    : projects;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-purple-100 relative">
      <FloatingEmojis />
      <SideNavbar />
      
      {/* Hero Section */}
      <section id="hero" className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium border border-pink-200">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            {personalInfo.status}
          </div>
            {/* Avatar underneath the name — slightly smaller: use Tailwind width/height utilities (w-6/md:w-8) */}
            <div className="flex justify-center mt-2">
                <div
                    className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden"
                    style={{ width: '384px', height: '384px' }}
                >
                    <ImageWithFallback
                        src="/images/personal/Youri.png"
                        alt={`${personalInfo.name} photo`}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
          <div className="space-y-6">
            {/* Name */}
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-black via-purple-900 to-pink-900 bg-clip-text text-transparent">
              {personalInfo.name}
            </h1>

            

            <p className="text-xl md:text-2xl text-black font-medium">
              {personalInfo.title}
            </p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {personalInfo.subtitle}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-600" />
              <span>{personalInfo.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              <div className="flex flex-col leading-tight">
                <a href={`mailto:${personalInfo.email}`} className="underline">{personalInfo.email}</a>
                <a href={`mailto:${personalInfo.secondaryEmail}`} className="text-sm opacity-90 underline">{personalInfo.secondaryEmail}</a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span>{personalInfo.phone}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/document/Resume.pdf"
              download="Resume.pdf"
              className="inline-block"
            >
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/youri-van-baal-114198332/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#0077B5] text-white hover:bg-[#005885]">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Experience & Projects */}
      <section id="projects" className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-black to-purple-900 bg-clip-text text-transparent">
              Experience & Projects
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Real-world experience gained through internships and collaborative projects with industry leaders
            </p>
          </div>
          
          {/* Skill Legend with filtering */}
          <div className="flex justify-center">
            <div className="max-w-4xl w-full">
              <SkillLegend 
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>
          </div>
          
          {/* Filter Status */}
          {selectedCategory && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                <span>Showing projects with <strong>{selectedCategory}</strong> skills</span>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="ml-2 text-purple-600 hover:text-purple-800 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {filteredProjects.length === 0 && selectedCategory ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700">No projects found</h3>
                <p className="text-gray-600">
                  No projects contain skills from the <strong>{selectedCategory}</strong> category.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory(null)}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  View All Projects
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProjects.map((project, index) => {
                // Image area: for projects with a video (Fontys) we make only the image clickable to open the dialog
                const handleImageClick = () => {
                  if (project.videoId) {
                    setVideoUrl(`https://www.youtube.com/embed/${project.videoId}`);
                  } else if (project.projectImages && project.projectImages.length > 0) {
                    setModalImages(project.projectImages);
                    setModalImageIndex(0);
                    setImageModalOpen(true);
                  }
                };

                const imageArea = (
                  <div
                    className="aspect-[16/9] relative overflow-hidden bg-white flex items-center justify-center cursor-pointer"
                    onClick={handleImageClick}
                    aria-label={project.videoId ? `Open video for ${project.company}` : `Open images for ${project.company}`}
                    tabIndex={0}
                    role="button"
                  >
                    <ImageWithFallback
                      src={project.images[0]?.src}
                      alt={`${project.company} project`}
                      className="max-w-full max-h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* subtle gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-black/28 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Remove video/image icon from here */}
                        </div>
                        {/* Badge ternary fixed */}
                        {project.type === 'internship' ? (
                          <Badge variant="default" className="bg-pink-500 text-white border-pink-400">💼 Internship</Badge>
                        ) : project.type === 'job' ? (
                          <Badge variant="default" className="bg-green-600 text-black border-green-500">💼 Job</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-purple-500 text-white border-purple-400">🎓 Project</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
  
                // No special wrapper here — clicking the image sets videoUrl which opens the modal rendered near the end of the page
                // Return the card normally for all projects
                return (
                    <div key={index}>
                        <Card
                            className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 bg-white/90 backdrop-blur-sm hover:bg-white hover:border-pink-300 overflow-hidden cursor-pointer">
                            {imageArea}
                            <CardHeader className="pb-4">
                                <div className="space-y-2">
                                    <CardTitle className="text-xl group-hover:text-pink-600 transition-colors">
                                        {project.role}
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4"/>
                                            <span>{project.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4"/>
                                            <span>{project.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <CardDescription className="text-gray-700 leading-relaxed">
                                    {project.description}
                                </CardDescription>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-black flex items-center gap-2">
                                        <span className="text-lg">🛠️</span>
                                        Technologies & Skills
                                    </h4>
                                    {(() => {
                                        const grouped: Record<string, string[]> = {};
                                        project.skills.forEach((s) => {
                                            const cat = getSkillCategory(s).name ?? 'Other';
                                            if (!grouped[cat]) grouped[cat] = [];
                                            if (!grouped[cat].includes(s)) grouped[cat].push(s);
                                        });

                                        const sortedCategories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
                                        const orderedSkills: string[] = [];
                                        sortedCategories.forEach((cat) => {
                                            const skills = grouped[cat].slice().sort((a, b) => a.localeCompare(b));
                                            orderedSkills.push(...skills);
                                        });

                                        return (
                                            <div className="flex flex-wrap gap-2">
                                                {orderedSkills.map((skill) => (
                                                    <SkillBadge key={skill} skill={skill}/>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                    {/* Add extra space before the media button */}
                                    {(project.videoId || (project.projectImages && project.projectImages.length > 0)) && (
                                        <div
                                            className="flex justify-center mt-8"> {/* Increased margin-top for more space */}
                                            <Button
                                                variant="outline"
                                                className="border-purple-400 text-purple-700 hover:bg-purple-50 px-6 py-2 rounded-full shadow flex items-center gap-2"
                                                onClick={handleImageClick}
                                                aria-label={project.videoId ? `View video for ${project.company}` : `View images for ${project.company}`}
                                            >
                                                {/* Move icon into button, conditionally render play or image icon */}
                                                {project.videoId ? (
                                                    <span className="inline-flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                         className="w-5 h-5 text-pink-600">
                                      <path d="M6.5 5.5v13l12-6.5-12-6.5z"/>
                                    </svg>
                                  </span>
                                                ) : (
                                                    <span className="inline-flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor" className="w-5 h-5 text-purple-600">
                                      <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
                                      <circle cx="8" cy="10" r="2" fill="currentColor"/>
                                      <path strokeWidth="2" d="M21 19l-5-5a3 3 0 0 0-4 0l-5 5"/>
                                    </svg>
                                  </span>
                                                )}
                                                {project.videoId ? 'View Video' : 'View Images'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* About Me */}
      <AboutSection />
      
      {/* Call to Action */}
      <section id="contact" className="relative z-10 py-16 px-6 bg-gradient-to-r from-black via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Ready to Contribute</h2>
            <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
              I'm actively seeking internship opportunities where I can apply my skills,
              learn from experienced professionals, and contribute to meaningful projects.
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href="mailto:y.vanbaal@student.fontys.nl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send email to Youri van Baal"
              onClick={(e) => { e.preventDefault(); window.open('mailto:y.vanbaal@student.fontys.nl', '_blank'); }}
            >
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Lightweight modal for video (renders when videoUrl is set) */}
      {videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setVideoUrl(null)} />
          <div className="relative w-full max-w-2xl mx-4 ring-2 ring-purple-300 bg-purple-50 shadow-2xl rounded-xl"> {/* Outline, new bg, shadow, rounded corners */}
            <div className="bg-white/90 rounded-xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Smart Classroom</h3>
                <button
                  onClick={() => setVideoUrl(null)}
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Close video"
                >
                  ✕
                </button>
              </div>
              <div className="w-full aspect-[16/9] max-h-[70vh]">
                <iframe
                  className="w-full h-full rounded-b"
                  src={videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {videoUrl.includes('youtube.com/embed/') && (
                <div className="p-4 border-t-2 border-purple-300 bg-white w-full">
                  <p className="text-gray-800 text-base">
                    In this video you see someone walking around with a tag that gets tracked using triangulation using some beacons. There are also sensors that track the air quality that get shown a bit later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Image Modal */}
      {imageModalOpen && modalImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setImageModalOpen(false)} />
          <div className="relative w-full max-w-2xl mx-4 ring-2 ring-purple-300 bg-purple-50 shadow-2xl rounded-xl">
            <div className="bg-white/90 rounded-xl overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Project Images</h3>
                <button
                  onClick={() => setImageModalOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Close image modal"
                >
                  ✕
                </button>
              </div>
              {/* Images and navigation logic */}
              {(() => {
                const canGoBack = modalImageIndex > 0;
                const canGoForward = modalImageIndex < modalImages.length - 1;
                const current = modalImages[modalImageIndex];
                return (
                  <div className="relative w-full flex flex-col items-center justify-center bg-black py-4">
                    {canGoBack && (
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow z-20 border-2 border-pink-400"
                        style={{ zIndex: 30 }}
                        onClick={() => setModalImageIndex(modalImageIndex - 1)}
                        aria-label="Back to previous image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-pink-500">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    <img
                      src={current.src}
                      alt={current.description}
                      className="block max-w-full max-h-[60vh] h-auto w-auto rounded shadow-lg"
                      style={{ objectFit: 'contain', objectPosition: 'center' }}
                    />
                    {canGoForward && (
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow z-20 border-2 border-pink-400"
                        style={{ zIndex: 30 }}
                        onClick={() => setModalImageIndex(modalImageIndex + 1)}
                        aria-label="Next image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7 text-pink-500">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })()}
              {/* Description for current image */}
              <div className="p-4 border-t-2 border-purple-300 bg-white w-full">
                {modalImages[modalImageIndex]?.description}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 py-8 px-6 border-t border-gray-300 bg-white/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-700">
            © 2025 {personalInfo.name}. Built with React, TypeScript, and Vite.
          </p>
        </div>
      </footer>
    </div>
  );
}
