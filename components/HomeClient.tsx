// ============================================================
// HOME CLIENT
// Solar Template - components/HomeClient.tsx
// ============================================================
// TASK 12: Phase 1 - Map ↔ Listings Sync
// Lifted state wrapper for map and sidebar synchronization
// ============================================================

'use client';

import { useState, useCallback, useMemo } from 'react';
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

// ============================================================
// MOCK DATA (Berlin)
// ============================================================

const MOCK_LISTINGS: SyncListing[] = [
  {
    id: 'listing_1',
    type: 'sale',
    price: 425000,
    priceSqm: 5000,
    address: 'Alexanderplatz 1, Berlin',
    rooms: 3,
    areaSqm: 85,
    buildingType: 'apartment',
    centroid: { lat: 52.5219, lng: 13.4132 },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'listing_2',
    type: 'rent',
    price: 1650,
    priceSqm: 25,
    address: 'Karl-Marx-Allee 33, Berlin',
    rooms: 2,
    areaSqm: 65,
    buildingType: 'apartment',
    centroid: { lat: 52.5180, lng: 13.4280 },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'listing_3',
    type: 'sale',
    price: 680000,
    priceSqm: 5667,
    address: 'Friedrichstraße 42, Berlin',
    rooms: 4,
    areaSqm: 120,
    buildingType: 'apartment',
    centroid: { lat: 52.5200, lng: 13.3880 },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'listing_4',
    type: 'rent',
    price: 2100,
    priceSqm: 23,
    address: 'Unter den Linden 77, Berlin',
    rooms: 3,
    areaSqm: 90,
    buildingType: 'apartment',
    centroid: { lat: 52.5170, lng: 13.3900 },
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'listing_5',
    type: 'sale',
    price: 520000,
    priceSqm: 5200,
    address: 'Prenzlauer Allee 88, Berlin',
    rooms: 3,
    areaSqm: 100,
    buildingType: 'apartment',
    centroid: { lat: 52.5350, lng: 13.4200 },
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'listing_6',
    type: 'sale',
    price: 890000,
    priceSqm: 7417,
    address: 'Kurfürstendamm 15, Berlin',
    rooms: 5,
    areaSqm: 120,
    buildingType: 'apartment',
    centroid: { lat: 52.5040, lng: 13.3320 },
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'listing_7',
    type: 'rent',
    price: 1200,
    priceSqm: 24,
    address: 'Warschauer Straße 12, Berlin',
    rooms: 1,
    areaSqm: 50,
    buildingType: 'apartment',
    centroid: { lat: 52.5070, lng: 13.4490 },
    createdAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: 'listing_8',
    type: 'sale',
    price: 350000,
    priceSqm: 5833,
    address: 'Boxhagener Platz 5, Berlin',
    rooms: 2,
    areaSqm: 60,
    buildingType: 'apartment',
    centroid: { lat: 52.5100, lng: 13.4580 },
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

// ============================================================
// HELPERS
// ============================================================

function isInBbox(point: Point, bbox: BoundingBox): boolean {
  return (
    point.lng >= bbox.minLng &&
    point.lng <= bbox.maxLng &&
    point.lat >= bbox.minLat &&
    point.lat <= bbox.maxLat
  );
}

// ============================================================
// COMPONENT
// ============================================================

export function HomeClient() {
  // Shared state
  const [bbox, setBbox] = useState<BoundingBox | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filter listings by bbox
  const visibleListings = useMemo(() => {
    if (!bbox) return MOCK_LISTINGS;
    return MOCK_LISTINGS.filter(listing => isInBbox(listing.centroid, bbox));
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
        listings={visibleListings}
        selectedId={selectedId}
        hoveredId={hoveredId}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onListingClick={handleListingClick}
        onListingHover={handleListingHover}
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
