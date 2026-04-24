import fs from "node:fs";
import path from "node:path";

type DocumentKind = "blog" | "review";

type IndexedDocument = {
  id: string;
  title: string;
  description?: string;
  kind: string;
  slug: string;
  relativePath: string;
  updatedAt?: string;
  author?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type DocumentsIndex = {
  documents?: IndexedDocument[];
};

type ResolvedDocument = Omit<IndexedDocument, "description" | "updatedAt" | "author" | "publishedAt" | "seoTitle" | "seoDescription"> & {
  description: string;
  updatedAt: string;
  author: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
};

export type DocumentPost = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  seo_name: string;
  seo_desc: string;
};

const DOCUMENT_DIRECTORIES: Record<DocumentKind, string[]> = {
  blog: ["blog", "blogs"],
  review: ["reviews", "review"],
};

function getDocumentsRoot() {
  return path.join(process.cwd(), "data", "documents");
}

function getDocumentsIndexPath() {
  return path.join(process.cwd(), "data", "documents.json");
}

function readDocumentsIndex(): DocumentsIndex {
  try {
    return JSON.parse(fs.readFileSync(getDocumentsIndexPath(), "utf8")) as DocumentsIndex;
  } catch {
    return { documents: [] };
  }
}

function getAbsoluteDocumentPath(relativePath: string) {
  return path.join(getDocumentsRoot(), relativePath);
}

function documentExists(relativePath: string) {
  return fs.existsSync(getAbsoluteDocumentPath(relativePath));
}

function readDocumentContent(relativePath: string) {
  try {
    return fs.readFileSync(getAbsoluteDocumentPath(relativePath), "utf8");
  } catch {
    return "";
  }
}

function extractTitleFromMarkdown(content: string, fallbackSlug: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || fallbackSlug.replace(/-/g, " ");
}

function listDocumentFiles(kind: DocumentKind) {
  const files = new Map<string, string>();

  for (const directory of DOCUMENT_DIRECTORIES[kind]) {
    const absoluteDir = path.join(getDocumentsRoot(), directory);
    if (!fs.existsSync(absoluteDir)) {
      continue;
    }

    for (const file of fs.readdirSync(absoluteDir)) {
      if (!file.endsWith(".md")) {
        continue;
      }

      const slug = file.replace(/\.md$/, "");
      if (!files.has(slug)) {
        files.set(slug, `${directory}/${file}`);
      }
    }
  }

  return files;
}

function sortDocuments(left: ResolvedDocument, right: ResolvedDocument) {
  return (right.publishedAt || right.updatedAt || "").localeCompare(
    left.publishedAt || left.updatedAt || "",
  );
}

function getDocumentsByKind(kind: DocumentKind): ResolvedDocument[] {
  const indexDocuments = (readDocumentsIndex().documents || []).filter(
    (doc) => doc.kind === kind,
  );
  const indexedBySlug = new Map(indexDocuments.map((doc) => [doc.slug, doc]));
  const filesBySlug = listDocumentFiles(kind);
  const slugs = new Set([...indexedBySlug.keys(), ...filesBySlug.keys()]);

  const documents: ResolvedDocument[] = [];
  for (const slug of slugs) {
    const indexed = indexedBySlug.get(slug);
    const indexedPath =
      indexed?.relativePath && documentExists(indexed.relativePath)
        ? indexed.relativePath
        : undefined;
    const relativePath =
      indexedPath || filesBySlug.get(slug) || indexed?.relativePath;

    if (!relativePath || !documentExists(relativePath)) {
      continue;
    }

    const content = readDocumentContent(relativePath);
    documents.push({
      id: indexed?.id || `${kind}-${slug}`,
      slug,
      title: indexed?.title || extractTitleFromMarkdown(content, slug),
      description: indexed?.description || "",
      kind,
      relativePath,
      updatedAt: indexed?.updatedAt || "",
      author: indexed?.author || "",
      publishedAt: indexed?.publishedAt || "",
      seoTitle: indexed?.seoTitle || "",
      seoDescription: indexed?.seoDescription || "",
    });
  }

  return documents.sort(sortDocuments);
}

export function formatDate(value: string | number): string {
  const date = typeof value === "number" ? new Date(value * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/[#>*_\-\n]/g, " ");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / wordsPerMinute))} min`;
}

export async function getDocumentPosts(
  kind: DocumentKind,
  page = 1,
  pageSize = 20,
): Promise<DocumentPost[]> {
  const allPosts = getDocumentsByKind(kind).map((doc) => ({
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    abstract: doc.description || "",
    content: readDocumentContent(doc.relativePath),
    author: doc.author || "",
    publishedAt: doc.publishedAt || doc.updatedAt || "",
    updatedAt: doc.updatedAt || doc.publishedAt || "",
    seo_name: doc.seoTitle || doc.title,
    seo_desc: doc.seoDescription || doc.description || "",
  }));

  const start = Math.max(0, (page - 1) * pageSize);
  return allPosts.slice(start, start + pageSize);
}

export async function getDocumentPost(kind: DocumentKind, slug: string): Promise<DocumentPost | null> {
  const doc = getDocumentsByKind(kind).find((item) => item.slug === slug);
  if (!doc) {
    return null;
  }

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    abstract: doc.description || "",
    content: readDocumentContent(doc.relativePath),
    author: doc.author || "",
    publishedAt: doc.publishedAt || doc.updatedAt || "",
    updatedAt: doc.updatedAt || doc.publishedAt || "",
    seo_name: doc.seoTitle || doc.title,
    seo_desc: doc.seoDescription || doc.description || "",
  };
}

export async function generateDocumentStaticParams(kind: DocumentKind) {
  return getDocumentsByKind(kind).map((doc) => ({
    slug: doc.slug,
  }));
}
