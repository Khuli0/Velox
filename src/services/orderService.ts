import { supabase } from '../lib/supabase';
import type { Order, OrderItem, PaymentMethod, ShippingAddressSnapshot } from '../types/order';
import type { CartItem } from '../types/cart';

interface CreateOrderInput {
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddressSnapshot;
  paymentMethod: PaymentMethod;
}

export const orderService = {
  async list(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Order[];
  },

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as unknown as Order | null;
  },

  /**
   * Simulates creating a paid order. No real payment gateway is
   * called — this is a checkout simulation per the project scope.
   */
  async create(input: CreateOrderInput): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: input.userId,
        status: 'processing',
        subtotal: input.subtotal,
        shipping: input.shipping,
        total: input.total,
        shipping_address: input.shippingAddress,
        payment_method: input.paymentMethod,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const itemsPayload: Omit<OrderItem, 'id'>[] = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
    if (itemsError) throw itemsError;

    return { ...order, items: itemsPayload } as unknown as Order;
  },
};
