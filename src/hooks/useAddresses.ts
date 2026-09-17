import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressService, type AddressInput } from '../services/addressService';
import { useAuth } from '../contexts/AuthContext';
import { useToastStore } from '../contexts/toastStore';

export function useAddresses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const push = useToastStore((s) => s.push);

  const query = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => addressService.list(user!.id),
    enabled: Boolean(user),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
  }

  const create = useMutation({
    mutationFn: (input: AddressInput) => addressService.create(user!.id, input),
    onSuccess: () => {
      invalidate();
      push('Address added', 'success');
    },
    onError: () => push('Could not save the address', 'error'),
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AddressInput> }) =>
      addressService.update(id, input),
    onSuccess: () => {
      invalidate();
      push('Address updated', 'success');
    },
    onError: () => push('Could not update the address', 'error'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => addressService.remove(id),
    onSuccess: () => {
      invalidate();
      push('Address removed', 'success');
    },
    onError: () => push('Could not remove the address', 'error'),
  });

  const setDefault = useMutation({
    mutationFn: (id: string) => addressService.setDefault(user!.id, id),
    onSuccess: invalidate,
  });

  return {
    addresses: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    createAddress: create.mutate,
    updateAddress: update.mutate,
    removeAddress: remove.mutate,
    setDefaultAddress: setDefault.mutate,
  };
}
