import fs from "node:fs";
import path from "node:path";

type IndexedPolicyDocument = {
  id: string;
  title: string;
  kind: string;
  slug: string;
  relativePath: string;
};

type DocumentsIndex = {
  documents?: IndexedPolicyDocument[];
};

export type PolicyDocument = {
  id: string;
  slug: string;
  name: string;
  content: string;
};

function getDocumentsRoot() {
  return path.join(process.cwd(), "data", "documents");
}

function getDocumentsIndexPath() {
  return path.join(process.cwd(), "data", "documents.json");
}

function getLegacyPoliciesIndexPath() {
  return path.join(process.cwd(), "data", "policies.json");
}

function getLegacyPolicyPath(slug: string) {
  return path.join(process.cwd(), "data", "policy", `${slug}.md`);
}

function readDocumentsIndex(): DocumentsIndex {
  try {
    return JSON.parse(fs.readFileSync(getDocumentsIndexPath(), "utf8")) as DocumentsIndex;
  } catch {
    return { documents: [] };
  }
}

function readPolicyContent(relativePath: string) {
  try {
    return fs.readFileSync(path.join(getDocumentsRoot(), relativePath), "utf8");
  } catch {
    return "";
  }
}

function readLegacyPolicies(): PolicyDocument[] {
  try {
    const records = JSON.parse(
      fs.readFileSync(getLegacyPoliciesIndexPath(), "utf8"),
    ) as Array<{ id?: string; name?: string }>;

    return records
      .map((record) => {
        const slug = record.id || "";
        if (!slug) {
          return null;
        }

        try {
          const content = fs.readFileSync(getLegacyPolicyPath(slug), "utf8");
          return {
            id: slug,
            slug,
            name: record.name || slug,
            content,
          };
        } catch {
          return null;
        }
      })
      .filter((record): record is PolicyDocument => Boolean(record));
  } catch {
    return [];
  }
}

export function getPolicyDocuments(): PolicyDocument[] {
  const indexedPolicies = (readDocumentsIndex().documents || [])
    .filter((doc) => doc.kind === "policy" && doc.slug)
    .map((doc) => ({
      id: doc.id || `policy-${doc.slug}`,
      slug: doc.slug,
      name: doc.title || doc.slug,
      content: readPolicyContent(doc.relativePath),
    }))
    .filter((doc) => doc.content);

  if (indexedPolicies.length > 0) {
    return indexedPolicies;
  }

  return readLegacyPolicies();
}

export function getPolicyDocument(slug: string): PolicyDocument | null {
  return getPolicyDocuments().find((doc) => doc.slug === slug) || null;
}

export function generatePolicyStaticParams() {
  return getPolicyDocuments().map((doc) => ({
    pageId: doc.slug,
  }));
}
