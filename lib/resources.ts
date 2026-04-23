import resourcesData from "@/public/resources.json";

export interface ResourceItem {
  id: string;
  name: string;
  path: string;
  kind: "image" | "video";
  status: "missing" | "generated";
  exists: boolean;
  prompt?: string;
  alt?: string;
  tags?: string[];
  updatedAt?: string;
}

const resources: ResourceItem[] = resourcesData.resources as ResourceItem[];

export function getResource(id: string): ResourceItem | undefined {
  return resources.find((r) => r.id === id);
}

export function getResourcePath(id: string): string | null {
  const r = getResource(id);
  if (!r || !r.exists) return null;
  const v = r.updatedAt ? encodeURIComponent(r.updatedAt) : "1";
  return `${r.path}?v=${v}`;
}
