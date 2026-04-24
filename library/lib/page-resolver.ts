import { promises as fs } from "fs";
import path from "path";
import { getFrontendPagesConfig } from "@/library/services/frontend-data.server";
import { getPageDataServer } from "@/library/lib/page-api.server";
import { getSiteConfig } from "@/library/lib/site-config";
import { PageItem, PagesConfig, SiteConfig } from "@/types/siteConfig";
import { PageSchema } from "@/types/webpage";

/**
 * Resolves all necessary data for a dynamic page based on route segments
 */
export async function resolvePageBySegments(segments: string[]) {
    const urlPath = "/" + segments.join("/");
    const pagesConfig = (await getFrontendPagesConfig()) as PagesConfig | null;

    // Find page by path first, then by ID as fallback
    const pageConfig = pagesConfig?.pages?.find(
        (item: PageItem) => item.path === urlPath || item.id === segments.join("/")
    );

    const id = pageConfig?.id || segments.join("/");

    const [pageSchema, siteConfig] = await Promise.all([
        getPageDataServer(id),
        getSiteConfig<SiteConfig>("site"),
    ]);

    return {
        id,
        pageConfig,
        pageSchema,
        siteConfig,
    };
}

/**
 * Generates static parameters for all public, indexed pages
 */
export async function getPublicStaticParams() {
    const pagesConfig = (await getFrontendPagesConfig()) as PagesConfig | null;
    if (!pagesConfig?.pages) return [];

    const pagesDir = path.join(process.cwd(), "data", "pages");
    try {
        await fs.access(pagesDir);
        const entries = await fs.readdir(pagesDir);
        const fileIds = new Set(
            entries
                .filter((file) => file.endsWith(".json"))
                .map((file) => file.replace(/\.json$/, ""))
        );

        return pagesConfig.pages
            .filter((page: PageItem) => {
                // Must exist in data/pages
                if (!fileIds.has(page.id)) return false;
                // Drafts are handled separately or excluded
                if (page.visibility === "draft") return false;
                // Home is handled by the root page.tsx
                if (page.id === "home") return false;
                // Exclude specific internal groups
                return page.group !== "user" && page.group !== "policy";
            })
            .map((page: PageItem) => {
                // Support nested routes: "/how-to-use/macos" -> ["how-to-use", "macos"]
                const segments = page.path
                    ? page.path.split("/").filter(Boolean)
                    : [page.id];
                return { page: segments };
            });
    } catch (error: any) {
        if (!error || error.code !== "ENOENT") {
            console.error("Failed to resolve static params:", error);
        }
        return [];
    }
}
