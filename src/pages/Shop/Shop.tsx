import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/product/ProductGrid';
import { FilterPanel } from '../../components/filters/FilterPanel';
import { SortSelect } from '../../components/filters/SortSelect';
import type { ProductFilters, SortOption } from '../../types/product';
import { NAV_CATEGORIES } from '../../data/constants';
import styles from './Shop.module.css';

const CATEGORY_TITLES: Record<string, string> = {
  men: 'Men',
  women: 'Women',
  shoes: 'Shoes',
  accessories: 'Accessories',
  sale: 'Sale',
};

export default function Shop() {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) ?? 'featured');
  const [filters, setFilters] = useState<ProductFilters>({
    categorySlug: category,
    search: searchParams.get('q') ?? undefined,
  });

  const effectiveFilters = useMemo<ProductFilters>(
    () => ({ ...filters, categorySlug: category ?? filters.categorySlug }),
    [filters, category]
  );

  const { data: products, isLoading, isError } = useProducts(effectiveFilters, sort);

  const activeFilterCount =
    (filters.size?.length ?? 0) +
    (filters.color?.length ?? 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0);

  const title = category ? CATEGORY_TITLES[category] ?? 'Shop' : 'Shop';
  const isSale = category === 'sale';

  return (
    <div className={styles.page}>
      <div className={`container ${styles.header}`}>
        <div>
          <span className={styles.eyebrow}>{NAV_CATEGORIES.length} categories available</span>
          <h1 className={isSale ? styles.titleSale : styles.title}>{title}</h1>
        </div>
      </div>

      <div className={`container ${styles.toolbar}`}>
        <button className={styles.filterButton} onClick={() => setFiltersOpen(true)}>
          Filters
          {activeFilterCount > 0 && <span className={styles.filterCount}>{activeFilterCount}</span>}
        </button>
        <span className={styles.resultCount}>
          {isLoading ? 'Loading...' : `${products?.length ?? 0} products`}
        </span>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        isOpen={isFiltersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <div className={`container ${styles.results}`}>
        <ProductGrid products={products} isLoading={isLoading} isError={isError} />
      </div>
    </div>
  );
}
