import { supabase } from '../lib/supabase';
import type { Product, ProductImage, ProductStatus, ProductVariant } from '../types/product';

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(*),
  variants:product_variants(*)
`;

export interface ProductInput {
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
}

export interface VariantInput {
  size: string;
  color: string | null;
  sku: string | null;
  stock: number;
  price: number | null;
}

function sortImages(product: Product): Product {
  return {
    ...product,
    images: [...(product.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

export const adminProductService = {
  /** Lists all products, including draft/archived — only admins see this via RLS. */
  async listAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(sortImages);
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? sortImages(data as Product) : null;
  },

  async create(input: ProductInput): Promise<Product> {
    const { data, error } = await supabase.from('products').insert(input).select(PRODUCT_SELECT).single();
    if (error) throw error;
    return data as Product;
  },

  async update(id: string, input: Partial<ProductInput>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(input)
      .eq('id', id)
      .select(PRODUCT_SELECT)
      .single();
    if (error) throw error;
    return data as Product;
  },

  async remove(id: string): Promise<void> {
    // product_images and product_variants have ON DELETE CASCADE — removed along with the product.
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },

  // -------------------- Variantes --------------------

  async addVariant(productId: string, input: VariantInput): Promise<ProductVariant> {
    const { data, error } = await supabase
      .from('product_variants')
      .insert({ ...input, product_id: productId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateVariant(id: string, input: Partial<VariantInput>): Promise<ProductVariant> {
    const { data, error } = await supabase
      .from('product_variants')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeVariant(id: string): Promise<void> {
    const { error } = await supabase.from('product_variants').delete().eq('id', id);
    if (error) throw error;
  },

  // -------------------- Imagens --------------------

  /** Uploads the file to Storage and returns the public URL. */
  async uploadImageFile(productId: string, file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `${productId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data.publicUrl;
  },

  async addImage(
    productId: string,
    imageUrl: string,
    altText: string,
    sortOrder: number
  ): Promise<ProductImage> {
    const { data, error } = await supabase
      .from('product_images')
      .insert({ product_id: productId, image_url: imageUrl, alt_text: altText, sort_order: sortOrder })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeImage(id: string): Promise<void> {
    const { error } = await supabase.from('product_images').delete().eq('id', id);
    if (error) throw error;
  },

  async listCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
};
