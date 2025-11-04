import React from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Palette } from "lucide-react";
import { skillCategories, getSkillsByCategory, getSkillCategory } from "./utils/skillCategories";
import { projects } from "../data/projects";

interface SkillLegendProps {
  selectedCategory?: string | null;
  selectedSkill?: string | null;
  onCategorySelect?: (category: string | null) => void;
  onSkillSelect?: (skill: string | null) => void;
}

export function SkillLegend({ selectedCategory, selectedSkill, onCategorySelect, onSkillSelect }: SkillLegendProps) {

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const badgeRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [maxSkillSize, setMaxSkillSize] = React.useState<{ width: number; height: number } | null>(null);
  const [maxCategorySize, setMaxCategorySize] = React.useState<{ width: number; height: number } | null>(null);

  const projectSkillSet = React.useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => {
      if (Array.isArray(p.skills)) {
        p.skills.forEach((sk) => s.add(sk.name));
      }
    });
    return s;
  }, []);

  const allSkillsForMeasurement = React.useMemo(() => {
    return Object.entries(skillCategories).flatMap(([key, category]) =>
      getSkillsByCategory(key as keyof typeof skillCategories)
        .filter((sk) => projectSkillSet.has(sk))
        .map((skill) => ({ key, skill, category }))
    );
  }, [projectSkillSet]);

  const handleCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      // selecting a category clears any skill-level selection
      onCategorySelect(selectedCategory === categoryName ? null : categoryName);
      if (onSkillSelect && selectedCategory === categoryName) onSkillSelect(null);
    }
  };

  const toggleExpand = (categoryKey: string) => {
    setExpanded((s) => ({ ...s, [categoryKey]: !s[categoryKey] }));
  };

  const handleSkillClick = (categoryName: string, skillName: string) => {
    if (onSkillSelect) {
      // select or deselect skill
      onSkillSelect(selectedSkill === skillName ? null : skillName);
    }
    // ensure the category is selected when selecting a skill
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  // Measure skill badge sizes after render and update the max size
  // Use a small timeout so DOM content (fonts) settle, and update on resize.
  React.useEffect(() => {
    const measure = () => {
      const entries = Object.entries(badgeRefs.current).filter(([_, el]) => !!el) as [string, HTMLDivElement][];
      if (entries.length === 0) return;
      // prefer measuring the offscreen measurement set (keys starting with 'measure::' and 'measure-cat::')
      const measureSkillRects = entries
        .filter(([k]) => k.startsWith('measure::'))
        .map(([_, el]) => el.getBoundingClientRect());
      const measureCatRects = entries
        .filter(([k]) => k.startsWith('measure-cat::'))
        .map(([_, el]) => el.getBoundingClientRect());

      if (measureSkillRects.length > 0) {
        const maxWidth = Math.max(...measureSkillRects.map((r) => Math.ceil(r.width)));
        const maxHeight = Math.max(...measureSkillRects.map((r) => Math.ceil(r.height)));
        setMaxSkillSize({ width: Math.min(maxWidth, 240), height: maxHeight });
      } else {
        const skillRects = entries
          .filter(([k]) => !k.startsWith('cat::') && !k.startsWith('measure-cat::') && !k.startsWith('measure::'))
          .map(([_, el]) => el.getBoundingClientRect());
        if (skillRects.length > 0) {
          const maxWidth = Math.max(...skillRects.map((r) => Math.ceil(r.width)));
          const maxHeight = Math.max(...skillRects.map((r) => Math.ceil(r.height)));
          setMaxSkillSize({ width: Math.min(maxWidth, 240), height: maxHeight });
        }
      }

      if (measureCatRects.length > 0) {
        const maxWidth = Math.max(...measureCatRects.map((r) => Math.ceil(r.width)));
        const maxHeight = Math.max(...measureCatRects.map((r) => Math.ceil(r.height)));
        setMaxCategorySize({ width: Math.min(maxWidth, 240), height: maxHeight });
      } else {
        const catRects = entries
          .filter(([k]) => k.startsWith('cat::'))
          .map(([_, el]) => el.getBoundingClientRect());
        if (catRects.length > 0) {
          const maxWidth = Math.max(...catRects.map((r) => Math.ceil(r.width)));
          const maxHeight = Math.max(...catRects.map((r) => Math.ceil(r.height)));
          setMaxCategorySize({ width: Math.min(maxWidth, 240), height: maxHeight });
        }
      }
    };

    const t = window.setTimeout(measure, 60);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [expanded, selectedCategory, selectedSkill]);

  return (
    
    <Card
      className="relative z-20 mt-8 border-2 border-purple-700 ring-3 ring-purple-400/22 hover:ring-4 hover:ring-purple-500/30 transition-shadow duration-300"
      style={{ boxShadow: '0 0 12px rgba(124,58,237,0.20), 0 6px 16px rgba(124,58,237,0.08)' }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base justify-center">
          <Palette className="w-4 h-4" />
          Skill Categories
        </CardTitle>
      </CardHeader>
  <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(skillCategories).map(([key, category]) => {
            const isSelected = selectedCategory === category.name;
            const isClickable = !!onCategorySelect;
            const isExpanded = !!expanded[key];
            const ringClass = isSelected ? `${category.borderColor.replace('border-', 'ring-')} ring-offset-2 ring-2` : '';

            let skills = getSkillsByCategory(key as keyof typeof skillCategories);
            // only include skills that appear in projects
            skills = skills.filter((sk) => projectSkillSet.has(sk));

            return (
              <div key={key} className="min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    ref={(el) => { badgeRefs.current[`cat::${key}`] = el; }}
                    className={`inline-flex items-center ${ringClass}`}
                    style={{
                        width: maxCategorySize ? `${Math.min(maxCategorySize.width, 240)}px` : undefined,
                        maxWidth: '100%',
                        minHeight: maxCategorySize ? `${maxCategorySize.height}px` : '2rem',
                        boxSizing: 'border-box',
                    }}
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs border transition-all duration-200 max-w-full whitespace-normal break-words text-center ${category.color} ${category.bgColor} ${category.borderColor} ${
                        isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''
                      } w-full h-full flex items-center justify-center`}
                      style={{ padding: '5px' }}
                      onClick={() => isClickable && handleCategoryClick(category.name)}
                    >
                      <span style={{ whiteSpace: 'normal', textAlign: 'center' }}>{category.name}</span>
                    </Badge>
                  </div>

                  {skills.length > 0 && (
                    <button
                      aria-label={isExpanded ? `Collapse ${category.name}` : `Expand ${category.name}`}
                      onClick={() => toggleExpand(key)}
                      className={`w-7 h-7 px-1 border rounded inline-flex items-center justify-center transition-transform transform hover:scale-110 ${category.bgColor} ${category.borderColor} ${category.color} ${
                        isSelected ? ringClass : ''
                      }`}
                      style={{ lineHeight: 1, boxSizing: 'border-box' }}
                    >
                      <span className="text-lg font-semibold" aria-hidden>
                        {isExpanded ? '▾' : '▸'}
                      </span>
                    </button>
                  )}
                </div>

                {isExpanded && skills.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {skills.map((skill) => {
                      const skillSelected = selectedSkill === skill;
                      const skillRing = skillSelected ? `${category.borderColor.replace('border-', 'ring-')} ring-offset-1 ring-2` : '';
                      const refKey = `${key}::${skill}`;
                      return (
                        <div key={skill} className="flex items-center">
                          <div
                            ref={(el) => { badgeRefs.current[refKey] = el; }}
                            className={`inline-flex items-center justify-center transition-all duration-150 ${category.bgColor} ${category.borderColor} ${category.color} rounded border cursor-pointer hover:scale-105 hover:shadow-sm ${skillRing}`}
                            style={{
                              padding: '5px',
                              textAlign: 'center',
                              boxSizing: 'border-box',
                              whiteSpace: 'normal',
                              overflowWrap: 'anywhere',
                              wordBreak: 'break-word',
                              width: maxSkillSize ? `${Math.min(maxSkillSize.width, 240)}px` : undefined,
                              maxWidth: '100%',
                              minHeight: maxSkillSize ? `${maxSkillSize.height}px` : '2rem',
                            }}
                            onClick={() => handleSkillClick(category.name, skill)}
                          >
                            <span className="text-xs" style={{ whiteSpace: 'normal', textAlign: 'center' }}>{skill}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {onCategorySelect ? (
            <>
              <strong>Click</strong> any category to filter projects • <strong>Click</strong> on skill badges to see how they are used
            </>
          ) : (
            'Click on any skill badge on the project cards below to see how it is used'
          )}
        </p>
      </CardContent>
      {/* Offscreen measurement helpers: render every skill and category once (hidden) so we can compute the max sizes */}
      <div aria-hidden style={{ position: 'absolute', left: -9999, top: -9999, width: 'auto', height: 'auto', overflow: 'hidden', visibility: 'hidden', pointerEvents: 'none' }}>
        {allSkillsForMeasurement.map(({ key, skill, category }) => {
          const refKey = `measure::${key}::${skill}`;
          return (
            <div
              key={refKey}
              ref={(el) => { badgeRefs.current[refKey] = el; }}
              className={`inline-flex items-center justify-center transition-all duration-150 ${category.bgColor} ${category.borderColor} ${category.color} rounded border`}
                style={{ padding: '5px', boxSizing: 'border-box', whiteSpace: 'normal' }}
            >
              <span className="text-xs">{skill}</span>
            </div>
          );
        })}

        {Object.entries(skillCategories).map(([key, category]) => {
          const refKey = `measure-cat::${key}`;
          return (
            <div
              key={refKey}
              ref={(el) => { badgeRefs.current[refKey] = el; }}
              className={`inline-flex items-center justify-center ${category.bgColor} ${category.borderColor} ${category.color} rounded border`}
                style={{ padding: '5px', boxSizing: 'border-box', whiteSpace: 'normal' }}
            >
              <span className="text-xs">{category.name}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
 