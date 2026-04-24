'use client';

import React from 'react';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// 模版样式映射
const ctaTemplates = {
  default: {
    section: "py-20 bg-muted",
    heading: "text-3xl md:text-4xl lg:text-5xl font-bold mb-8 font-poppins text-foreground",
    summary: "text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed",
  },
  minimal: {
    section: "py-16 bg-background border-t border-border",
    heading: "text-3xl font-bold mb-8 text-center text-foreground",
    summary: "text-lg text-muted-foreground mb-10 max-w-2xl mx-auto",
  },
  centered: {
    section: "py-24 bg-primary text-primary-foreground",
    heading: "text-4xl md:text-5xl font-bold mb-8 text-center text-primary-foreground",
    summary: "text-xl text-primary-foreground/90 mb-12 max-w-3xl mx-auto text-center",
  },
};

export const CTA = ({ node, selectedNodeId }: ComponentProps) => {
  const {
    heading,
    title,
    summary,
    subtitle,
    detail,
    link = '/',
    linkText = 'Get Started',
    secondaryLink,
    secondaryLinkText,
    comingSoon = false,
    className,
  } = node.props || {};

  const templateName = node.template || 'default';
  const template = ctaTemplates[templateName as keyof typeof ctaTemplates] || ctaTemplates.default;
  const isSelected = selectedNodeId === node.id;

  const displayHeading = heading || title;
  const displaySummary = summary || subtitle;

  return (
    <section
      id={node.id}
      data-node-id={node.id}
      className={cn(template.section, 'scroll-mt-20', className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200')}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {comingSoon && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold">Coming Soon</span>
            </div>
          )}

          {node.props?.icon && (
            <div className="flex justify-center mb-8">
              <span className="text-4xl md:text-6xl animate-bounce-slow" role="img" aria-label="icon">
                {node.props.icon}
              </span>
            </div>
          )}

          {displayHeading && (
            <h2 className={cn(template.heading)}>
              {displayHeading}
            </h2>
          )}

          {displaySummary && (
            <p className={cn(template.summary)}>
              {displaySummary}
            </p>
          )}

          {detail && (
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              {detail}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {comingSoon ? (
              <Button
                size="lg"
                disabled
                className="bg-muted text-muted-foreground px-6 sm:px-10 py-6 text-lg sm:text-xl font-semibold rounded-xl shadow-lg cursor-not-allowed opacity-60 w-full sm:w-auto max-w-full truncate"
              >
                {linkText}
              </Button>
            ) : (
              <>
                <Link href={link} className="w-full sm:w-auto max-w-full block">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-10 py-6 text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto max-w-full truncate cursor-pointer"
                  >
                    <span className="truncate w-full block">{linkText}</span>
                  </Button>
                </Link>
                {secondaryLink && secondaryLinkText && (
                  <Link href={secondaryLink} className="w-full sm:w-auto max-w-full block">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-background hover:bg-muted text-foreground px-6 sm:px-10 py-6 text-lg sm:text-xl font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto max-w-full truncate cursor-pointer"
                    >
                      <span className="truncate w-full block">{secondaryLinkText}</span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
