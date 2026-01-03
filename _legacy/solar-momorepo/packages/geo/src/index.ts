// Types - explicit exports to avoid conflicts
export type { OSMFeature, ParsedHouse, OSMImportOptions } from './osm-types';
export type { BBox, HouseFeature, HouseFeatureCollection, HouseProperties } from './types';

// Query functions
export { getHouseById, getHouseByPoint, getHousesInBounds } from './queries';
