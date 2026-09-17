import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { ProductGrid } from '../product/ProductGrid';
import { revealOnScroll } from '../../animations/scrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './ProductSection.module.css';

interface ProductSectionProps {
  eyebrow: string;
  title: string;
  viewAllHref: string;
  products?: Product[];
  isLoading?: boolean;
  isError?: boolean;
}

export function ProductSection({
  eyebrow,
  title,
  viewAllHref,
  products,
  isLoading,
  isError,
}: ProductSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const anim = revealOnScroll(ref.current, { y: 20 });
    return () => {
      anim.scrollTrigger?.kill();
    };
  }, [reduced]);

  return (
    <section className="container" ref={ref}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <Link to={viewAllHref} className={styles.viewAll}>
          View All →
        </Link>
      </div>
      <ProductGrid products={products} isLoading={isLoading} isError={isError} />
    </section>
  );
}
