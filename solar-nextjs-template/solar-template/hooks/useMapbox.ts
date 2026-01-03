// ===========================================
// MAPBOX HOOK
// Solar Template - hooks/useMapbox.ts
// ===========================================

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { DEFAULT_REGION } from '@/config/regions';
import { MAP_STYLE, MAP_MIN_ZOOM, MAP_MAX_ZOOM } from '@/config/constants';
import type { Point, BoundingBox, MapViewport } from '@/types/map';

// ===========================================
// TYPES
// ===========================================

export interface UseMapboxOptions {
  container: string;
  center?: Point;
  zoom?: number;
  style?: string;
  onMove?: (viewport: MapViewport, bbox: BoundingBox) => void;
  onClick?: (point: Point, features: any[]) => void;
}

export interface UseMapboxReturn {
  map: mapboxgl.Map | null;
  isLoaded: boolean;
  viewport: MapViewport;
  bbox: BoundingBox | null;
  flyTo: (center: Point, zoom?: number) => void;
  fitBounds: (bbox: BoundingBox) => void;
}

// ===========================================
// HOOK
// ===========================================

export function useMapbox(options: UseMapboxOptions): UseMapboxReturn {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewport, setViewport] = useState<MapViewport>({
    center: options.center || DEFAULT_REGION.center,
    zoom: options.zoom || DEFAULT_REGION.zoom,
  });
  const [bbox, setBbox] = useState<BoundingBox | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;
    
    // Set access token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    
    const map = new mapboxgl.Map({
      container: options.container,
      style: options.style || MAP_STYLE,
      center: [viewport.center.lng, viewport.center.lat],
      zoom: viewport.zoom,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      pitch: 45,
      bearing: 0,
      antialias: true,
    });
    
    // Add controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    
    // Handle load
    map.on('load', () => {
      setIsLoaded(true);
      updateBbox(map);
    });
    
    // Handle move
    map.on('moveend', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const newViewport: MapViewport = {
        center: { lat: center.lat, lng: center.lng },
        zoom,
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      };
      
      setViewport(newViewport);
      const newBbox = updateBbox(map);
      
      if (options.onMove && newBbox) {
        options.onMove(newViewport, newBbox);
      }
    });
    
    // Handle click
    map.on('click', (e) => {
      const point: Point = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      const features = map.queryRenderedFeatures(e.point);
      
      if (options.onClick) {
        options.onClick(point, features);
      }
    });
    
    mapRef.current = map;
    
    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [options.container]);
  
  // Update bbox helper
  const updateBbox = useCallback((map: mapboxgl.Map): BoundingBox | null => {
    const bounds = map.getBounds();
    if (!bounds) return null;
    
    const newBbox: BoundingBox = {
      minLng: bounds.getWest(),
      minLat: bounds.getSouth(),
      maxLng: bounds.getEast(),
      maxLat: bounds.getNorth(),
    };
    
    setBbox(newBbox);
    return newBbox;
  }, []);
  
  // Fly to location
  const flyTo = useCallback((center: Point, zoom?: number) => {
    if (!mapRef.current) return;
    
    mapRef.current.flyTo({
      center: [center.lng, center.lat],
      zoom: zoom || mapRef.current.getZoom(),
      duration: 1000,
    });
  }, []);
  
  // Fit bounds
  const fitBounds = useCallback((bounds: BoundingBox) => {
    if (!mapRef.current) return;
    
    mapRef.current.fitBounds(
      [
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
      ],
      { padding: 50, duration: 1000 }
    );
  }, []);
  
  return {
    map: mapRef.current,
    isLoaded,
    viewport,
    bbox,
    flyTo,
    fitBounds,
  };
}
