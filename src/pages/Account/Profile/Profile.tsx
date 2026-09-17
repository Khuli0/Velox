import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useOrders } from '../../../hooks/useOrders';
import { formatOrderNumber, formatPrice } from '../../../lib/utils';
import styles from './Profile.module.css';

export default function AccountOverview() {
  const { profile, user } = useAuth();
  const { data: orders } = useOrders();
  const lastOrder = orders?.[0];

  return (
    <div className={styles.wrapper}>
      <section className={styles.card}>
        <span className={styles.cardLabel}>Personal Information</span>
        <div className={styles.infoGrid}>
          <div>
            <span className={styles.infoLabel}>Name</span>
            <span className={styles.infoValue}>{profile?.full_name ?? '—'}</span>
          </div>
          <div>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{profile?.email ?? user?.email}</span>
          </div>
        </div>
      </section>

      {lastOrder && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Last Order</span>
            <Link to="/account/orders" className={styles.viewAll}>
              View All →
            </Link>
          </div>
          <div className={styles.orderRow}>
            <div>
              <span className={styles.orderNumber}>{formatOrderNumber(lastOrder.id)}</span>
              <span className={styles.orderStatus}>{lastOrder.status}</span>
            </div>
            <span className={styles.orderTotal}>{formatPrice(lastOrder.total)}</span>
          </div>
        </section>
      )}

      <div className={styles.quickLinks}>
        <Link to="/wishlist" className={styles.quickLink}>
          Wishlist
        </Link>
        <Link to="/account/addresses" className={styles.quickLink}>
          Addresses
        </Link>
      </div>
    </div>
  );
}
