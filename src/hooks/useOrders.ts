import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

export function useOrders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => orderService.list(user!.id),
    enabled: Boolean(user),
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id as string),
    enabled: Boolean(id),
  });
}
