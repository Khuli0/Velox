import { useToastStore } from '../../contexts/toastStore';
import styles from './Toast.module.css';
import { cn } from '../../lib/utils';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (!toasts.length) return null;

  return (
    <div className={styles.wrapper} role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          className={cn(styles.toast, styles[toast.variant])}
          onClick={() => dismiss(toast.id)}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
