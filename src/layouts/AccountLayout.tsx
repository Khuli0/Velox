import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import styles from './AccountLayout.module.css';

const LINKS = [
  { label: 'Overview', to: '/account', end: true },
  { label: 'Orders', to: '/account/orders' },
  { label: 'Addresses', to: '/account/addresses' },
];

export function AccountLayout() {
  const { profile, signOut } = useAuth();

  return (
    <div className={styles.page}>
      <div className={`container ${styles.header}`}>
        <span className={styles.eyebrow}>My VELOX</span>
        <h1 className={styles.title}>Hi, {profile?.full_name?.split(' ')[0] ?? 'Athlete'}</h1>
      </div>

      <div className={`container ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button className={styles.logout} onClick={() => signOut()}>
            Log Out
          </button>
        </aside>

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
