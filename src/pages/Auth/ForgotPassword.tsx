import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the recovery email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Account Recovery</span>
        <h1 className={styles.title}>Forgot Password</h1>

        {sent ? (
          <span className={styles.success}>
            If this email exists in our system, you'll receive a link to reset your password.
          </span>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <span className={styles.error}>{error}</span>}
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Send Reset Link
            </Button>
          </form>
        )}

        <div className={styles.footer}>
          <Link to="/login" className={styles.link}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
