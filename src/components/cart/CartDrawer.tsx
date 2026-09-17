import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../contexts/uiStore';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from './CartItem';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { formatPrice, cn } from '../../lib/utils';
import { FREE_SHIPPING_THRESHOLD } from '../../data/constants';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) panelRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeCart]);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      <div className={cn(styles.backdrop, isOpen && styles.backdropVisible)} onClick={closeCart} />
      <aside
        ref={panelRef}
        className={cn(styles.drawer, isOpen && styles.drawerOpen)}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Your Bag ({items.length})</h2>
          <button onClick={closeCart} aria-label="Close bag" className={styles.close}>
            ✕
          </button>
        </div>

        {items.length > 0 && (
          <div className={styles.shippingNote}>
            {remainingForFreeShipping > 0 ? (
              <span>
                You're <strong>{formatPrice(remainingForFreeShipping)}</strong> away from free shipping
              </span>
            ) : (
              <span>You've unlocked free shipping 🎉</span>
            )}
          </div>
        )}

        <div className={styles.items}>
          {items.length === 0 ? (
            <EmptyState
              title="Your bag is empty"
              description="Explore the collection and find your next piece."
              action={
                <Button variant="outline" onClick={closeCart}>
                  Continue Shopping
                </Button>
              }
            />
          ) : (
            items.map((item) => <CartItem key={item.key} item={item} compact onNavigate={closeCart} />)
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className={styles.shippingText}>Shipping and taxes calculated at checkout.</p>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                closeCart();
                navigate('/checkout');
              }}
            >
              Checkout
            </Button>
            <Link to="/cart" onClick={closeCart} className={styles.viewBag}>
              View Bag
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
