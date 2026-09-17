import { gsap, ScrollTrigger } from './gsapConfig';

interface RevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  once?: boolean;
}

/**
 * Aplica um fade + translateY em elementos ao entrarem na viewport.
 * Used for editorial sections (images, titles, cards).
 */
export function revealOnScroll(
  targets: gsap.TweenTarget,
  { y = 32, duration = 0.9, stagger = 0.08, start = 'top 85%', once = true }: RevealOptions = {}
) {
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: targets as any,
        start,
        once,
      },
    }
  );
}

/** Subtle parallax — shifts the target slightly as the page scrolls. */
export function parallax(target: gsap.TweenTarget, distance = 60) {
  return gsap.fromTo(
    target,
    { yPercent: -distance / 4 },
    {
      yPercent: distance / 4,
      ease: 'none',
      scrollTrigger: {
        trigger: target as any,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    }
  );
}

export function killScrollTriggersFor(selector: string) {
  ScrollTrigger.getAll()
    .filter((st) => st.vars.trigger && (st.vars.trigger as Element).nodeType && (st.vars.trigger as Element).matches?.(selector))
    .forEach((st) => st.kill());
}
