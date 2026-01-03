// ============================================================
// @solar/config - Central Configuration Package
// Switzerland Edition
// ============================================================

// Regions
export {
  REGIONS,
  DEFAULT_REGION,
  getRegion,
  getRegionList,
  getRegionsByCountry,
  isCHRegion,
  getOSMQuery,
} from './regions';

export type {
  RegionConfig,
  Currency,
  AreaUnit,
  PriceUnit,
} from './regions';

// Units & Formatting
export {
  SQFT_PER_SQM,
  SQM_PER_SQFT,
  sqmToSqft,
  sqftToSqm,
  formatCurrency,
  formatArea,
  formatPricePerUnit,
  getCurrencySymbol,
  getAreaUnitLabel,
  formatSwissNumber,
  formatSwissPriceSqm,
} from './units';
