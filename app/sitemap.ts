import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "/",                      priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/gpt-image-2",           priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/gpt-image-2-review",    priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/pricing",               priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/privacy",               priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms",                 priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/refund",                priority: 0.3, changeFrequency: "yearly" as const },
  ];
  return routes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
