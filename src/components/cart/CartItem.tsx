import { Link } from 'react-router-dom';
import type { CartItem as CartItemType } from '../../types/cart';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
  onNavigate?: () => void;
}

export function CartItem({ item, compact, onNavigate }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className={styles.row}>
      <Link to={`/product/${item.slug}`} onClick={onNavigate} className={styles.imageLink}>
        <img src={item.image} alt={item.name} className={styles.image} />
      </Link>

      <div className={styles.info}>
        <div className={styles.top}>
          <Link to={`/product/${item.slug}`} onClick={onNavigate} className={styles.name}>
            {item.name}
          </Link>
          <button className={styles.remove} onClick={() => removeItem(item.key)} aria-label="Remove item">
            ✕
          </button>
        </div>

        <div className={styles.meta}>
          {item.size && <span>Size {item.size}</span>}
          {item.color && <span>{item.color}</span>}
        </div>

        <div className={styles.bottom}>
          <div className={styles.stepper}>
            <button
              onClick={() => updateQuantity(item.key, item.quantity - 1)}
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span aria-live="polite">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.key, item.quantity + 1)}
              aria-label="Increase quantity"
              disabled={item.quantity >= item.stock}
            >
              +
            </button>
          </div>
          <span className={compact ? styles.priceCompact : styles.price}>
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
