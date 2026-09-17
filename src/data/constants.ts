export const NAV_CATEGORIES = [
  { label: 'Men', slug: 'men' },
  { label: 'Women', slug: 'women' },
  { label: 'Shoes', slug: 'shoes' },
  { label: 'Accessories', slug: 'accessories' },
  { label: 'Sale', slug: 'sale' },
] as const;

export const POPULAR_SEARCHES = ['Running', 'Training', 'Shoes', 'Jackets'] as const;

export const SIZE_OPTIONS_SHOE = ['38', '39', '40', '41', '42', '43', '44'] as const;
export const SIZE_OPTIONS_APPAREL = ['PP', 'P', 'M', 'G', 'GG'] as const;

export const FREE_SHIPPING_THRESHOLD = 399;
export const DEFAULT_SHIPPING_COST = 29.9;

export const CURRENCY_LOCALE = 'pt-BR';
export const CURRENCY_CODE = 'BRL';
