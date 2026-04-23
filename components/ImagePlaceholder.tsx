"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getResource } from "@/lib/resources";

interface Props {
  resourceId: string;
  alt: string;
  aspectRatio?: "1/1" | "4/3" | "3/2" | "16/9" | "free";
  className?: string;
  gradient?: string;
}

export function ImagePlaceholder({
  resourceId,
  alt,
  aspectRatio = "1/1",
  className,
  gradient = "from-purple-900/40 via-slate-900/60 to-cyan-900/30",
}: Props) {
  const resource = getResource(resourceId);
  const ratioClass: Record<string, string> = {
    "1/1": "aspect-square",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "16/9": "aspect-video",
    free: "",
  };

  if (resource?.exists && resource.status === "generated") {
    const v = resource.updatedAt ? encodeURIComponent(resource.updatedAt) : "1";
    return (
      <div className={cn(ratioClass[aspectRatio], "relative overflow-hidden rounded-xl", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${resource.path}?v=${v}`}
          alt={resource.alt || alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        ratioClass[aspectRatio],
        "relative overflow-hidden rounded-xl",
        aspectRatio === "free" && "min-h-[200px]",
        className
      )}
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
      aria-label={alt}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <ImageIcon className="w-8 h-8" style={{ color: "var(--muted2)" }} />
        <span className="text-xs" style={{ color: "var(--muted2)" }}>{alt}</span>
      </div>
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-medium"
        style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b" }}>
        PLACEHOLDER
      </div>
    </div>
  );
}
