'use client';

import React from 'react';
import { ComponentProps, getChildrenArray } from '../registry';
import { cn } from '@/lib/utils';

// 模版样式映射
const stepTemplates = {
  default: {
    section: "py-20 bg-background",
    heading: "text-3xl md:text-4xl font-bold mb-12 text-center font-poppins text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
    card: "relative z-10 bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-border hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between h-full min-h-[280px]",
  },
  horizontal: {
    section: "py-16 bg-muted",
    heading: "text-3xl md:text-4xl font-bold mb-12 text-center text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8",
    card: "bg-card rounded-xl p-8 border-l-4 border-primary shadow-md hover:shadow-lg transition-all",
  },
  minimal: {
    section: "py-20 bg-background",
    heading: "text-4xl font-bold mb-16 text-center text-foreground",
    grid: "flex flex-col md:flex-row gap-8 justify-center",
    card: "bg-transparent border-b-2 border-border pb-8 text-center max-w-xs",
  },
  process: {
    section: "py-24 bg-background text-foreground",
    heading: "text-4xl md:text-5xl font-bold mb-4 text-center text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-4 gap-4",
    card: "bg-card/40 rounded-xl p-8 border border-border transition-all h-full",
  },
  "process-3-cols": {
    section: "py-24 bg-background text-foreground",
    heading: "text-4xl md:text-5xl font-bold mb-4 text-center text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8",
    card: "bg-card/40 rounded-xl p-8 border border-border transition-all h-full",
  }
};

export const HowItWorks = ({ node, renderChildren, selectedNodeId }: ComponentProps) => {
  const { heading, title, subtitle, summary, className } = node.props || {};
  const templateName = node.template || 'default';
  const template = stepTemplates[templateName as keyof typeof stepTemplates] || stepTemplates.default;
  const isSelected = selectedNodeId === node.id;
  const isProcess = templateName === 'process' || templateName === 'process-3-cols';

  // Calculate dynamic grid columns based on children count
  const children = getChildrenArray(node.children);
  const childrenCount = children.length;
  let dynamicGridClass = template.grid;

  if (childrenCount === 3) {
    // 3 items: use 3 columns on medium screens
    dynamicGridClass = "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8";
  } else if (childrenCount === 4) {
    // 4 items: use 4 columns on large screens
    dynamicGridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6";
  } else if (childrenCount === 2) {
    // 2 items: use 2 columns
    dynamicGridClass = "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8";
  }

  return (
    <section
      id={node.id}
      data-node-id={node.id}
      className={cn(template.section, 'scroll-mt-20', className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200')}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {(heading || title) && (
            <h2 className={cn(template.heading)}>
              {heading || title}
            </h2>
          )}
          {(subtitle || summary) && (
            <p className="text-lg text-muted-foreground text-center mb-20 max-w-3xl mx-auto">
              {subtitle || summary}
            </p>
          )}



          <div className={cn(dynamicGridClass)}>
            {renderChildren(node.children)}
          </div>
        </div>
      </div>
    </section>
  );
};

export const StepItem = ({ node, selectedNodeId }: ComponentProps) => {
  const { step, stepNumber, title, description, icon, list, isActive, className } = node.props || {};
  const templateName = node.template || 'default';
  const template = stepTemplates[templateName as keyof typeof stepTemplates] || stepTemplates.default;
  const isSelected = selectedNodeId === node.id;
  const isProcess = templateName === 'process' || templateName === 'process-3-cols';

  const stepNum = step || stepNumber || '';

  // Process template specific styles
  if (isProcess) {
    // Local state for hover effect if not strictly controlled by parent props.
    // However, props are immutable here. We can use a local state wrapper or just useState.
    // But we can't use useState inside a conditional return easily if hooks order changes.
    // Ideally StepItem should be a full component. It is. But we are inside `if (isProcess)`.
    // We should move hooks to top level.
    // Let's refactor StepItem to put hooks at top.

    // Actually, I can't easily move hooks up without changing the whole function structure significantly 
    // or adding a separate sub-component.
    // Let's assume we can add hooks at the top level of StepItem component.
    // Wait, I am editing `StepItem`.

    return <StepItemProcessVariant node={node} selectedNodeId={selectedNodeId} renderChildren={() => null} />;
  }

  // Default template
  return (
    <div
      data-node-id={node.id}
      className={cn(template.card, className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20')}
    >
      <div>
        {icon && (
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{icon}</span>
          </div>
        )}

        {stepNum && (
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
            {stepNum}
          </div>
        )}

        {title && (
          <h3 className="text-lg font-semibold mb-3 text-foreground">
            {title}
          </h3>
        )}
      </div>

      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

// Internal component for Process Variant to safely use hooks
const StepItemProcessVariant = ({ node, selectedNodeId }: ComponentProps) => {
  const { step, stepNumber, title, description, list, isActive, className } = node.props || {};
  const [isHovered, setIsHovered] = React.useState(false);
  const isSelected = selectedNodeId === node.id;
  const stepNum = step || stepNumber || '';

  // Effective active state is either prop-based or hover-based
  const effectiveActive = isActive || isHovered;

  return (
    <div
      data-node-id={node.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "rounded-xl p-6 border transition-all duration-300 h-full cursor-default",
        effectiveActive
          ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
          : "bg-card/40 text-foreground hover:bg-muted/50 border-border hover:border-primary/50",
        className,
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Number Circle - Left Aligned */}
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors flex-shrink-0 mt-1",
          effectiveActive
            ? "bg-background text-primary"
            : "border border-muted-foreground/30 text-muted-foreground"
        )}>
          {stepNum}
        </div>

        {/* Content - Right Side */}
        <div className="flex-1">
          <h3 className={cn("text-xl font-bold mb-3 transition-colors", effectiveActive ? "text-primary-foreground" : "text-foreground")}>
            {title}
          </h3>

          <p className={cn("text-base leading-relaxed mb-4 transition-colors", effectiveActive ? "text-primary-foreground/90" : "text-muted-foreground")}>
            {description}
          </p>

          {list && list.length > 0 && (
            <ul className="mt-4 space-y-2">
              {list.map((item: string, i: number) => (
                <li key={i} className={cn("flex items-start gap-2 text-sm transition-colors", effectiveActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  <span className={cn("mt-1.5 w-1 h-1 rounded-full flex-shrink-0 transition-colors", effectiveActive ? "bg-primary-foreground/60" : "bg-muted-foreground/40")} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
