import type { SortOption } from '../../types/product';
import styles from './SortSelect.module.css';

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="sort-select" className={styles.label}>
        Sort
      </label>
      <select
        id="sort-select"
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
