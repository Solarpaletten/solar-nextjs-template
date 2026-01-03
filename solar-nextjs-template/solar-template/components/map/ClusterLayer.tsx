// ===========================================
// CLUSTER LAYER
// Solar Template - components/map/ClusterLayer.tsx
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
}

// ===========================================
// COMPONENT
// ===========================================

export function ClusterLayer({
  map,
  clusters,
  onClusterClick,
  onPointClick,
}: ClusterLayerProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Update markers when clusters change
  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers
    clusters.forEach(feature => {
      const [lng, lat] = feature.geometry.coordinates;
      const isCluster = feature.properties.cluster;
      
      // Create marker element
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
        el.addEventListener('click', () => {
          onClusterClick?.(feature);
        });
      } else {
        // Individual point marker
        const segment = feature.properties.segment || 'mid';
        const color = getSegmentColor(feature.properties.price_sqm || 7000);
        
        el.className = 'point-marker';
        el.style.cssText = `
          width: 16px;
          height: 16px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        `;
        
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.25)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });
        el.addEventListener('click', () => {
          onPointClick?.(feature);
        });
      }
      
      // Create and add marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
      
      markersRef.current.push(marker);
    });
    
    // Cleanup on unmount
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, clusters, onClusterClick, onPointClick]);
  
  return null;
}
