
import React, { isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/library/lib/utils';

interface MarkdownRendererProps {
    content: string;
    className?: string;
    // Special styling for the first few paragraphs as seen in MarkdownBlock
    featuredStyles?: boolean;
}

const getNodeText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getNodeText).join('');
    if (isValidElement<{ children?: React.ReactNode }>(node)) return getNodeText(node.props.children);
    return '';
};

export const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-一-龥]+/g, '');

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    className,
    featuredStyles = false
}) => {
    let paragraphIndex = 0;

    return (
        <div className={cn("prose prose-xl lg:prose-2xl max-w-none dark:prose-invert", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-center font-poppins font-normal text-xl md:text-2xl text-foreground mb-2 mt-0">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => {
                        const title = getNodeText(children);
                        return (
                            <h2 id={slugify(title)} className="font-poppins font-medium text-lg md:text-xl text-foreground mt-8 scroll-mt-28">
                                {children}
                            </h2>
                        );
                    },
                    h3: ({ children }) => {
                        const title = getNodeText(children);
                        return (
                            <h3 id={slugify(title)} className="scroll-mt-28">
                                {children}
                            </h3>
                        );
                    },
                    p: ({ children }) => {
                        if (!featuredStyles) {
                            return <p className="text-base md:text-lg text-muted-foreground mb-4 last:mb-0">{children}</p>;
                        }

                        paragraphIndex += 1;
                        if (paragraphIndex === 1) {
                            return <p className="text-center text-base text-muted-foreground mb-10">{children}</p>;
                        }
                        if (paragraphIndex === 2) {
                            return <p className="lead text-lg md:text-xl mb-8">{children}</p>;
                        }
                        return <p className="text-base md:text-lg text-muted-foreground mb-4 last:mb-0">{children}</p>;
                    },
                    ul: ({ children }) => (
                        <ul className="my-4 list-disc space-y-2 pl-6 text-base md:text-lg text-muted-foreground">
                            {children}
                        </ul>
                    ),
                    li: ({ children }) => <li className="pl-1">{children}</li>,
                    a: ({ children, href }) => (
                        <a href={href} className="font-medium text-primary underline decoration-2 underline-offset-4 hover:text-primary/80">
                            {children}
                        </a>
                    ),
                    img: ({ src, alt }) => (
                        <img
                            src={src || ""}
                            alt={alt || ""}
                            className="mx-auto my-8 block h-auto max-w-full rounded-2xl"
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
