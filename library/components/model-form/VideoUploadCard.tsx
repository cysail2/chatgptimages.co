"use client";

import React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/library/ui/button";
import { cn } from "@/library/lib/utils";

type VideoUploadCardProps = {
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  previewUrl: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  accept?: string;
  placeholder?: string;
  disabled?: boolean;
  onRequireSignIn?: () => void;
  className?: string;
};

export function VideoUploadCard({
  label,
  inputRef,
  previewUrl,
  onChange,
  onRemove,
  accept = "video/*",
  placeholder = "Click to upload video",
  disabled = false,
  onRequireSignIn,
  className,
}: VideoUploadCardProps) {
  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-input rounded-xl p-4 text-center bg-card hover:bg-muted/50 transition-colors cursor-pointer min-h-[190px] flex items-center justify-center",
        className
      )}
      onClick={() => {
        if (disabled) {
          onRequireSignIn?.();
          return;
        }
        inputRef.current?.click();
      }}
    >
      <div className="absolute top-3 left-3 bg-background/90 text-foreground text-sm font-medium px-3 py-1 rounded-lg shadow-sm">
        {label}
      </div>
      {previewUrl ? (
        <div className="relative w-full">
          <video
            src={previewUrl}
            className="w-full max-h-[150px] mx-auto rounded-lg shadow"
            controls
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 rounded-full h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
