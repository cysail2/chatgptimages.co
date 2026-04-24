'use client';

import React, { useState } from 'react';
import { ComponentProps } from '../registry';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

// 模版样式映射
const faqTemplates = {
  default: {
    section: "py-20 bg-background",
    heading: "text-3xl md:text-4xl font-bold mb-12 text-center font-poppins text-foreground",
    container: "max-w-4xl mx-auto space-y-4",
    item: "bg-card rounded-xl border border-border overflow-hidden",
  },
  minimal: {
    section: "py-16 bg-muted",
    heading: "text-3xl font-bold mb-10 text-center text-foreground",
    container: "max-w-3xl mx-auto space-y-3",
    item: "bg-card rounded-lg border border-border shadow-sm overflow-hidden",
  },
  cards: {
    section: "py-20 bg-background",
    heading: "text-4xl font-bold mb-16 text-center text-foreground",
    container: "max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6",
    item: "bg-card rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full",
  },
};

interface FAQItemData {
  id?: string;
  question: string;
  answer: string;
  template?: string;
}

const FAQItemUI = ({
  item,
  isSelected,
  templateName: propTemplateName,
  defaultOpen = false
}: {
  item: FAQItemData;
  isSelected?: boolean;
  templateName?: string;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const templateName = propTemplateName || item.template || 'default';
  const template = faqTemplates[templateName as keyof typeof faqTemplates] || faqTemplates.default;

  // 如果是 cards 模版，使用非折叠的静态展示方式
  if (templateName === 'cards') {
    return (
      <div
        data-node-id={item.id}
        className={cn(template.item, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20')}
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {item.question}
        </h3>
        <div className="text-muted-foreground leading-relaxed">
          {item.answer}
        </div>
      </div>
    );
  }

  return (
    <div
      data-node-id={item.id}
      className={cn(template.item, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200 scroll-mt-20')}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/5 transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-foreground pr-4">
          {item.question}
        </h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
        )}
      </button>

      <div className={cn("px-6 pb-4 transition-all duration-300 overflow-hidden", isOpen ? "h-auto opacity-100 visible" : "h-0 opacity-0 invisible pb-0")}>
        <div className="text-muted-foreground leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  );
};

export const FAQList = ({ node, renderChildren, selectedNodeId }: ComponentProps) => {
  const { heading, title, subtitle, summary, className, items } = node.props || {};
  const templateName = node.template || 'default';
  const template = faqTemplates[templateName as keyof typeof faqTemplates] || faqTemplates.default;
  const isSelected = selectedNodeId === node.id;

  return (
    <section
      id={node.id}
      data-node-id={node.id}
      className={cn(template.section, 'scroll-mt-20', className, isSelected && 'ring-2 ring-primary ring-offset-2 transition-all duration-200')}
    >
      <div className="container mx-auto px-6">
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

        <div className={cn(template.container)}>
          {/* Support both direct items in props AND children in the tree */}
          {items && Array.isArray(items) ? (
            items.map((item: any, idx: number) => (
              <FAQItemUI
                key={idx}
                item={item}
                templateName={templateName}
                defaultOpen={idx === 0}
              />
            ))
          ) : (
            renderChildren(node.children)
          )}
        </div>
      </div>
    </section>
  );
};

export const FAQItem = ({ node, selectedNodeId }: ComponentProps) => {
  const { question, answer } = node.props || {};
  const templateName = node.template || 'default';
  const isSelected = selectedNodeId === node.id;

  return (
    <FAQItemUI
      item={{ id: node.id, question, answer }}
      isSelected={isSelected}
      templateName={templateName}
    />
  );
};
