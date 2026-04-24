"use client";

import React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/library/ui/button";
import { Label } from "@/library/ui/label";
import { cn } from "@/library/lib/utils";
import {
  createFileUploadRulesFromAllowedTypes,
  createImageUploadRules,
  type FileUploadRules,
} from "./file-upload-helpers";

type ImageUploadFieldProps = {
  label: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  previewUrl: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileAccepted?: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  allowedTypes?: string[];
  maxSizeMb?: number;
  helperText?: string[];
  rules?: FileUploadRules;
  disabled?: boolean;
  onRequireSignIn?: () => void;
  enableDragDrop?: boolean;
  enablePaste?: boolean;
  className?: string;
  previewAlt?: string;
};

export function ImageUploadField({
  label,
  inputRef,
  previewUrl,
  onChange,
  onFileAccepted,
  onRemove,
  accept = "image/*",
  allowedTypes,
  maxSizeMb,
  helperText,
  rules,
  disabled = false,
  onRequireSignIn,
  enableDragDrop = true,
  enablePaste = true,
  className,
  previewAlt = "Preview",
}: ImageUploadFieldProps) {
  const uploadAreaRef = React.useRef<HTMLDivElement>(null);
  const dragCounterRef = React.useRef(0);

  const resolvedRules = React.useMemo(() => {
    if (rules) return rules;
    if (allowedTypes && allowedTypes.length > 0) {
      return createFileUploadRulesFromAllowedTypes({
        allowedTypes,
        maxSizeMb,
        helperText,
        label: "image",
      });
    }
    return createImageUploadRules({ maxSizeMb, helperText });
  }, [allowedTypes, helperText, maxSizeMb, rules]);

  const helperTextToRender = resolvedRules.helperText;

  const handleDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!enableDragDrop || disabled) return;
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = "copy";
    },
    [disabled, enableDragDrop]
  );

  const handleDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!enableDragDrop || disabled) return;
      event.preventDefault();
      event.stopPropagation();
      dragCounterRef.current += 1;
    },
    [disabled, enableDragDrop]
  );

  const handleDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!enableDragDrop || disabled) return;
      event.preventDefault();
      event.stopPropagation();
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    },
    [disabled, enableDragDrop]
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (!enableDragDrop) return;
      event.preventDefault();
      event.stopPropagation();
      dragCounterRef.current = 0;
      if (disabled) {
        onRequireSignIn?.();
        return;
      }
      const files = event.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        onFileAccepted?.(file);
        return;
      }
      const items = event.dataTransfer.items;
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i += 1) {
          const item = items[i];
          if (item.kind === "file") {
            const file = item.getAsFile();
            if (file) onFileAccepted?.(file);
            return;
          }
        }
      }
    },
    [
      disabled,
      enableDragDrop,
      onFileAccepted,
      onRequireSignIn,
    ]
  );

  React.useEffect(() => {
    if (!enablePaste) return;
    const handlePaste = (event: ClipboardEvent) => {
      if (disabled) return;
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) onFileAccepted?.(file);
          break;
        }
      }
    };
    const uploadArea = uploadAreaRef.current;
    if (uploadArea) {
      uploadArea.setAttribute("tabindex", "0");
    }
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [disabled, enablePaste, onFileAccepted, resolvedRules]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div
        ref={uploadAreaRef}
        className="border-2 border-dashed border-input rounded-xl p-4 text-center bg-card hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => {
          if (disabled) {
            onRequireSignIn?.();
            return;
          }
          inputRef.current?.click();
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt={previewAlt}
              className="max-w-full max-h-[160px] mx-auto rounded-lg shadow"
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
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold block mb-1">Click to upload</span>
              {helperTextToRender.map((text) => (
                <span key={text} className="block text-muted-foreground/70">
                  {text}
                </span>
              ))}
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={resolvedRules.accept.join(",") || accept}
          onChange={onChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
