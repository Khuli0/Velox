import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../contexts/AuthContext';
import { useToastStore } from '../contexts/toastStore';

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const push = useToastStore((s) => s.push);

  const favoritesQuery = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => favoriteService.list(user!.id),
    enabled: Boolean(user),
  });

  const idsQuery = useQuery({
    queryKey: ['favorite-ids', user?.id],
    queryFn: () => favoriteService.listIds(user!.id),
    enabled: Boolean(user),
  });

  const toggle = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('not-authenticated');
      const ids = idsQuery.data ?? [];
      if (ids.includes(productId)) {
        await favoriteService.remove(user.id, productId);
        return { productId, added: false };
      }
      await favoriteService.add(user.id, productId);
      return { productId, added: true };
    },
    onSuccess: ({ added }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['favorite-ids', user?.id] });
      push(added ? 'Added to wishlist' : 'Removed from wishlist', 'success');
    },
    onError: () => push('Could not update your wishlist', 'error'),
  });

  return {
    favorites: favoritesQuery.data ?? [],
    favoriteIds: idsQuery.data ?? [],
    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,
    toggleFavorite: toggle.mutate,
    isAuthenticated: Boolean(user),
  };
}
