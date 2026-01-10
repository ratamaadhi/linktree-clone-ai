# Theme System Architecture - Bio-Link Management System

## Overview

This document outlines the comprehensive theme system architecture that allows users to customize the appearance of their bio pages and individual links, with support for theme presets and reusable templates.

## Core Concepts

### 1. Theme Configuration Structure

The theme system uses a hierarchical configuration model with three levels:

1. **Global Theme**: Applied to the entire bio page
2. **Link Theme**: Overrides global theme for individual links
3. **Theme Presets**: Reusable theme configurations that can be applied to any bio page

### 2. Theme Properties

#### Bio Page Theme Properties

```typescript
export interface BioPageThemeConfig {
  // Colors
  primaryColor: string;           // Primary accent color (hex)
  secondaryColor: string;         // Secondary accent color (hex)
  backgroundColor: string;        // Page background color (hex)
  textColor: string;              // Main text color (hex)
  secondaryTextColor: string;     // Secondary text color (hex)

  // Typography
  fontFamily: string;             // Font family name
  fontSize: {
    base: string;                 // Base font size (e.g., '16px')
    heading: string;              // Heading font size (e.g., '24px')
    small: string;               // Small text size (e.g., '14px')
  };
  fontWeight: {
    normal: number;               // Normal font weight (400)
    medium: number;               // Medium font weight (500)
    bold: number;                 // Bold font weight (700)
  };

  // Spacing
  spacing: 'compact' | 'normal' | 'relaxed';
  padding: {
    page: string;                 // Page padding (e.g., '24px')
    section: string;              // Section padding (e.g., '16px')
    link: string;                 // Link padding (e.g., '12px')
  };

  // Layout
  layout: 'vertical' | 'grid';
  maxWidth: string;               // Maximum container width (e.g., '600px')
  alignment: 'left' | 'center' | 'right';

  // Button/Link Styling
  buttonStyle: 'solid' | 'outline' | 'ghost';
  borderRadius: number;           // Border radius in pixels (0-50)
  borderWidth: number;            // Border width in pixels
  shadow: 'none' | 'small' | 'medium' | 'large';

  // Avatar
  avatarShape: 'circle' | 'square' | 'rounded';
  avatarSize: 'small' | 'medium' | 'large';

  // Animations
  animation: 'none' | 'fade' | 'slide' | 'scale';
  animationDuration: string;       // Animation duration (e.g., '0.3s')

  // Background
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundGradient?: {
    type: 'linear' | 'radial';
    direction?: string;           // For linear gradient (e.g., '45deg')
    colors: string[];             // Array of hex colors
  };
  backgroundImage?: {
    url: string;
    position: 'cover' | 'contain' | 'center';
    opacity: number;              // 0-1
  };
}
```

#### Link Theme Properties

```typescript
export interface BioLinkThemeConfig {
  // Colors (overrides page theme)
  backgroundColor?: string;        // Link background color (hex)
  textColor?: string;             // Link text color (hex)
  borderColor?: string;           // Link border color (hex)
  hoverColor?: string;            // Hover state color (hex)

  // Button Styling
  buttonStyle?: 'solid' | 'outline' | 'ghost';
  borderRadius?: number;          // Border radius in pixels (0-50)
  borderWidth?: number;           // Border width in pixels
  shadow?: 'none' | 'small' | 'medium' | 'large';

  // Typography
  fontSize?: string;              // Font size (e.g., '16px')
  fontWeight?: number;             // Font weight (400-700)

  // Spacing
  padding?: string;                // Link padding (e.g., '12px')
  margin?: string;                // Link margin (e.g., '8px')

  // Icon
  iconPosition?: 'left' | 'right' | 'none';
  iconSize?: 'small' | 'medium' | 'large';

  // Image
  showImage?: boolean;
  imagePosition?: 'left' | 'right' | 'background';
  imageSize?: 'small' | 'medium' | 'large';
}
```

## Theme System Components

### 1. Theme Provider

Central theme management component that provides theme context to all child components.

```typescript
// components/theme/theme-provider.tsx
import * as React from 'react';
import { ThemeContext } from './theme-context';

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: BioPageThemeConfig;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<BioPageThemeConfig>(
    initialTheme || getDefaultTheme()
  );

  const updateTheme = React.useCallback((updates: Partial<BioPageThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  }, []);

  const resetTheme = React.useCallback(() => {
    setTheme(getDefaultTheme());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 2. Theme Context

React context for accessing and updating theme configuration.

```typescript
// components/theme/theme-context.tsx
import * as React from 'react';
import type { BioPageThemeConfig } from '@/types/theme';

interface ThemeContextValue {
  theme: BioPageThemeConfig;
  updateTheme: (updates: Partial<BioPageThemeConfig>) => void;
  resetTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### 3. Theme Preset Manager

Manages theme presets, including creation, duplication, and application.

```typescript
// lib/theme/preset-manager.ts
import { db } from '@/lib/db';
import { themePresets, bioPages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export class ThemePresetManager {
  /**
   * Create a new theme preset
   */
  static async createPreset(
    userId: string,
    data: {
      name: string;
      description?: string;
      thumbnailUrl?: string;
      themeConfig: BioPageThemeConfig;
      organizationId?: string;
    }
  ) {
    const [preset] = await db.insert(themePresets)
      .values({
        userId,
        organizationId: data.organizationId,
        name: data.name,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        themeConfig: data.themeConfig,
        isSystemPreset: false,
        usageCount: 0,
      })
      .returning();

    return preset;
  }

  /**
   * Duplicate an existing preset
   */
  static async duplicatePreset(presetId: string, userId: string) {
    const original = await db.query.themePresets.findFirst({
      where: eq(themePresets.id, presetId),
    });

    if (!original) {
      throw new Error('Preset not found');
    }

    const [duplicate] = await db.insert(themePresets)
      .values({
        userId,
        organizationId: original.organizationId,
        name: `${original.name} (Copy)`,
        description: original.description,
        thumbnailUrl: original.thumbnailUrl,
        themeConfig: original.themeConfig,
        isSystemPreset: false,
        usageCount: 0,
      })
      .returning();

    return duplicate;
  }

  /**
   * Apply a preset to a bio page
   */
  static async applyPreset(presetId: string, bioPageId: string) {
    const preset = await db.query.themePresets.findFirst({
      where: eq(themePresets.id, presetId),
    });

    if (!preset) {
      throw new Error('Preset not found');
    }

    await db.update(bioPages)
      .set({
        themeConfig: preset.themeConfig,
        themePresetId: presetId,
      })
      .where(eq(bioPages.id, bioPageId));

    // Increment usage count
    await db.update(themePresets)
      .set({
        usageCount: sql`${themePresets.usageCount} + 1`,
      })
      .where(eq(themePresets.id, presetId));

    return preset;
  }

  /**
   * Get system presets (pre-defined themes)
   */
  static async getSystemPresets() {
    return db.query.themePresets.findMany({
      where: eq(themePresets.isSystemPreset, true),
    });
  }

  /**
   * Get user presets
   */
  static async getUserPresets(userId: string, organizationId?: string) {
    const conditions = [eq(themePresets.userId, userId)];

    if (organizationId) {
      conditions.push(eq(themePresets.organizationId, organizationId));
    }

    return db.query.themePresets.findMany({
      where: and(...conditions),
      orderBy: desc(themePresets.createdAt),
    });
  }
}
```

### 4. Theme Validator

Validates theme configuration values.

```typescript
// lib/theme/validator.ts
import { z } from 'zod';

export const bioPageThemeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryTextColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  fontFamily: z.string(),
  fontSize: z.object({
    base: z.string(),
    heading: z.string(),
    small: z.string(),
  }),
  fontWeight: z.object({
    normal: z.number().min(100).max(900),
    medium: z.number().min(100).max(900),
    bold: z.number().min(100).max(900),
  }),
  spacing: z.enum(['compact', 'normal', 'relaxed']),
  padding: z.object({
    page: z.string(),
    section: z.string(),
    link: z.string(),
  }),
  layout: z.enum(['vertical', 'grid']),
  maxWidth: z.string(),
  alignment: z.enum(['left', 'center', 'right']),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']),
  borderRadius: z.number().min(0).max(50),
  borderWidth: z.number().min(0).max(10),
  shadow: z.enum(['none', 'small', 'medium', 'large']),
  avatarShape: z.enum(['circle', 'square', 'rounded']),
  avatarSize: z.enum(['small', 'medium', 'large']),
  animation: z.enum(['none', 'fade', 'slide', 'scale']),
  animationDuration: z.string(),
  backgroundType: z.enum(['solid', 'gradient', 'image']),
  backgroundGradient: z.object({
    type: z.enum(['linear', 'radial']),
    direction: z.string().optional(),
    colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)),
  }).optional(),
  backgroundImage: z.object({
    url: z.string().url(),
    position: z.enum(['cover', 'contain', 'center']),
    opacity: z.number().min(0).max(1),
  }).optional(),
});

export const bioLinkThemeConfigSchema = z.object({
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  hoverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  buttonStyle: z.enum(['solid', 'outline', 'ghost']).optional(),
  borderRadius: z.number().min(0).max(50).optional(),
  borderWidth: z.number().min(0).max(10).optional(),
  shadow: z.enum(['none', 'small', 'medium', 'large']).optional(),
  fontSize: z.string().optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  padding: z.string().optional(),
  margin: z.string().optional(),
  iconPosition: z.enum(['left', 'right', 'none']).optional(),
  iconSize: z.enum(['small', 'medium', 'large']).optional(),
  showImage: z.boolean().optional(),
  imagePosition: z.enum(['left', 'right', 'background']).optional(),
  imageSize: z.enum(['small', 'medium', 'large']).optional(),
});

export function validateThemeConfig(config: unknown) {
  return bioPageThemeConfigSchema.parse(config);
}

export function validateLinkThemeConfig(config: unknown) {
  return bioLinkThemeConfigSchema.parse(config);
}
```

### 5. Theme CSS Generator

Generates CSS from theme configuration.

```typescript
// lib/theme/css-generator.ts
import type { BioPageThemeConfig, BioLinkThemeConfig } from '@/types/theme';

export function generateThemeCSS(theme: BioPageThemeConfig): string {
  const css = `
    :root {
      /* Colors */
      --theme-primary: ${theme.primaryColor};
      --theme-secondary: ${theme.secondaryColor};
      --theme-background: ${theme.backgroundColor};
      --theme-text: ${theme.textColor};
      --theme-text-secondary: ${theme.secondaryTextColor};

      /* Typography */
      --theme-font-family: ${theme.fontFamily};
      --theme-font-size-base: ${theme.fontSize.base};
      --theme-font-size-heading: ${theme.fontSize.heading};
      --theme-font-size-small: ${theme.fontSize.small};
      --theme-font-weight-normal: ${theme.fontWeight.normal};
      --theme-font-weight-medium: ${theme.fontWeight.medium};
      --theme-font-weight-bold: ${theme.fontWeight.bold};

      /* Spacing */
      --theme-padding-page: ${theme.padding.page};
      --theme-padding-section: ${theme.padding.section};
      --theme-padding-link: ${theme.padding.link};

      /* Layout */
      --theme-max-width: ${theme.maxWidth};
      --theme-alignment: ${theme.alignment};

      /* Border */
      --theme-border-radius: ${theme.borderRadius}px;
      --theme-border-width: ${theme.borderWidth}px;

      /* Shadow */
      --theme-shadow: ${getShadowValue(theme.shadow)};

      /* Animation */
      --theme-animation-duration: ${theme.animationDuration};
    }

    .bio-page {
      font-family: var(--theme-font-family);
      background: ${getBackgroundCSS(theme)};
      color: var(--theme-text);
      text-align: var(--theme-alignment);
      max-width: var(--theme-max-width);
      margin: 0 auto;
      padding: var(--theme-padding-page);
    }

    .bio-link {
      border-radius: var(--theme-border-radius);
      padding: var(--theme-padding-link);
      ${getButtonStyleCSS(theme.buttonStyle, theme.primaryColor, theme.textColor)}
      box-shadow: var(--theme-shadow);
      ${getAnimationCSS(theme.animation)}
    }

    .bio-link:hover {
      ${getHoverCSS(theme)}
    }

    .bio-avatar {
      border-radius: ${getAvatarRadius(theme.avatarShape)};
    }
  `;

  return css;
}

function getBackgroundCSS(theme: BioPageThemeConfig): string {
  switch (theme.backgroundType) {
    case 'gradient':
      if (theme.backgroundGradient) {
        const { type, direction, colors } = theme.backgroundGradient;
        if (type === 'linear') {
          return `linear-gradient(${direction || '45deg'}, ${colors.join(', ')})`;
        } else {
          return `radial-gradient(${colors.join(', ')})`;
        }
      }
      return theme.backgroundColor;
    case 'image':
      if (theme.backgroundImage) {
        return `
          url(${theme.backgroundImage.url}) ${theme.backgroundImage.position} / cover no-repeat,
          ${theme.backgroundColor}
        `;
      }
      return theme.backgroundColor;
    default:
      return theme.backgroundColor;
  }
}

function getButtonStyleCSS(
  style: 'solid' | 'outline' | 'ghost',
  primaryColor: string,
  textColor: string
): string {
  switch (style) {
    case 'solid':
      return `
        background-color: ${primaryColor};
        color: ${textColor};
        border: none;
      `;
    case 'outline':
      return `
        background-color: transparent;
        color: ${primaryColor};
        border: var(--theme-border-width) solid ${primaryColor};
      `;
    case 'ghost':
      return `
        background-color: transparent;
        color: ${textColor};
        border: none;
      `;
  }
}

function getShadowValue(shadow: 'none' | 'small' | 'medium' | 'large'): string {
  switch (shadow) {
    case 'small':
      return '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    case 'medium':
      return '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    case 'large':
      return '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    default:
      return 'none';
  }
}

function getAnimationCSS(animation: 'none' | 'fade' | 'slide' | 'scale'): string {
  switch (animation) {
    case 'fade':
      return `
        animation: fadeIn var(--theme-animation-duration) ease-in-out;
      `;
    case 'slide':
      return `
        animation: slideIn var(--theme-animation-duration) ease-in-out;
      `;
    case 'scale':
      return `
        animation: scaleIn var(--theme-animation-duration) ease-in-out;
      `;
    default:
      return '';
  }
}

function getHoverCSS(theme: BioPageThemeConfig): string {
  return `
    transform: translateY(-2px);
    box-shadow: ${getHoverShadow(theme.shadow)};
  `;
}

function getHoverShadow(shadow: 'none' | 'small' | 'medium' | 'large'): string {
  switch (shadow) {
    case 'small':
      return '0 2px 4px 0 rgba(0, 0, 0, 0.1)';
    case 'medium':
      return '0 6px 8px -1px rgba(0, 0, 0, 0.15), 0 3px 5px -1px rgba(0, 0, 0, 0.1)';
    case 'large':
      return '0 15px 20px -3px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1)';
    default:
      return 'none';
  }
}

function getAvatarRadius(shape: 'circle' | 'square' | 'rounded'): string {
  switch (shape) {
    case 'circle':
      return '50%';
    case 'square':
      return '0';
    case 'rounded':
      return '12px';
  }
}

export function generateLinkThemeCSS(
  linkTheme: BioLinkThemeConfig,
  pageTheme: BioPageThemeConfig
): string {
  const css = `
    .bio-link.custom-theme {
      ${linkTheme.backgroundColor ? `background-color: ${linkTheme.backgroundColor};` : ''}
      ${linkTheme.textColor ? `color: ${linkTheme.textColor};` : ''}
      ${linkTheme.borderColor ? `border-color: ${linkTheme.borderColor};` : ''}
      ${linkTheme.borderRadius !== undefined ? `border-radius: ${linkTheme.borderRadius}px;` : ''}
      ${linkTheme.borderWidth !== undefined ? `border-width: ${linkTheme.borderWidth}px;` : ''}
      ${linkTheme.fontSize ? `font-size: ${linkTheme.fontSize};` : ''}
      ${linkTheme.fontWeight ? `font-weight: ${linkTheme.fontWeight};` : ''}
      ${linkTheme.padding ? `padding: ${linkTheme.padding};` : ''}
      ${linkTheme.margin ? `margin: ${linkTheme.margin};` : ''}
      ${linkTheme.shadow ? `box-shadow: ${getShadowValue(linkTheme.shadow)};` : ''}
    }

    .bio-link.custom-theme:hover {
      ${linkTheme.hoverColor ? `background-color: ${linkTheme.hoverColor};` : ''}
    }
  `;

  return css;
}
```

### 6. Default Themes

Pre-defined theme presets for new users.

```typescript
// lib/theme/default-themes.ts
import type { BioPageThemeConfig } from '@/types/theme';

export const defaultThemes: BioPageThemeConfig[] = [
  {
    name: 'Modern Blue',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    secondaryTextColor: '#6b7280',
    fontFamily: 'Inter',
    fontSize: {
      base: '16px',
      heading: '24px',
      small: '14px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    spacing: 'normal',
    padding: {
      page: '24px',
      section: '16px',
      link: '12px',
    },
    layout: 'vertical',
    maxWidth: '600px',
    alignment: 'center',
    buttonStyle: 'solid',
    borderRadius: 8,
    borderWidth: 0,
    shadow: 'small',
    avatarShape: 'circle',
    avatarSize: 'medium',
    animation: 'fade',
    animationDuration: '0.3s',
    backgroundType: 'solid',
  },
  {
    name: 'Dark Mode',
    primaryColor: '#60a5fa',
    secondaryColor: '#a78bfa',
    backgroundColor: '#111827',
    textColor: '#f9fafb',
    secondaryTextColor: '#9ca3af',
    fontFamily: 'Inter',
    fontSize: {
      base: '16px',
      heading: '24px',
      small: '14px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    spacing: 'normal',
    padding: {
      page: '24px',
      section: '16px',
      link: '12px',
    },
    layout: 'vertical',
    maxWidth: '600px',
    alignment: 'center',
    buttonStyle: 'outline',
    borderRadius: 12,
    borderWidth: 2,
    shadow: 'medium',
    avatarShape: 'circle',
    avatarSize: 'medium',
    animation: 'slide',
    animationDuration: '0.3s',
    backgroundType: 'solid',
  },
  {
    name: 'Gradient Purple',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    secondaryTextColor: '#6b7280',
    fontFamily: 'Poppins',
    fontSize: {
      base: '16px',
      heading: '24px',
      small: '14px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    spacing: 'relaxed',
    padding: {
      page: '32px',
      section: '20px',
      link: '16px',
    },
    layout: 'vertical',
    maxWidth: '600px',
    alignment: 'center',
    buttonStyle: 'solid',
    borderRadius: 16,
    borderWidth: 0,
    shadow: 'medium',
    avatarShape: 'circle',
    avatarSize: 'large',
    animation: 'scale',
    animationDuration: '0.3s',
    backgroundType: 'gradient',
    backgroundGradient: {
      type: 'linear',
      direction: '135deg',
      colors: ['#667eea', '#764ba2'],
    },
  },
];

export function getDefaultTheme(): BioPageThemeConfig {
  return defaultThemes[0];
}
```

## Frontend Components

### 1. Theme Editor Component

Interactive theme editor with live preview.

```typescript
// components/theme/theme-editor.tsx
'use client';

import * as React from 'react';
import { useTheme } from './theme-context';
import { ColorPicker } from './color-picker';
import { FontSelector } from './font-selector';
import { SliderControl } from './slider-control';
import { SelectControl } from './select-control';

export function ThemeEditor() {
  const { theme, updateTheme } = useTheme();

  return (
    <div className="theme-editor">
      <h2>Theme Settings</h2>

      {/* Color Settings */}
      <section>
        <h3>Colors</h3>
        <ColorPicker
          label="Primary Color"
          value={theme.primaryColor}
          onChange={(color) => updateTheme({ primaryColor: color })}
        />
        <ColorPicker
          label="Secondary Color"
          value={theme.secondaryColor}
          onChange={(color) => updateTheme({ secondaryColor: color })}
        />
        <ColorPicker
          label="Background Color"
          value={theme.backgroundColor}
          onChange={(color) => updateTheme({ backgroundColor: color })}
        />
        <ColorPicker
          label="Text Color"
          value={theme.textColor}
          onChange={(color) => updateTheme({ textColor: color })}
        />
      </section>

      {/* Typography Settings */}
      <section>
        <h3>Typography</h3>
        <FontSelector
          label="Font Family"
          value={theme.fontFamily}
          onChange={(font) => updateTheme({ fontFamily: font })}
        />
        <SliderControl
          label="Font Size"
          value={parseInt(theme.fontSize.base)}
          min={12}
          max={24}
          onChange={(size) => updateTheme({
            fontSize: {
              ...theme.fontSize,
              base: `${size}px`,
            }
          })}
        />
      </section>

      {/* Layout Settings */}
      <section>
        <h3>Layout</h3>
        <SelectControl
          label="Layout"
          value={theme.layout}
          options={[
            { value: 'vertical', label: 'Vertical' },
            { value: 'grid', label: 'Grid' },
          ]}
          onChange={(layout) => updateTheme({ layout })}
        />
        <SelectControl
          label="Alignment"
          value={theme.alignment}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
          onChange={(alignment) => updateTheme({ alignment })}
        />
      </section>

      {/* Button Style Settings */}
      <section>
        <h3>Button Style</h3>
        <SelectControl
          label="Button Style"
          value={theme.buttonStyle}
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'outline', label: 'Outline' },
            { value: 'ghost', label: 'Ghost' },
          ]}
          onChange={(buttonStyle) => updateTheme({ buttonStyle })}
        />
        <SliderControl
          label="Border Radius"
          value={theme.borderRadius}
          min={0}
          max={50}
          onChange={(radius) => updateTheme({ borderRadius: radius })}
        />
      </section>

      {/* Spacing Settings */}
      <section>
        <h3>Spacing</h3>
        <SelectControl
          label="Spacing"
          value={theme.spacing}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'normal', label: 'Normal' },
            { value: 'relaxed', label: 'Relaxed' },
          ]}
          onChange={(spacing) => updateTheme({ spacing })}
        />
      </section>
    </div>
  );
}
```

### 2. Theme Preset Selector

Component for selecting and applying theme presets.

```typescript
// components/theme/theme-preset-selector.tsx
'use client';

import * as React from 'react';
import { ThemePresetManager } from '@/lib/theme/preset-manager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ThemePresetSelectorProps {
  bioPageId: string;
  onPresetApplied: () => void;
}

export function ThemePresetSelector({ bioPageId, onPresetApplied }: ThemePresetSelectorProps) {
  const [presets, setPresets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPresets() {
      try {
        const [systemPresets, userPresets] = await Promise.all([
          ThemePresetManager.getSystemPresets(),
          ThemePresetManager.getUserPresets(userId),
        ]);
        setPresets([...systemPresets, ...userPresets]);
      } catch (error) {
        console.error('Failed to load presets:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPresets();
  }, []);

  async function handleApplyPreset(presetId: string) {
    try {
      await ThemePresetManager.applyPreset(presetId, bioPageId);
      onPresetApplied();
    } catch (error) {
      console.error('Failed to apply preset:', error);
    }
  }

  if (loading) {
    return <div>Loading presets...</div>;
  }

  return (
    <div className="theme-preset-selector">
      <h2>Theme Presets</h2>
      <div className="preset-grid">
        {presets.map((preset) => (
          <Card key={preset.id} className="preset-card">
            {preset.thumbnailUrl && (
              <img src={preset.thumbnailUrl} alt={preset.name} />
            )}
            <h3>{preset.name}</h3>
            <p>{preset.description}</p>
            <Button onClick={() => handleApplyPreset(preset.id)}>
              Apply
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 3. Live Preview Component

Real-time preview of the bio page with applied theme.

```typescript
// components/theme/live-preview.tsx
'use client';

import * as React from 'react';
import { useTheme } from './theme-context';
import { generateThemeCSS } from '@/lib/theme/css-generator';

interface LivePreviewProps {
  bioPage: {
    title: string;
    description: string;
    avatarUrl: string;
    links: Array<{
      title: string;
      url: string;
      iconUrl?: string;
    }>;
  };
}

export function LivePreview({ bioPage }: LivePreviewProps) {
  const { theme } = useTheme();
  const themeCSS = generateThemeCSS(theme);

  return (
    <div className="live-preview">
      <style>{themeCSS}</style>
      <div className="bio-page">
        {bioPage.avatarUrl && (
          <img
            src={bioPage.avatarUrl}
            alt={bioPage.title}
            className="bio-avatar"
          />
        )}
        <h1 className="bio-title">{bioPage.title}</h1>
        {bioPage.description && (
          <p className="bio-description">{bioPage.description}</p>
        )}
        <div className="bio-links">
          {bioPage.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className="bio-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.iconUrl && (
                <img src={link.iconUrl} alt="" className="link-icon" />
              )}
              <span>{link.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Theme System Features

### 1. Theme Inheritance

- Bio page theme provides default values
- Individual link themes override page theme
- Cascading priority: Link theme > Page theme > Default theme

### 2. Theme Presets

- System presets: Pre-defined themes available to all users
- User presets: Custom themes created by users
- Duplicate presets: Copy existing presets for customization
- Apply presets: One-click theme application

### 3. Theme Validation

- Color validation: Hex format (#RRGGBB)
- Font validation: Valid font family names
- Range validation: Numeric values within acceptable ranges
- Type validation: Correct data types for all properties

### 4. Theme Persistence

- Theme configs stored as JSONB in database
- Efficient serialization/deserialization
- Version control for theme changes
- Rollback capability

### 5. Theme Performance

- CSS generation on demand
- Minimal runtime overhead
- Efficient theme application
- Lazy loading of theme resources

## Integration Points

### 1. Bio Page Editor

- Theme editor integrated into bio page editing flow
- Live preview shows theme changes in real-time
- Theme presets accessible from editor

### 2. Link Editor

- Individual link theme customization
- Override page theme for specific links
- Preview link styling in context

### 3. Public Bio Page View

- Apply stored theme configuration
- Generate CSS dynamically
- Optimize for performance

### 4. Analytics Dashboard

- Theme usage statistics
- Popular themes tracking
- Theme performance metrics

## Security Considerations

1. **Input Validation**: All theme inputs validated before storage
2. **CSS Injection Prevention**: Sanitize all user-provided values
3. **XSS Prevention**: Escape all dynamic content
4. **Resource Limits**: Limit theme complexity to prevent performance issues
5. **Access Control**: Users can only access their own presets

## Future Enhancements

1. **AI Theme Generation**: Use AI to generate theme suggestions
2. **Theme Import/Export**: Share themes between users
3. **Theme Marketplace**: Community theme sharing
4. **Advanced Animations**: Custom animation configurations
5. **Responsive Themes**: Different themes for different screen sizes
6. **Dark/Light Mode**: Automatic theme switching based on system preference
7. **Theme Analytics**: Track which themes perform best
8. **A/B Testing**: Test different themes for conversion optimization
