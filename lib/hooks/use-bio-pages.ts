import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface BioPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  isActive: boolean;
  themePresetId?: string;
  themeConfig?: unknown;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export function useBioPages() {
  const queryClient = useQueryClient();

  const {
    data: bioPages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bio-pages'],
    queryFn: async () => {
      const response = await fetch('/api/v1/bio-pages');
      if (!response.ok) throw new Error('Failed to fetch bio pages');
      const result = await response.json();
      return result.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await fetch('/api/v1/bio-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create bio page');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
      const response = await fetch(`/api/v1/bio-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update bio page');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/v1/bio-pages/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete bio page');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(
        `/api/v1/bio-pages/${id}/toggle-visibility`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive }),
        }
      );
      if (!response.ok) throw new Error('Failed to toggle visibility');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-pages'] });
    },
  });

  return {
    bioPages,
    loading: isLoading,
    error,
    createPage: createMutation.mutateAsync,
    updatePage: updateMutation.mutateAsync,
    deletePage: deleteMutation.mutateAsync,
    toggleVisibility: toggleVisibilityMutation.mutateAsync,
  };
}
