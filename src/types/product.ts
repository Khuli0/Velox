export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string | null;
  sku: string | null;
  stock: number;
  price: number | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  brand: string | null;
  status: ProductStatus;
  featured: boolean;
  is_new: boolean;
  is_sale: boolean;
  created_at: string;
  updated_at: string;
  // relations (populated via joins)
  category?: Category | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductFilters {
  categorySlug?: string;
  size?: string[];
  color?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

// Reserved for future reviews table — kept here so ProductInfo/PDP
// components can reference the shape without a future refactor.
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
}
