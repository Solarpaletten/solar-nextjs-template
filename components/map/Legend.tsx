// ===========================================
// LEGEND
// Solar Template - components/map/Legend.tsx
// ===========================================

'use client';

import { LEGEND_ITEMS } from '@/lib/segmentation';
import { CURRENCY } from '@/config/constants';

// ===========================================
// TYPES
// ===========================================

interface LegendProps {
  visible?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

// ===========================================
// COMPONENT
// ===========================================

export function Legend({ visible = true, position = 'bottom-left' }: LegendProps) {
  if (!visible) return null;
  
  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
  };
  
  return (
    <div
      className={`
        absolute ${positionClasses[position]} z-10
        bg-white/95 backdrop-blur-sm rounded-lg
        shadow-lg border border-gray-200/50
        p-3
      `}
    >
      {/* Title */}
      <div className="text-xs font-semibold text-gray-600 mb-2">
        Price ({CURRENCY}/m²)
      </div>
      
      {/* Items */}
      <div className="space-y-1.5">
        {LEGEND_ITEMS.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-700">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
