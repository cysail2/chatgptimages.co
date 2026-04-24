import resourcesManifest from "@/public/resources.json";

export type PublicResourceKind = "image" | "video" | string;

export type PublicResourceItem = {
  id: string;
  path: string;
  kind?: PublicResourceKind;
  status?: string;
  exists?: boolean;
  tags?: string[];
  alt?: string;
  coverPath?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

type PublicResourcesManifest = {
  resources?: PublicResourceItem[];
};

const manifest = resourcesManifest as PublicResourcesManifest;

function getResources() {
  return Array.isArray(manifest.resources) ? manifest.resources : [];
}

function isGenerated(item: PublicResourceItem, kind: "image" | "video") {
  if (item.kind && item.kind !== kind) return false;
  return item.exists === true && item.status === "generated";
}

export function getPublicVideoResource({
  resourceId,
  videoTag,
}: {
  resourceId?: string;
  videoTag?: string;
}) {
  return (
    getResources().find((item) => {
      if (!isGenerated(item, "video")) return false;
      if (resourceId) return item.id === resourceId;
      if (videoTag) return Array.isArray(item.tags) && item.tags.includes(videoTag);
      return false;
    }) ?? null
  );
}

export function getPublicImageResource({
  resourceId,
  resourcePath,
}: {
  resourceId?: string;
  resourcePath?: string;
}) {
  return (
    getResources().find((item) => {
      if (!isGenerated(item, "image")) return false;
      if (resourceId) return item.id === resourceId;
      if (resourcePath) return item.path === resourcePath;
      return false;
    }) ?? null
  );
}
