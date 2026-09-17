import { Link } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { ProductGrid } from '../../components/product/ProductGrid';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { favorites, isLoading, isError, isAuthenticated } = useFavorites();

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className="container">
          <EmptyState
            title="Sign in to view your wishlist"
            description="Save your favorite products and access them from anywhere."
            action={
              <Link to="/login">
                <Button variant="primary">Sign In</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.header}`}>
        <h1 className={styles.title}>Wishlist</h1>
        <span className={styles.count}>{favorites.length} items</span>
      </div>
      <div className="container">
        <ProductGrid
          products={favorites}
          isLoading={isLoading}
          isError={isError}
          emptyTitle="Your wishlist is empty"
          emptyDescription="Tap the heart on a product to save it here."
        />
      </div>
    </div>
  );
}
