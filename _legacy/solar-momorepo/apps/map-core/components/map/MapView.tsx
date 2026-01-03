'use client';

import { useEffect, useRef, useState } from 'react';
import { useMapbox } from './useMapbox';
import { HousePopup } from './Popup';
import { PriceToggle, PriceLegend } from './PriceToggle';
import { usePriceOverlay } from './usePriceOverlay';

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

// ============================================================
// MAP VIEW COMPONENT
// ============================================================

interface MapViewProps {
  accessToken: string;
}

export function MapView({ accessToken }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Set container after mount
  useEffect(() => {
    setContainer(containerRef.current);
  }, []);

  const { map, isLoaded, popupData, closePopup } = useMapbox({
    container,
    accessToken,
  });

  const {
    enabled: priceOverlayEnabled,
    loading: priceLoading,
    buildingsCount,
    toggle: togglePriceOverlay,
  } = usePriceOverlay(map);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map container */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Loading indicator */}
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Loading map...
        </div>
      )}

      {/* Zoom hint */}
      {isLoaded && map && map.getZoom() < 14 && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '13px',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Zoom in to see buildings
        </div>
      )}

      {/* House popup */}
      <HousePopup
        map={map}
        data={popupData}
        onClose={closePopup}
      />
      <PriceToggle
        enabled={priceOverlayEnabled}
        onToggle={togglePriceOverlay}
        loading={priceLoading}
        buildingsCount={buildingsCount}
      />
      <PriceLegend visible={priceOverlayEnabled} />
    </div>
  );
}
