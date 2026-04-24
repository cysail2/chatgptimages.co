import {
  DocumentPost,
  estimateReadingTime,
  formatDate,
  generateDocumentStaticParams,
  getDocumentPost,
  getDocumentPosts,
} from "@/library/lib/document-post-utils";

export interface ReviewPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export type ReviewPost = DocumentPost;

export function generateSlug(title: string, url?: string) {
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

export async function getReviewPosts(): Promise<ReviewPost[]> {
  return getDocumentPosts("review", 1, Number.MAX_SAFE_INTEGER);
}

export async function getReviewPost(slug: string): Promise<ReviewPost | null> {
  return getDocumentPost("review", slug);
}

export async function generateReviewStaticParams() {
  return generateDocumentStaticParams("review");
}
