import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useProducts';
import { revealOnScroll } from '../../animations/scrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './ShopByCategory.module.css';

export function ShopByCategory() {
  const { data: categories } = useCategories();
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const visibleCategories = (categories ?? []).filter((c) => c.slug !== 'sale');

  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('[data-reveal]');
    const anim = revealOnScroll(cards, { y: 24, stagger: 0.08 });
    return () => {
      anim.scrollTrigger?.kill();
    };
  }, [visibleCategories.length, reduced]);

  if (!visibleCategories.length) return null;

  return (
    <section className="container">
      <div ref={sectionRef} className={styles.grid}>
        {visibleCategories.map((category) => (
          <Link
            key={category.id}
            to={`/shop/${category.slug}`}
            className={styles.card}
            data-reveal
          >
            {category.image_url && (
              <img src={category.image_url} alt="" className={styles.image} loading="lazy" />
            )}
            <div className={styles.overlay} />
            <div className={styles.label}>
              <span className={styles.name}>{category.name}</span>
              <span className={styles.link}>
                Shop Now <span className={styles.arrow}>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
