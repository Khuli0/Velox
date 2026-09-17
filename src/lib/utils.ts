import { CURRENCY_CODE, CURRENCY_LOCALE } from '../data/constants';

export function formatPrice(value: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
  }).format(value);
}

export function formatInstallments(value: number, installments = 6): string {
  const perInstallment = value / installments;
    return `${installments}x of ${formatPrice(perInstallment)}, interest-free`;
}

export function formatOrderNumber(id: string): string {
  return `#VX${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(CURRENCY_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
