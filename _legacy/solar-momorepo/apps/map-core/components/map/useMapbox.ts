'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  HOUSES_SOURCE_ID,
  HOUSES_FILL_LAYER_ID,
  HOUSES_LINE_LAYER_ID,
  housesFillLayer,
  housesLineLayer,
} from './layers';
import type { HouseFeatureCollection, HouseDetailResponse, PopupData } from './types';

// ============================================================
// CONFIGURATION - SWITZERLAND (MONTHEY)
// ============================================================

// Start position: Monthey, Valais
const DEFAULT_CENTER: [number, number] = [6.954, 46.255];
const DEFAULT_ZOOM = 14;
const MIN_ZOOM_FOR_HOUSES = 13;

// Map style - satellite streets for premium look
const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

// ============================================================
// HOOK
// ============================================================

interface UseMapboxOptions {
  container: HTMLDivElement | null;
  accessToken: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

interface UseMapboxReturn {
  map: mapboxgl.Map | null;
  isLoaded: boolean;
  popupData: PopupData | null;
  closePopup: () => void;
  flyTo: (center: [number, number], zoom?: number) => void;
}

export function useMapbox({ 
  container, 
  accessToken,
  initialCenter = DEFAULT_CENTER,
  initialZoom = DEFAULT_ZOOM,
}: UseMapboxOptions): UseMapboxReturn {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const hoveredHouseId = useRef<string | null>(null);

  // Close popup handler
  const closePopup = useCallback(() => {
    setPopupData(null);
  }, []);

  // Fly to location
  const flyTo = useCallback((center: [number, number], zoom?: number) => {
    const map = mapRef.current;
    if (!map) return;
    
    map.flyTo({
      center,
      zoom: zoom || map.getZoom(),
      duration: 2000,
      essential: true,
    });
  }, []);

  // ============================================================
  // MAP INITIALIZATION
  // ============================================================

  useEffect(() => {
    if (!container || !accessToken || mapRef.current) return;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container,
      style: MAP_STYLE,
      center: initialCenter,
      zoom: initialZoom,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      mapRef.current = map;
      
      // Add 3D buildings layer
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      // Add 3D buildings from Mapbox
      map.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 0,
              12.5, ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              12, 0,
              12.5, ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );

      // Add empty source for our houses
      map.addSource(HOUSES_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        promoteId: 'id',
      });

      // Add layers
      map.addLayer(housesFillLayer);
      map.addLayer(housesLineLayer);

      setIsLoaded(true);

      // Initial load
      loadHousesForViewport(map);
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [container, accessToken, initialCenter, initialZoom]);

  // ============================================================
  // VIEWPORT CHANGE → LOAD HOUSES
  // ============================================================

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    const handleMoveEnd = () => {
      loadHousesForViewport(map);
    };

    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleMoveEnd);
    };
  }, [isLoaded]);

  // ============================================================
  // HOVER INTERACTION
  // ============================================================

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [HOUSES_FILL_LAYER_ID],
      });

      // Change cursor
      map.getCanvas().style.cursor = features.length > 0 ? 'pointer' : '';

      // Clear previous hover
      if (hoveredHouseId.current !== null) {
        map.setFeatureState(
          { source: HOUSES_SOURCE_ID, id: hoveredHouseId.current },
          { hover: false }
        );
      }

      // Set new hover
      if (features.length > 0) {
        const feature = features[0];
        const id = feature.properties?.id;
        if (id) {
          hoveredHouseId.current = id;
          map.setFeatureState(
            { source: HOUSES_SOURCE_ID, id },
            { hover: true }
          );
        }
      } else {
        hoveredHouseId.current = null;
      }
    };

    const handleMouseLeave = () => {
      if (hoveredHouseId.current !== null) {
        map.setFeatureState(
          { source: HOUSES_SOURCE_ID, id: hoveredHouseId.current },
          { hover: false }
        );
        hoveredHouseId.current = null;
      }
      map.getCanvas().style.cursor = '';
    };

    map.on('mousemove', HOUSES_FILL_LAYER_ID, handleMouseMove);
    map.on('mouseleave', HOUSES_FILL_LAYER_ID, handleMouseLeave);

    return () => {
      map.off('mousemove', HOUSES_FILL_LAYER_ID, handleMouseMove);
      map.off('mouseleave', HOUSES_FILL_LAYER_ID, handleMouseLeave);
    };
  }, [isLoaded]);

  // ============================================================
  // CLICK INTERACTION
  // ============================================================

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    const handleClick = async (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [HOUSES_FILL_LAYER_ID],
      });

      if (features.length === 0) {
        setPopupData(null);
        return;
      }

      const feature = features[0];
      const props = feature.properties;
      
      if (!props?.id) return;

      // Parse address from properties
      let address = 'Address unknown';
      try {
        const addressObj = typeof props.address === 'string' 
          ? JSON.parse(props.address) 
          : props.address;
        if (addressObj) {
          const parts = [addressObj.street, addressObj.number].filter(Boolean);
          if (parts.length > 0) {
            address = parts.join(' ');
          }
        }
      } catch {
        // Keep default
      }

      // Parse building info
      let buildingType = null;
      let levels = null;
      try {
        const buildingObj = typeof props.building === 'string'
          ? JSON.parse(props.building)
          : props.building;
        if (buildingObj) {
          buildingType = buildingObj.type;
          levels = buildingObj.levels;
        }
      } catch {
        // Keep defaults
      }

      // Set initial popup (loading state)
      const clickCoords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setPopupData({
        coordinates: clickCoords,
        houseId: props.id,
        address,
        buildingType,
        levels,
        estimate: null,
        listings: [],
        loading: true,
      });

      // Fetch house details with price
      try {
        const response = await fetch(`/api/house/${props.id}`);
        if (response.ok) {
          const data: HouseDetailResponse = await response.json();
          setPopupData(prev => prev && prev.houseId === props.id ? {
            ...prev,
            estimate: data.estimate,
            loading: false,
          } : prev);
        } else {
          setPopupData(prev => prev && prev.houseId === props.id ? {
            ...prev,
            loading: false,
          } : prev);
        }
      } catch (error) {
        console.error('Error fetching house details:', error);
        setPopupData(prev => prev && prev.houseId === props.id ? {
          ...prev,
          loading: false,
        } : prev);
      }
    };

    map.on('click', HOUSES_FILL_LAYER_ID, handleClick);

    return () => {
      map.off('click', HOUSES_FILL_LAYER_ID, handleClick);
    };
  }, [isLoaded]);

  return {
    map: mapRef.current,
    isLoaded,
    popupData,
    closePopup,
    flyTo,
  };
}

// ============================================================
// LOAD HOUSES FOR CURRENT VIEWPORT
// ============================================================

async function loadHousesForViewport(map: mapboxgl.Map): Promise<void> {
  const zoom = map.getZoom();
  
  // Don't load at low zoom levels
  if (zoom < MIN_ZOOM_FOR_HOUSES) {
    const source = map.getSource(HOUSES_SOURCE_ID) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({ type: 'FeatureCollection', features: [] });
    }
    return;
  }

  const bounds = map.getBounds();
  if (!bounds) return;

  const bbox = [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth(),
  ].join(',');

  try {
    const response = await fetch(`/api/houses?bbox=${bbox}`);
    if (!response.ok) {
      console.error('Failed to fetch houses:', response.statusText);
      return;
    }

    const data: HouseFeatureCollection = await response.json();
    
    const source = map.getSource(HOUSES_SOURCE_ID) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  } catch (error) {
    console.error('Error loading houses:', error);
  }
}
