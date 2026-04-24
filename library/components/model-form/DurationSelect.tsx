"use client";

import React from "react";
import { Label } from "@/library/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/library/ui/select";
import { cn } from "@/library/lib/utils";

type DurationSelectProps = {
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
  className?: string;
};

export function DurationSelect({
  label,
  value,
  options,
  onChange,
  className,
}: DurationSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="h-10 px-3 border-2 border-input bg-background rounded-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={String(opt)}>
              {opt}s
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
