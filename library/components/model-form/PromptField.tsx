"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/library/ui/button";
import { Label } from "@/library/ui/label";
import { cn } from "@/library/lib/utils";

type PromptFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  minHeightClassName?: string;
  className?: string;
};

export function PromptField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  maxLength = 2000,
  minHeightClassName = "min-h-[120px] sm:min-h-[140px]",
  className,
}: PromptFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="relative">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-3 text-sm border-2 border-input bg-background rounded-xl resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-muted disabled:cursor-not-allowed text-foreground placeholder:text-muted-foreground",
            minHeightClassName
          )}
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            disabled={!value}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
