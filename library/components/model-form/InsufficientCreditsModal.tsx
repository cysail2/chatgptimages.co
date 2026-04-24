"use client";

import React from "react";
import { X, Zap, Check } from "lucide-react";
import { Button } from "@/library/ui/button";

type InsufficientCreditsModalProps = {
  open: boolean;
  creditCost: number | string;
  onClose: () => void;
  onUpgrade: () => void;
  title?: string;
  upgradeLabel?: string;
  resourceLabel?: string;
  helperText?: string;
};

export function InsufficientCreditsModal({
  open,
  creditCost,
  onClose,
  onUpgrade,
  title = "Insufficient Credits",
  upgradeLabel = "Upgrade To Plus Plan",
  resourceLabel = "video",
  helperText,
}: InsufficientCreditsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="relative p-6 pt-12 text-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-amber-50 dark:ring-amber-900/10">
            <Zap className="w-10 h-10 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h2>

          <div className="mb-8 space-y-2">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              You need <span className="font-bold text-indigo-600 dark:text-indigo-400">{creditCost} credits</span>
              <br />to generate this {resourceLabel}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[80%] mx-auto">
              {helperText || `Please purchase more credits to continue creating amazing ${resourceLabel}s`}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-900/20 transition-all hover:scale-[1.02]"
              onClick={onUpgrade}
            >
              {upgradeLabel}
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={onClose}
            >
              Not now
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex justify-center gap-6 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500 dark:text-green-400" strokeWidth={3} />
                No Expiry
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500 dark:text-green-400" strokeWidth={3} />
                One-time
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500 dark:text-green-400" strokeWidth={3} />
                Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
