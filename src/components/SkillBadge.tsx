import React, { useState } from 'react';
// Note: render our own badge element here to ensure category classes have precedence
// over any shared Badge variants which can produce unexpected backgrounds.
import { getSkillCategory } from './utils/skillCategories';

interface SkillBadgeProps extends React.Attributes {
  skill: string;
  className?: string;
}

export function SkillBadge(props: SkillBadgeProps & { key?: React.Key }) {
  const { skill, className } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const category = getSkillCategory(skill);

  // Function to format category name with line breaks for long names
  const formatCategoryName = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2 && name.length > 12) {
      // Split long category names into multiple lines
      const midPoint = Math.ceil(words.length / 2);
      const firstLine = words.slice(0, midPoint).join(' ');
      const secondLine = words.slice(midPoint).join(' ');
      return { firstLine, secondLine, isMultiLine: true };
    }
    return { firstLine: name, secondLine: '', isMultiLine: false };
  };

  const formattedName = formatCategoryName(category.name);

  return (
    <div className="relative inline-block">
      <span
        role="button"
        tabIndex={0}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 hover:scale-105 transition-transform duration-200 cursor-help font-medium ${category.bgColor} ${category.color} ${category.borderColor} ${className}`}
      >
        {skill}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60] shadow-xl border bg-white backdrop-blur-sm rounded-lg">
          <div className="px-3 py-2 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${category.bgColor.replace('hover:', '').replace('bg-', 'bg-')}`}></div>
            <div className="text-xs font-medium text-gray-700 text-center leading-tight">
              {formattedName.isMultiLine ? (
                <>
                  <div>{formattedName.firstLine}</div>
                  <div>{formattedName.secondLine}</div>
                </>
              ) : (
                <div>{formattedName.firstLine}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}