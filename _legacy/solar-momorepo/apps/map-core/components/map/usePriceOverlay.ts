// ============================================================
// usePriceOverlay Hook
// Phase 5B: Manage price overlay state and data fetching
// ============================================================

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';

// Types
export interface BulkPriceResponse {
  bbox: [number, number, number, number];
  prices: Array<{
    house_id: string;
    price_sqm: number;
    confidence: number;
    color: string;
  }>;
  count: number;
  method: string;
  cached: boolean;
  response_time_ms: number;
}

export interface PriceOverlayState {
  enabled: boolean;
  loading: boolean;
  error: Error | null;
  priceMap: Map<string, { price: number; color: string }>;
  buildingsCount: number;
  lastBbox: string | null;
}

// Debounce delay for map movements (ms)
const DEBOUNCE_DELAY = 400;

/**
 * Hook for managing price overlay on map
 *
 * Features:
 * - Toggle on/off
 * - Fetch prices for current viewport
 * - Debounced updates on map move
 * - Apply colors to buildings
 */
export function usePriceOverlay(map: MapboxMap | null) {
  const [state, setState] = useState<PriceOverlayState>({
    enabled: false,
    loading: false,
    error: null,
    priceMap: new Map(),
    buildingsCount: 0,
    lastBbox: null,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Get current map bbox as string
   */
  const getBboxString = useCallback((): string | null => {
    if (!map) return null;
    const bounds = map.getBounds();
    if (!bounds) return null;
    
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    
    return `${sw.lng.toFixed(5)},${sw.lat.toFixed(5)},${ne.lng.toFixed(5)},${ne.lat.toFixed(5)}`;
  }, [map]);

  /**
   * Fetch prices for current viewport
   */
  const fetchPrices = useCallback(async () => {
    const bbox = getBboxString();
    if (!bbox) return;

    // Skip if same bbox
    if (bbox === state.lastBbox && state.priceMap.size > 0) {
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/price/bulk?bbox=${bbox}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: BulkPriceResponse = await response.json();

      // Build price map
      const newPriceMap = new Map<string, { price: number; color: string }>();
      for (const p of data.prices) {
        newPriceMap.set(p.house_id, {
          price: p.price_sqm,
          color: p.color,
        });
      }

      setState(prev => ({
        ...prev,
        loading: false,
        priceMap: newPriceMap,
        buildingsCount: data.count,
        lastBbox: bbox,
      }));

      // Apply colors to map
      applyPriceColors(map, newPriceMap);

    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return; // Ignore abort errors
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    }
  }, [map, getBboxString, state.lastBbox, state.priceMap.size]);

  /**
   * Toggle price overlay
   */
  const toggle = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, enabled }));

    if (enabled) {
      fetchPrices();
    } else {
      // Reset colors
      resetPriceColors(map);
      setState(prev => ({
        ...prev,
        priceMap: new Map(),
        buildingsCount: 0,
        lastBbox: null,
      }));
    }
  }, [map, fetchPrices]);

  /**
   * Handle map move (debounced)
   */
  const handleMapMove = useCallback(() => {
    if (!state.enabled) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchPrices();
    }, DEBOUNCE_DELAY);
  }, [state.enabled, fetchPrices]);

  /**
   * Setup map event listeners
   */
  useEffect(() => {
    if (!map) return;

    map.on('moveend', handleMapMove);

    return () => {
      map.off('moveend', handleMapMove);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [map, handleMapMove]);

  return {
    enabled: state.enabled,
    loading: state.loading,
    error: state.error,
    buildingsCount: state.buildingsCount,
    priceMap: state.priceMap,
    toggle,
    refresh: fetchPrices,
  };
}

// ============================================================
// MAPBOX INTEGRATION HELPERS
// ============================================================

/**
 * Apply price colors to buildings layer
 */
function applyPriceColors(
  map: MapboxMap | null,
  priceMap: Map<string, { price: number; color: string }>
): void {
  if (!map) return;

  const layerId = 'buildings-3d';

  // Check if layer exists
  if (!map.getLayer(layerId)) {
    console.warn('Buildings layer not found:', layerId);
    return;
  }

  // Build match expression for colors
  // Format: ['match', ['get', 'id'], id1, color1, id2, color2, ..., defaultColor]
  const matchExpression: any[] = ['match', ['get', 'id']];

  for (const [houseId, data] of Array.from(priceMap.entries())) {
    matchExpression.push(houseId);
    matchExpression.push(data.color);
  }

  // Default color for buildings without prices
  matchExpression.push('#888888');

  try {
    map.setPaintProperty(layerId, 'fill-extrusion-color', matchExpression as any);
  } catch (error) {
    console.error('Failed to apply price colors:', error);
    
    // Fallback: try interpolate expression based on data-driven approach
    applyPriceColorsAlternative(map, priceMap);
  }
}

/**
 * Alternative approach using setFeatureState
 */
function applyPriceColorsAlternative(
  map: MapboxMap | null,
  priceMap: Map<string, { price: number; color: string }>
): void {
  if (!map) return;

  const sourceId = 'buildings';
  
  // Set feature state for each building
  for (const [houseId, data] of Array.from(priceMap.entries())) {
    try {
      map.setFeatureState(
        { source: sourceId, id: houseId },
        { priceColor: data.color, priceSqm: data.price }
      );
    } catch {
      // Feature might not exist
    }
  }
}

/**
 * Reset building colors to default
 */
function resetPriceColors(map: MapboxMap | null): void {
  if (!map) return;

  const layerId = 'buildings-3d';

  if (!map.getLayer(layerId)) return;

  try {
    // Reset to original color (semi-transparent based on building type)
    map.setPaintProperty(layerId, 'fill-extrusion-color', [
      'match',
      ['get', 'building_type'],
      'residential', 'rgba(100, 149, 237, 0.7)',
      'apartments', 'rgba(65, 105, 225, 0.7)',
      'commercial', 'rgba(255, 165, 0, 0.7)',
      'office', 'rgba(147, 112, 219, 0.7)',
      'industrial', 'rgba(169, 169, 169, 0.7)',
      'rgba(128, 128, 128, 0.7)' // default
    ]);
  } catch (error) {
    console.error('Failed to reset colors:', error);
  }
}

/**
 * Get price for a specific house (for popup)
 */
export function getPriceFromOverlay(
  priceMap: Map<string, { price: number; color: string }>,
  houseId: string
): { price: number; color: string } | null {
  return priceMap.get(houseId) ?? null;
}
