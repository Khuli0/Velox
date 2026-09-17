import { Link } from 'react-router-dom';
import { useSaleProducts } from '../../hooks/useProducts';
import styles from './SaleSection.module.css';

export function SaleSection() {
  const { data: products } = useSaleProducts(3);

  if (!products?.length) return null;

  return (
    <section className="container">
      <div className={styles.wrapper}>
        <div className={styles.textBlock}>
          <span className={styles.eyebrow}>VELOX Sale</span>
          <h2 className={styles.title}>
            Up to <span className={styles.accent}>40% Off</span>
          </h2>
          <p className={styles.description}>Selected pieces, while supplies last.</p>
          <Link to="/shop/sale" className={styles.cta}>
            Shop Sale →
          </Link>
        </div>
        <div className={styles.images}>
          {products.slice(0, 3).map((p) => (
            <Link key={p.id} to={`/product/${p.slug}`} className={styles.imageLink}>
              {p.images?.[0] && <img src={p.images[0].image_url} alt={p.name} loading="lazy" />}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
