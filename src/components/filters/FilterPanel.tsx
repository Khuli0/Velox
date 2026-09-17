import { useEffect } from 'react';
import type { ProductFilters } from '../../types/product';
import { cn } from '../../lib/utils';
import styles from './FilterPanel.module.css';

const SIZES = ['PP', 'P', 'M', 'G', 'GG', '38', '39', '40', '41', '42', '43'];
const COLORS = ['Black', 'White', 'Grey', 'Off-White'];
const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: 'Under R$ 200', max: 200 },
  { label: 'R$ 200 – R$ 400', min: 200, max: 400 },
  { label: 'R$ 400 – R$ 700', min: 400, max: 700 },
  { label: 'Over R$ 700', min: 700 },
];

interface FilterPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FilterPanel({ filters, onChange, isOpen, onClose }: FilterPanelProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  function toggleArrayValue(key: 'size' | 'color', value: string) {
    const current = filters[key] ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next.length ? next : undefined });
  }

  function setPriceRange(min?: number, max?: number) {
    const isActive = filters.minPrice === min && filters.maxPrice === max;
    onChange({ ...filters, minPrice: isActive ? undefined : min, maxPrice: isActive ? undefined : max });
  }

  function clearAll() {
    onChange({ categorySlug: filters.categorySlug, search: filters.search });
  }

  return (
    <>
      <div className={cn(styles.backdrop, isOpen && styles.backdropVisible)} onClick={onClose} />
      <aside
        className={cn(styles.panel, isOpen && styles.panelOpen)}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className={styles.header}>
          <span className={styles.title}>Filters</span>
          <button onClick={onClose} aria-label="Close filters" className={styles.close}>
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <FilterGroup title="Size">
            <div className={styles.sizeGrid}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={cn(styles.sizeChip, filters.size?.includes(size) && styles.chipActive)}
                  onClick={() => toggleArrayValue('size', size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Color">
            <div className={styles.list}>
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={cn(styles.listItem, filters.color?.includes(color) && styles.listItemActive)}
                  onClick={() => toggleArrayValue('color', color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Price">
            <div className={styles.list}>
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  className={cn(
                    styles.listItem,
                    filters.minPrice === range.min && filters.maxPrice === range.max && styles.listItemActive
                  )}
                  onClick={() => setPriceRange(range.min, range.max)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Availability">
            <button
              className={cn(styles.listItem, filters.inStockOnly && styles.listItemActive)}
              onClick={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
            >
              In stock only
            </button>
          </FilterGroup>

          <button className={styles.clearAll} onClick={clearAll}>
            Clear all filters
          </button>
        </div>

        <button className={styles.apply} onClick={onClose}>
          View Results
        </button>
      </aside>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.group}>
      <span className={styles.groupTitle}>{title}</span>
      {children}
    </div>
  );
}
