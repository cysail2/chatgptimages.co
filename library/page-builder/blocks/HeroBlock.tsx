
import React from "react";
import dynamic from "next/dynamic";
import { ComponentProps, getChildrenArray } from "../registry";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  SeedanceGenerate,
  SeedanceGenerateClassic,
  VibeVoiceComposer,
  SunoV5MusicComposer,
  Qwen3TTS,
  Qwen3TtsVoiceClone,
  Qwen3TtsVoiceDesign,
  ViduQ3Generate,
  KlingGenerate,
} from "@/ai/registry";

// Template styles mapping
const heroTemplates = {
  default: {
    section:
      "relative bg-background py-16 lg:py-24 pt-[calc(2rem+3vh)] lg:pt-[calc(3rem+3vh)]",
    title:
      "text-3xl md:text-5xl lg:text-6xl font-bold mb-4 font-poppins bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent leading-tight",
    subtitle: "text-xl md:text-2xl mb-6 max-w-5xl mx-auto leading-relaxed",
    subtitleDefault: "text-muted-foreground",
    titleOnMedia: "text-white drop-shadow-lg",
    subtitleOnMedia: "text-white/95 drop-shadow-lg font-medium",
  },
  minimal: {
    section:
      "relative bg-background py-16 lg:py-24 pt-[calc(4rem+5vh)] lg:pt-[calc(6rem+5vh)]",
    title:
      "text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-poppins text-foreground",
    subtitle: "text-xl md:text-2xl mb-8 max-w-4xl mx-auto",
    subtitleDefault: "text-muted-foreground",
    titleOnMedia: "text-white drop-shadow-lg",
    subtitleOnMedia: "text-white/95 drop-shadow-lg font-medium",
  },
  centered: {
    section:
      "relative bg-background py-12 lg:py-20 pt-[calc(3rem+5vh)] lg:pt-[calc(5rem+5vh)]",
    title:
      "text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-poppins text-center text-foreground",
    subtitle: "text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-center",
    subtitleDefault: "text-muted-foreground",
    titleOnMedia: "text-white drop-shadow-lg",
    subtitleOnMedia: "text-white/95 drop-shadow-lg font-medium",
  },
  fullscreen: {
    section:
      "relative bg-background py-16 lg:py-24 pt-[calc(4rem+5vh)] lg:pt-[calc(6rem+5vh)]",
    title:
      "text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 font-poppins text-center text-foreground",
    subtitle: "text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-center",
    subtitleDefault: "text-muted-foreground",
    titleOnMedia: "text-white drop-shadow-xl",
    subtitleOnMedia: "text-white/95 drop-shadow-lg font-medium",
  },
};

// Generator type
type GeneratorType = "seedance" | "seedance-classic" | "vibevoice" | "minimax-music" | "suno-v5" | "ViduQ3Generate" | "kling" | "none";

// Generator components mapping
const GeneratorComponents: Record<string, React.ComponentType<any>> = {
  seedance: SeedanceGenerate,
  "seedance-classic": SeedanceGenerateClassic,
  vibevoice: VibeVoiceComposer,
  "suno-v5": SunoV5MusicComposer,
  "qwen3-tts-text-to-speech": Qwen3TTS,
  "qwen3-tts-voice-clone": Qwen3TtsVoiceClone,
  "qwen3-tts-voice-design": Qwen3TtsVoiceDesign,
  "ViduQ3Generate": ViduQ3Generate,
  "kling": KlingGenerate,
};

export const HeroBlock = ({
  node,
  renderChildren,
  selectedNodeId,
}: ComponentProps) => {
  const props = node.props || {};
  const {
    heading,
    title,
    summary,
    subtitle,
    generator = "wan26", // 默认使用 wan26 生成器
    initialLanguage = "en",
    fullHeight = false,
    backgroundVideoUrl,
    backgroundVideoPoster,
    backgroundVideoOverlay = "bg-transparent",
    comingSoon = false,
    className,
    primaryButtonText,
    primaryButtonUrl,
    secondaryButtonText,
    secondaryButtonUrl,
    stats,
  } = props;

  const showGenerator =
    props.showGenerator ?? node.type === "hero-with-generator";
  const shouldShowGenerator = showGenerator;

  // 获取生成器组件
  const GeneratorComponent =
    generator && generator !== "none"
      ? GeneratorComponents[generator as string]
      : null;

  const hasGenerator = shouldShowGenerator && !!GeneratorComponent;

  const templateName = node.template || "default";
  const template =
    heroTemplates[templateName as keyof typeof heroTemplates] ||
    heroTemplates.default;

  const displayTitle = heading || title;
  const displaySubtitle = summary || subtitle;
  const isSelected = selectedNodeId === node.id;
  const subtitleClassName = cn(
    template.subtitle,
    backgroundVideoUrl ? template.subtitleOnMedia : template.subtitleDefault,
    !hasGenerator && "max-w-4xl"
  );

  const generatorProps =
    generator === "vibevoice" ? { initialLanguage } : {};


  return (
    <section
      id={node.id}
      data-node-id={node.id}
      className={cn(
        template.section,
        fullHeight && "min-h-screen flex items-center",
        backgroundVideoUrl && "overflow-hidden",
        "scroll-mt-20",
        className,
        isSelected &&
        "ring-2 ring-primary ring-offset-2 transition-all duration-200"
      )}
    >
      {backgroundVideoUrl && (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={backgroundVideoPoster}
          >
            <source src={backgroundVideoUrl} />
          </video>
          <div className={cn("absolute inset-0", backgroundVideoOverlay)} />
        </div>
      )}

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div
          className={cn(
            "mx-auto text-center transition-all duration-300",
            hasGenerator ? "max-w-7xl" : "max-w-5xl"
          )}
        >

          {comingSoon && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-semibold">Coming Soon</span>
            </div>
          )}
          {displayTitle && (
            <h1
              className={cn(
                template.title,
                backgroundVideoUrl && template.titleOnMedia
              )}
            >
              {displayTitle}
            </h1>
          )}
          {displaySubtitle && (
            <p className={subtitleClassName}>{displaySubtitle}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            {secondaryButtonText && secondaryButtonUrl && (
              <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                <Link href={secondaryButtonUrl}>{secondaryButtonText}</Link>
              </Button>
            )}
            {primaryButtonText && primaryButtonUrl && (
              <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90" asChild>
                <Link href={primaryButtonUrl}>{primaryButtonText}</Link>
              </Button>
            )}
          </div>

          {stats && stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
              {stats.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generator UI - 如果启用 */}
        {shouldShowGenerator && GeneratorComponent && (
          <div className="max-w-7xl mx-auto mt-8">
            <div id="seedance-generator">
              <GeneratorComponent {...generatorProps} />
            </div>
          </div>
        )}

        {/* 其他子内容 */}
        {getChildrenArray(node.children).length > 0 && (
          <div className="mt-8">{renderChildren(node.children)}</div>
        )}
      </div>
    </section>
  );
};
