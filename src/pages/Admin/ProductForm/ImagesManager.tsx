import { useRef, useState } from 'react';
import type { ProductImage } from '../../../types/product';
import { useAdminProductMutations } from '../../../hooks/useAdminProducts';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import styles from './ImagesManager.module.css';

export function ImagesManager({ productId, images }: { productId: string; images: ProductImage[] }) {
  const { uploadImage, removeImage } = useAdminProductMutations(productId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    Array.from(files).forEach((file, i) => {
      if (!file.type.startsWith('image/')) return;
      uploadImage.mutate({
        file,
        sortOrder: images.length + i,
        altText: file.name.replace(/\.[^.]+$/, ''),
      });
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>Imagens do Produto</span>

      {images.length > 0 && (
        <div className={styles.grid}>
          {images.map((image, i) => (
            <div key={image.id} className={styles.imageCard}>
              <img src={image.image_url} alt={image.alt_text ?? ''} className={styles.image} />
              {i === 0 && <span className={styles.mainBadge}>Main</span>}
              <button
                className={styles.removeButton}
                onClick={() => {
                  if (window.confirm('Remove this image?')) removeImage.mutate(image.id);
                }}
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={cn(styles.dropzone, isDragging && styles.dropzoneActive)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <p className={styles.dropzoneText}>Drag images here or</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.fileInput}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={uploadImage.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          Select Files
        </Button>
      </div>
    </div>
  );
}
