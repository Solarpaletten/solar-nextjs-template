// ===========================================
// CLUSTER LAYER
// Solar Template - components/map/ClusterLayer.tsx
// ===========================================
// TASK 13.4: Added hover/select highlighting for sidebar sync
// ===========================================

'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { ClusterFeature } from '@/types/map';
import { getClusterStyle, formatCount } from '@/lib/clustering';
import { getSegmentColor } from '@/lib/segmentation';

// ===========================================
// TYPES
// ===========================================

interface ClusterLayerProps {
  map: mapboxgl.Map;
  clusters: ClusterFeature[];
  onClusterClick?: (feature: ClusterFeature) => void;
  onPointClick?: (feature: ClusterFeature) => void;
  onPointHover?: (feature: ClusterFeature | null) => void;
  // TASK 13.4: Sync state from parent
  selectedId?: string | null;
  hoveredId?: string | null;
}

// ===========================================
// HELPERS
// ===========================================

function getHouseId(feature: ClusterFeature): string | null {
  return feature.properties.houseId || feature.properties.listing_id || null;
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
  selectedId,
  hoveredId,
}: ClusterLayerProps) {
  const markersRef = useRef<Map<string, { marker: mapboxgl.Marker; element: HTMLDivElement }>>(
    new Map()
  );
  const prevSelectedRef = useRef<string | null>(null);
  const prevHoveredRef = useRef<string | null>(null);

  // ===========================================
  // UPDATE MARKERS
  // ===========================================
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    clusters.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const isCluster = feature.properties.cluster;
      const el = document.createElement('div');

      if (isCluster) {
        // Cluster marker
        const count = feature.properties.point_count || 0;
        const style = getClusterStyle(count);

        el.className = 'cluster-marker';
        el.innerHTML = formatCount(count);
        el.style.cssText = `
          width: ${style.size}px;
          height: ${style.size}px;
          background-color: ${style.backgroundColor};
          border: 3px solid ${style.borderColor};
          border-radius: 50%;
          color: ${style.textColor};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: ${style.size > 50 ? '16px' : '14px'};
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.1)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onClusterClick?.(feature);
        });
      } else {
        // Individual point marker
        const houseId = getHouseId(feature);
        const color = getSegmentColor(feature.properties.price_sqm || 7000);
        const isSelected = houseId && houseId === selectedId;
        const isHovered = houseId && houseId === hoveredId;

        el.className = 'point-marker';
        el.setAttribute('data-house-id', houseId || '');
        
        // Apply style based on state
        applyPointStyle(el, color, isSelected, isHovered);

        // Hover handlers
        el.addEventListener('mouseenter', () => {
          if (!isSelected) {
            el.style.transform = 'scale(1.4)';
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
          }
          onPointHover?.(feature);
        });
        
        el.addEventListener('mouseleave', () => {
          if (!isSelected) {
            el.style.transform = 'scale(1)';
            el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
          }
          onPointHover?.(null);
        });
        
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onPointClick?.(feature);
        });
      }

      // Create and add marker
      const marker = new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);

      const id = feature.properties.cluster
        ? `cluster_${feature.properties.cluster_id}`
        : getHouseId(feature) || String(feature.id);

      markersRef.current.set(id, { marker, element: el });
    });

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current.clear();
    };
  }, [map, clusters, onClusterClick, onPointClick, onPointHover]);

  // ===========================================
  // TASK 13.4: Update highlighting when selection/hover changes
  // ===========================================
  useEffect(() => {
    // Update previously selected marker
    if (prevSelectedRef.current && prevSelectedRef.current !== selectedId) {
      const prevData = markersRef.current.get(prevSelectedRef.current);
      if (prevData) {
        const feature = clusters.find(
          (f) => !f.properties.cluster && getHouseId(f) === prevSelectedRef.current
        );
        if (feature) {
          const color = getSegmentColor(feature.properties.price_sqm || 7000);
          applyPointStyle(prevData.element, color, false, false);
        }
      }
    }

    // Update newly selected marker
    if (selectedId) {
      const data = markersRef.current.get(selectedId);
      if (data) {
        const feature = clusters.find(
          (f) => !f.properties.cluster && getHouseId(f) === selectedId
        );
        if (feature) {
          const color = getSegmentColor(feature.properties.price_sqm || 7000);
          applyPointStyle(data.element, color, true, false);
        }
      }
    }

    prevSelectedRef.current = selectedId || null;
  }, [selectedId, clusters]);

  useEffect(() => {
    // Update previously hovered marker (only if not selected)
    if (prevHoveredRef.current && prevHoveredRef.current !== hoveredId && prevHoveredRef.current !== selectedId) {
      const prevData = markersRef.current.get(prevHoveredRef.current);
      if (prevData) {
        const feature = clusters.find(
          (f) => !f.properties.cluster && getHouseId(f) === prevHoveredRef.current
        );
        if (feature) {
          const color = getSegmentColor(feature.properties.price_sqm || 7000);
          applyPointStyle(prevData.element, color, false, false);
        }
      }
    }

    // Update newly hovered marker (only if not selected)
    if (hoveredId && hoveredId !== selectedId) {
      const data = markersRef.current.get(hoveredId);
      if (data) {
        const feature = clusters.find(
          (f) => !f.properties.cluster && getHouseId(f) === hoveredId
        );
        if (feature) {
          const color = getSegmentColor(feature.properties.price_sqm || 7000);
          applyPointStyle(data.element, color, false, true);
        }
      }
    }

    prevHoveredRef.current = hoveredId || null;
  }, [hoveredId, selectedId, clusters]);

  return null;
}

// ===========================================
// STYLE HELPER
// ===========================================

function applyPointStyle(
  el: HTMLDivElement,
  color: string,
  isSelected: boolean,
  isHovered: boolean
) {
  const size = isSelected ? 24 : isHovered ? 20 : 16;
  const borderWidth = isSelected ? 4 : isHovered ? 3 : 2;
  const borderColor = isSelected ? '#2563eb' : 'white';
  const scale = isSelected ? 1.5 : isHovered ? 1.25 : 1;
  const shadow = isSelected
    ? '0 0 0 4px rgba(37, 99, 235, 0.3), 0 2px 8px rgba(0,0,0,0.4)'
    : isHovered
    ? '0 2px 8px rgba(0,0,0,0.4)'
    : '0 1px 4px rgba(0,0,0,0.3)';
  const zIndex = isSelected ? 1000 : isHovered ? 500 : 1;

  el.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    background-color: ${color};
    border: ${borderWidth}px solid ${borderColor};
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: ${shadow};
    transform: scale(${scale});
    z-index: ${zIndex};
  `;
}
