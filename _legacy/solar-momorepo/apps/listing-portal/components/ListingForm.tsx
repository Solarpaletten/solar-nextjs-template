'use client';

import { useState } from 'react';
import styles from './ListingForm.module.css';
import type { 
  FormStep, 
  FormData, 
  ListingType, 
  CreateListingPayload,
  CreateListingResponse,
  initialFormData 
} from './types';

// ============================================================
// LISTING FORM COMPONENT
// ============================================================

export function ListingForm() {
  const [step, setStep] = useState<FormStep>('address');
  const [formData, setFormData] = useState<FormData>({
    houseId: null,
    address: '',
    listingType: null,
    price: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // STEP NAVIGATION
  // ============================================================

  const goToStep = (nextStep: FormStep) => {
    setError(null);
    setStep(nextStep);
  };

  const canProceedFromAddress = formData.address.trim().length > 0;
  const canProceedFromType = formData.listingType !== null;
  const canSubmit = 
    formData.contactEmail.trim().length > 0 &&
    formData.price.trim().length > 0 &&
    parseFloat(formData.price) > 0;

  // ============================================================
  // FORM SUBMISSION
  // ============================================================

  const handleSubmit = async () => {
    if (!canSubmit || !formData.listingType) return;

    setIsSubmitting(true);
    setError(null);

    const payload: CreateListingPayload = {
      house_id: formData.houseId,
      listing_type: formData.listingType,
      price: parseFloat(formData.price),
      contact_email: formData.contactEmail.trim(),
      contact_phone: formData.contactPhone.trim() || null,
      description: formData.description.trim() || null,
    };

    try {
      const response = await fetch('/api/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: CreateListingResponse = await response.json();

      if (data.status === 'ok') {
        goToStep('success');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  const stepIndex = ['address', 'type', 'details', 'success'].indexOf(step);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.logo}>☀️ Solar Listing</h1>
        <p className={styles.tagline}>List your property in under 60 seconds</p>
      </header>

      {/* Progress */}
      {step !== 'success' && (
        <div className={styles.progress}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${styles.progressStep} ${
                i < stepIndex ? styles.completed : ''
              } ${i === stepIndex ? styles.active : ''}`}
            />
          ))}
        </div>
      )}

      {/* Card */}
      <div className={styles.card}>
        {error && <div className={styles.error}>{error}</div>}

        {/* Step 1: Address */}
        {step === 'address' && (
          <StepAddress
            value={formData.address}
            onChange={(address) => setFormData({ ...formData, address })}
            onNext={() => goToStep('type')}
            canProceed={canProceedFromAddress}
          />
        )}

        {/* Step 2: Listing Type */}
        {step === 'type' && (
          <StepType
            value={formData.listingType}
            onChange={(listingType) => setFormData({ ...formData, listingType })}
            onBack={() => goToStep('address')}
            onNext={() => goToStep('details')}
            canProceed={canProceedFromType}
          />
        )}

        {/* Step 3: Details */}
        {step === 'details' && (
          <StepDetails
            formData={formData}
            onChange={(updates) => setFormData({ ...formData, ...updates })}
            onBack={() => goToStep('type')}
            onSubmit={handleSubmit}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Step 4: Success */}
        {step === 'success' && <StepSuccess />}
      </div>
    </div>
  );
}

// ============================================================
// STEP 1: ADDRESS
// ============================================================

interface StepAddressProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  canProceed: boolean;
}

function StepAddress({ value, onChange, onNext, canProceed }: StepAddressProps) {
  return (
    <>
      <h2 className={styles.stepTitle}>Where is your property?</h2>
      <p className={styles.stepDescription}>
        Enter the address of the property you want to list
      </p>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Address <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.input}
          placeholder="e.g. Friedrichstraße 123, Berlin"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={onNext}
          disabled={!canProceed}
        >
          Continue
        </button>
      </div>
    </>
  );
}

// ============================================================
// STEP 2: LISTING TYPE
// ============================================================

interface StepTypeProps {
  value: ListingType | null;
  onChange: (value: ListingType) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

function StepType({ value, onChange, onBack, onNext, canProceed }: StepTypeProps) {
  return (
    <>
      <h2 className={styles.stepTitle}>What do you want to do?</h2>
      <p className={styles.stepDescription}>
        Choose whether you want to rent or sell your property
      </p>

      <div className={styles.radioGroup}>
        <label
          className={`${styles.radioOption} ${value === 'rent' ? styles.selected : ''}`}
        >
          <input
            type="radio"
            name="listingType"
            value="rent"
            checked={value === 'rent'}
            onChange={() => onChange('rent')}
            className={styles.radioInput}
          />
          <div>
            <div className={styles.radioLabel}>🏠 Rent</div>
            <div className={styles.radioDescription}>
              List your property for monthly rental
            </div>
          </div>
        </label>

        <label
          className={`${styles.radioOption} ${value === 'sale' ? styles.selected : ''}`}
        >
          <input
            type="radio"
            name="listingType"
            value="sale"
            checked={value === 'sale'}
            onChange={() => onChange('sale')}
            className={styles.radioInput}
          />
          <div>
            <div className={styles.radioLabel}>💰 Sale</div>
            <div className={styles.radioDescription}>
              List your property for sale
            </div>
          </div>
        </label>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={onBack}
        >
          Back
        </button>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={onNext}
          disabled={!canProceed}
        >
          Continue
        </button>
      </div>
    </>
  );
}

// ============================================================
// STEP 3: DETAILS
// ============================================================

interface StepDetailsProps {
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
}

function StepDetails({
  formData,
  onChange,
  onBack,
  onSubmit,
  canSubmit,
  isSubmitting,
}: StepDetailsProps) {
  const priceLabel = formData.listingType === 'rent' 
    ? 'Monthly rent (€)' 
    : 'Sale price (€)';
  const pricePlaceholder = formData.listingType === 'rent' 
    ? 'e.g. 1200' 
    : 'e.g. 350000';

  return (
    <>
      <h2 className={styles.stepTitle}>Price & Contact</h2>
      <p className={styles.stepDescription}>
        Set your price and how buyers can reach you
      </p>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          {priceLabel} <span className={styles.required}>*</span>
        </label>
        <input
          type="number"
          className={styles.input}
          placeholder={pricePlaceholder}
          value={formData.price}
          onChange={(e) => onChange({ price: e.target.value })}
          min="1"
          autoFocus
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          className={styles.input}
          placeholder="your@email.com"
          value={formData.contactEmail}
          onChange={(e) => onChange({ contactEmail: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Phone (optional)</label>
        <input
          type="tel"
          className={styles.input}
          placeholder="+49 123 456 789"
          value={formData.contactPhone}
          onChange={(e) => onChange({ contactPhone: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Description (optional)</label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Tell potential buyers about your property..."
          value={formData.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.loading}></span>
              Publishing...
            </>
          ) : (
            'Publish Listing'
          )}
        </button>
      </div>
    </>
  );
}

// ============================================================
// STEP 4: SUCCESS
// ============================================================

function StepSuccess() {
  return (
    <>
      <div className={styles.successIcon}>✓</div>
      <h2 className={styles.successTitle}>Published!</h2>
      <p className={styles.successMessage}>
        Your listing is now live and visible on the map.
        <br />
        Interested buyers can contact you directly.
      </p>
      <div className={styles.buttonGroup}>
        <a
          href="/"
          className={`${styles.button} ${styles.buttonSecondary}`}
          style={{ textDecoration: 'none', textAlign: 'center' }}
        >
          Post Another
        </a>
        <a
          href="http://localhost:3000"
          className={`${styles.button} ${styles.buttonPrimary}`}
          style={{ textDecoration: 'none', textAlign: 'center' }}
        >
          View on Map
        </a>
      </div>
    </>
  );
}
