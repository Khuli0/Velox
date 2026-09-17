import { useState } from 'react';
import type { ProductImage } from '../../types/product';
import { cn } from '../../lib/utils';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return <div className={styles.placeholder} aria-hidden="true" />;
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.thumbs}>
        {images.map((img, i) => (
          <button
            key={img.id}
            className={cn(styles.thumb, i === active && styles.thumbActive)}
            onClick={() => setActive(i)}
            aria-label={`Ver imagem ${i + 1} de ${productName}`}
          >
            <img src={img.image_url} alt="" />
          </button>
        ))}
      </div>

      <div className={styles.mainWrapper}>
        <img
          src={images[active].image_url}
          alt={images[active].alt_text ?? productName}
          className={styles.mainImage}
        />
      </div>

      <div className={styles.mobileCarousel}>
        {images.map((img, i) => (
          <div key={img.id} className={styles.mobileSlide}>
            <img src={img.image_url} alt={img.alt_text ?? `${productName} ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>
    </div>
  );
}
