import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { getSkillCategory } from './utils/skillCategories';

interface SkillBadgeProps extends React.Attributes {
  skill: string;
  className?: string;
  // optional click handler (used by ProjectCard to open the usage panel)
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  // control how the category tooltip is triggered; defaults to 'click' for backward compatibility
  tooltipTrigger?: 'click' | 'hover';
}

export function SkillBadge(props: SkillBadgeProps & { key?: React.Key }) {
  const { skill, className, onClick, tooltipTrigger = 'click' } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const category = getSkillCategory(skill);
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  // small helper to split long category names
  const formatCategoryName = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2 && name.length > 12) {
      const midPoint = Math.ceil(words.length / 2);
      return { firstLine: words.slice(0, midPoint).join(' '), secondLine: words.slice(midPoint).join(' '), isMultiLine: true };
    }
    return { firstLine: name, secondLine: '', isMultiLine: false };
  };

  const formattedName = formatCategoryName(category.name);

  // compute tooltip position when it becomes visible (only on click)
  useEffect(() => {
    if (!showTooltip || !badgeRef.current) {
      setPos(null);
      return;
    }

    const compute = () => {
      const badgeRect = badgeRef.current!.getBoundingClientRect();
      const tooltipEl = tooltipRef.current;
      const estimatedWidth = tooltipEl ? tooltipEl.offsetWidth : 200;
      const estimatedHeight = tooltipEl ? tooltipEl.offsetHeight : 40;
      let top = badgeRect.top - estimatedHeight - 8;
      if (top < 8) top = badgeRect.bottom + 8;
      let left = badgeRect.left + badgeRect.width / 2 - estimatedWidth / 2;
      const minLeft = 8;
      const maxLeft = (window.innerWidth || document.documentElement.clientWidth) - estimatedWidth - 8;
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;
      setPos({ left, top });

      if (!tooltipEl) return;
      requestAnimationFrame(() => {
        const tRect = tooltipEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const maxTop = viewportHeight - tRect.height - 8;
        let refinedTop = badgeRect.top - tRect.height - 8;
        if (refinedTop < 8) refinedTop = badgeRect.bottom + 8;
        if (refinedTop > maxTop) refinedTop = Math.max(8, maxTop);
        let refinedLeft = badgeRect.left + badgeRect.width / 2 - tRect.width / 2;
        const refinedMaxLeft = (window.innerWidth || document.documentElement.clientWidth) - tRect.width - 8;
        if (refinedLeft < 8) refinedLeft = 8;
        if (refinedLeft > refinedMaxLeft) refinedLeft = refinedMaxLeft;
        setPos((prev) => {
          if (!prev) return { left: refinedLeft, top: refinedTop };
          if (Math.abs(prev.left - refinedLeft) > 1 || Math.abs(prev.top - refinedTop) > 1) return { left: refinedLeft, top: refinedTop };
          return prev;
        });
      });
    };

    const t = window.setTimeout(compute, 0);
    const onResize = () => compute();
    const onScroll = () => compute();
    window.addEventListener('resize', onResize);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [showTooltip]);

  const canUseDOM = typeof document !== 'undefined' && !!document.body;
  const tooltipContainerRef = React.useRef<HTMLElement | null>(null);
  // Use a single, stable container for all skill tooltips to avoid removeChild races
  useEffect(() => {
    if (!canUseDOM) return;
    // Lazily create or reuse a shared tooltip root
    const containerId = 'app-tooltip-root';
    let container = document.getElementById(containerId) as HTMLElement | null;
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.setAttribute(
        'style',
        'position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:2147483647;'
      );
      document.body.appendChild(container);
    }
    tooltipContainerRef.current = container;
    // Intentionally do not remove the container on unmount; keeping it prevents
    // React from attempting to remove children from a detached parent during rapid toggles
    return () => {
      tooltipContainerRef.current = null;
    };
  }, [canUseDOM]);

  const defaultClick = (e?: React.MouseEvent) => {
    // In hover mode we intentionally ignore clicks unless an explicit onClick is provided
    if (tooltipTrigger === 'hover') {
      if (onClick && e) onClick(e as React.MouseEvent<HTMLSpanElement>);
      return;
    }
    if (onClick && e) {
      onClick(e as React.MouseEvent<HTMLSpanElement>);
      return;
    }
    setShowTooltip((s) => !s);
  };

  const tooltipNode = (
    <div
      ref={tooltipRef}
      className="shadow-xl border bg-white backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-medium text-gray-700 leading-tight"
      style={{
        position: 'fixed',
        left: pos ? `${pos.left}px` : '-9999px',
        top: pos ? `${pos.top}px` : '-9999px',
        zIndex: 99999999999,
        pointerEvents: 'auto',
      }}
      role="tooltip"
    >
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${category.bgColor.replace('hover:', '').replace('bg-', 'bg-')}`} />
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
  );

  return (
    <div className="relative inline-block">
      <span
        ref={badgeRef}
        role={tooltipTrigger === 'click' || onClick ? 'button' : 'presentation'}
        tabIndex={tooltipTrigger === 'click' || onClick ? 0 : -1}
        onClick={(e) => {
          // If parent provided a click handler, forward the event. Otherwise toggle tooltip (click mode only)
          defaultClick(e);
        }}
        onMouseEnter={() => {
          if (tooltipTrigger === 'hover') setShowTooltip(true);
        }}
        onMouseLeave={() => {
          if (tooltipTrigger === 'hover') setShowTooltip(false);
        }}
        onFocus={() => {
          // basic a11y: show on focus when hover mode isn't keyboard-accessible otherwise
          if (tooltipTrigger === 'hover') setShowTooltip(true);
        }}
        onBlur={() => {
          if (tooltipTrigger === 'hover') setShowTooltip(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (tooltipTrigger === 'click' || onClick) {
              defaultClick();
            }
          }
        }}
        className={`inline-flex items-center justify-center rounded-md border-2 border-white outline-2 outline-pink-500 px-2 py-0.5 text-xs w-fit whitespace-nowrap shrink-0 gap-1 hover:scale-105 transition-transform duration-200 ${tooltipTrigger === 'click' || onClick ? 'cursor-pointer' : 'cursor-default'} font-medium ${category.bgColor} ${category.color} ${category.borderColor} ${className}`}
      >
        {skill}
      </span>

  {canUseDOM && showTooltip && tooltipContainerRef.current ? createPortal(tooltipNode, tooltipContainerRef.current) : null}
    </div>
  );
}