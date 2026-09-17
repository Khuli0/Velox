import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminProduct, useAdminProductMutations } from '../../../hooks/useAdminProducts';
import { useCategories } from '../../../hooks/useProducts';
import type { ProductInput } from '../../../services/adminProductService';
import type { ProductStatus } from '../../../types/product';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { slugify } from '../../../lib/utils';
import { VariantsManager } from './VariantsManager';
import { ImagesManager } from './ImagesManager';
import styles from './ProductForm.module.css';

const EMPTY: ProductInput = {
  name: '',
  slug: '',
  description: '',
  short_description: '',
  price: 0,
  compare_at_price: null,
  category_id: null,
  brand: 'VELOX',
  status: 'draft',
  featured: false,
  is_new: false,
  is_sale: false,
};

export default function ProductForm() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useAdminProduct(id);
  const { data: categories } = useCategories();
  const { createProduct, updateProduct } = useAdminProductMutations(id);

  const [form, setForm] = useState<ProductInput>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        compare_at_price: product.compare_at_price,
        category_id: product.category_id,
        brand: product.brand,
        status: product.status,
        featured: product.featured,
        is_new: product.is_new,
        is_sale: product.is_sale,
      });
      setSlugTouched(true);
    }
  }, [product]);

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(value: string) {
    update('name', value);
    if (!slugTouched) {
      update('slug', slugify(value));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isEditing && id) {
      updateProduct.mutate({ id, input: form });
    } else {
      createProduct.mutate(form, {
        onSuccess: (created) => {
          navigate(`/admin/products/${created.id}/edit`, { replace: true });
        },
      });
    }
  }

  if (isEditing && isLoading) return <LoadingState label="Loading product" />;
  if (isEditing && isError) return <ErrorState message="We could not load this product." />;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{isEditing ? `Edit: ${product?.name ?? ''}` : 'New Product'}</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Basic Information</span>

          <Input label="Name" required value={form.name} onChange={(e) => handleNameChange(e.target.value)} />

          <Input
            label="Slug (URL)"
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update('slug', e.target.value);
            }}
          />

          <div className={styles.field}>
            <label className={styles.label}>Short Description</label>
            <textarea
              className={styles.textarea}
              rows={2}
              value={form.short_description ?? ''}
              onChange={(e) => update('short_description', e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Full Description</label>
            <textarea
              className={styles.textarea}
              rows={4}
              value={form.description ?? ''}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <Input
              label="Price (R$)"
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price}
              onChange={(e) => update('price', parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Compare-at Price (R$, optional)"
              type="number"
              step="0.01"
              min="0"
              value={form.compare_at_price ?? ''}
              onChange={(e) => update('compare_at_price', e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.select}
                value={form.category_id ?? ''}
                onChange={(e) => update('category_id', e.target.value || null)}
              >
                <option value="">No category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={form.status}
                onChange={(e) => update('status', e.target.value as ProductStatus)}
              >
                <option value="draft">Draft (not visible in store)</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update('featured', e.target.checked)}
              />
              Featured
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" checked={form.is_new} onChange={(e) => update('is_new', e.target.checked)} />
              New Arrival
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={form.is_sale}
                onChange={(e) => update('is_sale', e.target.checked)}
              />
              Sale
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={createProduct.isPending || updateProduct.isPending}
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>

      {isEditing && product && (
        <>
          <VariantsManager productId={product.id} variants={product.variants ?? []} />
          <ImagesManager productId={product.id} images={product.images ?? []} />
        </>
      )}

      {!isEditing && (
        <p className={styles.notice}>
          Save the product first to be able to add variants (size/stock) and images.
        </p>
      )}
    </div>
  );
}
