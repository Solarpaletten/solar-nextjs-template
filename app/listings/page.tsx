// ============================================================
// LISTINGS PAGE
// Solar Template - app/listings/page.tsx
// ============================================================
// TASK 14: Switzerland Only - Monthey addresses
// ============================================================

import { Suspense } from 'react';
import { ListingList } from '@/components/listings';

// ============================================================
// METADATA
// ============================================================

export const metadata = {
  title: 'Listings | Solar House Price',
  description: 'Browse real estate listings in Monthey, Switzerland',
};

// ============================================================
// DATA FETCHING
// ============================================================

async function getListings() {
  // Demo listings data - Monthey, Valais, Switzerland
  return [
    {
      id: '1',
      type: 'sale' as const,
      price: 650000,
      address: 'Avenue de la Gare 15, Monthey',
      rooms: 4,
      areaSqm: 95,
      buildingType: 'apartment',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'rent' as const,
      price: 1850,
      address: 'Rue du Commerce 8, Monthey',
      rooms: 3,
      areaSqm: 75,
      buildingType: 'apartment',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      type: 'sale' as const,
      price: 890000,
      address: 'Chemin des Vignes 22, Monthey',
      rooms: 5,
      areaSqm: 140,
      buildingType: 'house',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '4',
      type: 'rent' as const,
      price: 2400,
      address: 'Place Centrale 3, Monthey',
      rooms: 4,
      areaSqm: 100,
      buildingType: 'apartment',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: '5',
      type: 'sale' as const,
      price: 520000,
      address: 'Rue du Château 11, Monthey',
      rooms: 3,
      areaSqm: 70,
      buildingType: 'apartment',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
    },
  ];
}

// ============================================================
// LOADING
// ============================================================

function ListingsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
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
      ))}
    </div>
  );
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Listings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {listings.length} properties in Monthey, Valais
              </p>
            </div>
            
            {/* Back to map */}
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Map
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters (placeholder) */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            All
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">
            For Sale
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">
            For Rent
          </button>
        </div>

        {/* Listings grid */}
        <Suspense fallback={<ListingsLoading />}>
          <ListingList 
            listings={listings}
            layout="grid"
          />
        </Suspense>
      </div>
    </main>
  );
}
