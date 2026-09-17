import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../../contexts/uiStore';
import { useProductSearch } from '../../hooks/useProducts';
import { POPULAR_SEARCHES } from '../../data/constants';
import { formatPrice, cn } from '../../lib/utils';
import styles from './SearchOverlay.module.css';

export function SearchOverlay() {
  const isOpen = useUIStore((s) => s.isSearchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const [term, setTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: results, isLoading } = useProductSearch(term);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 320);
    } else {
      setTerm('');
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSearch();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, closeSearch]);

  return (
    <div className={cn(styles.overlay, isOpen && styles.overlayOpen)} aria-hidden={!isOpen}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Search VELOX</span>
          <button onClick={closeSearch} aria-label="Close search" className={styles.close}>
            ✕
          </button>
        </div>

        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="What are you looking for?"
            className={styles.input}
            aria-label="Search products"
          />
          {term && (
            <button onClick={() => setTerm('')} className={styles.clear} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        {!term && (
          <div className={styles.popular}>
            <span className={styles.popularLabel}>Popular Searches</span>
            <div className={styles.popularList}>
              {POPULAR_SEARCHES.map((s) => (
                <button key={s} className={styles.popularItem} onClick={() => setTerm(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {term && (
          <div className={styles.results}>
            {isLoading && <span className={styles.status}>Searching...</span>}
            {!isLoading && results?.length === 0 && (
              <span className={styles.status}>No results for "{term}".</span>
            )}
            {!isLoading && results && results.length > 0 && (
              <>
                <span className={styles.resultsLabel}>Results</span>
                <ul className={styles.resultsList}>
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link to={`/product/${product.slug}`} onClick={closeSearch} className={styles.resultItem}>
                        <img
                          src={product.images?.[0]?.image_url}
                          alt={product.name}
                          className={styles.resultImage}
                        />
                        <div>
                          <span className={styles.resultCategory}>{product.category?.name}</span>
                          <span className={styles.resultName}>{product.name}</span>
                        </div>
                        <span className={styles.resultPrice}>{formatPrice(product.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/shop?q=${encodeURIComponent(term)}`}
                  onClick={closeSearch}
                  className={styles.viewAll}
                >
                  View all results →
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
