import styles from './EmptyState.module.css';

export function ErrorState({ message = 'Algo deu errado. Tente novamente.' }: { message?: string }) {
  return (
    <div className={styles.wrapper} role="alert">
      <h3 className={styles.title}>Ops.</h3>
      <p className={styles.description}>{message}</p>
    </div>
  );
}
