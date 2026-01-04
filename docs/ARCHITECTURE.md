# 🏗️ Architecture

Solar House Price — System Architecture

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mapbox    │  │   React     │  │  Tailwind   │         │
│  │   GL JS     │  │   18        │  │   CSS       │         │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘         │
│         │                │                                   │
│         └────────┬───────┘                                   │
│                  ▼                                           │
│         ┌───────────────┐                                   │
│         │   Next.js 14  │                                   │
│         │  App Router   │                                   │
│         └───────┬───────┘                                   │
└─────────────────┼───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │/clusters │  │/segments │  │ /houses  │  │ /price   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └─────────────┴─────────────┴─────────────┘          │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │   Prisma    │                          │
│                    │    ORM      │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Database                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PostgreSQL 16 + PostGIS 3.4             │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐ │   │
│  │  │ houses  │  │listings │  │ prices  │  │ coeffs │ │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
solar-template/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── map/              # Map-related
│   ├── listings/         # Listing cards
│   └── ui/               # Reusable UI
│
├── lib/                   # Business logic
│   ├── db.ts             # Prisma client singleton
│   ├── pricing.ts        # Price calculation
│   ├── segmentation.ts   # Price segments
│   ├── clustering.ts     # Supercluster
│   ├── geo.ts            # GIS utilities
│   └── utils.ts          # Helpers
│
├── config/               # Configuration
│   ├── constants.ts      # App constants
│   ├── regions.ts        # Map regions
│   └── coefficients.ts   # Price factors
│
├── hooks/                # React hooks
│   ├── useMapbox.ts      # Map integration
│   └── useClusters.ts    # Data fetching
│
├── types/                # TypeScript
│   ├── map.ts            # Map types
│   └── api.ts            # API types
│
└── prisma/               # Database
    ├── schema.prisma     # Schema
    └── migrations/       # SQL migrations
```

---

## Data Flow

### Map Load
```
User opens / → MapContainer mounts
              → useMapbox initializes Mapbox GL
              → map.on('load') fires
              → useClusters fetches /api/clusters
              → ClusterLayer renders markers
```

### Cluster Click
```
User clicks cluster → getSegments(cluster_id)
                    → GET /api/segments
                    → SegmentPopup displays
```

### Price Estimate
```
GET /api/price?house_id=xxx
    → Check cache (PriceEstimate table)
    → If cached & valid → return cached
    → Else → calculate estimate
           → Save to cache (24h TTL)
           → Return result
```

---

## Database Schema

### houses
```sql
id              UUID PRIMARY KEY
osm_id          BIGINT (OSM reference)
geometry        GEOMETRY(Polygon, 4326)
centroid        GEOMETRY(Point, 4326)
building_type   VARCHAR(50)
building_levels SMALLINT
area_sqm        DECIMAL(10,2)
address_*       VARCHAR (street, city, postcode)
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### price_estimates
```sql
id              UUID PRIMARY KEY
house_id        UUID UNIQUE FK → houses
price_sqm       DECIMAL(10,2)
price_total     DECIMAL(12,2)
method          VARCHAR(20)
confidence      DECIMAL(3,2)
calculated_at   TIMESTAMPTZ
expires_at      TIMESTAMPTZ (cache TTL)
```

### light_listings
```sql
id              UUID PRIMARY KEY
house_id        UUID FK → houses
listing_type    VARCHAR(20) (rent/sale)
price           DECIMAL(12,2)
area_sqm        DECIMAL(10,2)
geometry        GEOMETRY(Point, 4326)
contact_email   VARCHAR(255)
is_active       BOOLEAN
expires_at      TIMESTAMPTZ
```

---

## Spatial Indexes

```sql
-- Houses geometry (bbox queries)
CREATE INDEX idx_houses_geometry 
ON houses USING GIST(geometry);

-- Houses centroid (point queries)
CREATE INDEX idx_houses_centroid 
ON houses USING GIST(centroid);

-- Listings location
CREATE INDEX idx_listings_geometry 
ON light_listings USING GIST(geometry);

-- OSM deduplication
CREATE UNIQUE INDEX idx_houses_osm_id_unique 
ON houses(osm_id) WHERE osm_id IS NOT NULL;
```

---

## Price Calculation

### Factors
1. **Base price** — Regional average (€/m²)
2. **Building type** — Multiplier (0.6-1.15)
3. **Building size** — Area adjustments
4. **Data completeness** — Confidence score

### Multipliers
| Type | Factor |
|------|--------|
| residential | 1.00 |
| apartments | 1.05 |
| house | 1.10 |
| detached | 1.15 |
| commercial | 0.85 |
| office | 0.90 |
| industrial | 0.60 |

---

## Deployment

```
┌─────────────────┐
│     Vercel      │
│   (Frontend)    │
│   Next.js 14    │
└────────┬────────┘
         │
         │ DATABASE_URL
         ▼
┌─────────────────┐
│  Digital Ocean  │
│  PostgreSQL 16  │
│   + PostGIS     │
└─────────────────┘
```

---

## Performance

| Metric | Target |
|--------|--------|
| Initial load | < 2s |
| API response | < 500ms |
| Map FPS | 60 FPS |
| Bundle size | < 500KB gzip |

---

*Architecture v1.0.0 — January 2026*
