import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface BioLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  iconUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
}

export function useBioLinks(bioPageId: string) {
  const queryClient = useQueryClient();

  const {
    data: links = [] as BioLink[],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bio-links', bioPageId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/bio-pages/${bioPageId}/links`);
      if (!response.ok) throw new Error('Failed to fetch links');
      const result = await response.json();
      return result.data;
    },
    enabled: !!bioPageId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await fetch(`/api/v1/bio-pages/${bioPageId}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create link');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ linkId, data }: { linkId: string; data: unknown }) => {
      const response = await fetch(
        `/api/v1/bio-pages/${bioPageId}/links/${linkId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error('Failed to update link');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const response = await fetch(
        `/api/v1/bio-pages/${bioPageId}/links/${linkId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Failed to delete link');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (links: Array<{ id: string; order: number }>) => {
      const response = await fetch(
        `/api/v1/bio-pages/${bioPageId}/links/reorder`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ links }),
        }
      );
      if (!response.ok) throw new Error('Failed to reorder links');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-links', bioPageId] });
    },
  });

  return {
    links,
    loading: isLoading,
    error,
    createLink: createMutation.mutateAsync,
    updateLink: updateMutation.mutateAsync,
    deleteLink: deleteMutation.mutateAsync,
    reorderLinks: reorderMutation.mutateAsync,
  };
}
