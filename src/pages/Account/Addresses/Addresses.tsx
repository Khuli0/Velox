import { useState } from 'react';
import { useAddresses } from '../../../hooks/useAddresses';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';
import { AddressForm } from './AddressForm';
import type { Address } from '../../../types/user';
import { cn } from '../../../lib/utils';
import styles from './Addresses.module.css';

export default function Addresses() {
  const { addresses, isLoading, isError, removeAddress, setDefaultAddress } = useAddresses();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  function openCreate() {
    setEditingAddress(null);
    setFormOpen(true);
  }

  function openEdit(address: Address) {
    setEditingAddress(address);
    setFormOpen(true);
  }

  if (isLoading) return <LoadingState label="Loading addresses" />;
  if (isError) return <ErrorState message="We could not load your addresses." />;

  if (isFormOpen) {
    return (
      <AddressForm
        address={editingAddress}
        onClose={() => setFormOpen(false)}
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.subtitle}>{addresses.length} saved address(es)</span>
        <Button variant="outline" size="sm" onClick={openCreate}>
          + Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          title="No addresses yet"
          description="Add an address to speed up your checkout."
          action={
            <Button variant="primary" onClick={openCreate}>
              Add Address
            </Button>
          }
        />
      ) : (
        <div className={styles.list}>
          {addresses.map((address) => (
            <div key={address.id} className={cn(styles.card, address.is_default && styles.cardDefault)}>
              {address.is_default && <span className={styles.defaultBadge}>Default</span>}
              <span className={styles.name}>{address.name}</span>
              <p className={styles.text}>
                {address.street}, {address.number}
                {address.complement ? ` – ${address.complement}` : ''}
                <br />
                {address.neighborhood} · {address.city}/{address.state}
                <br />
                {address.postal_code}
              </p>
              <div className={styles.actions}>
                <button onClick={() => openEdit(address)}>Edit</button>
                {!address.is_default && (
                  <button onClick={() => setDefaultAddress(address.id)}>Set as default</button>
                )}
                <button className={styles.remove} onClick={() => removeAddress(address.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
