import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { parallax, revealOnScroll } from '../../animations/scrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './Campaign.module.css';

export function Campaign() {
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const anims = [parallax(imageRef.current, 40), revealOnScroll(contentRef.current, { y: 24 })];
    return () => {
      anims.forEach((a) => a.scrollTrigger?.kill());
    };
  }, [reduced]);

  return (
    <section className={styles.section}>
      <div className={styles.mediaWrapper}>
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1800"
          alt="VELOX runner in motion in an urban setting at dawn."
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay} />
      </div>

      <div ref={contentRef} className={styles.content}>
        <span className={styles.brand}>VELOX</span>
        <h2 className={styles.headline}>Move Without Limits.</h2>
        <p className={styles.tag}>
          Built for movement.
          <br />
          Engineered for performance.
        </p>
        <Link to="/shop" className={styles.cta}>
          Explore Collection <span>→</span>
        </Link>
      </div>
    </section>
  );
}
