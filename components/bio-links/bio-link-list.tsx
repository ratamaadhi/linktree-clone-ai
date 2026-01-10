'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBioLinks, type BioLink } from '@/lib/hooks/use-bio-links';
import { BioLinkCard } from './bio-link-card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

function SortableBioLinkCard({
  bioLink,
  onToggleVisibility,
  onEdit,
  onDelete,
}: {
  bioLink: BioLink;
  onToggleVisibility: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bioLink.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BioLinkCard
        bioLink={bioLink}
        isDragging={isDragging}
        onToggleVisibility={onToggleVisibility}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

interface BioLinkListProps {
  bioPageId: string;
  onEditLink: (linkId: string) => void;
}

export function BioLinkList({ bioPageId, onEditLink }: BioLinkListProps) {
  const { links, loading, error, deleteLink, updateLink, reorderLinks } =
    useBioLinks(bioPageId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-lg font-semibold text-gray-900">
          Failed to load links
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex(
        (link: BioLink) => link.id === active.id
      );
      const newIndex = links.findIndex((link: BioLink) => link.id === over.id);

      const reorderedLinks = arrayMove(
        links as BioLink[],
        oldIndex,
        newIndex
      ).map((link: BioLink, index: number) => ({
        id: link.id,
        order: index,
      }));

      await reorderLinks(reorderedLinks);
    }
  };

  if (links.length === 0 && !loading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
        <Plus className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-900">No links yet</h2>
        <p className="mt-2 text-sm text-gray-600">
          Add your first link to get started.
        </p>
        <Button className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Links ({links.length})
          </h2>
          <p className="text-sm text-gray-600">
            Drag to reorder, click menu for options
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      {loading && links.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((link: BioLink) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {links.map((link: BioLink) => (
                <SortableBioLinkCard
                  key={link.id}
                  bioLink={link}
                  onToggleVisibility={(id: string, isActive: boolean) =>
                    updateLink({ linkId: id, data: { isActive } })
                  }
                  onEdit={(id: string) => onEditLink(id)}
                  onDelete={(id: string) => deleteLink(id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
