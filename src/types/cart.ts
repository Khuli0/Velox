export interface CartItem {
  /** stable key = productId + size + color */
  key: string;
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  image: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  stock: number;
}

export interface CartState {
  items: CartItem[];
}
