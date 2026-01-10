'use client';

import * as React from 'react';
import { MoreVertical, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BioLinkCardProps {
  bioLink: {
    id: string;
    title: string;
    url: string;
    description?: string;
    iconUrl?: string;
    imageUrl?: string;
    isActive: boolean;
    order: number;
  };
  isDragging?: boolean;
  onToggleVisibility: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BioLinkCard({
  bioLink,
  isDragging = false,
  onToggleVisibility,
  onEdit,
  onDelete,
}: BioLinkCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all',
        isDragging ? 'opacity-50 shadow-lg' : 'hover:shadow-md',
        !bioLink.isActive && 'opacity-60'
      )}
    >
      <div className="flex cursor-grab text-gray-400 hover:text-gray-600">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>

      {bioLink.iconUrl && (
        <img
          src={bioLink.iconUrl}
          alt={bioLink.title}
          className="h-8 w-8 rounded object-cover"
        />
      )}

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-gray-900">
          {bioLink.title}
        </h4>
        <a
          href={bioLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-xs text-gray-500 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {bioLink.url}
        </a>
        {bioLink.description && (
          <p className="mt-1 line-clamp-1 text-xs text-gray-500">
            {bioLink.description}
          </p>
        )}
      </div>

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
                  onEdit(bioLink.id);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onToggleVisibility(bioLink.id, !bioLink.isActive);
                  setShowMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {bioLink.isActive ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {bioLink.isActive ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => {
                  onDelete(bioLink.id);
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
    </div>
  );
}
