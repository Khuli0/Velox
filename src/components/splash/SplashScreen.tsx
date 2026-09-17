import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';
import styles from './SplashScreen.module.css';

const SESSION_KEY = 'velox_splash_shown';
const SPIN_DELAY = 1500;
const REDUCED_DELAY = 350;
const EXIT_DURATION = 650;

export function shouldShowSplash(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) !== 'true';
  } catch {
    return true;
  }
}

function markSplashShown() {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true');
  } catch {
    // sessionStorage indisponível (modo privado, etc.) — sem problema, apenas
    // repete o splash na próxima navegação.
  }
}

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setIsExiting(true), reduced ? REDUCED_DELAY : SPIN_DELAY);
    return () => clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    if (!isExiting) return;
    const timer = setTimeout(() => {
      document.body.style.overflow = '';
      markSplashShown();
      onFinish();
    }, EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [isExiting, onFinish]);

  return (
    <div
      className={cn(styles.splash, isExiting && styles.exiting)}
      role="presentation"
      aria-hidden="true"
    >
      <svg
        className={cn(styles.snowflake, reduced && styles.snowflakeStatic)}
        viewBox="0 0 100 100"
        width="72"
        height="72"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      >
        {[0, 60, 120].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 50 50)`}>
            <line x1="50" y1="6" x2="50" y2="94" />
            <line x1="50" y1="22" x2="37" y2="13" />
            <line x1="50" y1="22" x2="63" y2="13" />
            <line x1="50" y1="78" x2="37" y2="87" />
            <line x1="50" y1="78" x2="63" y2="87" />
          </g>
        ))}
      </svg>
      <span className={cn(styles.logo, reduced && styles.logoStatic)}>VELOX</span>
    </div>
  );
}
