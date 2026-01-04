// ============================================================
// LISTING SIDEBAR
// Solar Template - components/sidebar/ListingSidebar.tsx
// ============================================================
// TASK 12: Phase 1 - Map ↔ Listings Sync
// ============================================================

'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { SyncListing } from '@/components/HomeClient';

// ============================================================
// TYPES
// ============================================================

interface ListingSidebarProps {
  listings: SyncListing[];
  selectedId: string | null;
  hoveredId: string | null;
  collapsed: boolean;
  onToggle: () => void;
  onListingClick: (listing: SyncListing) => void;
  onListingHover: (id: string | null) => void;
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
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

// ============================================================
// LISTING CARD (inline for sidebar)
// ============================================================

interface SidebarListingCardProps {
  listing: SyncListing;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function SidebarListingCard({
  listing,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SidebarListingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'p-3 rounded-lg cursor-pointer transition-all duration-200',
        'border-2',
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : isHovered
          ? 'border-blue-300 bg-blue-50/50'
          : 'border-transparent bg-white hover:bg-gray-50'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'px-2 py-0.5 rounded text-xs font-medium',
            listing.type === 'rent'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          )}
        >
          {listing.type === 'rent' ? 'RENT' : 'SALE'}
        </span>
        <span className="text-xs text-gray-400">{formatDate(listing.createdAt)}</span>
      </div>

      {/* Price */}
      <div className="text-lg font-bold text-gray-900 mb-1">
        {formatPrice(listing.price, listing.type)}
      </div>

      {/* Address */}
      <div className="text-sm text-gray-600 truncate mb-2">{listing.address}</div>

      {/* Details */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
            />
          </svg>
          {listing.rooms}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          {listing.areaSqm}m²
        </span>
        <span className="text-gray-400">
          €{listing.priceSqm}/m²
        </span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function ListingSidebar({
  listings,
  selectedId,
  hoveredId,
  collapsed,
  onToggle,
  onListingClick,
  onListingHover,
}: ListingSidebarProps) {
  return (
    <aside
      className={cn(
        'h-full bg-gray-100 border-r border-gray-200 flex flex-col transition-all duration-300',
        collapsed ? 'w-12' : 'w-80 lg:w-96'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        {!collapsed && (
          <div>
            <h2 className="font-semibold text-gray-900">Listings</h2>
            <p className="text-xs text-gray-500">{listings.length} in view</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={cn('w-5 h-5 text-gray-600 transition-transform', collapsed && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Listings */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-sm">No listings in this area</p>
              <p className="text-xs">Try zooming out</p>
            </div>
          ) : (
            listings.map((listing) => (
              <SidebarListingCard
                key={listing.id}
                listing={listing}
                isSelected={selectedId === listing.id}
                isHovered={hoveredId === listing.id}
                onClick={() => onListingClick(listing)}
                onMouseEnter={() => onListingHover(listing.id)}
                onMouseLeave={() => onListingHover(null)}
              />
            ))
          )}
        </div>
      )}

      {/* Collapsed indicator */}
      {collapsed && listings.length > 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {listings.length}
          </div>
        </div>
      )}
    </aside>
  );
}
