import type { Feature, FeatureCollection, Polygon, Point } from 'geojson';

// ============================================================
// HOUSE PROPERTIES
// ============================================================

export interface HouseAddress {
  street: string | null;
  number: string | null;
  city: string | null;
  postcode: string | null;
}

export interface HouseBuilding {
  type: string | null;
  levels: number | null;
  areaSqm: number | null;
}

export interface HouseProperties {
  id: string;
  osmId: number | null;
  address: HouseAddress;
  building: HouseBuilding;
}

// ============================================================
// GEOJSON TYPES
// ============================================================

export type HouseFeature = Feature<Polygon, HouseProperties>;
export type HouseFeatureCollection = FeatureCollection<Polygon, HouseProperties>;

// ============================================================
// PRICE ESTIMATE
// ============================================================

export interface PriceEstimate {
  rentMin: number;
  rentMax: number;
  saleMin: number;
  saleMax: number;
  pricePerSqm?: number;
  confidence?: 'low' | 'medium' | 'high';
}

// ============================================================
// LISTING (from database)
// ============================================================

export interface Listing {
  id: string;
  type: 'rent' | 'sale';
  price: number;
  rooms?: number;
  areaSqm?: number;
  title?: string;
  source?: string;
}

// ============================================================
// API RESPONSES
// ============================================================

export interface HouseDetailResponse {
  house: HouseFeature;
  estimate: PriceEstimate | null;
  listings: Listing[];
}

// ============================================================
// POPUP DATA
// ============================================================

export interface PopupData {
  coordinates: [number, number];
  houseId: string;
  address: string;
  buildingType: string | null;
  levels: number | null;
  estimate: PriceEstimate | null;
  listings: Listing[];
  loading: boolean;
}

// ============================================================
// BUILDING TYPE COLORS (for reference)
// ============================================================

export type BuildingType = 
  | 'residential'
  | 'apartments'
  | 'house'
  | 'commercial'
  | 'retail'
  | 'office'
  | 'industrial'
  | 'warehouse'
  | 'yes'  // OSM default
  | string;

export const BUILDING_TYPE_LABELS: Record<string, string> = {
  residential: 'Residential',
  apartments: 'Apartments',
  house: 'House',
  commercial: 'Commercial',
  retail: 'Retail',
  office: 'Office',
  industrial: 'Industrial',
  warehouse: 'Warehouse',
  yes: 'Building',
};
