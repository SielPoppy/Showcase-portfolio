import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Palette, Filter } from "lucide-react";
import { skillCategories } from "./utils/skillCategories";

interface SkillLegendProps {
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
}

export function SkillLegend({ selectedCategory, onCategorySelect }: SkillLegendProps) {
  const handleCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      // Toggle selection: if already selected, deselect it
      onCategorySelect(selectedCategory === categoryName ? null : categoryName);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="w-4 h-4" />
          Skill Categories
          {onCategorySelect && (
            <span className="text-xs font-normal text-gray-600 ml-2">
              <Filter className="w-3 h-3 inline mr-1" />
              Click to filter projects
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(skillCategories).map(([key, category]) => {
            const isSelected = selectedCategory === category.name;
            const isClickable = !!onCategorySelect;
            
            return (
              <div key={key} className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-1 border transition-all duration-200 ${category.color} ${category.bgColor} ${category.borderColor} ${
                    isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''
                  } ${
                    isSelected ? 'ring-2 ring-purple-500 ring-offset-2 bg-purple-100 shadow-lg' : ''
                  }`}
                  onClick={() => isClickable && handleCategoryClick(category.name)}
                >
                  {category.name}
                </Badge>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {onCategorySelect ? (
            <>
              <strong>Click</strong> any category to filter projects • <strong>Hover</strong> over skill badges to see classifications
            </>
          ) : (
            'Hover over any skill badge to see its category classification'
          )}
        </p>
      </CardContent>
    </Card>
  );
}