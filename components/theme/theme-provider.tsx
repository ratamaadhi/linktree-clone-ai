'use client';

import * as React from 'react';
import type { BioPageThemeConfig } from '@/lib/theme/types';
import { getDefaultTheme } from '@/lib/theme/default-themes';
import { deepMerge } from '@/lib/utils/merge';

interface ThemeContextValue {
  theme: BioPageThemeConfig;
  updateTheme: (updates: Partial<BioPageThemeConfig>) => void;
  resetTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

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
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
