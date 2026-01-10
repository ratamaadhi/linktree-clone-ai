'use client';

import * as React from 'react';
import { useBioPages, type BioPage } from '@/lib/hooks/use-bio-pages';
import { BioPageCard } from './bio-page-card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export function BioPageList() {
  const { bioPages, loading, error, deletePage, toggleVisibility } =
    useBioPages();

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-lg font-semibold text-gray-900">
          Failed to load bio pages
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please try again later or contact support.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (loading && bioPages.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (bioPages.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Plus className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">
          No bio pages yet
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Create your first bio page to get started.
        </p>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Create Bio Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bio Pages</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your bio pages and links
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Bio Page
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bioPages.map((page: BioPage) => (
          <BioPageCard
            key={page.id}
            bioPage={{
              ...page,
              linkCount: 0,
            }}
            onEdit={(id: string) => {
              window.location.href = `/dashboard/bio-pages/${id}`;
            }}
            onDelete={(id: string) => deletePage(id)}
            onToggleVisibility={(id: string, isActive: boolean) =>
              toggleVisibility({ id, isActive })
            }
          />
        ))}
      </div>
    </div>
  );
}
