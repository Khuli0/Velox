import { gsap } from './gsapConfig';

interface HeroRevealTargets {
  eyebrow: Element | null;
  headlineLines: Element[];
  subhead: Element | null;
  meta: Element | null;
  cta: Element | null;
  media: Element | null;
}

/** Cinematic entrance sequence for the Home hero. */
export function heroReveal(targets: HeroRevealTargets, reduced: boolean) {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (reduced) {
    tl.set(
      [
        targets.media,
        targets.eyebrow,
        ...targets.headlineLines,
        targets.subhead,
        targets.meta,
        targets.cta,
      ].filter(Boolean),
      { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0 0 0 0)' }
    );
    return tl;
  }

  if (targets.media) {
    tl.fromTo(targets.media, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 });
  }
  if (targets.eyebrow) {
    tl.fromTo(targets.eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, '-=1.1');
  }
  if (targets.headlineLines.length) {
    tl.fromTo(
      targets.headlineLines,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
      '-=0.4'
    );
  }
  if (targets.subhead) {
    tl.fromTo(targets.subhead, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
  }
  if (targets.meta) {
    tl.fromTo(targets.meta, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4');
  }
  if (targets.cta) {
    tl.fromTo(targets.cta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
  }

  return tl;
}
