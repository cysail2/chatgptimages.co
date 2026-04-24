"use client";

import { ImageIcon } from "lucide-react";
import { getPublicImageResource } from "@/lib/resources";
import { cn } from "@/lib/utils";

interface Props {
  resourceId: string;
  alt: string;
  aspectRatio?: "1/1" | "4/3" | "3/2" | "16/9" | "free";
  className?: string;
  gradient?: string;
}

const ratioClass: Record<NonNullable<Props["aspectRatio"]>, string> = {
  "1/1": "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "16/9": "aspect-video",
  free: "",
};

export function ImagePlaceholder({
  resourceId,
  alt,
  aspectRatio = "1/1",
  className,
  gradient = "from-purple-900/40 via-slate-900/60 to-cyan-900/30",
}: Props) {
  const resource = getPublicImageResource({ resourceId });

  if (resource?.exists && resource.status === "generated") {
    const version = resource.updatedAt
      ? encodeURIComponent(resource.updatedAt)
      : "1";

    return (
      <div
        className={cn(
          ratioClass[aspectRatio],
          "relative overflow-hidden rounded-xl",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${resource.path}?v=${version}`}
          alt={resource.alt || alt}
          className="absolute inset-0 h-full w-full object-cover"
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
        className,
      )}
      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
      aria-label={alt}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <ImageIcon className="h-8 w-8" style={{ color: "var(--muted2)" }} />
        <span className="text-xs" style={{ color: "var(--muted2)" }}>
          {alt}
        </span>
      </div>
      <div
        className="absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-medium"
        style={{
          background: "rgba(245,158,11,0.15)",
          border: "1px solid rgba(245,158,11,0.3)",
          color: "#f59e0b",
        }}
      >
        PLACEHOLDER
      </div>
    </div>
  );
}
