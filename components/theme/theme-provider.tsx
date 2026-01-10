'use client';

import * as React from 'react';
import type { BioPageThemeConfig } from '@/lib/theme/types';
import { getDefaultTheme } from '@/lib/theme/default-themes';

interface ThemeContextValue {
  theme: BioPageThemeConfig;
  updateTheme: (updates: Partial<BioPageThemeConfig>) => void;
  resetTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key as keyof T];

      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key as keyof T] = deepMerge(targetValue, sourceValue) as T[keyof T];
      } else {
        result[key as keyof T] = sourceValue as T[keyof T];
      }
    }
  }

  return result;
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: BioPageThemeConfig;
}) {
  const [theme, setTheme] = React.useState<BioPageThemeConfig>(
    initialTheme || getDefaultTheme()
  );

  const updateTheme = React.useCallback(
    (updates: Partial<BioPageThemeConfig>) => {
      setTheme((prev) => deepMerge(prev, updates));
    },
    []
  );

  const resetTheme = React.useCallback(() => {
    setTheme(getDefaultTheme());
  }, []);

  const value = React.useMemo(
    () => ({ theme, updateTheme, resetTheme }),
    [theme, updateTheme, resetTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
