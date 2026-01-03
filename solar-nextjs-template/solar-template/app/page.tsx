// ===========================================
// HOME PAGE
// Solar Template - app/page.tsx
// ===========================================

import { MapContainer } from '@/components/map/MapContainer';
import { APP_NAME } from '@/config/constants';

// ===========================================
// PAGE
// ===========================================

export default function HomePage() {
  return (
    <main className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-8 h-8 bg-solar-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="font-semibold text-gray-900">{APP_NAME}</h1>
        </div>
        
        {/* Region selector (future) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Valais, Switzerland</span>
        </div>
      </header>
      
      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer />
      </div>
    </main>
  );
}
