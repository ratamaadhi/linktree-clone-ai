'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again later or contact support.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6',
        className
      )}
    >
      <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title = 'No items found',
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6',
        className
      )}
    >
      {icon || (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl text-gray-400">📭</span>
        </div>
      )}
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
