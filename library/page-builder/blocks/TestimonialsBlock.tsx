'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';

// 模版样式映射
const testimonialTemplates = {
  default: {
    section: 'py-16 md:py-20 bg-background',
    heading: 'text-3xl md:text-4xl font-bold text-center text-foreground',
    summary: 'mt-4 text-base md:text-lg text-muted-foreground text-center max-w-3xl mx-auto',
    grid: 'mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    card: 'bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300',
  },
  minimal: {
    section: 'py-16 bg-background',
    heading: 'text-3xl md:text-4xl font-bold text-center text-foreground',
    summary: 'mt-4 text-base text-muted-foreground text-center max-w-2xl mx-auto',
    grid: 'mt-10 grid grid-cols-1 md:grid-cols-3 gap-6',
    card: 'rounded-xl border border-border p-6 bg-transparent',
  },
  centered: {
    section: 'py-20 bg-background',
    heading: 'text-4xl md:text-5xl font-bold text-center text-foreground',
    summary: 'mt-4 text-lg text-muted-foreground text-center max-w-3xl mx-auto',
    grid: 'mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    card: 'bg-card rounded-2xl border border-border p-7 shadow-lg',
  },
  cards: {
    section: 'py-20 bg-muted/40',
    heading: 'text-4xl md:text-5xl font-bold text-center text-foreground',
    summary: 'mt-4 text-lg text-muted-foreground text-center max-w-3xl mx-auto',
    grid: 'mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    card: 'bg-card rounded-2xl border border-border p-6 shadow-xl hover:-translate-y-0.5 transition-all duration-300',
  },
  horizontal: {
    section: 'py-16 bg-background',
    heading: 'text-3xl md:text-4xl font-bold text-center text-foreground',
    summary: 'mt-4 text-base text-muted-foreground text-center max-w-3xl mx-auto',
    grid: 'mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6',
    card: 'bg-card rounded-xl border border-border p-6 shadow-sm',
  },
};

export const Testimonials = ({ node, renderChildren, selectedNodeId }: ComponentProps) => {
  const { heading, title, summary, subtitle, className } = node.props || {};
  const templateName = node.template || 'default';
  const template = testimonialTemplates[templateName as keyof typeof testimonialTemplates] || testimonialTemplates.default;
  const isSelected = selectedNodeId === node.id;

  return (
    <section
      data-node-id={node.id}
      className={cn(template.section, className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20')}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {(heading || title) && (
            <h2 className={cn(template.heading)}>
              {heading || title}
            </h2>
          )}
          {(summary || subtitle) && (
            <p className={cn(template.summary)}>
              {summary || subtitle}
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

const getAvatarText = (name?: string, avatar?: string) => {
  if (avatar) return avatar;
  if (!name) return '';
  return name.trim().charAt(0).toUpperCase();
};

export const TestimonialCard = ({ node, selectedNodeId }: ComponentProps) => {
  const { name, role, content, rating = 5, avatar, avatarUrl, className } = node.props || {};
  const templateName = node.template || 'default';
  const template = testimonialTemplates[templateName as keyof typeof testimonialTemplates] || testimonialTemplates.default;
  const isSelected = selectedNodeId === node.id;

  const ratingValue = Number.isFinite(Number(rating)) ? Number(rating) : 0;
  const safeRating = Math.max(0, Math.min(5, Math.round(ratingValue)));
  const avatarText = getAvatarText(name, avatar);

  return (
    <div
      data-node-id={node.id}
      className={cn(
        template.card,
        className,
        isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground overflow-hidden">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name ? `${name} avatar` : 'User avatar'}
              className="h-full w-full object-cover"
            />
          ) : (
            avatarText || '?'
          )}
        </div>
        <div>
          {name && <div className="text-sm font-semibold text-foreground">{name}</div>}
          {role && <div className="text-xs text-muted-foreground">{role}</div>}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const isActive = index < safeRating;
          return (
            <Star
              key={`star-${node.id}-${index}`}
              className={cn(
                'h-4 w-4',
                isActive ? 'text-amber-400 fill-current' : 'text-muted-foreground/40 fill-transparent'
              )}
            />
          );
        })}
      </div>

      {content && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {content}
        </p>
      )}
    </div>
  );
};
