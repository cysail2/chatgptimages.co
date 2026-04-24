"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { AiModelId } from "@/types/model-types";

export type AIModel = AiModelId | "seedream" | "kling" | "suno";

const VALID_MODELS = new Set<AIModel>([
  "seedream-5.0",
  "seedream-4.5",
  "seedream-4.0",
  "seedream",
  "kling-v3.0-pro",
  "kling-v3.0-std",
  "kling-v2.6-pro",
  "kling-v2.6-std",
  "kling",
  "seedance-2.0",
  "seedance-1.5",
  "viduq3",
  "suno-v5",
  "suno-v4",
  "suno",
  "vibevoice",
  "qwen3tts",
  "wan2.5",
  "wan2.6",
  "wan2.7",
  "skyreels-v3",
  "skyreels-v4",
  "happyhorse1.0",
]);

function parseModelFromPath(pathname: string): AIModel {
  const matched = pathname.match(/^\/ai-studio(?:\/([^/]+))?/);
  const candidate = matched?.[1];
  if (candidate && VALID_MODELS.has(candidate as AIModel)) {
    return candidate as AIModel;
  }
  return "seedance-2.0";
}

interface AIStudioContextType {
  isOpen: boolean;
  activeModel: AIModel;
  openAIStudio: (model?: AIModel) => void;
  closeAIStudio: () => void;
  setActiveModel: (model: AIModel) => void;
  setPageModel: (model?: AIModel) => void;
}

const AIStudioContext = createContext<AIStudioContextType | undefined>(undefined);

export function AIStudioProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [pageModel, setPageModel] = React.useState<AIModel | undefined>(undefined);

  const isOpen = pathname.startsWith("/ai-studio");
  const activeModel = useMemo(() => pageModel ?? parseModelFromPath(pathname), [pageModel, pathname]);

  const openAIStudio = useCallback(
    (model?: AIModel) => {
      router.push(`/ai-studio/${model ?? activeModel}`);
    },
    [activeModel, router]
  );

  const closeAIStudio = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  }, [router]);

  const setActiveModel = useCallback(
    (model: AIModel) => {
      router.replace(`/ai-studio/${model}`);
    },
    [router]
  );

  return (
    <AIStudioContext.Provider
      value={{
        isOpen,
        activeModel,
        openAIStudio,
        closeAIStudio,
        setActiveModel,
        setPageModel,
      }}
    >
      {children}
    </AIStudioContext.Provider>
  );
}

const fallbackContext: AIStudioContextType = {
  isOpen: false,
  activeModel: "seedream",
  openAIStudio: () => { },
  closeAIStudio: () => { },
  setActiveModel: () => { },
  setPageModel: () => { },
};

export function useAIStudio() {
  const context = useContext(AIStudioContext);
  if (context === undefined) {
    // If the provider is completely missing (e.g. AI Studio is disabled in siteConfig)
    // we return a safe dummy fallback to prevent application crashes.
    return fallbackContext;
  }
  return context;
}

/**
 * Hook for Client Components to override default AI Studio model globally.
 */
export function useSetAIStudioModel(model?: AIModel) {
  const { setPageModel } = useAIStudio();

  React.useEffect(() => {
    if (model) {
      setPageModel(model);
    }
    return () => {
      setPageModel(undefined);
    };
  }, [model, setPageModel]);
}

/**
 * Component to be used in Server Component pages as a bridge to register default AI Studio model.
 */
export function AIStudioSettings({ model }: { model: AIModel }) {
  useSetAIStudioModel(model);
  return null;
}
