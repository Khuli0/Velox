import { useMemo, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useUIStore } from '../../contexts/uiStore';
import { useCart } from '../../contexts/CartContext';
import { useToastStore } from '../../contexts/toastStore';
import { formatPrice, cn } from '../../lib/utils';
import styles from './ProductQuickAdd.module.css';

export function ProductQuickAdd() {
  const product = useUIStore((s) => s.quickAddProduct);
  const closeQuickAdd = useUIStore((s) => s.closeQuickAdd);
  const openCart = useUIStore((s) => s.openCart);
  const addItem = useCart().addItem;
  const push = useToastStore((s) => s.push);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sizes = useMemo(() => {
    const list = product?.variants ?? [];
    const unique = new Map<string, number>();
    list.forEach((v) => unique.set(v.size, (unique.get(v.size) ?? 0) + v.stock));
    return Array.from(unique.entries());
  }, [product]);

  function handleClose() {
    setSelectedSize(null);
    setError(null);
    closeQuickAdd();
  }

  function handleAdd() {
    if (!product) return;
    if (!selectedSize) {
      setError('Please select a size.');
      return;
    }
    const variant = product.variants?.find((v) => v.size === selectedSize);
    if (!variant || variant.stock < 1) {
      setError('Size unavailable.');
      return;
    }

    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0]?.image_url ?? '',
      size: variant.size,
      color: variant.color,
      price: product.price,
      quantity: 1,
      stock: variant.stock,
    });

    push(`${product.name} added to bag`, 'success');
    handleClose();
    openCart();
  }

  return (
    <Modal isOpen={Boolean(product)} onClose={handleClose} title={product?.name ?? 'Quick Add'}>
      {product && (
        <div className={styles.content}>
          <div className={styles.top}>
            {product.images?.[0] && (
              <img src={product.images[0].image_url} alt={product.name} className={styles.image} />
            )}
            <div>
              <span className={styles.category}>{product.category?.name}</span>
              <h4 className={styles.name}>{product.name}</h4>
              <span className={styles.price}>{formatPrice(product.price)}</span>
            </div>
          </div>

          <div className={styles.sizes}>
            <span className={styles.sizesLabel}>Size</span>
            <div className={styles.sizeGrid}>
              {sizes.map(([size, stock]) => (
                <button
                  key={size}
                  className={cn(
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonActive,
                    stock < 1 && styles.sizeButtonDisabled
                  )}
                  disabled={stock < 1}
                  onClick={() => {
                    setSelectedSize(size);
                    setError(null);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleAdd}>
            Add to Bag
          </Button>
        </div>
      )}
    </Modal>
  );
}
