import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../../hooks/useOrders';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatDate, formatOrderNumber, formatPrice } from '../../../lib/utils';
import styles from './OrderDetails.module.css';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) return <LoadingState label="Loading order" />;
  if (isError) return <ErrorState message="We could not load this order." />;
  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="Check the link or go back to your orders."
        action={
          <Link to="/account/orders" className={styles.backLink}>
            Back to Orders
          </Link>
        }
      />
    );
  }

  const address = order.shipping_address;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <span className={styles.orderNumber}>{formatOrderNumber(order.id)}</span>
          <span className={styles.date}>{formatDate(order.created_at)}</span>
        </div>
        <span className={styles.status}>{order.status}</span>
      </div>

      <div className={styles.items}>
        {order.items?.map((item) => (
          <div key={item.id} className={styles.item}>
            {item.product_image && <img src={item.product_image} alt={item.product_name} className={styles.image} />}
            <div className={styles.itemInfo}>
              <span className={styles.itemName}>{item.product_name}</span>
              <span className={styles.itemMeta}>
                {item.size && `Size ${item.size}`} {item.color && `· ${item.color}`} · Qty {item.quantity}
              </span>
            </div>
            <span className={styles.itemPrice}>{formatPrice(item.total_price)}</span>
          </div>
        ))}
      </div>

      <div className={styles.totals}>
        <div className={styles.line}>
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className={styles.line}>
          <span>Shipping</span>
          <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
        </div>
        <div className={styles.totalLine}>
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {address && (
        <div className={styles.address}>
          <span className={styles.addressLabel}>Shipping Address</span>
          <p>
            {address.name}
            <br />
            {address.street}, {address.number}
            {address.complement ? ` – ${address.complement}` : ''}
            <br />
            {address.neighborhood} · {address.city}/{address.state}
            <br />
            {address.postal_code} · {address.country}
          </p>
        </div>
      )}
    </div>
  );
}
