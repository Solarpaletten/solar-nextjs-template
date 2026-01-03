# 🏗️ Architecture

## Overview

SolarHousePrice is a **monorepo** built with pnpm workspaces, consisting of applications and shared packages.

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   map-core      │    │ listing-portal  │                │
│  │   (Next.js)     │    │   (Next.js)     │                │
│  └────────┬────────┘    └────────┬────────┘                │
│           │                      │                          │
│           └──────────┬───────────┘                          │
│                      │                                      │
├──────────────────────┼──────────────────────────────────────┤
│                  PACKAGES                                    │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │      @solar/db  │    │    @solar/geo   │                │
│  │    (Prisma)     │◄───│   (GIS utils)   │                │
│  └────────┬────────┘    └─────────────────┘                │
│           │                                                 │
├───────────┼─────────────────────────────────────────────────┤
│           │           DATABASE                              │
│           ▼                                                 │
│  ┌─────────────────────────────────────────┐               │
│  │   PostgreSQL 16 + PostGIS 3.4           │               │
│  │   ┌─────────┐  ┌─────────┐  ┌────────┐  │               │
│  │   │ houses  │  │listings │  │ users  │  │               │
│  │   └─────────┘  └─────────┘  └────────┘  │               │
│  └─────────────────────────────────────────┘               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    EXTERNAL SERVICES                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐           │
│  │  Mapbox  │   │ Overpass │   │ Digital Ocean│           │
│  │  GL JS   │   │   API    │   │   Database   │           │
│  └──────────┘   └──────────┘   └──────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

---

## Applications

### map-core (`apps/map-core`)

Main application — interactive 3D map with building data.

**Key Features:**
- Mapbox GL JS with satellite view
- 3D building extrusion (`fill-extrusion`)
- Click-to-see price estimates
- Responsive popup UI

**Routes:**
- `/` — Main map view
- `/api/houses` — GeoJSON buildings by bbox
- `/api/house/[id]` — Single house with estimates

**Key Files:**
```
apps/map-core/
├── app/
│   ├── page.tsx              # Main page
│   └── api/
│       ├── houses/route.ts   # Houses by bbox
│       └── house/[id]/route.ts
├── components/map/
│   ├── MapView.tsx           # React wrapper
│   ├── useMapbox.ts          # Map logic hook
│   ├── layers.ts             # Mapbox layers config
│   ├── Popup.tsx             # Info popup
│   └── types.ts              # TypeScript types
└── .env                      # Environment config
```

### listing-portal (`apps/listing-portal`)

Property listing submission form.

**Features:**
- 3-step form (Address → Details → Contact)
- Map-based location picker
- Validation with Zod
- API submission

---

## Packages

### @solar/db (`packages/db`)

Database access layer using Prisma.

**Exports:**
- `prisma` — Prisma client instance
- Generated types

**Schema:**
```prisma
model House {
  id              String    @id @default(uuid())
  osm_id          BigInt?   @unique
  geometry        Geometry  // PostGIS Polygon
  centroid        Geometry  // PostGIS Point
  building_type   String?
  building_levels Int?
  area_sqm        Decimal?
  address_*       String?   // street, number, city, postcode
}

model Listing {
  id        String   @id @default(uuid())
  house_id  String?
  type      String   // rent | sale
  price     Decimal
  rooms     Int?
  area_sqm  Decimal?
  // ... more fields
}
```

### @solar/geo (`packages/geo`)

GIS utilities and OSM import.

**Exports:**
- `getHousesInBounds(bbox)` — Query houses by bbox
- `getHouseByPoint(lat, lng)` — Find house at click
- `getHouseById(id)` — Get single house
- Types: `BBox`, `HouseFeature`, `HouseFeatureCollection`

**CLI:**
- `pnpm osm:import` — Import buildings from Overpass API

---

## Data Flow

### 1. Map Load

```
User opens /
    │
    ▼
MapView mounts
    │
    ▼
useMapbox hook initializes Mapbox GL
    │
    ▼
map.on('load') fires
    │
    ▼
loadHousesForViewport() called
    │
    ▼
GET /api/houses?bbox=...
    │
    ▼
getHousesInBounds() (PostGIS query)
    │
    ▼
GeoJSON returned → map.setData()
    │
    ▼
Buildings rendered (2D or 3D based on zoom)
```

### 2. Building Click

```
User clicks building
    │
    ▼
map.queryRenderedFeatures()
    │
    ▼
Feature ID extracted
    │
    ▼
GET /api/house/{id}
    │
    ▼
Price estimate calculated
    │
    ▼
Popup displayed with data
```

### 3. OSM Import

```
pnpm osm:import --city=berlin-alex
    │
    ▼
Build Overpass query (bbox)
    │
    ▼
POST to Overpass API
    │
    ▼
Parse JSON → Extract ways with building=*
    │
    ▼
Convert nodes → coordinates → WKT Polygon
    │
    ▼
INSERT INTO houses (ST_GeomFromText)
    │
    ▼
Success summary
```

---

## Map Layers

### Layer Stack

```
┌─────────────────────────────────────┐
│ houses-3d (fill-extrusion)          │ ← zoom ≥ 15
│ Opacity: 0.35, Height: levels × 3m  │
├─────────────────────────────────────┤
│ houses-line (line)                  │ ← all zooms
│ White outline, width by zoom        │
├─────────────────────────────────────┤
│ houses-fill (fill)                  │ ← zoom < 15
│ Transparent, hover only             │
├─────────────────────────────────────┤
│ satellite-streets-v12               │ ← base map
│ Mapbox satellite imagery            │
└─────────────────────────────────────┘
```

### Color Palette (Satellite Mode)

| Building Type | Color | Hex |
|---------------|-------|-----|
| residential | Warm terracotta | `#b85c38` |
| apartments | Brick | `#a35231` |
| commercial | Concrete gray | `#8d8d8d` |
| office | Cool gray | `#6f7782` |
| industrial | Dark brown | `#5a4a42` |
| default | Neutral | `#9b9b9b` |

---

## Price Estimation

### Algorithm (MVP)

```typescript
function calculateEstimate(house: House): PriceEstimate {
  const sqm = house.area_sqm || estimateFromGeometry(house.geometry);
  const levels = house.building_levels || 2;
  
  // Base prices per sqm (Berlin market averages)
  const baseRent = 15; // €/sqm/month
  const baseSale = 5000; // €/sqm
  
  // Modifiers
  const typeMultiplier = getTypeMultiplier(house.building_type);
  const levelMultiplier = 1 + (levels - 2) * 0.05;
  
  return {
    rentMin: sqm * baseRent * typeMultiplier * 0.8,
    rentMax: sqm * baseRent * typeMultiplier * 1.2,
    saleMin: sqm * baseSale * typeMultiplier * levelMultiplier * 0.8,
    saleMax: sqm * baseSale * typeMultiplier * levelMultiplier * 1.2,
  };
}
```

**Note:** These are demo estimates, not real market data.

---

## Database Schema

### PostGIS Setup

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE houses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  osm_id BIGINT UNIQUE,
  geometry GEOMETRY(Polygon, 4326),
  centroid GEOMETRY(Point, 4326),
  building_type VARCHAR(50),
  building_levels INTEGER,
  area_sqm DECIMAL(10, 2),
  address_street VARCHAR(255),
  address_number VARCHAR(20),
  address_city VARCHAR(100),
  address_postcode VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Spatial index for bbox queries
CREATE INDEX idx_houses_geometry ON houses USING GIST(geometry);

-- Unique constraint for OSM deduplication
CREATE UNIQUE INDEX idx_houses_osm_id_unique 
  ON houses(osm_id) WHERE osm_id IS NOT NULL;
```

---

## Environment Configuration

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/database

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx

# Optional: Prisma logging
PRISMA_LOG_QUERIES=true
```

### Connections

| Service | Development | Production |
|---------|-------------|------------|
| Database | localhost:5432 | DO: 207.154.220.86:5433 |
| Frontend | localhost:3000 | Vercel |
| Mapbox | Individual tier | Individual tier |

---

## Security Considerations

1. **Database** — SSL required in production
2. **API** — Rate limiting recommended (not implemented)
3. **Mapbox token** — Public token, domain-restricted
4. **User data** — No PII stored currently

---

## Performance

### Current Metrics

| Metric | Value |
|--------|-------|
| Initial map load | ~2s |
| API response (500 buildings) | 300-600ms |
| 3D rendering | 60 FPS on modern hardware |
| Bundle size | ~500KB (gzipped) |

### Optimization Opportunities

1. Vector tiles for >1000 buildings
2. API response caching
3. Debounce viewport changes
4. Cluster markers at low zoom

---

## Testing

### Manual Testing Checklist

- [ ] Map loads at Berlin Alexanderplatz
- [ ] Buildings visible at zoom 14+
- [ ] 3D mode activates at zoom 15+
- [ ] Click shows popup with address
- [ ] Price estimates display
- [ ] Hover highlights building
- [ ] Mobile responsive

### Automated Testing (TODO)

- Unit tests for price calculation
- API integration tests
- E2E with Playwright

---

## Deployment Architecture

```
                    ┌─────────────────┐
                    │     Vercel      │
                    │   (Frontend)    │
                    │                 │
                    │  ┌───────────┐  │
   Users ──────────▶│  │ map-core  │  │
                    │  │ Next.js   │  │
                    │  └─────┬─────┘  │
                    │        │        │
                    └────────┼────────┘
                             │
                             │ DATABASE_URL
                             │
                    ┌────────▼────────┐
                    │  Digital Ocean  │
                    │   PostgreSQL    │
                    │   + PostGIS     │
                    └─────────────────┘
```

---

*Last updated: Phase 4A (January 2026)*
