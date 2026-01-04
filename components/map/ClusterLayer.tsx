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
