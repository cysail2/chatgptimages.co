import type { ImageGenAdapter } from "./types";

const adapters = new Map<string, ImageGenAdapter>();

export function registerImageAdapter(adapter: ImageGenAdapter) {
  adapters.set(adapter.modelId, adapter);
}

export function getImageAdapter(modelId: string): ImageGenAdapter | undefined {
  return adapters.get(modelId);
}

export function listImageAdapters(): ImageGenAdapter[] {
  return Array.from(adapters.values());
}
