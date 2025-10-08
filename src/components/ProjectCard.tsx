import React, {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader} from "./ui/card";
import {Badge} from "./ui/badge";
import {ImageWithFallback} from "./figma/ImageWithFallback";
import {Calendar, Image as ImageIcon, MapPin} from "lucide-react";
import {getSkillCategory} from "./utils/skillCategories";
import {Dialog} from "./ui/dialog";

interface ProjectImage {
  src: string;
  description: string;
}

interface ProjectCardProps {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  images: ProjectImage[];
  projectImages?: ProjectImage[];
  type: "Project" | "Internship";
}

export function ProjectCard({ 
  company, 
  role, 
  duration, 
  location, 
  description, 
  skills, 
  images, 
  projectImages = [],
}: ProjectCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMedia, setShowMedia] = useState(false);
  const currentImage = images[currentIndex];
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < images.length - 1;

  // Color for navigation buttons (same as dot)
  const navColor = "bg-primary text-white";
  // Color for media icon
  const mediaIconColor = "text-pink-500"
    
  // Helper to check if an image is a company logo
  const isCompanyLogo = (src: string) => src.includes('/images/companies/');
  // Find the company logo (first image that is a company logo)
  const companyLogo = images.find(img => isCompanyLogo(img.src));
  // Only show media icon if there is a non-empty projectImages array
  const hasMedia = projectImages.length > 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
      <div className="aspect-video relative overflow-hidden rounded-t-lg flex items-center justify-center bg-gray-100">
        <div className="relative flex items-center justify-center w-full h-full">
          <ImageWithFallback
            src={currentImage.src}
            alt={`${company} project`}
            className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
          />
          {/* Left arrow */}
          {canGoBack && (
            <button
              className={`absolute right-16 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full ${navColor} shadow-lg z-10`}
              style={{ right: '4.5rem' }}
              onClick={() => setCurrentIndex(currentIndex - 1)}
              aria-label="Previous image"
            >
              <span className="text-2xl font-bold">{'<'}</span>
            </button>
          )}
          {/* Right arrow */}
          {canGoForward && (
            <button
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full ${navColor} shadow-lg z-10`}
              onClick={() => setCurrentIndex(currentIndex + 1)}
              aria-label="Next image"
            >
              <span className="text-2xl font-bold">{'>'}</span>
            </button>
          )}
        </div>
      </div>
      {/* Image description */}
      <div className="px-4 py-2 text-center text-sm text-muted-foreground bg-white border-b border-t border-border">
        {currentImage.description}
      </div>
      {/* Company logo always shown at the top */}
      {companyLogo && (
        <div className="flex justify-center items-center py-4">
          <ImageWithFallback
            src={companyLogo.src}
            alt={companyLogo.description || `${company} logo`}
            className="h-16 w-auto object-contain rounded-lg shadow-md"
          />
        </div>
      )}
      {/* Media icon and modal only for projects with media */}
      {hasMedia && (
        <div className="flex justify-center items-center py-2">
          <button
            className="focus:outline-none"
            onClick={() => setShowMedia(true)}
            aria-label="Show project images"
          >
            <ImageIcon className={`w-8 h-8 ${mediaIconColor}`} />
          </button>
        </div>
      )}
      {/* Modal for project images */}
      {showMedia && hasMedia && (
        <Dialog open={showMedia} onOpenChange={setShowMedia}>
          <div className="flex flex-col items-center">
            {projectImages.map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={img.description}
                className="max-w-full max-h-[60vh] mb-4 rounded-lg shadow-lg"
              />
            ))}
          </div>
        </Dialog>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {/* Removed company name and building icon */}
            {/* <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {company}
            </CardTitle> */}
            <CardDescription className="font-medium text-foreground">
              {role}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {location}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{description}</p>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Technologies & Skills</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => {
              const category = getSkillCategory(skill);
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-xs transition-colors border ${category.color} ${category.bgColor} ${category.borderColor}`}
                  title={`${skill} - ${category.name}`}
                >
                  {skill}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



