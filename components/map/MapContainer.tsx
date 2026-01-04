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
