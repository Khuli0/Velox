import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { heroReveal } from '../../animations/heroReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './Hero.module.css';

const HEADLINE_LINES = ['Performance', 'Without', 'Limits.'];

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // Only start the video once it's ready to play,
    // to avoid blocking the initial render of the hero.
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 3) setVideoReady(true);
  }, []);

  useEffect(() => {
    const tl = heroReveal(
      {
        media: mediaRef.current,
        eyebrow: eyebrowRef.current,
        headlineLines: lineRefs.current.filter(Boolean) as Element[],
        subhead: subheadRef.current,
        meta: metaRef.current,
        cta: ctaRef.current,
      },
      reduced
    );
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <section className={styles.hero}>
      <div ref={mediaRef} className={styles.mediaWrapper}>
        <picture>
          <source srcSet="/images/hero-fallback.webp" type="image/webp" />
          <img
            src="/images/hero-fallback.jpg"
            alt="VELOX athlete in a snowy mountain setting, wearing a black hood and protective goggles."
            className={styles.fallbackImage}
            fetchPriority="high"
          />
        </picture>
        <video
          ref={videoRef}
          className={styles.video}
          style={{ opacity: videoReady ? 1 : 0 }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-fallback.jpg"
          onCanPlay={() => setVideoReady(true)}
          aria-hidden="true"
        >
          <source src="/videos/hero-campaign.webm" type="video/webm" />
          <source src="/videos/hero-campaign.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.content}`}>
        <span ref={eyebrowRef} className={styles.eyebrow}>
          VELOX Performance
          <br />
          2026 Collection
        </span>

        <h1 className={styles.headline}>
          {HEADLINE_LINES.map((line, i) => (
            <span key={line} className={styles.lineMask}>
              <span
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className={`${styles.line} ${i === 2 ? styles.lineAccent : ''}`}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p ref={subheadRef} className={styles.subhead}>
          Built for movement.
        </p>

        <div className={styles.footer}>
          <div ref={metaRef} className={styles.meta}>
            <span>01</span>
            <span className={styles.metaLine} />
            <span>03</span>
          </div>

          <div ref={ctaRef}>
            <Link to="/shop" className={styles.cta}>
              Explore Collection
              <span className={styles.ctaArrow}>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
