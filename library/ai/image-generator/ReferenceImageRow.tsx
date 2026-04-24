"use client";

import React, { useEffect, useRef, useState } from "react";
import { FolderOpen, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/library/ui/button";
import { Input } from "@/library/ui/input";

export function ReferenceImageRow({
  item,
  onChange,
  onRemove,
  isFirst,
}: {
  item: { id: string; value: string; file?: File; isLoading?: boolean };
  onChange: (value: string, file?: File) => void;
  onRemove: () => void;
  isFirst: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (item.file) {
      const url = URL.createObjectURL(item.file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    if (
      item.value &&
      (item.value.startsWith("http") || item.value.startsWith("data:"))
    ) {
      setPreview(item.value);
      return;
    }
    setPreview(null);
  }, [item.file, item.value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file.name, file);
    }
  };

  return (
    <div className="relative w-full rounded-lg border border-dashed p-2 transition-colors hover:bg-muted/30">
      <div className="relative">
        <Input
          value={item.value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com/image.png"
          className="pr-20"
          disabled={item.isLoading}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {item.isLoading ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-default text-muted-foreground"
              disabled
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => inputRef.current?.click()}
                disabled={item.isLoading}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
              {!isFirst && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={onRemove}
                  disabled={item.isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {!preview && !item.isLoading && (
        <div className="mt-1 px-1 text-xs text-muted-foreground/70">
          Hint: Click the folder icon to upload a file or paste a URL
        </div>
      )}

      {preview && (
        <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-lg border border-border bg-muted/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          {item.isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
