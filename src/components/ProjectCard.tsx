import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Building2, Calendar, MapPin } from "lucide-react";
import { getSkillCategory } from "./utils/skillCategories";

interface ProjectCardProps {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  image: string;
  type: "Project" | "Internship";
}

export function ProjectCard({ 
  company, 
  role, 
  duration, 
  location, 
  description, 
  skills, 
  image, 
  type 
}: ProjectCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <ImageWithFallback
          src={image}
          alt={`${company} office`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant={type === "Internship" ? "default" : "secondary"} className="backdrop-blur-sm">
            {type}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {company}
            </CardTitle>
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