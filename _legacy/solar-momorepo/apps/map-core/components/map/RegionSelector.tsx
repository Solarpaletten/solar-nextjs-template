// ============================================================
// REGION SELECTOR COMPONENT
// Phase 6: Multi-region support
// ============================================================

'use client';

import { getRegionList, RegionConfig } from '@solar/config';

interface RegionSelectorProps {
  currentRegion: string;
  onRegionChange: (regionId: string) => void;
}

export function RegionSelector({
  currentRegion,
  onRegionChange,
}: RegionSelectorProps) {
  const regions = getRegionList();

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 10,
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    }}>
      {regions.map((region) => (
        <RegionButton
          key={region.id}
          region={region}
          isActive={currentRegion === region.id}
          onClick={() => onRegionChange(region.id)}
        />
      ))}
    </div>
  );
}

// ============================================================
// REGION BUTTON
// ============================================================

interface RegionButtonProps {
  region: RegionConfig;
  isActive: boolean;
  onClick: () => void;
}

function RegionButton({ region, isActive, onClick }: RegionButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '14px',
        fontFamily: 'system-ui, sans-serif',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? '#2563eb' : 'rgba(255, 255, 255, 0.95)',
        color: isActive ? 'white' : '#374151',
        boxShadow: isActive 
          ? '0 4px 12px rgba(37, 99, 235, 0.4)' 
          : '0 2px 6px rgba(0, 0, 0, 0.1)',
      }}
      title={`${region.city}, ${region.canton || region.country}`}
    >
      <span style={{ fontSize: '16px' }}>{region.flag}</span>
      <span>{region.label}</span>
      {isActive && (
        <span style={{
          fontSize: '10px',
          opacity: 0.8,
          marginLeft: '2px',
        }}>
          {region.currency}
        </span>
      )}
    </button>
  );
}

// ============================================================
// COMPACT VERSION (for mobile)
// ============================================================

export function RegionSelectorCompact({
  currentRegion,
  onRegionChange,
}: RegionSelectorProps) {
  const regions = getRegionList();
  const current = regions.find(r => r.id === currentRegion);

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 10,
    }}>
      <select
        value={currentRegion}
        onChange={(e) => onRegionChange(e.target.value)}
        style={{
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '14px',
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#374151',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          appearance: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23374151\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10l-5 5z\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '36px',
        }}
      >
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.flag} {region.label} ({region.currency})
          </option>
        ))}
      </select>
    </div>
  );
}
