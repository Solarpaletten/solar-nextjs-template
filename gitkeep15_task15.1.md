leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % cat components/map/ClusterLayer.tsx
// ===========================================
// CLUSTER LAYER
// Solar Template - components/map/ClusterLayer.tsx
// ===========================================
// TASK 12: Phase 1 - Added highlight support for sidebar sync
// ===========================================

'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { ClusterFeature } from '@/types/map';

// ===========================================
// TYPES
// ===========================================

interface ClusterLayerProps {
  map: mapboxgl.Map;
  clusters: ClusterFeature[];
  onClusterClick?: (feature: ClusterFeature) => void;
  onPointClick?: (feature: ClusterFeature) => void;
  onPointHover?: (feature: ClusterFeature) => void;
  onPointLeave?: () => void;
  selectedId?: string | null;
  hoveredId?: string | null;
}

// ===========================================
// HELPERS
// ===========================================

function getSegmentColor(priceSqm: number): string {
  if (priceSqm < 6000) return '#22c55e'; // green - low
  if (priceSqm < 8000) return '#3b82f6'; // blue - mid
  if (priceSqm < 10000) return '#f97316'; // orange - upper
  return '#ef4444'; // red - premium
}

function getClusterSize(count: number): number {
  if (count < 5) return 36;
  if (count < 20) return 44;
  if (count < 50) return 52;
  if (count < 100) return 60;
  return 68;
}

// ===========================================
// COMPONENT
// ===========================================

export function ClusterLayer({
  map,
  clusters,
  onClusterClick,
  onPointClick,
  onPointHover,
  onPointLeave,
  selectedId,
  hoveredId,
}: ClusterLayerProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    clusters.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const el = document.createElement('div');

      if (feature.properties.cluster) {
        // Cluster marker
        const count = feature.properties.point_count || 0;
        const size = getClusterSize(count);

        el.className = 'cluster-marker';
        el.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${count > 99 ? '14px' : '16px'};
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        el.textContent = feature.properties.point_count_abbreviated || String(count);

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.1)';
          el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        });
        el.addEventListener('click', () => {
          onClusterClick?.(feature);
        });
      } else {
        // Individual point marker
        const listingId = feature.properties.listing_id;
        const color = getSegmentColor(feature.properties.price_sqm || 7000);
        const isSelected = selectedId === listingId;
        const isHovered = hoveredId === listingId;
        const isHighlighted = isSelected || isHovered;

        el.className = 'point-marker';
        el.setAttribute('data-listing-id', listingId || '');
        el.style.cssText = `
          width: ${isHighlighted ? '24px' : '16px'};
          height: ${isHighlighted ? '24px' : '16px'};
          background-color: ${color};
          border: ${isHighlighted ? '3px' : '2px'} solid ${isSelected ? '#2563eb' : 'white'};
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: ${isHighlighted ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.3)'};
          z-index: ${isHighlighted ? '100' : '1'};
        `;

        el.addEventListener('mouseenter', () => {
          if (!isHighlighted) {
            el.style.transform = 'scale(1.25)';
          }
          onPointHover?.(feature);
        });
        el.addEventListener('mouseleave', () => {
          if (!isHighlighted) {
            el.style.transform = 'scale(1)';
          }
          onPointLeave?.();
        });
        el.addEventListener('click', () => {
          onPointClick?.(feature);
        });
      }

      // Create and add marker
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);

      markersRef.current.push(marker);
    });

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [map, clusters, onClusterClick, onPointClick, onPointHover, onPointLeave, selectedId, hoveredId]);

  return null;
}
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % cat components/map/MapContainer.tsx
// ===========================================
// MAP CONTAINER
// Solar Template - components/map/MapContainer.tsx
// ===========================================
// TASK 12: Phase 1 - Added sync props for sidebar integration
// ===========================================

'use client';

import { useCallback, useState, useEffect } from 'react';
import { useMapbox } from '@/hooks/useMapbox';
import { useClusters } from '@/hooks/useClusters';
import { ClusterLayer } from '@/components/map/ClusterLayer';
import { Legend } from '@/components/map/Legend';
import { SegmentPopup } from '@/components/map/SegmentPopup';
import type { Point, BoundingBox, MapViewport, ClusterFeature } from '@/types/map';
import type { SegmentsResponse } from '@/types/api';

// ===========================================
// TYPES
// ===========================================

interface MapContainerProps {
  className?: string;
  // Sync props (Phase 1)
  onBboxChange?: (bbox: BoundingBox) => void;
  onPointSelect?: (id: string) => void;
  onPointHover?: (id: string | null) => void;
  selectedId?: string | null;
  hoveredId?: string | null;
}

// ===========================================
// COMPONENT
// ===========================================

export function MapContainer({
  className = '',
  onBboxChange,
  onPointSelect,
  onPointHover,
  selectedId,
  hoveredId,
}: MapContainerProps) {
  const [selectedCluster, setSelectedCluster] = useState<{
    feature: ClusterFeature;
    segments: SegmentsResponse | null;
  } | null>(null);

  // Map hook
  const { map, isLoaded, viewport, bbox, flyTo } = useMapbox({
    container: 'map',
    onMove: handleMapMove,
    onClick: handleMapClick,
  });

  // Clusters hook
  const { clusters, isLoading, getSegments } = useClusters({
    bbox,
    zoom: viewport.zoom,
    enabled: isLoaded,
  });

  // Notify parent of bbox changes
  useEffect(() => {
    if (bbox && onBboxChange) {
      onBboxChange(bbox);
    }
  }, [bbox, onBboxChange]);

  // Handle map move
  function handleMapMove(newViewport: MapViewport, newBbox: BoundingBox) {
    // Don't auto-close popup on small movements
    // Bbox change handled via useEffect
  }

  // Handle map click
  async function handleMapClick(point: Point, features: any[]) {
    // Find cluster feature
    const clusterFeature = features.find((f) => f.properties?.cluster);

    if (clusterFeature) {
      const clusterId = clusterFeature.properties.cluster_id;
      const segments = await getSegments(clusterId);

      setSelectedCluster({
        feature: clusterFeature as ClusterFeature,
        segments,
      });
    } else {
      setSelectedCluster(null);
    }
  }

  // Handle zoom to cluster
  const handleZoomIn = useCallback(
    (feature: ClusterFeature) => {
      const [lng, lat] = feature.geometry.coordinates;
      // Offset lat вниз чтобы popup был виден сверху
      flyTo({ lat: lat - 0.003, lng }, viewport.zoom + 2);
      setSelectedCluster(null);
    },
    [flyTo, viewport.zoom]
  );

  // Handle point click (sync with sidebar)
  function handlePointClick(feature: ClusterFeature) {
    const houseId = feature.properties.listing_id;
    if (houseId) {
      console.log('Point clicked:', houseId);
      onPointSelect?.(houseId);
    }
  }

  // Handle point hover (sync with sidebar)
  function handlePointMouseEnter(feature: ClusterFeature) {
    const houseId = feature.properties.listing_id;
    if (houseId) {
      onPointHover?.(houseId);
    }
  }

  function handlePointMouseLeave() {
    onPointHover?.(null);
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map container */}
      <div id="map" className="w-full h-full" />

      {/* Cluster layer */}
      {isLoaded && map && (
        <ClusterLayer
          map={map}
          clusters={clusters}
          onClusterClick={(feature) => {
            // Handle via map click
          }}
          onPointClick={handlePointClick}
          onPointHover={handlePointMouseEnter}
          onPointLeave={handlePointMouseLeave}
          selectedId={selectedId}
          hoveredId={hoveredId}
        />
      )}

      {/* Legend */}
      <Legend />

      {/* Segment popup */}
      {selectedCluster && selectedCluster.segments && (
        <SegmentPopup
          segments={selectedCluster.segments}
          position={{
            lat: selectedCluster.feature.geometry.coordinates[1],
            lng: selectedCluster.feature.geometry.coordinates[0],
          }}
          onClose={() => setSelectedCluster(null)}
          onZoomIn={() => handleZoomIn(selectedCluster.feature)}
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg">
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % cat components/sidebar/ListingSidebar.tsx
// ============================================================
// LISTING SIDEBAR
// Solar Template - components/sidebar/ListingSidebar.tsx
// ============================================================
// TASK 12: Phase 1 - Map ↔ Listings Sync
// ============================================================

'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { SyncListing } from '@/components/HomeClient';

// ============================================================
// TYPES
// ============================================================

interface ListingSidebarProps {
  listings: SyncListing[];
  selectedId: string | null;
  hoveredId: string | null;
  collapsed: boolean;
  onToggle: () => void;
  onListingClick: (listing: SyncListing) => void;
  onListingHover: (id: string | null) => void;
}

// ============================================================
// HELPERS
// ============================================================

function formatPrice(price: number, type: 'rent' | 'sale'): string {
  const formatted = new Intl.NumberFormat('de-DE').format(price);
  return type === 'rent' ? `€${formatted}/mo` : `€${formatted}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

// ============================================================
// LISTING CARD (inline for sidebar)
// ============================================================

interface SidebarListingCardProps {
  listing: SyncListing;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function SidebarListingCard({
  listing,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SidebarListingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'p-3 rounded-lg cursor-pointer transition-all duration-200',
        'border-2',
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : isHovered
          ? 'border-blue-300 bg-blue-50/50'
          : 'border-transparent bg-white hover:bg-gray-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'px-2 py-0.5 rounded text-xs font-medium',
            listing.type === 'rent'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          )}
        >
          {listing.type === 'rent' ? 'RENT' : 'SALE'}
        </span>
        <span className="text-xs text-gray-400">{formatDate(listing.createdAt)}</span>
      </div>

      {/* Price */}
      <div className="text-lg font-bold text-gray-900 mb-1">
        {formatPrice(listing.price, listing.type)}
      </div>

      {/* Address */}
      <div className="text-sm text-gray-600 truncate mb-2">{listing.address}</div>

      {/* Details */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
            />
          </svg>
          {listing.rooms}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          {listing.areaSqm}m²
        </span>
        <span className="text-gray-400">
          €{listing.priceSqm}/m²
        </span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function ListingSidebar({
  listings,
  selectedId,
  hoveredId,
  collapsed,
  onToggle,
  onListingClick,
  onListingHover,
}: ListingSidebarProps) {
  return (
    <aside
      className={cn(
        'h-full bg-gray-100 border-r border-gray-200 flex flex-col transition-all duration-300',
        collapsed ? 'w-12' : 'w-80 lg:w-96'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        {!collapsed && (
          <div>
            <h2 className="font-semibold text-gray-900">Listings</h2>
            <p className="text-xs text-gray-500">{listings.length} in view</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={cn('w-5 h-5 text-gray-600 transition-transform', collapsed && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Listings */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-sm">No listings in this area</p>
              <p className="text-xs">Try zooming out</p>
            </div>
          ) : (
            listings.map((listing) => (
              <SidebarListingCard
                key={listing.id}
                listing={listing}
                isSelected={selectedId === listing.id}
                isHovered={hoveredId === listing.id}
                onClick={() => onListingClick(listing)}
                onMouseEnter={() => onListingHover(listing.id)}
                onMouseLeave={() => onListingHover(null)}
              />
            ))
          )}
        </div>
      )}

      {/* Collapsed indicator */}
      {collapsed && listings.length > 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {listings.length}
          </div>
        </div>
      )}
    </aside>
  );
}
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % cat components/HomeClient.tsx
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

leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % cat ./app/page.tsx
// ===========================================
// HOME PAGE
// Solar Template - app/page.tsx
// ===========================================
import { APP_NAME } from '@/config/constants';

import { HomeClient } from '@/components/HomeClient';


// ===========================================
// PAGE
// ===========================================

export default function HomePage() {
  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 bg-solar-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="font-semibold text-gray-900">{APP_NAME}</h1>
        </div>
        
        {/* Region selector (future) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Valais, Switzerland</span>
        </div>
      </header>
      
      {/* Map */}
      <div className="flex-1 relative">
        <HomeClient />
      </div>
    </main>
  );
}
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % 
task15