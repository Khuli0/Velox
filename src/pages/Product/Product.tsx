import { useParams, Link } from 'react-router-dom';
import { useProduct, useRelatedProducts } from '../../hooks/useProducts';
import { ProductGallery } from '../../components/product/ProductGallery';
import { ProductInfo } from '../../components/product/ProductInfo';
import { ProductRelated } from '../../components/product/ProductRelated';
import { LoadingState } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import styles from './Product.module.css';

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: related } = useRelatedProducts(product);

  if (isLoading) {
    return (
      <div className={styles.statusPage}>
        <LoadingState label="Loading product" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.statusPage}>
        <ErrorState message="We could not load this product." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.statusPage}>
        <EmptyState
          title="Product not found"
          description="The item you are looking for may have been removed."
          action={
            <Link to="/shop" className={styles.backLink}>
              Back to Store
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <nav className={`container ${styles.breadcrumb}`} aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link>
        {product.category && (
          <>
            {' '}
            / <Link to={`/shop/${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}{' '}
        / <span>{product.name}</span>
      </nav>

      <div className={`container ${styles.layout}`}>
        <ProductGallery images={product.images ?? []} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      <div className="container">
        <ProductRelated products={related ?? []} />
      </div>
    </div>
  );
}
