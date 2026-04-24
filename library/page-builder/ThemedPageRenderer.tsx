'use client';

import React from 'react';
import { ComponentNode, PageSchema, PageTheme } from '@/types/webpage';
import { PageRenderer } from './renderer';

// Helper function to convert hex to HSL
function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'hsl(0 0% 0%)';

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

// Helper to adjust brightness
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

// Generate theme CSS
function generateThemeCSS(theme: PageTheme): string {
  const bgColor = theme.backgroundColor || '#ffffff';
  const primaryColor = theme.primaryColor || '#6366f1';
  const textColor = theme.textColor || '#1f2937';
  const secondaryColor = theme.secondaryColor || '#6b7280';
  const accentColor = theme.accentColor || '#8b5cf6';
  const primaryForeground = getReadableTextColor(primaryColor);
  const accentForeground = getReadableTextColor(accentColor);

  // Determine if this is a dark theme
  const isDark = bgColor.toLowerCase() < '#888888';

  return `
    /* Global theme variables - affects Navbar and all elements */
    :root {
      --background: ${hexToHsl(bgColor)};
      --foreground: ${hexToHsl(textColor)};
      --primary: ${hexToHsl(primaryColor)};
      --primary-foreground: ${primaryForeground};
      --secondary: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.1 : -0.05))};
      --secondary-foreground: ${hexToHsl(textColor)};
      --muted: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.1 : -0.05))};
      --muted-foreground: ${hexToHsl(secondaryColor)};
      --accent: ${hexToHsl(accentColor)};
      --accent-foreground: ${accentForeground};
      --card: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.03 : 0))};
      --card-foreground: ${hexToHsl(textColor)};
      --border: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.15 : -0.1))};
      --input: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.15 : -0.1))};
      --ring: ${hexToHsl(primaryColor)};
    }

    /* Apply background color to body */
    body {
      background-color: ${bgColor} !important;
      color: ${textColor} !important;
    }

    /* Navbar theme adaptation */
    nav.site-nav {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.02 : 0)} !important;
      border-bottom: 1px solid ${adjustBrightness(bgColor, isDark ? 0.15 : -0.1)};
    }

    nav.site-nav.nav-transparent {
      background-color: transparent !important;
      border-bottom-color: transparent !important;
      box-shadow: none !important;
    }

    nav .text-foreground\\/80 {
      color: ${textColor}cc !important;
    }

    nav .text-foreground {
      color: ${textColor} !important;
    }

    nav .text-primary {
      color: ${primaryColor} !important;
    }

    nav .hover\\:text-primary:hover {
      color: ${primaryColor} !important;
    }

    /* Footer theme adaptation */
    footer {
      background-color: ${bgColor} !important;
      border-color: ${adjustBrightness(bgColor, isDark ? 0.15 : -0.1)} !important;
    }

    footer .text-foreground {
      color: ${textColor} !important;
    }

    footer .text-muted-foreground {
      color: ${secondaryColor} !important;
    }

    footer .text-primary {
      color: ${primaryColor} !important;
    }

    footer .hover\\:text-primary:hover {
      color: ${primaryColor} !important;
    }

    .themed-page {
      --background: ${hexToHsl(bgColor)};
      --foreground: ${hexToHsl(textColor)};
      --primary: ${hexToHsl(primaryColor)};
      --primary-foreground: ${primaryForeground};
      --secondary: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.1 : -0.05))};
      --secondary-foreground: ${hexToHsl(textColor)};
      --muted: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.1 : -0.05))};
      --muted-foreground: ${hexToHsl(secondaryColor)};
      --accent: ${hexToHsl(accentColor)};
      --accent-foreground: ${accentForeground};
      --card: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.03 : 0))};
      --card-foreground: ${hexToHsl(textColor)};
      --border: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.15 : -0.1))};
      --input: ${hexToHsl(adjustBrightness(bgColor, isDark ? 0.15 : -0.1))};
      --ring: ${hexToHsl(primaryColor)};
      
      background-color: ${bgColor} !important;
      color: ${textColor} !important;
    }

    .themed-page .bg-background {
      background-color: ${bgColor} !important;
    }

    .themed-page .bg-white {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.05 : 0)} !important;
    }

    .themed-page .text-foreground {
      color: ${textColor} !important;
    }

    .themed-page .text-primary {
      color: ${primaryColor} !important;
    }

    .themed-page .text-muted-foreground {
      color: ${secondaryColor} !important;
    }

    .themed-page .bg-primary {
      background-color: ${primaryColor} !important;
    }

    .themed-page .border-primary {
      border-color: ${primaryColor} !important;
    }

    .themed-page h1, .themed-page h2, .themed-page h3, .themed-page h4, .themed-page h5, .themed-page h6 {
      color: ${textColor};
    }

    .themed-page p {
      color: ${secondaryColor};
    }

    /* Gradient text fix */
    .themed-page .bg-gradient-to-r.bg-clip-text {
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-image: linear-gradient(to right, ${primaryColor}, ${accentColor});
    }

    /* FAQ component */
    .themed-page .faq-section {
      background-color: ${bgColor} !important;
    }

    .themed-page .faq-title {
      color: ${textColor} !important;
    }

    /* Pricing component */
    .themed-page .pricing-section {
      background-color: ${bgColor} !important;
    }

    .themed-page .pricing-card {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.05 : -0.02)} !important;
    }

    .themed-page .pricing-title {
      color: ${textColor} !important;
    }

    /* CTA component */
    .themed-page .cta-section {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.05 : -0.03)} !important;
    }

    /* Feature cards */
    .themed-page .feature-card {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.05 : -0.02)} !important;
    }

    /* Section backgrounds */
    .themed-page section {
      background-color: ${bgColor};
    }

    .themed-page .bg-gray-50,
    .themed-page .bg-slate-50 {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.03 : -0.02)} !important;
    }

    .themed-page .bg-gray-100,
    .themed-page .bg-slate-100 {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.05 : -0.03)} !important;
    }

    /* Border colors */
    .themed-page .border-gray-100,
    .themed-page .border-gray-200 {
      border-color: ${adjustBrightness(bgColor, isDark ? 0.15 : -0.1)} !important;
    }

    /* Text colors */
    .themed-page .text-gray-500,
    .themed-page .text-gray-600 {
      color: ${secondaryColor} !important;
    }

    .themed-page .text-gray-700,
    .themed-page .text-gray-800,
    .themed-page .text-gray-900 {
      color: ${textColor} !important;
    }

    /* Card component */
    .themed-page .bg-card {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.05 : 0)} !important;
    }

    .themed-page .border-border {
      border-color: ${adjustBrightness(bgColor, isDark ? 0.15 : -0.1)} !important;
    }

    /* Muted backgrounds */
    .themed-page .bg-muted {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.1 : -0.05)} !important;
    }

    /* Input and form elements */
    .themed-page input,
    .themed-page textarea,
    .themed-page select {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.08 : -0.02)} !important;
      border-color: ${adjustBrightness(bgColor, isDark ? 0.15 : -0.1)} !important;
      color: ${textColor} !important;
    }

    .themed-page input::placeholder,
    .themed-page textarea::placeholder {
      color: ${secondaryColor} !important;
    }

    /* Label text */
    .themed-page label {
      color: ${textColor} !important;
    }

    /* Tabs component */
    .themed-page [data-state="inactive"] {
      color: ${secondaryColor} !important;
    }

    /* Card with opacity */
    .themed-page .bg-card\\/50 {
      background-color: ${adjustBrightness(bgColor, isDark ? 0.05 : 0)}80 !important;
    }

    /* Accent color */
    .themed-page .bg-accent {
      background-color: ${accentColor} !important;
    }

    .themed-page .text-accent {
      color: ${accentColor} !important;
    }

    /* Primary foreground */
    .themed-page .text-primary-foreground {
      color: ${primaryForeground} !important;
    }

    /* Primary with opacity */
    .themed-page .bg-primary\\/10 {
      background-color: ${primaryColor}1a !important;
    }

    .themed-page .bg-primary\\/5 {
      background-color: ${primaryColor}0d !important;
    }
  `;
}

import { DataSourceProvider } from './DataSourceContext';

interface ThemedPageRendererProps {
  pageSchema: PageSchema;
  dataSources?: Record<string, any>;
  slots?: Record<string, React.ReactNode>;
}

export const ThemedPageRenderer: React.FC<ThemedPageRendererProps> = ({ pageSchema, dataSources = {}, slots }) => {
  const theme = pageSchema.theme;
  const themeCSS = theme ? generateThemeCSS(theme) : '';

  // Normalize root node: support full node, simplified children map, and malformed/missing data.
  const rootRaw = pageSchema.root as any;
  let rootNode: ComponentNode;

  if (!rootRaw || typeof rootRaw !== 'object') {
    console.warn(
      `ThemedPageRenderer: page "${pageSchema.id}" is missing a valid root node, rendering fallback container.`
    );
    rootNode = {
      id: 'root',
      type: 'container',
      props: {
        className: 'flex-1',
      },
      children: [],
    };
  } else if (!rootRaw.type) {
    // It's a map of children, wrap in default container.
    rootNode = {
      id: 'root',
      type: 'container',
      props: {
        className: 'flex-1',
      },
      children: rootRaw,
    } as ComponentNode;
  } else {
    rootNode = rootRaw as ComponentNode;
  }

  return (
    <DataSourceProvider dataSources={dataSources}>
      {themeCSS && <style>{themeCSS}</style>}
      <div className={theme ? 'themed-page' : ''}>
        <PageRenderer node={rootNode} slots={slots} />
      </div>
    </DataSourceProvider>
  );
};
