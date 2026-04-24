"use client";

import React, { useTransition } from 'react';
import { useAIStudio } from './AIStudioContext';
import { Button } from "@/library/ui/button";
import { Loader2, Sparkles } from "lucide-react";

export function AIStudioTrigger() {
    const { openAIStudio, isOpen } = useAIStudio();
    const [isPending, startTransition] = useTransition();

    if (isOpen) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[100] group animate-fade-in-up hidden md:block">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <Button
                size="icon"
                onClick={() => startTransition(() => openAIStudio())}
                disabled={isPending}
                className="relative w-16 h-16 rounded-full bg-slate-950 border border-white/10 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
            >
                {isPending ? (
                    <Loader2 className="w-7 h-7 text-primary animate-spin" />
                ) : (
                    <Sparkles className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform duration-500" />
                )}
            </Button>

            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-900 border border-white/10 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-bold text-white shadow-xl">
                    {isPending ? "Opening AI Studio..." : "Launch AI Studio"}
                </div>
            </div>
        </div>
    );
}
