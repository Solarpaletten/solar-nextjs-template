// ===========================================
// CLUSTERING ENGINE
// Solar Template - lib/clustering.ts
// ===========================================
// TASK 13.4: Added houseId for Map ↔ Sidebar sync
// ===========================================

import Supercluster from 'supercluster';
import { getSegment, type PriceSegment } from '@/lib/segmentation';

// ===========================================
// TYPES
// ===========================================

export interface ClusterPoint {
  id: string;           // This IS the houseId
  lat: number;
  lng: number;
  priceSqm: number;
  segment: PriceSegment;
  propertyType?: string;
}

export interface ClusterFeature {
  type: 'Feature';
  id: string | number;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    cluster: boolean;
    cluster_id?: number;
    point_count?: number;
    point_count_abbreviated?: string;
    // TASK 13.4: Unified house identifier
    houseId: string | null;  // null for clusters, house.id for points
    // Legacy (kept for compatibility)
    listing_id?: string;
    price_sqm?: number;
    segment?: PriceSegment;
    property_type?: string;
  };
}

// ===========================================
// CLUSTER INDEX
// ===========================================

/**
 * Create a new Supercluster index
 */
export function createClusterIndex(options?: Partial<Supercluster.Options<any, any>>) {
  return new Supercluster({
    radius: 60,        // Pixel radius for clustering
    maxZoom: 16,       // Max zoom to cluster
    minPoints: 2,      // Min points to form cluster
    extent: 512,       // Tile extent
    nodeSize: 64,      // KD-tree node size
    ...options,
  });
}

/**
 * Load points into cluster index
 */
export function loadPoints(
  index: Supercluster,
  points: ClusterPoint[]
): void {
  const features = points.map((point) => ({
    type: 'Feature' as const,
    id: point.id,
    geometry: {
      type: 'Point' as const,
      coordinates: [point.lng, point.lat] as [number, number],
    },
    properties: {
      cluster: false,
      houseId: point.id,           // TASK 13.4: explicit houseId
      listing_id: point.id,        // Legacy support
      price_sqm: point.priceSqm,
      segment: point.segment,
      property_type: point.propertyType,
    },
  }));
  
  index.load(features);
}

/**
 * Get clusters for viewport
 */
export function getClusters(
  index: Supercluster,
  bbox: [number, number, number, number],
  zoom: number
): ClusterFeature[] {
  const clusters = index.getClusters(bbox, zoom);
  
  return clusters.map((cluster: any) => {
    if (cluster.properties.cluster) {
      return {
        type: 'Feature',
        id: `cluster_${cluster.properties.cluster_id}`,
        geometry: cluster.geometry,
        properties: {
          cluster: true,
          cluster_id: cluster.properties.cluster_id,
          point_count: cluster.properties.point_count,
          point_count_abbreviated: formatCount(cluster.properties.point_count),
          houseId: null,  // Clusters don't have single houseId
        },
      };
    }
    
    // Individual point - houseId is the identifier
    const houseId = cluster.properties.houseId || cluster.properties.listing_id;
    
    return {
      type: 'Feature',
      id: houseId,
      geometry: cluster.geometry,
      properties: {
        cluster: false,
        houseId: houseId,                             // TASK 13.4
        listing_id: houseId,                          // Legacy
        price_sqm: cluster.properties.price_sqm,
        segment: cluster.properties.segment,
        property_type: cluster.properties.property_type,
      },
    };
  });
}

/**
 * Get points in a cluster
 */
export function getClusterLeaves(
  index: Supercluster,
  clusterId: number,
  limit: number = 100,
  offset: number = 0
): ClusterFeature[] {
  const leaves = index.getLeaves(clusterId, limit, offset);
  
  return leaves.map((leaf: any) => {
    const houseId = leaf.properties.houseId || leaf.properties.listing_id;
    
    return {
      type: 'Feature',
      id: houseId,
      geometry: leaf.geometry,
      properties: {
        cluster: false,
        houseId: houseId,
        listing_id: houseId,
        price_sqm: leaf.properties.price_sqm,
        segment: leaf.properties.segment,
        property_type: leaf.properties.property_type,
      },
    };
  });
}

/**
 * Get cluster expansion zoom
 */
export function getClusterExpansionZoom(
  index: Supercluster,
  clusterId: number
): number {
  return index.getClusterExpansionZoom(clusterId);
}

/**
 * TASK 13.4: Extract visible houseIds from features
 */
export function extractVisibleHouseIds(features: ClusterFeature[]): string[] {
  const ids: string[] = [];
  
  for (const feature of features) {
    if (!feature.properties.cluster && feature.properties.houseId) {
      ids.push(feature.properties.houseId);
    }
  }
  
  return [...new Set(ids)]; // Deduplicate
}

// ===========================================
// CLUSTER STYLING
// ===========================================

export interface ClusterStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  size: number;
}

/**
 * Get cluster marker style
 */
export function getClusterStyle(
  count: number,
  dominantSegment?: PriceSegment
): ClusterStyle {
  // Size based on count
  let size: number;
  if (count < 5) size = 36;
  else if (count < 20) size = 44;
  else if (count < 50) size = 52;
  else if (count < 100) size = 60;
  else size = 68;
  
  // Default green (like Lithuanian site)
  const colors = {
    low: { bg: '#22c55e', border: '#86efac' },
    mid: { bg: '#3b82f6', border: '#93c5fd' },
    upper: { bg: '#f97316', border: '#fdba74' },
    premium: { bg: '#ef4444', border: '#fca5a5' },
  };
  
  const segmentColors = dominantSegment 
    ? colors[dominantSegment]
    : colors.low;
  
  return {
    backgroundColor: segmentColors.bg,
    borderColor: segmentColors.border,
    textColor: '#ffffff',
    size,
  };
}

// ===========================================
// HELPERS
// ===========================================

/**
 * Format count for display
 */
export function formatCount(count: number): string {
  if (count >= 1000) return `${Math.round(count / 1000)}K`;
  if (count >= 9) return '9+';
  return count.toString();
}
