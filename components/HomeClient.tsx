// ============================================================
// HOME CLIENT
// Solar Template - components/HomeClient.tsx
// ============================================================
// TASK 13.4: Map ↔ Sidebar Real Sync (UX Core)
// Единый источник правды: house.id
// ============================================================

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { MapContainer } from '@/components/map/MapContainer';
import { ListingSidebar } from '@/components/sidebar/ListingSidebar';
import type { BoundingBox, Point } from '@/types/map';

// ============================================================
// TYPES
// ============================================================

export interface SyncListing {
  id: string;
  type: 'rent' | 'sale';
  price: number;
  priceSqm: number;
  address: string;
  rooms: number;
  areaSqm: number;
  buildingType: string;
  centroid: Point;
  createdAt: string;
}

interface APIHouse {
  id: string;
  osm_id: string | null;
  building_type: string | null;
  area_sqm: number | null;
  building_levels: number | null;
  centroid: { lat: number; lng: number } | null;
}

interface APIResponse {
  houses: APIHouse[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

// ============================================================
// HELPERS
// ============================================================

const BASE_PRICE_SQM = 6500; // CHF/m²

function transformHouseToListing(house: APIHouse): SyncListing | null {
  // Skip houses without centroid
  if (!house.centroid) return null;

  const areaSqm = house.area_sqm ?? 80;
  const priceSqm = BASE_PRICE_SQM;
  const price = Math.round(areaSqm * priceSqm);

  return {
    id: house.id,
    type: 'sale',
    price,
    priceSqm,
    address: house.building_type
      ? `${house.building_type.charAt(0).toUpperCase()}${house.building_type.slice(1)} Property`
      : 'Property',
    rooms: house.building_levels ?? 3,
    areaSqm,
    buildingType: house.building_type ?? 'residential',
    centroid: house.centroid,
    createdAt: new Date().toISOString(),
  };
}

function bboxToString(bbox: BoundingBox): string {
  return `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`;
}

// ============================================================
// COMPONENT
// ============================================================

export function HomeClient() {
  // ===========================================
  // DATA STATE
  // ===========================================
  const [allHouses, setAllHouses] = useState<SyncListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===========================================
  // TASK 13.4: SYNC STATE (единый источник правды)
  // ===========================================
  const [bbox, setBbox] = useState<BoundingBox | null>(null);
  const [visibleHouseIds, setVisibleHouseIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ===========================================
  // TASK 13.4: Sidebar показывает ТОЛЬКО видимые на карте
  // ===========================================
  const visibleListings = useMemo(() => {
    if (visibleHouseIds.length === 0) return [];
    
    const idsSet = new Set(visibleHouseIds);
    return allHouses.filter((house) => idsSet.has(house.id));
  }, [allHouses, visibleHouseIds]);

  // ===========================================
  // FETCH HOUSES when bbox changes
  // ===========================================
  useEffect(() => {
    if (!bbox) return;

    const controller = new AbortController();

    async function fetchHouses() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/houses?bbox=${bboxToString(bbox)}&limit=500`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: APIResponse = await response.json();

        // Transform API houses to SyncListing format
        const listings = data.houses
          .map(transformHouseToListing)
          .filter((l): l is SyncListing => l !== null);

        setAllHouses(listings);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Ignore aborted requests
        }
        console.error('Failed to fetch houses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    }

    fetchHouses();

    return () => controller.abort();
  }, [bbox]);

  // ===========================================
  // MAP CALLBACKS
  // ===========================================
  const handleBboxChange = useCallback((newBbox: BoundingBox) => {
    setBbox(newBbox);
  }, []);

  // TASK 13.4: Receive visible IDs from map
  const handleVisibleHouseIdsChange = useCallback((ids: string[]) => {
    setVisibleHouseIds(ids);
  }, []);

  const handlePointSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handlePointHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  // ===========================================
  // SIDEBAR CALLBACKS
  // ===========================================
  const handleListingClick = useCallback((listing: SyncListing) => {
    setSelectedId(listing.id);
    // Map will auto-zoom via selectedId change
  }, []);

  const handleListingHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  // ===========================================
  // RENDER
  // ===========================================
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - shows ONLY visible houses */}
      <ListingSidebar
        listings={visibleListings}
        selectedId={selectedId}
        hoveredId={hoveredId}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onListingClick={handleListingClick}
        onListingHover={handleListingHover}
        loading={loading}
        error={error}
      />

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          className="w-full h-full"
          onBboxChange={handleBboxChange}
          onVisibleHouseIdsChange={handleVisibleHouseIdsChange}
          onPointSelect={handlePointSelect}
          onPointHover={handlePointHover}
          selectedId={selectedId}
          hoveredId={hoveredId}
        />
      </div>
    </div>
  );
}
