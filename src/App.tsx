import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AppRouter } from './router';
import { SplashScreen, shouldShowSplash } from './components/splash/SplashScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(shouldShowSplash);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
