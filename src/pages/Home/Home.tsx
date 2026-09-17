import { Hero } from '../../components/home/Hero';
import { ShopByCategory } from '../../components/home/ShopByCategory';
import { ProductSection } from '../../components/home/ProductSection';
import { TechnologySection } from '../../components/home/TechnologySection';
import { Campaign } from '../../components/home/Campaign';
import { SaleSection } from '../../components/home/SaleSection';
import { useFeaturedProducts, useNewArrivals } from '../../hooks/useProducts';
import styles from './Home.module.css';

export default function Home() {
  const featured = useFeaturedProducts(8);
  const newArrivals = useNewArrivals(8);

  return (
    <div className={styles.page}>
      <Hero />

      <div className={styles.sectionSpacing}>
        <ShopByCategory />
      </div>

      <div className={styles.sectionSpacing}>
        <ProductSection
          eyebrow="Selected by VELOX"
          title="Featured Collection"
          viewAllHref="/shop"
          products={featured.data}
          isLoading={featured.isLoading}
          isError={featured.isError}
        />
      </div>

      <div className={styles.sectionSpacing}>
        <ProductSection
          eyebrow="Just Landed"
          title="New Arrivals"
          viewAllHref="/shop?sort=newest"
          products={newArrivals.data}
          isLoading={newArrivals.isLoading}
          isError={newArrivals.isError}
        />
      </div>

      <TechnologySection />
      <Campaign />
      <SaleSection />
    </div>
  );
}
