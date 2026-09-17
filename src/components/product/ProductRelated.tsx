import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import styles from './ProductRelated.module.css';

export function ProductRelated({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Combine com</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
