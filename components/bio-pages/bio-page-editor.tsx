'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useBioPages } from '@/lib/hooks/use-bio-pages';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface BioPageEditorProps {
  bioPageId?: string;
}

export function BioPageEditor({ bioPageId }: BioPageEditorProps) {
  const router = useRouter();
  const { createPage, updatePage } = useBioPages();
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    slug: '',
    description: '',
    avatarUrl: '',
    isActive: true,
  });

  React.useEffect(() => {
    if (bioPageId) {
      fetch(`/api/v1/bio-pages/${bioPageId}`)
        .then((res) => res.json())
        .then((result) => {
          const data = result.data;
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            description: data.description || '',
            avatarUrl: data.avatarUrl || '',
            isActive: data.isActive ?? true,
          });
        });
    }
  }, [bioPageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (bioPageId) {
        await updatePage({ id: bioPageId, data: formData });
      } else {
        const newPage = await createPage(formData);
        router.push(`/dashboard/bio-pages/${newPage.id}`);
      }
    } catch (error) {
      console.error('Failed to save bio page:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: formData.slug || generateSlug(value),
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {bioPageId ? 'Edit Bio Page' : 'Create Bio Page'}
          </h1>
          <p className="text-sm text-gray-600">
            Configure your bio page settings
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
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
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="My Bio Page"
              required
              maxLength={100}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="my-bio-page"
              required
              pattern="[a-z0-9-]+"
              maxLength={50}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500">
              Your page URL: {window.location.origin}/{formData.slug}
            </p>
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
            placeholder="Tell visitors about yourself..."
            rows={3}
            maxLength={500}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="avatarUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            type="url"
            value={formData.avatarUrl}
            onChange={(e) =>
              setFormData({ ...formData, avatarUrl: e.target.value })
            }
            placeholder="https://example.com/avatar.jpg"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          {formData.avatarUrl && (
            <img
              src={formData.avatarUrl}
              alt="Avatar preview"
              className="mt-2 h-16 w-16 rounded-full object-cover"
            />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
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
              Published
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
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
                  {bioPageId ? 'Save Changes' : 'Create Page'}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
