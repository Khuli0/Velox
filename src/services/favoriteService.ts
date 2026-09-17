import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(*),
  variants:product_variants(*)
`;

export const favoriteService = {
  async list(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`product:products(${PRODUCT_SELECT})`)
      .eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).map((row: any) => row.product).filter(Boolean);
  },

  async listIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase.from('favorites').select('product_id').eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).map((row) => row.product_id);
  },

  async add(userId: string, productId: string) {
    const { error } = await supabase.from('favorites').insert({ user_id: userId, product_id: productId });
    if (error) throw error;
  },

  async remove(userId: string, productId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
  },
};
