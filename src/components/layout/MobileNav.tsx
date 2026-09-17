import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { NAV_CATEGORIES } from '../../data/constants';
import { useUIStore } from '../../contexts/uiStore';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import styles from './MobileNav.module.css';

export function MobileNav() {
  const isOpen = useUIStore((s) => s.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const { user, profile } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className={cn(styles.panel, isOpen && styles.panelOpen)} aria-hidden={!isOpen}>
      <nav className={styles.nav} aria-label="Mobile navigation">
        <Link to="/shop" onClick={closeMobileMenu} className={styles.link}>
          Shop All
        </Link>
        {NAV_CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            to={`/shop/${cat.slug}`}
            onClick={closeMobileMenu}
            className={cn(styles.link, cat.slug === 'sale' && styles.saleLink)}
            style={{ transitionDelay: `${(i + 1) * 40}ms` }}
          >
            {cat.label}
          </Link>
        ))}
      </nav>
      <div className={styles.footer}>
        <Link to={user ? '/account' : '/login'} onClick={closeMobileMenu} className={styles.secondaryLink}>
          {user ? 'My Account' : 'Sign In'}
        </Link>
        <Link to="/wishlist" onClick={closeMobileMenu} className={styles.secondaryLink}>
          Wishlist
        </Link>
        {profile?.role === 'admin' && (
          <Link to="/admin" onClick={closeMobileMenu} className={styles.adminLink}>
            Admin Panel
          </Link>
        )}
      </div>
    </div>
  );
}
