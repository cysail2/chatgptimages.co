import { SiteConfig } from "@/types/siteConfig";
import { ComponentNode, PageSchema } from "@/types/webpage";
import { getRequiredSiteConfig } from "./site-config";

interface SoftwareAppSchemaProps {
    name: string;
    description: string;
    applicationCategory: string;
    operatingSystem: string;
    url: string;
    image?: string;
    featureList?: string[];
    offers?: {
        price: string;
        currency: string;
    };
    aggregateRating?: {
        ratingValue: string;
        ratingCount: string;
    };
}

export function generateSoftwareAppSchema(props: SoftwareAppSchemaProps) {
    return {
        "@type": "SoftwareApplication",
        "name": props.name,
        "description": props.description,
        "applicationCategory": props.applicationCategory,
        "operatingSystem": props.operatingSystem,
        "url": props.url,
        "image": props.image,
        "featureList": props.featureList,
        "offers": {
            "@type": "Offer",
            "price": props.offers?.price || "0",
            "priceCurrency": props.offers?.currency || "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": props.aggregateRating?.ratingValue || "4.8",
            "ratingCount": props.aggregateRating?.ratingCount || "1000"
        }
    };
}

export function generateWebPageSchema(name: string, description: string, url: string) {
    return {
        "@type": "WebPage",
        "name": name,
        "description": description,
        "url": url
    };
}

export function generateOrganizationSchema(siteConfig: SiteConfig) {
    return {
        "@type": "Organization",
        "name": siteConfig.site.name,
        "url": siteConfig.site.url,
        "logo": siteConfig.site.logo || `${siteConfig.site.url}/logo.png`,
    };
}

// --- Extraction Helpers ---

function extractChildren(node: ComponentNode | Record<string, any>): ComponentNode[] {
    if (!node) return [];

    // If it's a ComponentNode with children array
    if ('type' in node && Array.isArray(node.children)) {
        return node.children;
    }

    // If it's a ComponentNode with children map
    if ('type' in node && typeof node.children === 'object' && node.children !== null) {
        return Object.values(node.children as Record<string, any>).map(c => ({
            ...c,
            // maintain normalized props if needed, but for extraction we just need props/children
        })) as ComponentNode[];
    }

    // If the node itself is a children map (Root map case) like in simplified JSON
    if (!('type' in node) && typeof node === 'object') {
        return Object.values(node).map(c => ({
            ...c
        })) as ComponentNode[];
    }

    return [];
}

function traverseAndFind(
    node: ComponentNode | Record<string, any>,
    type: string,
    results: ComponentNode[] = []
): ComponentNode[] {
    // Check current node
    if ('type' in node && node.type === type) {
        results.push(node as ComponentNode);
    }

    // Traverse children
    const children = extractChildren(node);
    for (const child of children) {
        traverseAndFind(child, type, results);
    }

    return results;
}

function extractFAQData(root: ComponentNode | Record<string, any>) {
    const startNode = 'type' in root ? root : { children: root } as any;
    const faqLists = traverseAndFind(startNode, 'faq-list');
    const faqs: { question: string; answer: string }[] = [];

    for (const list of faqLists) {
        // 1. Check for 'items' property (new concise format)
        // Props are merged into root in PageRenderer, so we check both places for robustness
        const itemsProp = list.items || (list.props && list.props.items);
        if (Array.isArray(itemsProp)) {
            for (const item of itemsProp) {
                if (item.question && item.answer) {
                    faqs.push({
                        question: item.question,
                        answer: item.answer
                    });
                }
            }
        }

        // 2. Fallback to child nodes (old tree format)
        const items = extractChildren(list);
        for (const item of items) {
            if (item.type === 'faq-item') {
                // Check both root properties and props object
                const q = item.question || (item.props && item.props.question);
                const a = item.answer || (item.props && item.props.answer);
                if (q && a) {
                    faqs.push({
                        question: q,
                        answer: a
                    });
                }
            }
        }
    }
    return faqs;
}

function extractHowToData(root: ComponentNode | Record<string, any>) {
    const startNode = 'type' in root ? root : { children: root } as any;
    // Find nodes by type OR ID (for slots)
    const howToLists = traverseAndFind(startNode, 'how-it-works');

    // Also look for nodes with id 'how-it-works' if they were missed (slots)
    if (!howToLists.some(n => n.id === 'how-it-works')) {
        const slots = Object.values(startNode.children || startNode) as any[];
        const match = slots.find(s => s.id === 'how-it-works');
        if (match) howToLists.push(match);
    }

    const steps: { name: string; text: string; image?: string }[] = [];

    for (const list of howToLists) {
        // 1. Check for 'items' property
        const itemsProp = list.items || (list.props && list.props.items);
        if (Array.isArray(itemsProp)) {
            for (const item of itemsProp) {
                if (item.title || item.description) {
                    steps.push({
                        name: item.title || `Step ${steps.length + 1}`,
                        text: item.description || '',
                        image: item.image
                    });
                }
            }
        }

        // 2. Check for child nodes
        const items = extractChildren(list);
        for (const item of items) {
            if (item.type === 'step-item') {
                const title = item.title || (item.props && item.props.title);
                const desc = item.description || (item.props && item.props.description);
                const img = item.image || (item.props && item.props.image);
                if (title || desc) {
                    steps.push({
                        name: title || `Step ${steps.length + 1}`,
                        text: desc || '',
                        image: img
                    });
                }
            }
        }
    }
    return steps;
}

// --- Page Type Definitions ---

/**
 * pageType controls which schema types are generated:
 *
 * "product"     → SoftwareApplication + WebPage + Org + FAQ (default for most pages)
 * "review"      → Review (with itemReviewed SoftwareApp) + WebPage + Org + FAQ
 * "article"     → Article + WebPage + Org + FAQ  (for comparison/vs pages)
 * "tutorial"    → HowTo + WebPage + Org + FAQ
 * "pricing"     → WebPage + Org + FAQ (no SoftwareApp, avoids offer confusion)
 * "blog"        → BlogPosting + WebPage + Org
 */
export type PageType = "product" | "review" | "article" | "tutorial" | "pricing" | "blog";

// --- Main Generator ---

export async function generatePageStructuredData(pageSchema: PageSchema, providedSiteConfig?: SiteConfig) {
    const siteConfig = providedSiteConfig || await getRequiredSiteConfig<SiteConfig>("site");
    const baseUrl = siteConfig.site.url;
    const canonicalUrl = pageSchema.metadata.canonical
        ? (pageSchema.metadata.canonical.startsWith('http') ? pageSchema.metadata.canonical : `${baseUrl}${pageSchema.metadata.canonical}`)
        : `${baseUrl}/${pageSchema.id}`;

    const pageType: PageType = (pageSchema as any).pageType || "product";
    const schemaData = (pageSchema as any).schema || {};
    const graph: any[] = [];

    // 1. WebPage (always)
    graph.push(generateWebPageSchema(
        pageSchema.metadata.title,
        pageSchema.metadata.description,
        canonicalUrl
    ));

    // 2. Organization (always)
    graph.push(generateOrganizationSchema(siteConfig));

    // 3. Type-specific primary schema
    const productName = (pageSchema.id !== 'home' && pageSchema.name)
        ? pageSchema.name
        : siteConfig.site.name;

    if (pageType === "product" && siteConfig.productFeatures && siteConfig.productFeatures.length > 0) {
        graph.push(generateSoftwareAppSchema({
            name: productName,
            description: pageSchema.metadata.description || siteConfig.site.description || '',
            applicationCategory: schemaData.applicationCategory || "MultimediaApplication",
            operatingSystem: "Web",
            url: pageSchema.id === 'home' ? baseUrl : canonicalUrl,
            image: siteConfig.site.logo ? `${baseUrl}${siteConfig.site.logo}` : undefined,
            featureList: siteConfig.productFeatures,
            offers: schemaData.offers,
            aggregateRating: schemaData.aggregateRating,
        }));
    }

    if (pageType === "review") {
        const ratingValue = schemaData.ratingValue || "4.8";
        const ratingCount = schemaData.ratingCount || "1000";
        graph.push({
            "@type": "Review",
            "name": pageSchema.metadata.title,
            "reviewBody": pageSchema.metadata.description,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": ratingValue,
                "bestRating": "5"
            },
            "author": {
                "@type": "Organization",
                "name": siteConfig.site.name,
                "url": baseUrl
            },
            "itemReviewed": {
                "@type": "SoftwareApplication",
                "name": productName,
                "applicationCategory": schemaData.applicationCategory || "MultimediaApplication",
                "operatingSystem": "Web",
                "offers": {
                    "@type": "Offer",
                    "price": schemaData.lowestPrice || "9.90",
                    "priceCurrency": "USD"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": ratingValue,
                    "ratingCount": ratingCount,
                    "bestRating": "5"
                }
            }
        });
    }

    if (pageType === "article") {
        graph.push({
            "@type": "Article",
            "headline": pageSchema.metadata.title,
            "description": pageSchema.metadata.description,
            "url": canonicalUrl,
            "author": {
                "@type": "Organization",
                "name": siteConfig.site.name,
                "url": baseUrl
            },
            "publisher": {
                "@type": "Organization",
                "name": siteConfig.site.name,
                "url": baseUrl,
                "logo": siteConfig.site.logo ? `${baseUrl}${siteConfig.site.logo}` : undefined
            },
            ...(schemaData.datePublished ? { "datePublished": schemaData.datePublished } : {}),
            ...(schemaData.dateModified ? { "dateModified": schemaData.dateModified } : {}),
        });
    }

    if (pageType === "blog") {
        graph.push({
            "@type": "BlogPosting",
            "headline": pageSchema.metadata.title,
            "description": pageSchema.metadata.description,
            "url": canonicalUrl,
            "author": {
                "@type": schemaData.authorType || "Person",
                "name": schemaData.authorName || siteConfig.site.name,
                "url": schemaData.authorUrl || baseUrl
            },
            "publisher": {
                "@type": "Organization",
                "name": siteConfig.site.name,
                "url": baseUrl,
                "logo": siteConfig.site.logo ? `${baseUrl}${siteConfig.site.logo}` : undefined
            },
            "datePublished": schemaData.datePublished || new Date().toISOString(),
            "dateModified": schemaData.dateModified || schemaData.datePublished || new Date().toISOString(),
            ...(schemaData.image ? { "image": schemaData.image.startsWith('http') ? schemaData.image : `${baseUrl}${schemaData.image}` } : {}),
        });
    }

    if (pageType === "tutorial") {
        // HowTo steps come from explicit schemaData.steps or auto-extracted from root nodes
        const explicitSteps: { name: string; text: string }[] = schemaData.steps || [];
        const autoSteps = explicitSteps.length === 0 ? extractHowToData(pageSchema.root) : [];
        const steps = explicitSteps.length > 0 ? explicitSteps : autoSteps;

        if (steps.length > 0) {
            graph.push({
                "@type": "HowTo",
                "name": schemaData.howToName || `How to use ${siteConfig.site.name}`,
                "description": pageSchema.metadata.description,
                "step": steps.map((step: any, index: number) => ({
                    "@type": "HowToStep",
                    "position": index + 1,
                    "name": step.name || step.title,
                    "text": step.text || step.description,
                }))
            });
        }
    }

    // 4. FAQ (auto-extracted from root for all page types except blog)
    if (pageType !== "blog") {
        const faqs = pageSchema.root ? extractFAQData(pageSchema.root) : [];
        if (faqs.length > 0) {
            graph.push({
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            });
        }
    }

    // 5. HowTo auto-extraction for "product" pageType (backward compat)
    if (pageType === "product" && pageSchema.root) {
        const steps = extractHowToData(pageSchema.root);
        if (steps.length > 0) {
            graph.push({
                "@type": "HowTo",
                "name": `How to use ${siteConfig.site.name}`,
                "step": steps.map((step, index) => ({
                    "@type": "HowToStep",
                    "position": index + 1,
                    "name": step.name,
                    "text": step.text,
                    ...(step.image ? { "image": step.image.startsWith('http') ? step.image : `${baseUrl}${step.image}` } : {})
                }))
            });
        }
    }

    return {
        "@context": "https://schema.org",
        "@graph": graph
    };
}
