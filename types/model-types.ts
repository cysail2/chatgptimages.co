export type SeedreamVersion = "seedream-4.0" | "seedream-4.5" | "seedream-5.0";
export type KlingVersion = "kling-v2.6-std" | "kling-v2.6-pro" | "kling-v3.0-std" | "kling-v3.0-pro";
export type SeedanceVersion = "seedance-1.5" | "seedance-2.0";
export type LtxVersion = "ltx-2.3";
export type ViduQ3Version = "viduq3";
export type SunoVersion = "suno-v5" | "suno-v4";
export type MurekaVersion = "mureka-v9" | "mureka-v8";
export type VibevoiceVersion = "vibevoice";
export type Qwen3TtsVersion = "qwen3tts";
export type WanVersion = "wan2.5" | "wan2.6" | "wan2.7";
export type SkyreelsVersion = "skyreels-v3" | "skyreels-v4";
export type WanCompatibleVersion = WanVersion | SkyreelsVersion;
export type HappyHorseVersion = "happyhorse1.0";
export type NanoBananaVersion = "nanobanana-pro" | "nanobanana2";

export type AiModelId =
    | SeedreamVersion
    | KlingVersion
    | SeedanceVersion
    | LtxVersion
    | ViduQ3Version
    | SunoVersion
    | MurekaVersion
    | VibevoiceVersion
    | Qwen3TtsVersion
    | WanVersion
    | SkyreelsVersion
    | HappyHorseVersion
    | NanoBananaVersion;

// Keeping ModelId for backwards compatibility if needed elsewhere
export type ModelId = AiModelId;

// Global definition of models/modules that support audio
export const AUDIO_SUPPORTED_MODULES = [
    "vidu",
    "viduq3",
    "seedance",
    "ltx",
    "kling",
    "suno",
    "mureka",
    "vibevoice"
] as const;

export type AudioSupportedModule = typeof AUDIO_SUPPORTED_MODULES[number];

export function isAudioSupportedModule(moduleId: string): boolean {
    return (AUDIO_SUPPORTED_MODULES as readonly string[]).some((supported) =>
        moduleId === supported || moduleId.startsWith(`${supported}-`)
    );
}
