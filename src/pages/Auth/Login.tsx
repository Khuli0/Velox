import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from './Auth.module.css';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Please check your details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Welcome back</span>
        <h1 className={styles.title}>Sign In</h1>

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
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            Login
          </Button>
        </form>

        <div className={styles.footer}>
          <Link to="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
          <Link to="/register" className={styles.link}>
            Don't have an account? <strong>Create Account</strong>
          </Link>
        </div>
      </div>
    </div>
  );
}
