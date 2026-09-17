import styles from './LoadingState.module.css';

export function LoadingState({ label = 'Carregando' }: { label?: string }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.bar} />
      <span className={styles.text}>{label}...</span>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={styles.grid} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />
        </div>
      ))}
    </div>
  );
}
