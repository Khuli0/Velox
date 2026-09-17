import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminProductService, type ProductInput, type VariantInput } from '../services/adminProductService';
import { useToastStore } from '../contexts/toastStore';

export function useAdminProducts() {
  return useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => adminProductService.listAll(),
  });
}

export function useAdminProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: () => adminProductService.getById(id as string),
    enabled: Boolean(id),
  });
}

/** Mutations de produto, variantes e imagens, todas invalidando as queries relevantes. */
export function useAdminProductMutations(productId?: string) {
  const queryClient = useQueryClient();
  const push = useToastStore((s) => s.push);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'product', productId] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }

  const createProduct = useMutation({
    mutationFn: (input: ProductInput) => adminProductService.create(input),
    onSuccess: () => {
      invalidate();
      push('Product created', 'success');
    },
    onError: (err) => push(err instanceof Error ? err.message : 'Could not create the product', 'error'),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ProductInput> }) =>
      adminProductService.update(id, input),
    onSuccess: () => {
      invalidate();
      push('Product updated', 'success');
    },
    onError: (err) => push(err instanceof Error ? err.message : 'Could not save the product', 'error'),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => adminProductService.remove(id),
    onSuccess: () => {
      invalidate();
      push('Product removed', 'success');
    },
    onError: () => push('Could not remove the product', 'error'),
  });

  const addVariant = useMutation({
    mutationFn: (input: VariantInput) => adminProductService.addVariant(productId!, input),
    onSuccess: () => {
      invalidate();
      push('Variant added', 'success');
    },
    onError: (err) => push(err instanceof Error ? err.message : 'Could not add the variant', 'error'),
  });

  const updateVariant = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<VariantInput> }) =>
      adminProductService.updateVariant(id, input),
    onSuccess: () => {
      invalidate();
      push('Stock updated', 'success');
    },
    onError: () => push('Could not update the variant', 'error'),
  });

  const removeVariant = useMutation({
    mutationFn: (id: string) => adminProductService.removeVariant(id),
    onSuccess: () => {
      invalidate();
      push('Variant removed', 'success');
    },
    onError: () => push('Could not remove the variant', 'error'),
  });

  const uploadImage = useMutation({
    mutationFn: async ({ file, sortOrder, altText }: { file: File; sortOrder: number; altText: string }) => {
      const url = await adminProductService.uploadImageFile(productId!, file);
      return adminProductService.addImage(productId!, url, altText, sortOrder);
    },
    onSuccess: () => {
      invalidate();
      push('Image uploaded', 'success');
    },
    onError: (err) => push(err instanceof Error ? err.message : 'Could not upload the image', 'error'),
  });

  const removeImage = useMutation({
    mutationFn: (id: string) => adminProductService.removeImage(id),
    onSuccess: () => {
      invalidate();
      push('Image removed', 'success');
    },
    onError: () => push('Could not remove the image', 'error'),
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    addVariant,
    updateVariant,
    removeVariant,
    uploadImage,
    removeImage,
  };
}
