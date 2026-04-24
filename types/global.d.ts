// Global type declarations

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'set' | 'event' | 'js' | 'consent',
      targetIdOrConfig: string | Date | Record<string, any>,
      config?: Record<string, any>
    ) => void;
  }
}

export {};
