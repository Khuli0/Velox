import { supabase } from '../lib/supabase';
import type { Product, ProductFilters, SortOption } from '../types/product';

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(*),
  variants:product_variants(*)
`;

function applySort(query: any, sort: SortOption) {
  switch (sort) {
    case 'newest':
      return query.order('created_at', { ascending: false });
    case 'price-asc':
      return query.order('price', { ascending: true });
    case 'price-desc':
      return query.order('price', { ascending: false });
    case 'featured':
    default:
      return query.order('featured', { ascending: false }).order('created_at', { ascending: false });
  }
}

export const productService = {
  async list(filters: ProductFilters = {}, sort: SortOption = 'featured'): Promise<Product[]> {
    let query = supabase.from('products').select(PRODUCT_SELECT).eq('status', 'active');

    if (filters.categorySlug === 'sale') {
      query = query.eq('is_sale', true);
    } else if (filters.categorySlug) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.categorySlug)
        .single();
      if (category) query = query.eq('category_id', category.id);
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);

    query = applySort(query, sort);

    const { data, error } = await query;
    if (error) throw error;

    let products = (data ?? []) as Product[];

    // filters that depend on variants (applied in memory since they involve 1:N)
    if (filters.size?.length) {
      products = products.filter((p) =>
        p.variants?.some((v) => filters.size!.includes(v.size))
      );
    }
    if (filters.color?.length) {
      products = products.filter((p) =>
        p.variants?.some((v) => v.color && filters.color!.includes(v.color))
      );
    }
    if (filters.inStockOnly) {
      products = products.filter((p) => p.variants?.some((v) => v.stock > 0));
    }

    return products.map(sortImages);
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data ? sortImages(data as Product) : null;
  },

  async listFeatured(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('status', 'active')
      .eq('featured', true)
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(sortImages);
  },

  async listNewArrivals(limit = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('status', 'active')
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(sortImages);
  },

  async listSale(limit = 12): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('status', 'active')
      .eq('is_sale', true)
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(sortImages);
  },

  async listRelated(product: Product, limit = 4): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('status', 'active')
      .neq('id', product.id)
      .limit(limit);

    if (product.category_id) query = query.eq('category_id', product.category_id);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(sortImages);
  },

  async search(term: string, limit = 6): Promise<Product[]> {
    if (!term.trim()) return [];
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('status', 'active')
      .ilike('name', `%${term}%`)
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(sortImages);
  },

  async listCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
};

function sortImages(product: Product): Product {
  return {
    ...product,
    images: [...(product.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}
