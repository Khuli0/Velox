import { create } from 'zustand';
import type { Product } from '../types/product';

interface UIState {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  quickAddProduct: Product | null;

  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openQuickAdd: (product: Product) => void;
  closeQuickAdd: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  quickAddProduct: null,

  openCart: () => set({ isCartOpen: true, isSearchOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  openSearch: () => set({ isSearchOpen: true, isCartOpen: false, isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openQuickAdd: (product) => set({ quickAddProduct: product }),
  closeQuickAdd: () => set({ quickAddProduct: null }),
}));
