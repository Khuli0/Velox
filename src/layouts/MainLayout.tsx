import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { MobileNav } from '../components/layout/MobileNav';
import { CartDrawer } from '../components/cart/CartDrawer';
import { SearchOverlay } from '../components/search/SearchOverlay';
import { ProductQuickAdd } from '../components/product/ProductQuickAdd';
import { ToastContainer } from '../components/ui/Toast';
import { useUIStore } from '../contexts/uiStore';

export function MainLayout() {
  const location = useLocation();
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const closeCart = useUIStore((s) => s.closeCart);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    closeMobileMenu();
    closeSearch();
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <Header />
      <MobileNav />
      <main>
        <Outlet />
      </main>
      <Footer />

      <CartDrawer />
      <SearchOverlay />
      <ProductQuickAdd />
      <ToastContainer />
    </>
  );
}
