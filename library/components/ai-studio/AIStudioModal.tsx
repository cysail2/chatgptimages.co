"use client";

import React, { Suspense } from "react";
import { useAIStudio } from "./AIStudioContext";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/library/ui/dialog";
import {
  SeedanceGenerateClassic,
  KlingGenerate,
  SeedreamGenerate,
  ViduQ3Generate,
  WanGenerate,
  SkyreelsGenerate,
  SunoV5MusicComposer,
  VibeVoiceComposer,
  Qwen3TTS,
  HappyHorseGenerate,
} from "@/library/ai/registry";
import { Loader2, Sparkles, XIcon } from "lucide-react";

const SeedanceGenerateClassicCompat = SeedanceGenerateClassic as React.ComponentType<{
  defaultVersion?: string;
  hideVersion?: boolean;
}>;

const SeedreamGenerateCompat = SeedreamGenerate as React.ComponentType<{
  defaultVersion?: string;
  hideVersion?: boolean;
}>;

const KlingGenerateCompat = KlingGenerate as React.ComponentType<{
  version?: string;
  hideVersion?: boolean;
}>;

const WanGenerateCompat = WanGenerate as React.ComponentType<{
  defaultVersion?: string;
  hideVersion?: boolean;
}>;

const SkyreelsGenerateCompat = SkyreelsGenerate as React.ComponentType<{
  defaultVersion?: string;
  hideVersion?: boolean;
}>;

const modelComponents: Record<string, React.ComponentType> = {
  "seedance-2.0": () => <SeedanceGenerateClassicCompat defaultVersion="seedance-2.0" hideVersion />,
  "seedance-1.5": () => <SeedanceGenerateClassicCompat defaultVersion="seedance-1.5" hideVersion />,
  "kling-v3.0-pro": () => <KlingGenerateCompat version="kling-v3.0-pro" hideVersion />,
  "kling-v3.0-std": () => <KlingGenerateCompat version="kling-v3.0-std" hideVersion />,
  "kling-v2.6-pro": () => <KlingGenerateCompat version="kling-v2.6-pro" hideVersion />,
  "kling-v2.6-std": () => <KlingGenerateCompat version="kling-v2.6-std" hideVersion />,
  kling: KlingGenerate,
  "seedream-5.0": () => <SeedreamGenerateCompat defaultVersion="seedream-5.0" hideVersion />,
  "seedream-4.5": () => <SeedreamGenerateCompat defaultVersion="seedream-4.5" hideVersion />,
  "seedream-4.0": () => <SeedreamGenerateCompat defaultVersion="seedream-4.0" hideVersion />,
  seedream: SeedreamGenerate,
  viduq3: ViduQ3Generate,
  suno: SunoV5MusicComposer,
  "suno-v5": SunoV5MusicComposer,
  "suno-v4": SunoV5MusicComposer,
  vibevoice: VibeVoiceComposer,
  qwen3tts: Qwen3TTS,
  "wan2.5": () => <WanGenerateCompat defaultVersion="wan2.5" hideVersion />,
  "wan2.6": () => <WanGenerateCompat defaultVersion="wan2.6" hideVersion />,
  "wan2.7": () => <WanGenerateCompat defaultVersion="wan2.7" hideVersion />,
  "skyreels-v3": () => <SkyreelsGenerateCompat defaultVersion="skyreels-v3" hideVersion />,
  "skyreels-v4": () => <SkyreelsGenerateCompat defaultVersion="skyreels-v4" hideVersion />,
  "happyhorse1.0": HappyHorseGenerate,
};

const modelTitles: Record<string, string> = {
  "seedance-2.0": "Seedance 2.0 AI Video",
  "seedance-1.5": "Seedance 1.5 AI Video",
  "kling-v3.0-pro": "Kling 3.0 Pro AI Video",
  "kling-v3.0-std": "Kling 3.0 AI Video",
  "kling-v2.6-pro": "Kling 2.6 Pro AI Video",
  "kling-v2.6-std": "Kling 2.6 AI Video",
  kling: "Kling AI Video",
  "seedream-5.0": "Seedream 5.0 AI Image",
  "seedream-4.5": "Seedream 4.5 AI Image",
  "seedream-4.0": "Seedream 4.0 AI Image",
  seedream: "Seedream AI Image",
  viduq3: "Vidu Q3 AI Video",
  suno: "Suno AI Music",
  "suno-v5": "Suno V5 AI Music",
  "suno-v4": "Suno V4 AI Music",
  vibevoice: "VibeVoice AI Composer",
  qwen3tts: "AI Text to Speech",
  "wan2.5": "Wan 2.5 AI Video",
  "wan2.6": "Wan 2.6 AI Video",
  "wan2.7": "Wan 2.7 AI Video",
  "skyreels-v3": "SkyReels V3 AI Video",
  "skyreels-v4": "SkyReels V4 AI Video",
  "happyhorse1.0": "HappyHorse 1.0 AI Video",
};

function AIStudioContent({ activeModel }: { activeModel: string }) {
  const ActiveComponent = modelComponents[activeModel] || (() => null);

  return (
    <>
      <DialogHeader className="p-4 pr-14 sm:p-6 border-b border-border/60 bg-background shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {modelTitles[activeModel] || "AI Creative Studio"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Transform your imagination into cinematic reality with next-gen AI.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto relative bg-background">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">
                  Initializing Neural Engine...
                </p>
              </div>
            </div>
          }
        >
          <div className="h-full">
            <ActiveComponent />
          </div>
        </Suspense>
      </div>
    </>
  );
}

export function AIStudioModal() {
  const { isOpen, activeModel, closeAIStudio } = useAIStudio();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAIStudio()}>
      <DialogContent
        hideCloseButton
        className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+8px)] top-auto left-0 right-0 translate-x-0 translate-y-0 w-screen max-w-none h-[85vh] max-h-[85vh] sm:inset-x-4 sm:bottom-[calc(env(safe-area-inset-bottom)+12px)] sm:h-[85vh] sm:max-h-[85vh] lg:h-screen lg:max-h-none lg:top-0 lg:bottom-auto lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:max-w-[1400px] lg:w-full p-0 gap-0 overflow-hidden bg-background border border-border/70 flex flex-col rounded-t-[24px] sm:rounded-[28px] lg:rounded-none shadow-xl lg:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] transition-all duration-300 ease-out"
      >
        <DialogClose
          aria-label="Close AI Studio"
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-40 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/70 bg-background/90 text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <XIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </DialogClose>
        <AIStudioContent activeModel={activeModel} />
      </DialogContent>
    </Dialog>
  );
}
