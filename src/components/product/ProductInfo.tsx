import { useMemo, useState } from 'react';
import type { Product } from '../../types/product';
import { formatPrice, formatInstallments } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';
import { useToastStore } from '../../contexts/toastStore';
import { useUIStore } from '../../contexts/uiStore';
import { WishlistButton } from '../wishlist/WishlistButton';
import { Button } from '../ui/Button';
import { Accordion, AccordionItem } from '../ui/Accordion';
import { cn } from '../../lib/utils';
import styles from './ProductInfo.module.css';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCart().addItem;
  const push = useToastStore((s) => s.push);
  const openCart = useUIStore((s) => s.openCart);

  const sizes = useMemo(() => {
    const list = product.variants ?? [];
    const unique = new Map<string, number>();
    list.forEach((v) => unique.set(v.size, (unique.get(v.size) ?? 0) + v.stock));
    return Array.from(unique.entries());
  }, [product]);

  const selectedVariant = product.variants?.find((v) => v.size === selectedSize);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;

  function handleAddToBag() {
    if (!selectedSize) {
      setError('Please select a size.');
      return;
    }
    if (!selectedVariant || selectedVariant.stock < 1) {
      setError('Size unavailable.');
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0]?.image_url ?? '',
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: product.price,
      quantity: 1,
      stock: selectedVariant.stock,
    });

    push(`${product.name} added to bag`, 'success');
    openCart();
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.category}>{product.category?.name ?? product.brand}</span>
      <h1 className={styles.name}>{product.name}</h1>

      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        {hasDiscount && (
          <span className={styles.comparePrice}>{formatPrice(product.compare_at_price!)}</span>
        )}
      </div>
      <span className={styles.installments}>{formatInstallments(product.price)}</span>

      {product.short_description && <p className={styles.shortDescription}>{product.short_description}</p>}

      <div className={styles.sizes}>
        <div className={styles.sizesHeader}>
          <span className={styles.sizesLabel}>Select size</span>
          <button className={styles.guideLink}>Size guide</button>
        </div>
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
        {error && (
          <span className={styles.error} role="alert">
            {error}
          </span>
        )}
        {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
          <span className={styles.stockWarning}>Only {selectedVariant.stock} left in stock</span>
        )}
      </div>

      <div className={styles.actions}>
        <Button variant="primary" size="lg" fullWidth onClick={handleAddToBag}>
          Add to Bag
        </Button>
        <WishlistButton productId={product.id} className={styles.wishlistStatic} />
      </div>

      <ul className={styles.trustList}>
        <li>Free shipping over R$ 399.00</li>
        <li>Easy returns within 30 days</li>
        <li>100% secure checkout</li>
      </ul>

      <Accordion>
        {product.description && (
          <AccordionItem title="Description" defaultOpen>
            <p>{product.description}</p>
          </AccordionItem>
        )}
        <AccordionItem title="Technology">
          <p>
            Built with lightweight, breathable materials designed to move with your body
            during training or everyday wear.
          </p>
        </AccordionItem>
        <AccordionItem title="Shipping & Returns">
          <p>
            Shipping across Brazil. Free exchange or return within 30 days of delivery, as long
            as the product is in its original packaging.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
