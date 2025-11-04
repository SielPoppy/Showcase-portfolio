import React from 'react';
import { Badge } from './ui/badge';
import { getSkillCategory, skillCategories } from './utils/skillCategories';

interface Props {
  categoryName: string;
  skills: string[];
  // forward mouse event so callers can anchor panels
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement | HTMLAnchorElement | HTMLElement>) => void;
  className?: string;
}

export default function CategoryBadge({ categoryName, skills, className, onClick }: Props) {
  const title = skills.length > 0 ? skills.join(', ') : 'No skills';

  // Derive styling: prefer using a real skill's category info if available,
  // otherwise fall back to the category mapping by name.
  let category = undefined as any;
  if (skills.length > 0) {
    category = getSkillCategory(skills[0]);
  }
  if (!category) {
    category = (skillCategories as any)[categoryName] || {
      name: categoryName,
      color: 'text-slate-700',
      bgColor: 'bg-slate-50 hover:bg-slate-100',
      borderColor: 'border-slate-200',
    };
  }

  const cls = `text-xs px-2 py-1 border max-w-full whitespace-normal break-words text-center ${category.bgColor} ${category.color} ${category.borderColor} ${className ?? ''}`;

  return (
    <div className="flex items-center">
      <Badge
        variant="outline"
        title={title}
        className={cls + (typeof onClick === 'function' ? ' cursor-pointer hover:scale-105 transition-transform' : ' cursor-default')}
        aria-label={`${categoryName} (click to open skills)`}
        onClick={(e: any) => onClick && onClick(e)}
      >
        {categoryName}
      </Badge>
    </div>
  );
}
