import React from 'react';
import { ComponentType, ComponentNode } from '../../types/webpage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Import Business Blocks
import { HeroBlock } from './blocks/HeroBlock';
import { FeaturesList, FeatureCard } from './blocks/FeatureBlocks';
import { HowItWorks, StepItem } from './blocks/StepBlocks';
import { FAQList, FAQItem } from './blocks/FAQBlocks';
import { VideoCases } from './blocks/VideoCasesBlock';
import { UseCases, UseCaseCard } from './blocks/UseCasesBlock';
import { CTA } from './blocks/CTABlock';
import { Pricing } from './blocks/PricingBlock';
import { PricingV2 } from './blocks/PricingBlockV2';
import { Testimonials, TestimonialCard } from './blocks/TestimonialsBlock';
import { AudioExamples } from './blocks/AudioExamplesBlock';
import { VideoComponent } from './blocks/MediaBlocks';
import { MarkdownBlock } from './blocks/MarkdownBlock';

// ... (renderChildren logic is unchanged, just skipped in this replacement block for brevity if I could, but I must match exact target. 
// Actually I'll just replace the upper imports and the registry object at the bottom.
// But replace_file_content requires contiguous block. I'll replace the whole file or just the top and bottom.
// I will use multi_replace for safety if I need two chunks, or just replace the imports and then add to registry.

// Let's use multi_replace to be safe and clean.


// 渲染器需要使用的上下文，用于递归渲染子节点
type RenderChildren = (children?: ComponentNode['children']) => React.ReactNode;

/**
 * Safely convert children (array or map) to a flat array of ComponentNodes
 */
export const getChildrenArray = (children?: ComponentNode['children']): ComponentNode[] => {
  if (!children) return [];
  if (Array.isArray(children)) return children;
  return Object.entries(children).map(([key, node]) => ({
    ...node,
    id: node.id || key,
  } as ComponentNode));
};

export interface ComponentProps {
  node: ComponentNode;
  renderChildren: RenderChildren;
  selectedNodeId?: string | null;
}

// 基础容器组件
const Container = ({ node, renderChildren, selectedNodeId }: ComponentProps) => {
  const { className, style, ...rest } = node.props || {};
  const isSelected = selectedNodeId === node.id;
  return (
    <div
      id={node.id}
      data-node-id={node.id}
      className={cn('w-full', className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200')}
      style={style}
      {...rest}
    >
      {renderChildren(node.children)}
    </div>
  );
};

// 行布局组件
const Row = ({ node, renderChildren, selectedNodeId }: ComponentProps) => {
  const { className, gap = 'gap-4', alignItems = 'items-center', justifyContent = 'justify-start', ...rest } = node.props || {};
  const isSelected = selectedNodeId === node.id;
  return (
    <div
      data-node-id={node.id}
      className={cn('flex flex-row flex-wrap', gap, alignItems, justifyContent, className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20')}
      {...rest}
    >
      {renderChildren(node.children)}
    </div>
  );
};

// 列布局组件
const Col = ({ node, renderChildren }: ComponentProps) => {
  const { className, gap = 'gap-4', alignItems = 'items-stretch', justifyContent = 'justify-start', ...rest } = node.props || {};
  return (
    <div className={cn('flex flex-col', gap, alignItems, justifyContent, className)} {...rest}>
      {renderChildren(node.children)}
    </div>
  );
};

// 文本组件
const Text = ({ node }: ComponentProps) => {
  const { content, tag = 'p', className, ...rest } = node.props || {};
  const Tag = (typeof tag === 'string' ? tag : 'p') as React.ElementType;
  return (
    <Tag className={cn('text-foreground', className)} {...rest}>
      {content}
    </Tag>
  );
};

// HTML组件
const HtmlComponent = ({ node }: ComponentProps) => {
  const { content, className, ...rest } = node.props || {};
  return (
    <div
      className={cn(className)}
      dangerouslySetInnerHTML={{ __html: content }}
      {...rest}
    />
  );
};

// 按钮组件
const ButtonComponent = ({ node }: ComponentProps) => {
  const { label, variant = 'default', size = 'default', className, action, href, ...rest } = node.props || {};

  const handleClick = (e: React.MouseEvent) => {
    if (action === 'scrollToGenerator' || href === '#seedance-generator') {
      e.preventDefault();
      const element = document.getElementById('seedance-generator');
      if (element) {
        const offset = 80; // Navbar height offset
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if (href && !action) {
    return (
      <Button variant={variant} size={size} className={className} asChild {...rest}>
        <a href={href} onClick={handleClick}>
          {label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {label}
    </Button>
  );
};

// 图片组件
const ImageComponent = ({ node }: ComponentProps) => {
  const { src, alt = '', width = 500, height = 300, className, objectFit = 'cover', ...rest } = node.props || {};
  return (
    <div className={cn('relative overflow-hidden rounded-md', className)} style={{ width: rest.width || '100%', height: rest.height || 'auto' }}>
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover', objectFit)}
        {...rest}
      />
    </div>
  );
};

// 卡片组件 (shadcn/ui Card 封装)
const CardComponent = ({ node, renderChildren }: ComponentProps) => {
  const { className, title, description, footer, ...rest } = node.props || {};

  return (
    <Card className={cn(className)} {...rest}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={!title && !description ? "p-6" : ""}>
        {renderChildren(node.children)}
      </CardContent>
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

// 通用区块组件，带标题
const SectionBlock = ({ node, renderChildren, selectedNodeId }: ComponentProps) => {
  const { className, heading, subtitle, ...rest } = node.props || {};
  const isSelected = selectedNodeId === node.id;

  return (
    <section
      id={node.id}
      data-node-id={node.id}
      className={cn('w-full', className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200')}
      {...rest}
    >
      <div className="container mx-auto px-4">
        {(heading || subtitle) && (
          <div className="mb-12 text-center max-w-3xl mx-auto">
            {heading && <h2 className="text-3xl font-bold tracking-tight mb-4">{heading}</h2>}
            {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {renderChildren(node.children)}
      </div>
    </section>
  );
};

export const ComponentRegistry: Record<ComponentType, React.FC<ComponentProps>> = {
  container: Container,
  row: Row,
  col: Col,
  text: Text,
  html: HtmlComponent,
  button: ButtonComponent,
  image: ImageComponent,
  card: CardComponent,

  // Business Blocks
  'hero': HeroBlock,
  'hero-with-generator': HeroBlock,
  'features-list': FeaturesList,
  'feature-card': FeatureCard,
  'how-it-works': HowItWorks,
  'step-item': StepItem,
  'faq-list': FAQList,
  'faq-item': FAQItem,
  'pricing': Pricing,
  'pricing-v2': PricingV2,
  'cta': CTA,
  'video-cases': VideoCases,
  'use-cases': UseCases,
  'use-case-card': UseCaseCard,
  'testimonials': Testimonials,
  'testimonial-card': TestimonialCard,
  'audio-examples': AudioExamples,
  'video': VideoComponent,
  'markdown': MarkdownBlock,
  'content-section': SectionBlock,
  'slot': () => null,
};
