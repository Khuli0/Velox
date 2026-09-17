import { useState, type FormEvent } from 'react';
import { useAddresses } from '../../../hooks/useAddresses';
import type { Address } from '../../../types/user';
import type { AddressInput } from '../../../services/addressService';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import styles from './AddressForm.module.css';

interface AddressFormProps {
  address: Address | null;
  onClose: () => void;
}

const EMPTY: AddressInput = {
  name: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'BR',
  is_default: false,
};

export function AddressForm({ address, onClose }: AddressFormProps) {
  const { createAddress, updateAddress } = useAddresses();
  const [form, setForm] = useState<AddressInput>(
    address
      ? {
          name: address.name,
          street: address.street,
          number: address.number,
          complement: address.complement ?? '',
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
          is_default: address.is_default,
        }
      : EMPTY
  );

  function update<K extends keyof AddressInput>(key: K, value: AddressInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (address) {
      updateAddress({ id: address.id, input: form });
    } else {
      createAddress(form);
    }
    onClose();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <span className={styles.title}>{address ? 'Edit Address' : 'New Address'}</span>

      <Input label="Name" required value={form.name} onChange={(e) => update('name', e.target.value)} />

      <div className={styles.row}>
        <Input
          label="Street"
          required
          value={form.street}
          onChange={(e) => update('street', e.target.value)}
          className={styles.rowMain}
        />
        <Input label="Number" required value={form.number} onChange={(e) => update('number', e.target.value)} />
      </div>

      <Input
        label="Complement (optional)"
        value={form.complement ?? ''}
        onChange={(e) => update('complement', e.target.value)}
      />

      <Input
        label="Neighborhood"
        required
        value={form.neighborhood}
        onChange={(e) => update('neighborhood', e.target.value)}
      />

      <div className={styles.row}>
        <Input label="City" required value={form.city} onChange={(e) => update('city', e.target.value)} />
        <Input label="State" required value={form.state} onChange={(e) => update('state', e.target.value)} />
      </div>

      <Input
        label="Postal Code"
        required
        value={form.postal_code}
        onChange={(e) => update('postal_code', e.target.value)}
      />

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={form.is_default}
          onChange={(e) => update('is_default', e.target.checked)}
        />
        Set as default address
      </label>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Address
        </Button>
      </div>
    </form>
  );
}
