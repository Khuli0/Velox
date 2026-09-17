import { Link, useNavigate } from 'react-router-dom';
import { useAdminProducts, useAdminProductMutations } from '../../../hooks/useAdminProducts';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { formatPrice } from '../../../lib/utils';
import { cn } from '../../../lib/utils';
import styles from './ProductsList.module.css';

export default function ProductsList() {
  const { data: products, isLoading, isError } = useAdminProducts();
  const { deleteProduct } = useAdminProductMutations();
  const navigate = useNavigate();

  if (isLoading) return <LoadingState label="Loading products" />;
  if (isError) return <ErrorState message="We could not load the products." />;

  if (!products?.length) {
    return (
      <EmptyState
        title="No products yet"
        description="Create your first product to start selling."
        action={
          <Button variant="primary" onClick={() => navigate('/admin/products/new')}>
            + New Product
          </Button>
        }
      />
    );
  }

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Permanently remove "${name}"? This action cannot be undone.`)) {
      deleteProduct.mutate(id);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <span className={styles.count}>{products.length} products</span>
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Product</span>
          <span>Status</span>
          <span>Price</span>
          <span>Stock</span>
          <span></span>
        </div>

        {products.map((product) => {
          const totalStock = (product.variants ?? []).reduce((sum, v) => sum + v.stock, 0);
          return (
            <div key={product.id} className={styles.row}>
              <div className={styles.productCell}>
                {product.images?.[0] && (
                  <img src={product.images[0].image_url} alt="" className={styles.thumb} />
                )}
                <div>
                  <span className={styles.name}>{product.name}</span>
                  <span className={styles.category}>{product.category?.name ?? '—'}</span>
                </div>
              </div>

              <span className={cn(styles.status, styles[`status_${product.status}`])}>
                {product.status}
              </span>

              <span className={styles.price}>{formatPrice(product.price)}</span>

              <span className={cn(styles.stock, totalStock === 0 && styles.stockZero)}>
                {totalStock} un.
              </span>

              <div className={styles.actions}>
                <Link to={`/admin/products/${product.id}/edit`}>Edit</Link>
                <button onClick={() => handleDelete(product.id, product.name)} className={styles.remove}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
