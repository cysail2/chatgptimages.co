"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/library/ui/button";
import { cn } from "@/library/lib/utils";

type GenerateActionBarProps = {
  onClick: () => void;
  disabled?: boolean;
  isPreparing?: boolean;
  label?: string;
  preparingLabel?: string;
  badgeText?: string;
  helperText?: string;
  className?: string;
};

export function GenerateActionBar({
  onClick,
  disabled = false,
  isPreparing = false,
  label = "Generate Video",
  preparingLabel = "Preparing...",
  badgeText,
  helperText,
  className,
}: GenerateActionBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 bg-card pt-4 pb-2 mt-0",
        className
      )}
    >
      {helperText ? (
        <div className="text-xs text-amber-500 font-semibold text-center mb-2">
          {helperText}
        </div>
      ) : null}
      <div className="relative">
        <Button
          onClick={onClick}
          disabled={disabled}
          className="w-full h-14 text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-500/90 hover:to-purple-600/90 text-white rounded-2xl shadow-lg"
        >
          {isPreparing ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {preparingLabel}
            </span>
          ) : (
            label
          )}
        </Button>
        {badgeText ? (
          <div className="absolute -top-3 -right-1 rounded-full bg-orange-500 px-4 py-1.5 text-sm font-bold leading-none text-white shadow-[0_6px_16px_rgba(249,115,22,0.40)]">
            {badgeText}
          </div>
        ) : null}
      </div>
    </div>
  );
}
