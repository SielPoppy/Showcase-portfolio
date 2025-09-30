import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MapPin, Gamepad2, Dumbbell, Home, Globe, Trophy, Users, Code } from "lucide-react";
import { Badge } from "./ui/badge";

const interests = [
  {
    title: "Geography",
    icon: <Globe className="w-6 h-6" />,
    description: "Fascinated by world cultures, maps, and geopolitical dynamics. I love exploring how technology can solve global challenges.",
    image: "https://images.unsplash.com/photo-1619469399933-05d6e31688d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMGdlb2dyYXBoeXxlbnwxfHx8fDE3NTg3ODQ5NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    skills: ["Data Visualization", "GIS Systems", "Analytics", "Research"]
  },
  {
    title: "Gaming",
    icon: <Gamepad2 className="w-6 h-6" />,
    description: "Strategy games and competitive gaming teach me problem-solving, quick decision-making, and teamwork under pressure.",
    image: "https://images.unsplash.com/photo-1695074185991-136f993ad998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGNvbnRyb2xsZXJ8ZW58MXx8fHwxNzU4Nzg2MzI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    skills: ["Strategic Thinking", "Team Coordination", "Performance Optimization", "User Experience"]
  },
  {
    title: "Working Out",
    icon: <Dumbbell className="w-6 h-6" />,
    description: "Regular fitness routine keeps me disciplined, focused, and energized. It teaches me consistency and goal-setting.",
    image: "https://images.unsplash.com/photo-1756115484694-009466dbaa67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwZml0bmVzc3xlbnwxfHx8fDE3NTg3MzgzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    skills: ["Discipline", "Goal Setting", "Time Management", "Persistence"]
  },
  {
    title: "Smart Home",
    icon: <Home className="w-6 h-6" />,
    description: "Building and automating my smart home setup. I love integrating IoT devices and creating efficient, connected systems.",
    image: "https://images.unsplash.com/photo-1650682009477-52fd77302b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODc4NjMzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    skills: ["IoT Integration", "Automation", "Network Setup", "Hardware Integration"]
  }
];

export function InterestsSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Beyond Code</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My hobbies and interests shape how I approach problems and work with teams
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {interests.map((interest, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-border/50 hover:border-border">
              <div className="aspect-[16/9] relative overflow-hidden">
                <ImageWithFallback
                  src={interest.image}
                  alt={interest.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      {interest.icon}
                    </div>
                    <h3 className="text-xl font-bold">{interest.title}</h3>
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardDescription className="text-sm leading-relaxed">
                  {interest.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Transferable Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {interest.skills.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex} 
                        variant="secondary" 
                        className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            These interests help me bring creativity, discipline, and diverse perspectives to every project
          </div>
        </div>
      </div>
    </section>
  );
}