// ===========================================
// CLUSTERS HOOK
// Solar Template - hooks/useClusters.ts
// ===========================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { BoundingBox, ClusterFeature } from '@/types/map';
import type { ClustersResponse, SegmentsResponse } from '@/types/api';
import { DEBOUNCE_MS } from '@/config/constants';
import { debounce } from '@/lib/utils';

// ===========================================
// TYPES
// ===========================================

export interface UseClustersOptions {
  bbox: BoundingBox | null;
  zoom: number;
  enabled?: boolean;
}

export interface UseClustersReturn {
  clusters: ClusterFeature[];
  isLoading: boolean;
  error: string | null;
  totalClusters: number;
  totalPoints: number;
  refetch: () => void;
  getSegments: (clusterId: number) => Promise<SegmentsResponse | null>;
}

// ===========================================
// HOOK
// ===========================================

export function useClusters(options: UseClustersOptions): UseClustersReturn {
  const { bbox, zoom, enabled = true } = options;
  
  const [clusters, setClusters] = useState<ClusterFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ totalClusters: 0, totalPoints: 0 });
  
  // Fetch clusters
  const fetchClusters = useCallback(async () => {
    if (!bbox || !enabled) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const bboxString = `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`;
      const response = await fetch(
        `/api/clusters?bbox=${bboxString}&zoom=${Math.round(zoom)}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch clusters: ${response.statusText}`);
      }
      
      const data: ClustersResponse = await response.json();
      
      setClusters(data.features);
      setMeta({
        totalClusters: data.meta.total_clusters,
        totalPoints: data.meta.total_points,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setClusters([]);
    } finally {
      setIsLoading(false);
    }
  }, [bbox, zoom, enabled]);
  
  // Debounced fetch
  const debouncedFetch = useCallback(
    debounce(fetchClusters, DEBOUNCE_MS),
    [fetchClusters]
  );
  
  // Fetch on bbox/zoom change
  useEffect(() => {
    if (bbox && enabled) {
      debouncedFetch();
    }
  }, [bbox, zoom, enabled, debouncedFetch]);
  
  // Get segments for a cluster
  const getSegments = useCallback(async (clusterId: number): Promise<SegmentsResponse | null> => {
    try {
      const response = await fetch(`/api/segments?cluster_id=${clusterId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch segments: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error fetching segments:', err);
      return null;
    }
  }, []);
  
  return {
    clusters,
    isLoading,
    error,
    totalClusters: meta.totalClusters,
    totalPoints: meta.totalPoints,
    refetch: fetchClusters,
    getSegments,
  };
}
