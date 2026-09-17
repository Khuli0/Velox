import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { Product, ProductFilters, SortOption } from '../types/product';

export function useProducts(filters: ProductFilters, sort: SortOption) {
  return useQuery({
    queryKey: ['products', filters, sort],
    queryFn: () => productService.list(filters, sort),
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => productService.listFeatured(limit),
  });
}

export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: ['products', 'new', limit],
    queryFn: () => productService.listNewArrivals(limit),
  });
}

export function useSaleProducts(limit = 12) {
  return useQuery({
    queryKey: ['products', 'sale', limit],
    queryFn: () => productService.listSale(limit),
  });
}

export function useRelatedProducts(product: Product | null | undefined) {
  return useQuery({
    queryKey: ['products', 'related', product?.id],
    queryFn: () => productService.listRelated(product as Product),
    enabled: Boolean(product),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.listCategories(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useProductSearch(term: string) {
  return useQuery({
    queryKey: ['products', 'search', term],
    queryFn: () => productService.search(term),
    enabled: term.trim().length > 1,
  });
}
