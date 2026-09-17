import { cn } from '../../lib/utils';
import styles from './CheckoutSteps.module.css';

const STEPS = ['Bag', 'Information', 'Address', 'Shipping', 'Payment'];

export function CheckoutSteps({ currentStep }: { currentStep: number }) {
  return (
    <ol className={styles.list} aria-label="Checkout progress">
      {STEPS.map((step, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;
        return (
          <li key={step} className={styles.item}>
            <span
              className={cn(styles.circle, isActive && styles.circleActive, isDone && styles.circleDone)}
            >
              {isDone ? '✓' : stepNumber}
            </span>
            <span className={cn(styles.label, isActive && styles.labelActive)}>{step}</span>
            {stepNumber < STEPS.length && <span className={styles.connector} />}
          </li>
        );
      })}
    </ol>
  );
}
