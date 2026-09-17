import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from '../ui/LoadingState';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  isError?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  isLoading,
  isError,
  emptyTitle = 'Nenhum produto encontrado.',
  emptyDescription = 'Ajuste os filtros ou volte mais tarde.',
}: ProductGridProps) {
  if (isLoading) return <ProductGridSkeleton />;
  if (isError) return <ErrorState message="Erro ao carregar produtos." />;
  if (!products?.length) return <EmptyState title={emptyTitle} description={emptyDescription} />;

  return (
    <div className={styles.grid}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} eager={i < 4} />
      ))}
    </div>
  );
}
