// ============================================================
// FORM STATE
// ============================================================

export type ListingType = 'rent' | 'sale';

export type FormStep = 'address' | 'type' | 'details' | 'success';

export interface FormData {
  houseId: string | null;
  address: string;
  listingType: ListingType | null;
  price: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
}

export const initialFormData: FormData = {
  houseId: null,
  address: '',
  listingType: null,
  price: '',
  contactEmail: '',
  contactPhone: '',
  description: '',
};

// ============================================================
// API TYPES
// ============================================================

export interface CreateListingPayload {
  house_id: string | null;
  listing_type: ListingType;
  price: number;
  contact_email: string;
  contact_phone: string | null;
  description: string | null;
}

export interface CreateListingResponse {
  status: 'ok' | 'error';
  error?: string;
}
