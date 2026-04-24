import { MetadataRoute } from "next";
import { getFrontendPagesConfig } from "@/library/services/frontend-data.server";
import { getBlogPosts } from "@/library/lib/blog-utils";
import { getReviewPosts } from "@/library/lib/reviews-utils";
import { PagesConfig } from "@/types/siteConfig";
import siteConfigData from "@/data/site.json";

// 静态生成：在构建时生成一次，除非重新构建，否则不会更新
// 如果需要实时更新，请改回 "force-dynamic"
export const dynamic = "force-static";
export const revalidate = false;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || siteConfigData.site.url;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  try {
    const pagesConfig = (await getFrontendPagesConfig()) as PagesConfig | null;

    if (pagesConfig && pagesConfig.pages) {
      pagesConfig.pages.forEach((page) => {
        if (
          page.visibility !== "draft" &&
          page.searchVisibility !== "noindex"
        ) {
          sitemapEntries.push({
            url: `${BASE_URL}${page.path === "/" ? "" : page.path}`,
            lastModified: new Date(), // Or a more specific date from the page data if available
            changeFrequency: page.changefreq || "weekly",
            priority: page.priority || 0.8,
          });
        }
      });
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch pages for sitemap:", error);
  }

  // Add dynamic blog post URLs from local documents
  try {
    const blogPosts = await getBlogPosts(1, Number.MAX_SAFE_INTEGER);
    blogPosts.forEach((post) => {
      sitemapEntries.push({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    console.log(`Sitemap: Generated ${blogPosts.length} blog post URLs`);
  } catch (error) {
    console.error("Sitemap: Failed to fetch blog posts for sitemap:", error);
  }

  try {
    const reviews = await getReviewPosts();
    reviews.forEach((review) => {
      sitemapEntries.push({
        url: `${BASE_URL}/${review.slug}`,
        lastModified: new Date(review.updatedAt || review.publishedAt || Date.now()),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Sitemap: Failed to fetch review posts for sitemap:", error);
  }

  return sitemapEntries;
}
