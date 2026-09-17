import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import styles from './Accordion.module.css';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.item}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={cn(styles.indicator, open && styles.indicatorOpen)}>+</span>
      </button>
      <div className={cn(styles.panel, open && styles.panelOpen)}>
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className={styles.accordion}>{children}</div>;
}
