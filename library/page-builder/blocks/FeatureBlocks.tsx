'use client';

import React from 'react';
import { ComponentProps, getChildrenArray } from '../registry';
import { cn } from '@/lib/utils';

// 模版样式映射
const featureTemplates = {
  default: {
    section: "py-12 md:py-20 bg-background",
    heading: "text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center font-poppins text-foreground px-4",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8",
    card: "bg-card rounded-xl md:rounded-2xl p-5 md:p-7 shadow-lg border border-border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
  },
  minimal: {
    section: "py-16 bg-background",
    heading: "text-3xl md:text-4xl font-bold mb-12 text-center text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8",
    card: "bg-muted rounded-lg p-6 border border-border hover:border-primary/50 transition-colors",
  },
  cards: {
    section: "py-20 bg-background",
    heading: "text-4xl md:text-5xl font-bold mb-16 text-center text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    card: "bg-card rounded-2xl p-8 shadow-xl border border-border hover:shadow-2xl transition-all duration-300",
  },
  grid: {
    section: "py-12 md:py-20 bg-background",
    heading: "text-2xl md:text-3xl lg:text-4xl font-bold mb-8 md:mb-12 text-center font-poppins text-foreground px-4",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8",
    card: "bg-card rounded-xl md:rounded-2xl p-5 md:p-7 shadow-lg border border-border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300",
  },
};

export const FeaturesList = ({ node, renderChildren, selectedNodeId }: ComponentProps) => {
  const { heading, title, subtitle, className } = node.props || {};
  const templateName = node.template || 'default';
  const template = featureTemplates[templateName as keyof typeof featureTemplates] || featureTemplates.default;
  const isSelected = selectedNodeId === node.id;

  // Calculate dynamic grid columns based on children count
  const children = getChildrenArray(node.children);
  const childrenCount = children.length;
  let dynamicGridClass = template.grid;

  if (childrenCount === 3) {
    // 3 items: use 3 columns on medium screens
    dynamicGridClass = "grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8";
  } else if (childrenCount === 4) {
    // 4 items: use 2x2 grid (max 3 per row, so 4 items = 2 rows of 2)
    dynamicGridClass = "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8";
  } else if (childrenCount === 2) {
    // 2 items: use 2 columns
    dynamicGridClass = "grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8";
  }

  return (
    <section
      id={node.id}
      data-node-id={node.id}
      className={cn(template.section, 'scroll-mt-20', className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200')}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {(heading || title) && (
            <h2 className={cn(template.heading)}>
              {heading || title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              {subtitle}
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

export const FeatureCard = ({ node, selectedNodeId }: ComponentProps) => {
  const { title, description, icon, className } = node.props || {};
  const templateName = node.template || 'default';
  const template = featureTemplates[templateName as keyof typeof featureTemplates] || featureTemplates.default;
  const isSelected = selectedNodeId === node.id;

  return (
    <div
      data-node-id={node.id}
      className={cn(template.card, className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20')}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="text-3xl md:text-4xl flex-shrink-0 bg-primary/10 text-primary rounded-xl p-3">
            {icon}
          </div>
        )}
        <div className="flex-1 space-y-2">
          {title && (
            <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
