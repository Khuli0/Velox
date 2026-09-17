import { useState, type FormEvent } from 'react';
import type { ProductVariant } from '../../../types/product';
import { useAdminProductMutations } from '../../../hooks/useAdminProducts';
import { Button } from '../../../components/ui/Button';
import styles from './VariantsManager.module.css';

export function VariantsManager({
  productId,
  variants,
}: {
  productId: string;
  variants: ProductVariant[];
}) {
  const { addVariant, updateVariant, removeVariant } = useAdminProductMutations(productId);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState(0);
  const [editingStock, setEditingStock] = useState<Record<string, number>>({});

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!size.trim()) return;
    addVariant.mutate(
      { size: size.trim(), color: color.trim() || null, sku: sku.trim() || null, stock, price: null },
      {
        onSuccess: () => {
          setSize('');
          setColor('');
          setSku('');
          setStock(0);
        },
      }
    );
  }

  function handleStockSave(variantId: string) {
    const newStock = editingStock[variantId];
    if (newStock === undefined) return;
    updateVariant.mutate({ id: variantId, input: { stock: newStock } });
    setEditingStock((prev) => {
      const next = { ...prev };
      delete next[variantId];
      return next;
    });
  }

  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>Variants (Size / Color / Stock)</span>

      {variants.length > 0 && (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Size</span>
            <span>Color</span>
            <span>SKU</span>
            <span>Stock</span>
            <span></span>
          </div>
          {variants.map((variant) => (
            <div key={variant.id} className={styles.row}>
              <span>{variant.size}</span>
              <span>{variant.color ?? '—'}</span>
              <span className={styles.sku}>{variant.sku ?? '—'}</span>
              <input
                type="number"
                min="0"
                className={styles.stockInput}
                value={editingStock[variant.id] ?? variant.stock}
                onChange={(e) =>
                  setEditingStock((prev) => ({ ...prev, [variant.id]: parseInt(e.target.value, 10) || 0 }))
                }
              />
              <div className={styles.rowActions}>
                {editingStock[variant.id] !== undefined && (
                  <button onClick={() => handleStockSave(variant.id)} className={styles.save}>
                    Save
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm(`Remove variant ${variant.size}${variant.color ? ` / ${variant.color}` : ''}?`)) {
                      removeVariant.mutate(variant.id);
                    }
                  }}
                  className={styles.remove}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form className={styles.addForm} onSubmit={handleAdd}>
        <input
          placeholder="Size (e.g. 40, M)"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className={styles.addInput}
          required
        />
        <input
          placeholder="Color (optional)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className={styles.addInput}
        />
        <input
          placeholder="SKU (optional)"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className={styles.addInput}
        />
        <input
          type="number"
          min="0"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
          className={styles.addInputSmall}
        />
        <Button type="submit" variant="outline" size="sm" loading={addVariant.isPending}>
          + Add
        </Button>
      </form>
    </div>
  );
}
