'use client';

import * as React from 'react';
import Link from 'next/link';
import { MoreVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BioPageCardProps {
  bioPage: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    avatarUrl?: string;
    isActive: boolean;
    linkCount?: number;
    createdAt: string;
    updatedAt: string;
  };
  onToggleVisibility: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BioPageCard({
  bioPage,
  onToggleVisibility,
  onEdit,
  onDelete,
}: BioPageCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
          {showMenu && (
            <div className="absolute top-full right-0 z-20 mt-1 w-40 rounded-md border border-gray-200 bg-white p-1 shadow-lg">
              <button
                onClick={() => {
                  onEdit(bioPage.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onToggleVisibility(bioPage.id, !bioPage.isActive);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {bioPage.isActive ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {bioPage.isActive ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => {
                  onDelete(bioPage.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {bioPage.avatarUrl && (
          <img
            src={bioPage.avatarUrl}
            alt={bioPage.title}
            className="h-16 w-16 rounded-full object-cover"
          />
        )}

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {bioPage.title}
          </h3>
          {bioPage.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {bioPage.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
                bioPage.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {bioPage.isActive ? 'Active' : 'Inactive'}
            </span>
            {bioPage.linkCount !== undefined && (
              <span>{bioPage.linkCount} links</span>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>Last updated {formatDate(bioPage.updatedAt)}</span>
          <Link
            href={`/${bioPage.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            View page
          </Link>
        </div>
      </div>
    </div>
  );
}
