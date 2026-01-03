'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import type { PopupData } from './types';

// ============================================================
// POPUP COMPONENT
// ============================================================

interface HousePopupProps {
  map: mapboxgl.Map | null;
  data: PopupData | null;
  onClose: () => void;
}

export function HousePopup({ map, data, onClose }: HousePopupProps) {
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!map || !data) {
      // Remove existing popup
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      return;
    }

    // Create popup content
    const content = createPopupContent(data);

    // Create or update popup
    if (!popupRef.current) {
      popupRef.current = new mapboxgl.Popup({
        closeOnClick: false,
        maxWidth: '300px',
      });
    }

    popupRef.current
      .setLngLat(data.coordinates)
      .setHTML(content)
      .addTo(map);

    // Handle close
    popupRef.current.on('close', onClose);

    return () => {
      if (popupRef.current) {
        popupRef.current.off('close', onClose);
      }
    };
  }, [map, data, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, []);

  return null; // Popup is rendered by Mapbox
}

// ============================================================
// POPUP CONTENT BUILDER
// ============================================================

function createPopupContent(data: PopupData): string {
  const { address, buildingType, levels, estimate, listings, loading } = data;

  if (loading) {
    return `
      <div style="padding: 8px; font-family: system-ui, sans-serif;">
        <div style="color: #64748b;">Loading...</div>
      </div>
    `;
  }

  const addressLine = address || 'Address unknown';
  const typeLine = buildingType ? capitalizeFirst(buildingType) : 'Building';
  const levelsLine = levels ? `${levels} floor${levels > 1 ? 's' : ''}` : '';

  // Active listings section
  let listingsSection = '';
  if (listings && listings.length > 0) {
    const listingItems = listings.map(l => {
      const icon = l.type === 'rent' ? '🏠' : '💰';
      const label = l.type === 'rent' ? 'Rent' : 'Sale';
      return `<div>${icon} ${label}: <strong>€${formatNumber(l.price)}${l.type === 'rent' ? '/mo' : ''}</strong></div>`;
    }).join('');

    listingsSection = `
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
        <div style="font-size: 11px; color: #22c55e; font-weight: 600; margin-bottom: 4px;">
          ✓ ACTIVE LISTING${listings.length > 1 ? 'S' : ''}
        </div>
        <div style="font-size: 13px;">
          ${listingItems}
        </div>
      </div>
    `;
  }

  // Price estimate section (only if no active listings)
  let priceSection = '';
  if (estimate && listings.length === 0) {
    const rentRange = `€${formatNumber(estimate.rentMin)} – €${formatNumber(estimate.rentMax)}/mo`;
    const saleRange = `€${formatNumber(estimate.saleMin)} – €${formatNumber(estimate.saleMax)}`;
    
    priceSection = `
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0;">
        <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">ESTIMATED PRICE</div>
        <div style="font-size: 13px;">
          <div>🏠 Rent: <strong>${rentRange}</strong></div>
          <div>💰 Sale: <strong>${saleRange}</strong></div>
        </div>
      </div>
    `;
  }

  return `
    <div style="padding: 8px; font-family: system-ui, sans-serif; min-width: 200px;">
      <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
        ${addressLine}
      </div>
      <div style="font-size: 12px; color: #64748b;">
        ${typeLine}${levelsLine ? ` · ${levelsLine}` : ''}
      </div>
      ${listingsSection}
      ${priceSection}
    </div>
  `;
}

// ============================================================
// HELPERS
// ============================================================

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}
