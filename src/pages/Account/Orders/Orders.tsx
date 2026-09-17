import { Link } from 'react-router-dom';
import { useOrders } from '../../../hooks/useOrders';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatDate, formatOrderNumber, formatPrice } from '../../../lib/utils';
import { cn } from '../../../lib/utils';
import styles from './Orders.module.css';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function Orders() {
  const { data: orders, isLoading, isError } = useOrders();

  if (isLoading) return <LoadingState label="Loading orders" />;
  if (isError) return <ErrorState message="We could not load your orders." />;
  if (!orders?.length) {
    return (
      <EmptyState
        title="No orders found"
        description="Your orders will appear here once you complete a purchase."
        action={
          <Link to="/shop" className={styles.shopLink}>
            Explore Collection
          </Link>
        }
      />
    );
  }

  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <Link key={order.id} to={`/account/orders/${order.id}`} className={styles.orderCard}>
          <div className={styles.top}>
            <span className={styles.orderNumber}>{formatOrderNumber(order.id)}</span>
            <span className={cn(styles.status, styles[`status_${order.status}`])}>
              {STATUS_LABELS[order.status] ?? order.status}
            </span>
          </div>
          <div className={styles.items}>
            {order.items?.map((item) => item.product_name).join(', ')}
          </div>
          <div className={styles.bottom}>
            <span className={styles.date}>{formatDate(order.created_at)}</span>
            <span className={styles.total}>{formatPrice(order.total)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
