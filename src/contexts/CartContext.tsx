import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '../types/cart';

const STORAGE_KEY = 'velox_cart_v1';

interface AddToCartInput {
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

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function makeKey(productId: string, size: string | null, color: string | null) {
  return [productId, size ?? '-', color ?? '-'].join('::');
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStorage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem: (input) => {
        const key = makeKey(input.productId, input.size, input.color);
        setItems((prev) => {
          const existing = prev.find((i) => i.key === key);
          if (existing) {
            const nextQty = Math.min(existing.quantity + input.quantity, input.stock);
            return prev.map((i) => (i.key === key ? { ...i, quantity: nextQty } : i));
          }
          return [
            ...prev,
            {
              key,
              productId: input.productId,
              variantId: input.variantId,
              slug: input.slug,
              name: input.name,
              image: input.image,
              size: input.size,
              color: input.color,
              price: input.price,
              quantity: Math.min(input.quantity, input.stock),
              stock: input.stock,
            },
          ];
        });
      },
      updateQuantity: (key, quantity) => {
        setItems((prev) =>
          prev
            .map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i))
            .filter((i) => i.quantity > 0)
        );
      },
      removeItem: (key) => {
        setItems((prev) => prev.filter((i) => i.key !== key));
      },
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
}
