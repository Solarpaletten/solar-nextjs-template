// ============================================================
// LISTING LIST
// Solar Template - components/listings/ListingList.tsx
// ============================================================
// Commit marker: components/listings/.gitkeep
// ============================================================

'use client';

import { cn } from '@/lib/utils';
import { ListingCard, type Listing } from './ListingCard';

// ============================================================
// TYPES
// ============================================================

interface ListingListProps {
  listings: Listing[];
  isLoading?: boolean;
  error?: string | null;
  onListingClick?: (listing: Listing) => void;
  layout?: 'grid' | 'list';
  compact?: boolean;
  emptyMessage?: string;
  className?: string;
}

// ============================================================
// SKELETON LOADER
// ============================================================

function ListingSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200 animate-pulse">
        <div className="w-16 h-6 bg-gray-200 rounded" />
        <div className="flex-1 h-5 bg-gray-200 rounded" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <svg 
        className="w-16 h-16 text-gray-300 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
        />
      </svg>
      <p className="text-gray-500 text-center">{message}</p>
    </div>
  );
}

// ============================================================
// ERROR STATE
// ============================================================

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <svg 
        className="w-16 h-16 text-red-300 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        />
      </svg>
      <p className="text-red-500 text-center">{message}</p>
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================

export function ListingList({
  listings,
  isLoading = false,
  error = null,
  onListingClick,
  layout = 'grid',
  compact = false,
  emptyMessage = 'No listings found',
  className,
}: ListingListProps) {
  
  // Error state
  if (error) {
    return <ErrorState message={error} />;
  }
  
  // Loading state
  if (isLoading) {
    const skeletonCount = compact ? 5 : 6;
    
    return (
      <div className={cn(
        layout === 'grid' && !compact
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-2',
        className
      )}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ListingSkeleton key={i} compact={compact} />
        ))}
      </div>
    );
  }
  
  // Empty state
  if (listings.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }
  
  // Render listings
  return (
    <div className={cn(
      layout === 'grid' && !compact
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
        : 'flex flex-col gap-2',
      className
    )}>
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onClick={onListingClick}
          compact={compact}
        />
      ))}
    </div>
  );
}
