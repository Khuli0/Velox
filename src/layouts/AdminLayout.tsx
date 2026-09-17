import { Link, NavLink, Outlet } from 'react-router-dom';
import { cn } from '../lib/utils';
import styles from './AdminLayout.module.css';

export function AdminLayout() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to="/" className={styles.brand}>
          VELOX <span>Admin</span>
        </Link>
        <Link to="/" className={styles.exitLink}>
          ← Back to store
        </Link>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/products/new"
            className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}
          >
            + New Product
          </NavLink>
        </aside>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
