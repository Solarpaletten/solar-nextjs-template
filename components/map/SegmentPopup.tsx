// ===========================================
// SEGMENT POPUP
// Solar Template - components/map/SegmentPopup.tsx
// ===========================================

'use client';

import type { SegmentsResponse } from '@/types/api';
import type { Point } from '@/types/map';
import { PRICE_SEGMENTS, type PriceSegment } from '@/lib/segmentation';

// ===========================================
// TYPES
// ===========================================

interface SegmentPopupProps {
  segments: SegmentsResponse;
  position: Point;
  onClose: () => void;
  onZoomIn?: () => void;
  onShowListings?: () => void;
}

// ===========================================
// COMPONENT
// ===========================================

export function SegmentPopup({
  segments,
  position,
  onClose,
  onZoomIn,
  onShowListings,
}: SegmentPopupProps) {
  const segmentOrder: PriceSegment[] = ['low', 'mid', 'upper', 'premium'];
  
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 min-w-[260px] max-w-[320px] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {segments.area_name || 'Selected Area'}
              </h3>
              <p className="text-sm text-gray-500">
                {segments.total} properties
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Segments */}
        <div className="px-4 py-3 space-y-2">
          {segmentOrder.map((segmentId) => {
            const segment = segments.segments[segmentId];
            const config = PRICE_SEGMENTS[segmentId];
            
            return (
              <div key={segmentId} className="flex items-center gap-2">
                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                
                {/* Count */}
                <span className="w-8 text-sm font-medium text-gray-700">
                  {segment.count}
                </span>
                
                {/* Progress bar */}
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${segment.percentage}%`,
                      backgroundColor: config.color,
                    }}
                  />
                </div>
                
                {/* Percentage */}
                <span className="w-10 text-xs text-gray-500 text-right">
                  {segment.percentage}%
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Actions */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
          {onShowListings && (
            <button
              onClick={onShowListings}
              className="
                flex-1 px-3 py-2 rounded-md
                bg-blue-600 text-white text-sm font-medium
                hover:bg-blue-700 transition-colors
              "
            >
              Show listings
            </button>
          )}
          {onZoomIn && (
            <button
              onClick={onZoomIn}
              className="
                flex-1 px-3 py-2 rounded-md
                bg-gray-200 text-gray-700 text-sm font-medium
                hover:bg-gray-300 transition-colors
              "
            >
              Zoom in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
