// ===========================================
// MAP CONTAINER
// Solar Template - components/map/MapContainer.tsx
// ===========================================
// TASK 13.4: Map ↔ Sidebar Real Sync
// ===========================================

'use client';

import { useCallback, useState, useEffect } from 'react';
import { useMapbox } from '@/hooks/useMapbox';
import { useClusters } from '@/hooks/useClusters';
import { ClusterLayer } from '@/components/map/ClusterLayer';
import { Legend } from '@/components/map/Legend';
import { SegmentPopup } from '@/components/map/SegmentPopup';
import { extractVisibleHouseIds } from '@/lib/clustering';
import type { Point, BoundingBox, MapViewport, ClusterFeature } from '@/types/map';
import type { SegmentsResponse } from '@/types/api';

// ===========================================
// TYPES
// ===========================================

interface MapContainerProps {
  className?: string;
  // TASK 13.4: Sync callbacks
  onBboxChange?: (bbox: BoundingBox) => void;
  onVisibleHouseIdsChange?: (ids: string[]) => void;
  onPointSelect?: (houseId: string) => void;
  onPointHover?: (houseId: string | null) => void;
  // Selected/hovered from parent
  selectedId?: string | null;
  hoveredId?: string | null;
}

// ===========================================
// COMPONENT
// ===========================================

export function MapContainer({
  className = '',
  onBboxChange,
  onVisibleHouseIdsChange,
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

  // ===========================================
  // TASK 13.4: Sync visible houseIds with parent
  // ===========================================
  useEffect(() => {
    if (!clusters.length) {
      onVisibleHouseIdsChange?.([]);
      return;
    }

    // Cast to any to avoid type conflicts between different ClusterFeature definitions
    const visibleIds = extractVisibleHouseIds(clusters as any);
    onVisibleHouseIdsChange?.(visibleIds);
  }, [clusters, onVisibleHouseIdsChange]);

  // Notify parent of bbox changes
  useEffect(() => {
    if (bbox) {
      onBboxChange?.(bbox);
    }
  }, [bbox, onBboxChange]);

  // ===========================================
  // HANDLERS
  // ===========================================

  // Handle map move
  function handleMapMove(newViewport: MapViewport, newBbox: BoundingBox) {
    // Close popup on move
    setSelectedCluster(null);
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

  // TASK 13.4: Handle cluster click → zoom in
  const handleClusterClick = useCallback(
    (feature: ClusterFeature) => {
      const [lng, lat] = feature.geometry.coordinates;
      flyTo({ lat, lng }, viewport.zoom + 2);
      setSelectedCluster(null);
    },
    [flyTo, viewport.zoom]
  );

  // TASK 13.4: Handle point click → select + zoom
  const handlePointClick = useCallback(
    (feature: ClusterFeature) => {
      const houseId = feature.properties.houseId || feature.properties.listing_id;
      if (!houseId) return;

      // Notify parent
      onPointSelect?.(houseId);

      // Zoom to point if not already close
      const [lng, lat] = feature.geometry.coordinates;
      if (viewport.zoom < 16) {
        flyTo({ lat, lng }, Math.max(viewport.zoom, 16));
      }
    },
    [flyTo, viewport.zoom, onPointSelect]
  );

  // TASK 13.4: Handle point hover → sync with sidebar
  const handlePointHover = useCallback(
    (feature: ClusterFeature | null) => {
      if (!feature) {
        onPointHover?.(null);
        return;
      }
      const houseId = feature.properties.houseId || feature.properties.listing_id;
      onPointHover?.(houseId || null);
    },
    [onPointHover]
  );

  // Handle zoom to cluster
  const handleZoomIn = useCallback(
    (feature: ClusterFeature) => {
      const [lng, lat] = feature.geometry.coordinates;
      flyTo({ lat, lng }, viewport.zoom + 2);
      setSelectedCluster(null);
    },
    [flyTo, viewport.zoom]
  );

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Map container */}
      <div id="map" className="w-full h-full" />

      {/* Cluster layer */}
      {isLoaded && map && (
        <ClusterLayer
          map={map}
          clusters={clusters}
          onClusterClick={handleClusterClick}
          onPointClick={handlePointClick}
          onPointHover={handlePointHover}
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
