'use client';

import { MapView } from '@/components/map';

export default function Home() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <main style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '24px',
          background: '#fef2f2',
          borderRadius: '8px',
          border: '1px solid #fecaca',
        }}>
          <h2 style={{ color: '#dc2626', margin: '0 0 8px 0' }}>
            Configuration Error
          </h2>
          <p style={{ color: '#7f1d1d', margin: 0 }}>
            Missing NEXT_PUBLIC_MAPBOX_TOKEN environment variable
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh',
      overflow: 'hidden',
    }}>
      <MapView accessToken={mapboxToken} />
    </main>
  );
}
