import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NAV_CATEGORIES } from '../../data/constants';
import { useUIStore } from '../../contexts/uiStore';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import styles from './Header.module.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const openSearch = useUIStore((s) => s.openSearch);
  const openCart = useUIStore((s) => s.openCart);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const { itemCount } = useCart();
  const { user, profile } = useAuth();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <div className={cn(styles.bar, 'container')}>
        <div className={styles.left}>
          <button
            className={styles.burger}
            onClick={toggleMobileMenu}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={cn(styles.burgerLine, isMobileMenuOpen && styles.burgerLineOpenTop)} />
            <span className={cn(styles.burgerLine, isMobileMenuOpen && styles.burgerLineOpenBottom)} />
          </button>

          <nav className={styles.nav} aria-label="Main navigation">
            <NavLink to="/shop" className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}>
              Shop
            </NavLink>
            {NAV_CATEGORIES.map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive, cat.slug === 'sale' && styles.saleLink)}
              >
                {cat.label}
              </NavLink>
            ))}
            {profile?.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => cn(styles.navLink, styles.adminLink, isActive && styles.navLinkActive)}>
                Admin
              </NavLink>
            )}
          </nav>
        </div>

        <Link to="/" className={styles.logo} aria-label="VELOX — Home">
          VELOX
        </Link>

        <div className={styles.actions}>
          <button className={styles.iconButton} onClick={openSearch} aria-label="Search">
            <SearchIcon />
          </button>
          <Link to={user ? '/account' : '/login'} className={styles.iconButton} aria-label="My account">
            <UserIcon />
          </Link>
          <Link to="/wishlist" className={styles.iconButton} aria-label="Wishlist">
            <HeartIcon />
          </Link>
          <button className={styles.iconButton} onClick={openCart} aria-label={`Bag, ${itemCount} items`}>
            <BagIcon />
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 20s-7-4.4-9.5-8.8C1 8 2.4 4.5 6 4c2-.3 3.6.7 6 3 2.4-2.3 4-3.3 6-3 3.6.5 5 4 3.5 7.2C19 15.6 12 20 12 20z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
