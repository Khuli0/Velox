import { supabase } from '../lib/supabase';
import type { Address } from '../types/user';

export type AddressInput = Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const addressService = {
  async list(userId: string): Promise<Address[]> {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, input: AddressInput): Promise<Address> {
    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...input, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, input: Partial<AddressInput>): Promise<Address> {
    const { data, error } = await supabase.from('addresses').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) throw error;
  },

  async setDefault(userId: string, id: string) {
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  },
};
