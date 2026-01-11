/**
 * Test render helpers for React components
 */

import { render, renderHook, type RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render function that includes any providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    // Add any providers here as needed
    // For example: ThemeProvider, QueryClientProvider, etc.
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
}

/**
 * Custom render hook function that includes any providers
 */
export function renderHookWithProviders<TResult, TProps>(
  callback: (props: TProps) => TResult,
  options?: {
    initialProps?: TProps;
  }
) {
  return renderHook(callback, {
    wrapper: ({ children }) => {
      // Add any providers here as needed
      return <>{children}</>;
    },
    ...options,
  });
}

/**
 * Re-export all testing library utilities
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
