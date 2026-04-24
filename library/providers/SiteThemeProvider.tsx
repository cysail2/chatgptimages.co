"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PageTheme, presetThemes } from "@/types/webpage";

// Helper functions
function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 0%';

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `hsl(${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

function adjustBrightness(hex: string, amount: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r = Math.min(255, Math.max(0, r + Math.round(255 * amount)));
  g = Math.min(255, Math.max(0, g + Math.round(255 * amount)));
  b = Math.min(255, Math.max(0, b + Math.round(255 * amount)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getReadableTextColor(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '#ffffff';

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const linear = (value: number) =>
    value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

  return luminance > 0.6 ? '#111827' : '#ffffff';
}

interface SiteThemeProviderProps {
  children: React.ReactNode;
  theme?: PageTheme;
  forcedTheme?: string;
}

export function SiteThemeProvider({ children, theme, forcedTheme }: SiteThemeProviderProps) {
  // Use default theme if none provided
  const activeTheme = theme || presetThemes.light;
  const lockedTheme =
    forcedTheme ||
    (activeTheme.mode === "dark"
      ? "dark"
      : activeTheme.mode === "light"
        ? "light"
        : undefined);

  // Extract light and dark configurations
  const lightConfig = activeTheme.light || activeTheme || presetThemes.light.light!;
  const darkConfig = activeTheme.dark || presetThemes.dark.dark!;

  const generateVars = (config: any, isDark: boolean) => {
    const bgColor = config.backgroundColor || (isDark ? '#0f172a' : '#ffffff');
    const primaryColor = config.primaryColor || (isDark ? '#818cf8' : '#6366f1');
    const textColor = config.textColor || (isDark ? '#f1f5f9' : '#1f2937');
    const secondaryColor = config.secondaryColor || (isDark ? '#94a3b8' : '#6b7280');
    const accentColor = config.accentColor || (isDark ? '#a78bfa' : '#8b5cf6');
    const primaryForeground = getReadableTextColor(primaryColor);
    const accentForeground = getReadableTextColor(accentColor);

    return `
      --background: ${hexToHsl(bgColor)};
      --foreground: ${hexToHsl(textColor)};
      --primary: ${hexToHsl(primaryColor)};
      --primary-foreground: ${hexToHsl(primaryForeground)};
      
      --secondary: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.1 : -0.05))};
      --secondary-foreground: ${hexToHsl(textColor)};
      --muted: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.1 : -0.05))};
      --muted-foreground: ${hexToHsl(secondaryColor)};
      --accent: ${hexToHsl(accentColor)};
      --accent-foreground: ${hexToHsl(accentForeground)};
      --card: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.03 : 0))};
      --card-foreground: ${hexToHsl(textColor)};
      --popover: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.03 : 0))};
      --popover-foreground: ${hexToHsl(textColor)};
      --border: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.15 : -0.1))};
      --input: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.15 : -0.1))};
      --ring: ${hexToHsl(primaryColor)};
      --radius: 0.5rem;
    `;
  };

  const css = `
    :root {
      ${generateVars(lightConfig, false)}
    }
    .dark {
      ${generateVars(darkConfig, true)}
    }
  `;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={lockedTheme || "dark"}
      enableSystem={!lockedTheme}
      forcedTheme={lockedTheme}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </NextThemesProvider>
  );
}
