import {
  DocumentPost,
  estimateReadingTime,
  formatDate,
  generateDocumentStaticParams,
  getDocumentPost,
  getDocumentPosts,
} from "@/library/lib/document-post-utils";

export interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export type BlogPost = DocumentPost;

export function generateSlug(title: string, url?: string): string {
  if (url && url.includes("-")) {
    return url
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50)
    .replace(/^-+|-+$/g, "");
}

export { estimateReadingTime, formatDate };

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return getDocumentPost("blog", slug);
}

export async function getBlogPosts(page = 1, pageSize = 20): Promise<BlogPost[]> {
  return getDocumentPosts("blog", page, pageSize);
}

export async function generateBlogStaticParams() {
  return generateDocumentStaticParams("blog");
}
