import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { cn } from '../../lib/utils';
import styles from './WishlistButton.module.css';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { favoriteIds, toggleFavorite, isAuthenticated } = useFavorites();
  const navigate = useNavigate();
  const isFavorite = favoriteIds.includes(productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleFavorite(productId);
  }

  return (
    <button
      className={cn(styles.button, isFavorite && styles.active, className)}
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20s-7-4.4-9.5-8.8C1 8 2.4 4.5 6 4c2-.3 3.6.7 6 3 2.4-2.3 4-3.3 6-3 3.6.5 5 4 3.5 7.2C19 15.6 12 20 12 20z" />
      </svg>
    </button>
  );
}
