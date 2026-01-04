// ============================================================
// HOME CLIENT
// Solar Template - components/HomeClient.tsx
// ============================================================
// TASK 13.3: Phase 2 - Real Data from API
// Lifted state wrapper for map and sidebar synchronization
// ============================================================

'use client';

import { useState, useCallback, useEffect } from 'react';
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
  // Data state
  const [houses, setHouses] = useState<SyncListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state
  const [bbox, setBbox] = useState<BoundingBox | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch houses when bbox changes
  useEffect(() => {
    if (!bbox) return;

    const controller = new AbortController();

    async function fetchHouses() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/houses?bbox=${bboxToString(bbox as BoundingBox)}&limit=100`,
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

        setHouses(listings);
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

  // Map callbacks
  const handleBboxChange = useCallback((newBbox: BoundingBox) => {
    setBbox(newBbox);
  }, []);

  const handlePointSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handlePointHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  // Sidebar callbacks
  const handleListingClick = useCallback((listing: SyncListing) => {
    setSelectedId(listing.id);
  }, []);

  const handleListingHover = useCallback((id: string | null) => {
    setHoveredId(id);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <ListingSidebar
        listings={houses}
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
          onPointSelect={handlePointSelect}
          onPointHover={handlePointHover}
          selectedId={selectedId}
          hoveredId={hoveredId}
        />
      </div>
    </div>
  );
}