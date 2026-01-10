'use client';

import * as React from 'react';
import { useBioLinks } from '@/lib/hooks/use-bio-links';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';

interface BioLinkEditorProps {
  bioPageId: string;
  linkId?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function BioLinkEditor({
  bioPageId,
  linkId,
  onCancel,
  onSuccess,
}: BioLinkEditorProps) {
  const { createLink, updateLink } = useBioLinks(bioPageId);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    url: '',
    description: '',
    iconUrl: '',
    imageUrl: '',
    isActive: true,
  });

  React.useEffect(() => {
    if (linkId) {
      fetch(`/api/v1/bio-pages/${bioPageId}/links/${linkId}`)
        .then((res) => res.json())
        .then((result) => {
          const data = result.data;
          setFormData({
            title: data.title || '',
            url: data.url || '',
            description: data.description || '',
            iconUrl: data.iconUrl || '',
            imageUrl: data.imageUrl || '',
            isActive: data.isActive ?? true,
          });
        });
    }
  }, [linkId, bioPageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (linkId) {
        await updateLink({ linkId, data: formData });
      } else {
        await createLink(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save link:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {linkId ? 'Edit Link' : 'Add New Link'}
        </h3>
        <button onClick={onCancel} className="rounded-md p-1 hover:bg-gray-100">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="My Website"
              required
              maxLength={100}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700"
            >
              URL <span className="text-red-500">*</span>
            </label>
            <input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://example.com"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Brief description of the link..."
            rows={2}
            maxLength={200}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="iconUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Icon URL
            </label>
            <input
              id="iconUrl"
              type="url"
              value={formData.iconUrl}
              onChange={(e) =>
                setFormData({ ...formData, iconUrl: e.target.value })
              }
              placeholder="https://example.com/icon.png"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {formData.iconUrl && (
          <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
            <img
              src={formData.iconUrl}
              alt="Icon preview"
              className="h-8 w-8 rounded object-cover"
            />
            <span className="text-sm text-gray-600">Icon preview</span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Visible on page
            </label>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {linkId ? 'Save Changes' : 'Add Link'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
