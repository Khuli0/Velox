import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../components/cart/CartItem';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatPrice } from '../../lib/utils';
import { DEFAULT_SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '../../data/constants';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <EmptyState
          title="Your bag is empty"
          description="Explore our collection and find your next VELOX piece."
          action={
            <Link to="/shop">
              <Button variant="primary">Explore Collection</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.header}`}>
        <h1 className={styles.title}>Your Bag</h1>
        <span className={styles.count}>{items.length} items</span>
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.items}>
          {items.map((item) => (
            <CartItem key={item.key} item={item} />
          ))}
        </div>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Summary</h2>

          <div className={styles.discountRow}>
            <input
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className={styles.discountInput}
              aria-label="Discount code"
            />
            <button className={styles.discountApply}>Apply</button>
          </div>

          <div className={styles.line}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className={styles.line}>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/checkout')}>
            Checkout
          </Button>
          <Link to="/shop" className={styles.continue}>
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
