import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPrice } from '../../lib/utils';
import { WishlistButton } from '../wishlist/WishlistButton';
import { useUIStore } from '../../contexts/uiStore';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  eager?: boolean;
}

export function ProductCard({ product, eager = false }: ProductCardProps) {
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);
  const images = product.images ?? [];
  const primaryImage = images[0]?.image_url;
  const secondaryImage = images[1]?.image_url ?? primaryImage;
  const hasStock = (product.variants ?? []).some((v) => v.stock > 0);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openQuickAdd(product);
  }

  return (
    <article className={styles.card}>
      <Link to={`/product/${product.slug}`} className={styles.mediaLink}>
        <div className={styles.mediaWrapper}>
          {primaryImage && (
            <img
              src={primaryImage}
              alt={images[0]?.alt_text ?? product.name}
              className={styles.imagePrimary}
              loading={eager ? 'eager' : 'lazy'}
              width={600}
              height={800}
            />
          )}
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt=""
              className={styles.imageSecondary}
              loading="lazy"
              aria-hidden="true"
            />
          )}

          <div className={styles.badges}>
            {product.is_new && <span className={styles.badgeNew}>New</span>}
            {product.is_sale && <span className={styles.badgeSale}>Sale</span>}
          </div>

          <WishlistButton productId={product.id} className={styles.wishlist} />

          <button
            className={styles.quickAdd}
            onClick={handleQuickAdd}
            disabled={!hasStock}
          >
            {hasStock ? 'Quick Add +' : 'Sold Out'}
          </button>
        </div>
      </Link>

      <Link to={`/product/${product.slug}`} className={styles.info}>
        <span className={styles.category}>{product.category?.name ?? product.brand}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className={styles.comparePrice}>{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
      </Link>
    </article>
  );
}
