import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToastStore } from '../../contexts/toastStore';
import styles from './Footer.module.css';

export function Footer() {
  const [email, setEmail] = useState('');
  const push = useToastStore((s) => s.push);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    push('Subscription confirmed. Welcome to VELOX.', 'success');
    setEmail('');
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.newsletter}`}>
        <div>
          <h3 className={styles.newsletterTitle}>Join the VELOX</h3>
          <p className={styles.newsletterText}>
            Get early access to new collections and exclusive releases.
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            aria-label="Your email"
          />
          <button type="submit" className={styles.submit} aria-label="Subscribe">
            →
          </button>
        </form>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>VELOX</span>
          <p className={styles.tagline}>Performance without limits.</p>
        </div>

        <FooterColumn
          title="Shop"
          links={[
            { label: 'Men', to: '/shop/men' },
            { label: 'Women', to: '/shop/women' },
            { label: 'Shoes', to: '/shop/shoes' },
            { label: 'Accessories', to: '/shop/accessories' },
            { label: 'Sale', to: '/shop/sale' },
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            { label: 'Shipping', to: '/shop' },
            { label: 'Returns', to: '/shop' },
            { label: 'Contact', to: '/shop' },
          ]}
        />
        <FooterColumn
          title="Social"
          links={[
            { label: 'Instagram', to: 'https://instagram.com', external: true },
            { label: 'TikTok', to: 'https://tiktok.com', external: true },
          ]}
        />
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} VELOX. All rights reserved.</span>
        <span>Free shipping over R$399 · Easy returns within 30 days</span>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: { label: string; to: string; external?: boolean }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className={styles.column}>
      <h4 className={styles.columnTitle}>{title}</h4>
      <ul className={styles.linkList}>
        {links.map((link) =>
          link.external ? (
            <li key={link.label}>
              <a href={link.to} target="_blank" rel="noreferrer" className={styles.link}>
                {link.label}
              </a>
            </li>
          ) : (
            <li key={link.label}>
              <Link to={link.to} className={styles.link}>
                {link.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
