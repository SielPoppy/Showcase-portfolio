import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { getSkillCategory } from './utils/skillCategories';

interface SkillBadgeProps extends React.Attributes {
  skill: string;
  className?: string;
}

export function SkillBadge(props: SkillBadgeProps & { key?: React.Key }) {
  const { skill, className } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const category = getSkillCategory(skill);
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

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
  
  const hideTimeoutRef = React.useRef<number | null>(null);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const showImmediately = () => {
    clearHideTimeout();
    setShowTooltip(true);
  };

  const hideWithDelay = (delay = 120) => {
    clearHideTimeout();
    hideTimeoutRef.current = window.setTimeout(() => setShowTooltip(false), delay);
  };

  // compute tooltip position when it becomes visible
  useEffect(() => {
    if (!showTooltip || !badgeRef.current) {
      setPos(null);
      return;
    }

    // measure and compute position after next paint
    const compute = () => {
      const badgeRect = badgeRef.current!.getBoundingClientRect();
      const tooltipEl = tooltipRef.current;

      // Estimate a tooltip width/height if not yet rendered
      const estimatedWidth = tooltipEl ? tooltipEl.offsetWidth : 200;
      const estimatedHeight = tooltipEl ? tooltipEl.offsetHeight : 40;

      // Prefer showing above the badge; if not enough space, show below
      let top = badgeRect.top - estimatedHeight - 8; // 8px gap
      if (top < 8) {
        top = badgeRect.bottom + 8;
      }

      let left = badgeRect.left + badgeRect.width / 2 - estimatedWidth / 2;
      // clamp to viewport
      const minLeft = 8;
      const maxLeft = (window.innerWidth || document.documentElement.clientWidth) - estimatedWidth - 8;
      if (left < minLeft) left = minLeft;
      if (left > maxLeft) left = maxLeft;

      setPos({ left, top });

      // If tooltip element exists we can refine measurements
      if (!tooltipEl) return;
      const refine = () => {
        const tRect = tooltipEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const maxTop = viewportHeight - tRect.height - 8;
        let refinedTop = badgeRect.top - tRect.height - 8;
        if (refinedTop < 8) refinedTop = badgeRect.bottom + 8;
        // ensure tooltip doesn't overflow past bottom of viewport
        if (refinedTop > maxTop) refinedTop = Math.max(8, maxTop);
        let refinedLeft = badgeRect.left + badgeRect.width / 2 - tRect.width / 2;
        const refinedMaxLeft = (window.innerWidth || document.documentElement.clientWidth) - tRect.width - 8;
        if (refinedLeft < 8) refinedLeft = 8;
        if (refinedLeft > refinedMaxLeft) refinedLeft = refinedMaxLeft;
        // Only update if changed to avoid rerenders
        setPos((prev) => {
          if (!prev) return { left: refinedLeft, top: refinedTop };
          if (Math.abs(prev.left - refinedLeft) > 1 || Math.abs(prev.top - refinedTop) > 1) {
            return { left: refinedLeft, top: refinedTop };
          }
          return prev;
        });

        // Debug: check which element is at the tooltip center (useful when tooltip appears behind something)
        try {
          const checkX = Math.round(refinedLeft + (tRect.width / 2));
          const checkY = Math.round(refinedTop + (tRect.height / 2));
          const topEl = document.elementFromPoint(checkX, checkY) as HTMLElement | null;
          if (topEl) {
            console.debug('[SkillBadge] tooltip top element:', {
              at: { x: checkX, y: checkY },
              tag: topEl.tagName,
              id: topEl.id,
              classes: topEl.className,
              zIndex: window.getComputedStyle(topEl).zIndex,
            });
          }
        } catch (err) {
          // ignore in non-browser contexts
        }
      };

      // run refine on next animation frame so the tooltip DOM exists
      requestAnimationFrame(refine);
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

  
  const onTooltipEnter = () => showImmediately();
  const onTooltipLeave = () => hideWithDelay();

  
  const onBadgeEnter = () => showImmediately();
  const onBadgeLeave = () => hideWithDelay();

  
  const canUseDOM = typeof document !== 'undefined' && !!document.body;

  
  const tooltipContainerRef = React.useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!canUseDOM) return;
    if (!showTooltip) return;
    
    const container = document.createElement('div');
    container.setAttribute('style', 'position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:2147483647;');
    document.body.appendChild(container);
    tooltipContainerRef.current = container;

    return () => {
      if (tooltipContainerRef.current && tooltipContainerRef.current.parentNode) {
        tooltipContainerRef.current.parentNode.removeChild(tooltipContainerRef.current);
      }
      tooltipContainerRef.current = null;
    };
  }, [canUseDOM, showTooltip]);

  const tooltipNode = (
    <div
      ref={tooltipRef}
      onMouseEnter={onTooltipEnter}
      onMouseLeave={onTooltipLeave}
      className="shadow-xl border bg-white backdrop-blur-sm rounded-lg px-3 py-2 text-xs font-medium text-gray-700 leading-tight"
      style={{
        position: 'fixed',
        left: pos ? `${pos.left}px` : '-9999px',
        top: pos ? `${pos.top}px` : '-9999px',
        zIndex: 99999999999, 
        pointerEvents: 'auto',
        willChange: 'transform, opacity',
        transform: 'translateZ(9999px)',
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
        role="button"
        tabIndex={0}
        onMouseEnter={onBadgeEnter}
        onMouseLeave={onBadgeLeave}
        onClick={() => setShowTooltip((s) => !s)}
        className={`inline-flex items-center justify-center rounded-md border-2 border-white outline-2 outline-pink-500 px-2 py-0.5 text-xs w-fit whitespace-nowrap shrink-0 gap-1 hover:scale-105 transition-transform duration-200 cursor-help font-medium ${category.bgColor} ${category.color} ${category.borderColor} ${className}`}
      >
        {skill}
      </span>


      {canUseDOM && showTooltip && tooltipContainerRef.current ? createPortal(tooltipNode, tooltipContainerRef.current) : null}
    </div>
  );
}