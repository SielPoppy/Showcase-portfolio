import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Code2, Database, Globe, Palette, Users, Gamepad2, Dumbbell, Home, Map } from "lucide-react";
import { getSkillCategory } from "./utils/skillCategories";

const skillCategories = [
	{
		title: "Frontend Development",
		icon: <Globe className="w-5 h-5" />,
		skills: ["React", "TypeScript", "Next.js", "HTML5", "CSS3"],
		hobbyConnection: "Geography",
	},
	{
		title: "Backend & Infrastructure",
		icon: <Database className="w-5 h-5" />,
		skills: [
			"Node.js",
			"MySQL",
			"MongoDB",
			"REST APIs",
			"Docker",
			"Kubernetes",
			"Azure",
			"SQL Server",
			"Webhooks",
			"Actix-web",
			"Rust",
			"IoT",
			"LoRaWAN",
		],
		hobbyConnection: "Smart Home",
	},
	{
		title: "Programming Languages",
		icon: <Code2 className="w-5 h-5" />,
		skills: ["JavaScript", "TypeScript", "C#", "Rust", ".NET"],
		hobbyConnection: null,
	},
	{
		title: "Design & UX",
		icon: <Palette className="w-5 h-5" />,
		skills: ["Figma"],
		hobbyConnection: "Gaming",
	},
	{
		title: "Tools & Collaboration",
		icon: <Users className="w-5 h-5" />,
		skills: [
			"Git",
			"Agile",
			"DevOps",
			"Automated Testing",
			"Google APIs",
			"OpenAI APIs",
		],
		hobbyConnection: "Gaming",
	},
	{
		title: "Personal Excellence",
		icon: <Dumbbell className="w-5 h-5" />,
		skills: ["Problem Solving", "Team Coordination"],
		hobbyConnection: "Fitness",
	},
];

const hobbyIcons = {
	Geography: <Map className="w-3 h-3" />,
	Gaming: <Gamepad2 className="w-3 h-3" />,
	"Smart Home": <Home className="w-3 h-3" />,
	Fitness: <Dumbbell className="w-3 h-3" />,
};

export function SkillsOverview() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{skillCategories.map((category, index) => (
				<Card
					key={index}
					className="hover:shadow-md transition-shadow duration-200 group"
				>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center justify-between text-base">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
									{category.icon}
								</div>
								{category.title}
							</div>
							{category.hobbyConnection && (
								<div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
									{
										hobbyIcons[
											category.hobbyConnection as keyof typeof hobbyIcons
										]
									}
									<span className="hidden sm:inline">
										{category.hobbyConnection}
									</span>
								</div>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{category.skills.map((skill, skillIndex) => {
								const skillCategory = getSkillCategory(skill);
								return (
									<Badge
										key={skillIndex}
										variant="secondary"
										className={`text-xs transition-colors cursor-default border ${skillCategory.color} ${skillCategory.bgColor} ${skillCategory.borderColor}`}
										title={`${skill} - ${skillCategory.name}`}
									>
										{skill}
									</Badge>
								);
							})}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}