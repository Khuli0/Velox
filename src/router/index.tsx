import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AccountLayout } from '../layouts/AccountLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { LoadingState } from '../components/ui/LoadingState';

const Home = lazy(() => import('../pages/Home/Home'));
const Shop = lazy(() => import('../pages/Shop/Shop'));
const Product = lazy(() => import('../pages/Product/Product'));
const Cart = lazy(() => import('../pages/Cart/Cart'));
const Wishlist = lazy(() => import('../pages/Wishlist/Wishlist'));
const Checkout = lazy(() => import('../pages/Checkout/Checkout'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/Auth/ResetPassword'));
const AccountOverview = lazy(() => import('../pages/Account/Profile/Profile'));
const Orders = lazy(() => import('../pages/Account/Orders/Orders'));
const OrderDetails = lazy(() => import('../pages/Account/OrderDetails/OrderDetails'));
const Addresses = lazy(() => import('../pages/Account/Addresses/Addresses'));
const AdminProductsList = lazy(() => import('../pages/Admin/ProductsList/ProductsList'));
const AdminProductForm = lazy(() => import('../pages/Admin/ProductForm/ProductForm'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

function withSuspense(node: React.ReactNode) {
  return (
    <Suspense
      fallback={
        <div style={{ paddingTop: '30vh' }}>
          <LoadingState />
        </div>
      }
    >
      {node}
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: withSuspense(<Home />) },
      { path: '/shop', element: withSuspense(<Shop />) },
      { path: '/shop/:category', element: withSuspense(<Shop />) },
      { path: '/product/:slug', element: withSuspense(<Product />) },
      { path: '/cart', element: withSuspense(<Cart />) },
      {
        path: '/wishlist',
        element: withSuspense(
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      {
        path: '/checkout',
        element: withSuspense(
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      { path: '/login', element: withSuspense(<Login />) },
      { path: '/register', element: withSuspense(<Register />) },
      { path: '/forgot-password', element: withSuspense(<ForgotPassword />) },
      { path: '/reset-password', element: withSuspense(<ResetPassword />) },
      {
        path: '/account',
        element: (
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: withSuspense(<AccountOverview />) },
          { path: 'orders', element: withSuspense(<Orders />) },
          { path: 'orders/:id', element: withSuspense(<OrderDetails />) },
          { path: 'addresses', element: withSuspense(<Addresses />) },
        ],
      },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: withSuspense(<AdminProductsList />) },
      { path: 'products/new', element: withSuspense(<AdminProductForm />) },
      { path: 'products/:id/edit', element: withSuspense(<AdminProductForm />) },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
