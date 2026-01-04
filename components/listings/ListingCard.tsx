// ============================================================
// LISTING CARD
// Solar Template - components/listings/ListingCard.tsx
// ============================================================
// Commit marker: components/listings/.gitkeep
// Reused patterns from: _legacy/solar-momorepo/apps/listing-portal/
// ============================================================

'use client';

import { cn } from '@/lib/utils';

// ============================================================
// TYPES
// ============================================================

export interface Listing {
  id: string;
  type: 'rent' | 'sale';
  price: number;
  address?: string;
  rooms?: number;
  areaSqm?: number;
  buildingType?: string;
  createdAt: string;
  imageUrl?: string;
}

interface ListingCardProps {
  listing: Listing;
  onClick?: (listing: Listing) => void;
  compact?: boolean;
  className?: string;
}

// ============================================================
// HELPERS
// ============================================================

function formatPrice(price: number, type: 'rent' | 'sale'): string {
  const formatted = new Intl.NumberFormat('de-DE').format(price);
  return type === 'rent' ? `€${formatted}/mo` : `€${formatted}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('de-DE');
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================
// COMPONENT
// ============================================================

export function ListingCard({ 
  listing, 
  onClick, 
  compact = false,
  className 
}: ListingCardProps) {
  const { id, type, price, address, rooms, areaSqm, buildingType, createdAt, imageUrl } = listing;
  
  const handleClick = () => {
    if (onClick) onClick(listing);
  };
  
  // Compact variant (for popups/sidebars)
  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg',
          'bg-white border border-gray-200',
          'hover:border-blue-300 hover:shadow-sm',
          'transition-all cursor-pointer',
          className
        )}
      >
        {/* Type badge */}
        <div className={cn(
          'flex-shrink-0 px-2 py-1 rounded text-xs font-medium',
          type === 'rent' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-blue-100 text-blue-700'
        )}>
          {type === 'rent' ? '🏠 Rent' : '💰 Sale'}
        </div>
        
        {/* Price */}
        <div className="flex-1 font-semibold text-gray-900">
          {formatPrice(price, type)}
        </div>
        
        {/* Details */}
        {(rooms || areaSqm) && (
          <div className="text-sm text-gray-500">
            {rooms && `${rooms}r`}
            {rooms && areaSqm && ' · '}
            {areaSqm && `${areaSqm}m²`}
          </div>
        )}
      </div>
    );
  }
  
  // Full card variant
  return (
    <div
      onClick={handleClick}
      className={cn(
        'bg-white rounded-xl border border-gray-200 overflow-hidden',
        'hover:border-blue-300 hover:shadow-md',
        'transition-all cursor-pointer',
        className
      )}
    >
      {/* Image placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={address || 'Property'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
          </div>
        )}
        
        {/* Type badge */}
        <div className={cn(
          'absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold',
          type === 'rent' 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-500 text-white'
        )}>
          {type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="text-xl font-bold text-gray-900 mb-1">
          {formatPrice(price, type)}
        </div>
        
        {/* Address */}
        {address && (
          <div className="text-sm text-gray-600 mb-3 truncate">
            {address}
          </div>
        )}
        
        {/* Details row */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {rooms && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" 
                />
              </svg>
              {rooms} rooms
            </span>
          )}
          
          {areaSqm && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
                />
              </svg>
              {areaSqm} m²
            </span>
          )}
          
          {buildingType && (
            <span>{capitalizeFirst(buildingType)}</span>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {formatDate(createdAt)}
          </span>
          <span className="text-xs text-blue-600 font-medium">
            View details →
          </span>
        </div>
      </div>
    </div>
  );
}
