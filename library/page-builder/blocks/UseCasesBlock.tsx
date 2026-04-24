'use client';

import React from 'react';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';

// 模版样式映射
const useCaseTemplates = {
  default: {
    section: "py-20 bg-background",
    heading: "text-3xl md:text-4xl font-bold mb-12 text-center font-poppins text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  },
  minimal: {
    section: "py-16 bg-background",
    heading: "text-3xl font-bold mb-10 text-center text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-2 gap-8",
  },
  cards: {
    section: "py-20 bg-muted",
    heading: "text-4xl font-bold mb-16 text-center text-foreground",
    grid: "grid grid-cols-1 md:grid-cols-3 gap-8",
  },
};

export const UseCases = ({ node, renderChildren, selectedNodeId }: ComponentProps) => {
  const { heading, title, subtitle, summary, className } = node.props || {};
  const templateName = node.template || 'default';
  const template = useCaseTemplates[templateName as keyof typeof useCaseTemplates] || useCaseTemplates.default;
  const isSelected = selectedNodeId === node.id;

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
            <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
              {subtitle || summary}
            </p>
          )}

          <div className={cn(template.grid)}>
            {renderChildren(node.children)}
          </div>
        </div>
      </div>
    </section>
  );
};

export const UseCaseCard = ({ node, selectedNodeId }: ComponentProps) => {
  const { title, description, icon, image, imageBg, className } = node.props || {};
  const isSelected = selectedNodeId === node.id;

  return (
    <div
      data-node-id={node.id}
      className={cn(
        "bg-transparent rounded-2xl transition-all duration-300 group",
        className,
        isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20'
      )}
    >
      {/* Image Container */}
      <div
        className={cn(
          "rounded-2xl overflow-hidden mb-6 aspect-[4/3] flex items-center justify-center relative",
          imageBg || "bg-primary/5"
        )}
      >
        {image ? (
          <img
            src={image}
            alt={title || "Use case"}
            className="w-[85%] h-auto object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          icon && <div className="text-6xl text-primary/80">{icon}</div>
        )}
      </div>

      {/* Content */}
      <div className="text-center px-2">
        {title && (
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-muted-foreground leading-relaxed text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
