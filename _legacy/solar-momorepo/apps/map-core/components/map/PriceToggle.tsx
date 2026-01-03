// ============================================================
// PriceToggle Component
// Phase 5B: Toggle button for city price overlay
// ============================================================

'use client';

import { useState } from 'react';

interface PriceToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  loading?: boolean;
  buildingsCount?: number;
}

/**
 * Toggle button for enabling/disabling price overlay on map
 * 
 * Position: Top-right corner of map
 * Icon: € symbol
 */
export function PriceToggle({
  enabled,
  onToggle,
  loading = false,
  buildingsCount,
}: PriceToggleProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={() => onToggle(!enabled)}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          font-medium text-sm
          transition-all duration-200
          shadow-lg backdrop-blur-sm
          ${enabled
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-white/90 text-gray-700 hover:bg-white'
          }
          ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
          border border-gray-200/50
        `}
        title={enabled ? 'Hide price overlay' : 'Show price overlay'}
      >
        {/* Euro Icon */}
        <span className={`
          text-lg font-bold
          ${enabled ? 'text-yellow-300' : 'text-blue-600'}
        `}>
          €
        </span>

        {/* Label */}
        <span>
          {loading ? 'Loading...' : enabled ? 'Hide prices' : 'Show prices'}
        </span>

        {/* Building count badge */}
        {enabled && buildingsCount !== undefined && buildingsCount > 0 && (
          <span className="
            ml-1 px-2 py-0.5 rounded-full
            text-xs bg-white/20
          ">
            {buildingsCount}
          </span>
        )}
      </button>
    </div>
  );
}

/**
 * Price Legend Component (optional, for future use)
 */
export function PriceLegend({ visible }: { visible: boolean }) {
  if (!visible) return null;

  const legendItems = [
    { color: '#3b82f6', label: '< €5,000/m²', value: 'Budget' },
    { color: '#22c55e', label: '€5,000-7,000', value: 'Average' },
    { color: '#eab308', label: '€7,000-9,000', value: 'Above avg' },
    { color: '#f97316', label: '€9,000-11,000', value: 'Premium' },
    { color: '#ef4444', label: '> €11,000/m²', value: 'Luxury' },
  ];

  return (
    <div className="
      absolute bottom-8 right-4 z-10
      bg-white/95 backdrop-blur-sm rounded-lg
      shadow-lg border border-gray-200/50
      p-3
    ">
      <div className="text-xs font-semibold text-gray-600 mb-2">
        Price per m²
      </div>
      <div className="space-y-1">
        {legendItems.map((item) => (
          <div key={item.color} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
