import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useAddresses } from '../../hooks/useAddresses';
import { CheckoutSteps } from '../../components/checkout/CheckoutSteps';
import { CartItem } from '../../components/cart/CartItem';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { orderService } from '../../services/orderService';
import { useToastStore } from '../../contexts/toastStore';
import { formatPrice, cn } from '../../lib/utils';
import { DEFAULT_SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '../../data/constants';
import type { PaymentMethod } from '../../types/order';
import type { ShippingAddressSnapshot } from '../../types/order';
import styles from './Checkout.module.css';

type Step = 1 | 2 | 3 | 4 | 5;

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const { addresses } = useAddresses();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);

  const [step, setStep] = useState<Step>(1);
  const [contactEmail, setContactEmail] = useState(user?.email ?? '');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.is_default)?.id ?? null
  );
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : shippingMethod === 'express'
        ? DEFAULT_SHIPPING_COST * 2
        : DEFAULT_SHIPPING_COST;
  const total = subtotal + shipping;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const shippingSnapshot: ShippingAddressSnapshot | null = useMemo(() => {
    if (!selectedAddress) return null;
    return {
      name: selectedAddress.name,
      street: selectedAddress.street,
      number: selectedAddress.number,
      complement: selectedAddress.complement,
      neighborhood: selectedAddress.neighborhood,
      city: selectedAddress.city,
      state: selectedAddress.state,
      postal_code: selectedAddress.postal_code,
      country: selectedAddress.country,
    };
  }, [selectedAddress]);

  function goNext() {
    setStep((s) => Math.min(5, s + 1) as Step);
  }
  function goBack() {
    setStep((s) => Math.max(1, s - 1) as Step);
  }

  async function handlePlaceOrder() {
    if (!user || !shippingSnapshot) return;
    setIsPlacingOrder(true);
    try {
      const order = await orderService.create({
        userId: user.id,
        items,
        subtotal,
        shipping,
        total,
        shippingAddress: shippingSnapshot,
        paymentMethod,
      });
      clear();
      push('Order placed successfully!', 'success');
      navigate(`/account/orders/${order.id}`, { replace: true });
    } catch {
      push('We could not place your order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <p className={styles.emptyMessage}>Your bag is empty.</p>
          <Button variant="outline" onClick={() => navigate('/shop')}>
            Explore Collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <CheckoutSteps currentStep={step} />

      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          {step === 1 && (
            <StepSection title="Your Bag">
              {items.map((item) => (
                <CartItem key={item.key} item={item} />
              ))}
              <Button variant="primary" size="lg" onClick={goNext}>
                Continue
              </Button>
            </StepSection>
          )}

          {step === 2 && (
            <StepSection title="Information">
              <Input
                label="Email"
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              <div className={styles.stepActions}>
                <Button variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={goNext} disabled={!contactEmail}>
                  Continue
                </Button>
              </div>
            </StepSection>
          )}

          {step === 3 && (
            <StepSection title="Shipping Address">
              {addresses.length === 0 ? (
                <p className={styles.notice}>
                  You don't have any saved addresses yet.{' '}
                  <a href="/account/addresses" target="_blank" rel="noreferrer">
                    Add an address
                  </a>{' '}
                  before continuing.
                </p>
              ) : (
                <div className={styles.addressList}>
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      className={cn(
                        styles.addressCard,
                        selectedAddressId === address.id && styles.addressCardActive
                      )}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <span className={styles.addressName}>{address.name}</span>
                      <span className={styles.addressText}>
                        {address.street}, {address.number} — {address.city}/{address.state}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.stepActions}>
                <Button variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={goNext} disabled={!selectedAddressId}>
                  Continue
                </Button>
              </div>
            </StepSection>
          )}

          {step === 4 && (
            <StepSection title="Shipping">
              <div className={styles.optionList}>
                <button
                  className={cn(styles.optionCard, shippingMethod === 'standard' && styles.optionCardActive)}
                  onClick={() => setShippingMethod('standard')}
                >
                  <span>Standard (5-7 business days)</span>
                  <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : formatPrice(DEFAULT_SHIPPING_COST)}</span>
                </button>
                <button
                  className={cn(styles.optionCard, shippingMethod === 'express' && styles.optionCardActive)}
                  onClick={() => setShippingMethod('express')}
                >
                  <span>Express (1-2 business days)</span>
                  <span>
                    {subtotal >= FREE_SHIPPING_THRESHOLD
                      ? 'Free'
                      : formatPrice(DEFAULT_SHIPPING_COST * 2)}
                  </span>
                </button>
              </div>
              <div className={styles.stepActions}>
                <Button variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={goNext}>
                  Continue
                </Button>
              </div>
            </StepSection>
          )}

          {step === 5 && (
            <StepSection title="Payment">
              <p className={styles.simulationNotice}>
                This is a simulated checkout. No real payment will be processed.
              </p>
              <div className={styles.optionList}>
                {(
                  [
                    { value: 'credit_card', label: 'Credit Card' },
                    { value: 'pix', label: 'Pix' },
                    { value: 'boleto', label: 'Boleto' },
                  ] as { value: PaymentMethod; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    className={cn(styles.optionCard, paymentMethod === opt.value && styles.optionCardActive)}
                    onClick={() => setPaymentMethod(opt.value)}
                  >
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
              <div className={styles.stepActions}>
                <Button variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button variant="primary" onClick={handlePlaceOrder} loading={isPlacingOrder}>
                  Place Order
                </Button>
              </div>
            </StepSection>
          )}
        </div>

        <aside className={styles.summary}>
          <span className={styles.summaryTitle}>Order Summary</span>
          <div className={styles.line}>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className={styles.line}>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}
