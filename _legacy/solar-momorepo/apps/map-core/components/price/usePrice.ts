// ============================================================
// usePrice Hook
// Phase 5: Fetch price estimates from API
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PriceEstimate } from './PriceDisplay';

interface UsePriceOptions {
  enabled?: boolean;
}

interface UsePriceResult {
  data: PriceEstimate | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch price estimate for a house
 *
 * @param houseId - UUID of the house
 * @param options - Options (enabled)
 * @returns Price data, loading state, error, refetch function
 *
 * @example
 * const { data, isLoading, error } = usePrice(selectedHouseId);
 */
export function usePrice(
  houseId: string | null,
  options: UsePriceOptions = {}
): UsePriceResult {
  const { enabled = true } = options;

  const [data, setData] = useState<PriceEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrice = useCallback(async () => {
    if (!houseId || !enabled) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/price/estimate?house_id=${encodeURIComponent(houseId)}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [houseId, enabled]);

  // Fetch on mount and when houseId changes
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPrice,
  };
}

/**
 * Hook to fetch prices for multiple houses
 *
 * @param houseIds - Array of house UUIDs
 * @returns Map of houseId -> PriceEstimate
 */
export function usePriceBulk(houseIds: string[]): Map<string, PriceEstimate> {
  const [prices, setPrices] = useState<Map<string, PriceEstimate>>(new Map());

  useEffect(() => {
    if (houseIds.length === 0) {
      setPrices(new Map());
      return;
    }

    const fetchPrices = async () => {
      const results = new Map<string, PriceEstimate>();

      // Fetch in parallel with concurrency limit
      const BATCH_SIZE = 5;
      for (let i = 0; i < houseIds.length; i += BATCH_SIZE) {
        const batch = houseIds.slice(i, i + BATCH_SIZE);

        const batchResults = await Promise.all(
          batch.map(async (id) => {
            try {
              const response = await fetch(
                `/api/price/estimate?house_id=${encodeURIComponent(id)}`
              );
              if (response.ok) {
                const data = await response.json();
                return [id, data] as const;
              }
            } catch {
              // Ignore errors for bulk fetch
            }
            return null;
          })
        );

        for (const result of batchResults) {
          if (result) {
            results.set(result[0], result[1]);
          }
        }
      }

      setPrices(results);
    };

    fetchPrices();
  }, [houseIds.join(',')]); // Dependency on joined IDs

  return prices;
}
