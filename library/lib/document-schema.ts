type BuildDocumentSchemaInput = {
  type: string;
  title: string;
  description?: string;
  content?: string;
  slug: string;
  siteName: string;
  siteUrl: string;
  author?: string;
  authorUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
  logoPath?: string;
  image?: string;
};

/**
 * Normalize a date string to ISO 8601 format with timezone.
 * "2026-03-20" → "2026-03-20T00:00:00Z"
 * Already has time/timezone → return as-is.
 */
function normalizeDateTime(date?: string): string {
  if (!date) return "";
  if (date.includes("T")) return date;
  return `${date}T00:00:00Z`;
}

export function buildDocumentSchema(input: BuildDocumentSchemaInput) {
  const baseUrl = input.siteUrl.replace(/\/$/, "");
  const canonicalUrl =
    input.type === "review"
      ? `${baseUrl}/${input.slug}`
      : `${baseUrl}/blog/${input.slug}`;

  const imageUrl = input.image
    ? (input.image.startsWith("http") ? input.image : `${baseUrl}${input.image}`)
    : (input.logoPath
      ? (input.logoPath.startsWith("http") ? input.logoPath : `${baseUrl}${input.logoPath}`)
      : undefined);

  return {
    "@context": "https://schema.org",
    "@type": input.type === "review" ? "ReviewNewsArticle" : "BlogPosting",
    headline: input.title,
    description: input.description || "",
    ...(imageUrl ? { image: imageUrl } : {}),
    articleBody: input.content || "",
    datePublished: normalizeDateTime(input.publishedAt || input.updatedAt),
    dateModified: normalizeDateTime(input.updatedAt || input.publishedAt),
    author: {
      "@type": "Person",
      name: input.author || `${input.siteName} Team`,
      ...(input.authorUrl ? { url: input.authorUrl } : { url: baseUrl }),
    },
    publisher: {
      "@type": "Organization",
      name: input.siteName,
      logo: input.logoPath
        ? {
            "@type": "ImageObject",
            url: input.logoPath.startsWith("http")
              ? input.logoPath
              : `${baseUrl}${input.logoPath}`,
          }
        : undefined,
    },
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
  };
}
