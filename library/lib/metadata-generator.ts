import { Metadata } from "next";
import { PageSchema } from "@/types/webpage";
import { SiteConfig } from "@/types/siteConfig";

import { getRequiredSiteConfig } from "./site-config";
/**
 * Generate Next.js Metadata object from PageSchema and SiteConfig
 */
export async function generatePageMetadata(
    pageSchema: PageSchema,
    providedSiteConfig?: SiteConfig
): Promise<Metadata> {
    const siteConfig = providedSiteConfig || await getRequiredSiteConfig<SiteConfig>("site");
    const meta = pageSchema.metadata;
    const site = siteConfig.site;
    const baseUrl = site.url;
    const siteName = site.name;

    // 1. Resolve Canonical URL
    // If metadata provides a canonical path, prepend baseUrl if needed.
    // Otherwise, default to baseUrl + page ID.
    const canonical = meta.canonical
        ? (meta.canonical.startsWith('http') ? meta.canonical : `${baseUrl}${meta.canonical.startsWith('/') ? '' : '/'}${meta.canonical}`)
        : `${baseUrl}/${pageSchema.id}`;

    // 2. Robots Handling
    const robotsList = meta.robots || ["index", "follow"];
    const robots = {
        index: robotsList.includes("index"),
        follow: robotsList.includes("follow"),
        nocache: robotsList.includes("nocache"),
        googleBot: {
            index: robotsList.includes("index"),
            follow: robotsList.includes("follow"),
        }
    };

    // 3. OpenGraph
    const og = meta.og || {} as any;
    const openGraph = {
        title: og.title || meta.title,
        description: og.description || meta.description,
        type: og.type || "website",
        url: og.url ? (og.url.startsWith('http') ? og.url : `${baseUrl}${og.url}`) : canonical,
        images: og.image ? [og.image] : ["/og.jpg"],
        siteName: siteName,
    };

    // 4. Twitter
    const twitterMeta = meta.twitter || {} as any;
    const twitter = {
        card: twitterMeta.card || "summary_large_image",
        title: twitterMeta.title || meta.title,
        description: twitterMeta.description || meta.description,
        images: twitterMeta.image ? [twitterMeta.image] : ["/og.jpg"],
        site: twitterMeta.site || siteName,
    };

    // 5. Keywords
    const keywords = meta.keywords || siteConfig.seo?.defaultKeywords || "";

    return {
        title: meta.title,
        description: meta.description,
        keywords: keywords,
        alternates: {
            canonical: canonical,
        },
        openGraph,
        twitter,
        robots,
    };
}
