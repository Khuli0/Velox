import { useEffect, useRef } from 'react';
import { revealOnScroll } from '../../animations/scrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './TechnologySection.module.css';

const FEATURES = [
  {
    code: '01',
    title: 'Lightweight',
    description: 'Low-weight materials that reduce effort with every movement.',
  },
  {
    code: '02',
    title: 'Breathable',
    description: 'Ventilated fabrics that keep the body at an ideal temperature.',
  },
  {
    code: '03',
    title: 'Flexible',
    description: 'Full freedom of movement, without restricting range of motion.',
  },
];

export function TechnologySection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const items = ref.current.querySelectorAll('[data-reveal]');
    const anim = revealOnScroll(items, { y: 20, stagger: 0.1 });
    return () => {
      anim.scrollTrigger?.kill();
    };
  }, [reduced]);

  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`} ref={ref}>
        <div className={styles.heading} data-reveal>
          <span className={styles.eyebrow}>VELOX Technology</span>
          <h2 className={styles.title}>
            Engineered
            <br />
            for Movement.
          </h2>
        </div>

        <div className={styles.features}>
          {FEATURES.map((feature) => (
            <div key={feature.code} className={styles.feature} data-reveal>
              <span className={styles.code}>{feature.code}</span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
