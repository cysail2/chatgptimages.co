import { create } from 'zustand';

interface PromptStore {
  selectedPrompt: string;
  setSelectedPrompt: (prompt: string) => void;
  clearSelectedPrompt: () => void;
}

export const usePromptStore = create<PromptStore>((set) => ({
  selectedPrompt: '',
  setSelectedPrompt: (prompt: string) => set({ selectedPrompt: prompt }),
  clearSelectedPrompt: () => set({ selectedPrompt: '' }),
})); 