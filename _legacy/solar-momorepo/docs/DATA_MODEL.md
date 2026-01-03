# 📊 Data Model

## Overview

SolarHousePrice uses PostgreSQL with PostGIS extension for geospatial data storage.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        houses                            │
├─────────────────────────────────────────────────────────┤
│ id              UUID (PK)                               │
│ osm_id          BIGINT (UNIQUE, nullable)              │
│ geometry        GEOMETRY(Polygon, 4326)                │
│ centroid        GEOMETRY(Point, 4326)                  │
│ building_type   VARCHAR(50)                            │
│ building_levels INTEGER                                │
│ area_sqm        DECIMAL(10, 2)                         │
│ address_*       VARCHAR                                │
│ created_at      TIMESTAMP                              │
│ updated_at      TIMESTAMP                              │
├─────────────────────────────────────────────────────────┤
│ Indexes:                                                │
│   - idx_houses_geometry (GIST)                         │
│   - idx_houses_osm_id_unique (BTREE, partial)         │
└─────────────────────────────────────────────────────────┘
                           │
                           │ house_id (FK, nullable)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                       listings                           │
├─────────────────────────────────────────────────────────┤
│ id              UUID (PK)                               │
│ house_id        UUID (FK → houses.id)                  │
│ type            VARCHAR(10) ['rent' | 'sale']          │
│ price           DECIMAL(12, 2)                         │
│ rooms           INTEGER                                │
│ area_sqm        DECIMAL(10, 2)                         │
│ title           VARCHAR(255)                           │
│ description     TEXT                                   │
│ contact_name    VARCHAR(100)                           │
│ contact_email   VARCHAR(255)                           │
│ contact_phone   VARCHAR(20)                            │
│ source          VARCHAR(50)                            │
│ external_id     VARCHAR(100)                           │
│ status          VARCHAR(20) DEFAULT 'active'           │
│ created_at      TIMESTAMP                              │
│ updated_at      TIMESTAMP                              │
├─────────────────────────────────────────────────────────┤
│ Indexes:                                                │
│   - idx_listings_house_id (BTREE)                      │
│   - idx_listings_status (BTREE)                        │
└─────────────────────────────────────────────────────────┘
```

---

## Tables

### houses

Main table storing building footprints and metadata.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto | Unique identifier |
| `osm_id` | BIGINT | UNIQUE | OpenStreetMap way ID |
| `geometry` | Geometry | NOT NULL | Polygon in EPSG:4326 |
| `centroid` | Geometry | | Point for markers |
| `building_type` | VARCHAR(50) | | OSM building tag |
| `building_levels` | INTEGER | | Number of floors |
| `area_sqm` | DECIMAL(10,2) | | Floor area |
| `address_street` | VARCHAR(255) | | addr:street |
| `address_number` | VARCHAR(20) | | addr:housenumber |
| `address_city` | VARCHAR(100) | | addr:city |
| `address_postcode` | VARCHAR(10) | | addr:postcode |
| `created_at` | TIMESTAMP | DEFAULT NOW() | |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | |

**Geometry Storage:**
- SRID: 4326 (WGS84, degrees)
- Format: Well-Known Binary (WKB)
- Example: `POLYGON((13.41 52.52, 13.42 52.52, ...))`

### listings

Property listings linked to houses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, auto | Unique identifier |
| `house_id` | UUID | FK | Reference to house |
| `type` | VARCHAR(10) | NOT NULL | 'rent' or 'sale' |
| `price` | DECIMAL(12,2) | NOT NULL | Price in EUR |
| `rooms` | INTEGER | | Number of rooms |
| `area_sqm` | DECIMAL(10,2) | | Living area |
| `title` | VARCHAR(255) | | Listing title |
| `description` | TEXT | | Full description |
| `contact_name` | VARCHAR(100) | | Owner/agent name |
| `contact_email` | VARCHAR(255) | | Contact email |
| `contact_phone` | VARCHAR(20) | | Contact phone |
| `source` | VARCHAR(50) | | 'user' or external |
| `external_id` | VARCHAR(100) | | ID from source |
| `status` | VARCHAR(20) | DEFAULT 'active' | |
| `created_at` | TIMESTAMP | DEFAULT NOW() | |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | |

---

## Building Types

OSM `building=*` tag values:

| Type | Description | Color (Satellite) |
|------|-------------|-------------------|
| `residential` | Generic residential | `#b85c38` |
| `apartments` | Apartment building | `#a35231` |
| `house` | Single house | `#c76b45` |
| `commercial` | Commercial building | `#8d8d8d` |
| `retail` | Shop/store | `#7a7a7a` |
| `office` | Office building | `#6f7782` |
| `industrial` | Factory/warehouse | `#5a4a42` |
| `warehouse` | Storage | `#4d4039` |
| `yes` | Generic (unspecified) | `#9b9b9b` |

---

## Queries

### Get houses by bounding box

```sql
SELECT 
  id,
  osm_id,
  address_street,
  address_number,
  address_city,
  address_postcode,
  building_type,
  building_levels,
  area_sqm,
  ST_AsGeoJSON(geometry) as geojson
FROM houses
WHERE geometry && ST_MakeEnvelope($west, $south, $east, $north, 4326)
LIMIT 1000;
```

### Get house by point (click)

```sql
SELECT *
FROM houses
WHERE ST_Contains(
  geometry, 
  ST_SetSRID(ST_Point($lng, $lat), 4326)
)
LIMIT 1;
```

### Get listings for house

```sql
SELECT *
FROM listings
WHERE house_id = $id
  AND status = 'active'
ORDER BY created_at DESC;
```

### Calculate area from geometry

```sql
SELECT 
  id,
  ST_Area(geometry::geography) as area_sqm
FROM houses
WHERE area_sqm IS NULL;
```

---

## Indexes

### Spatial Index (GIST)

```sql
CREATE INDEX idx_houses_geometry 
ON houses USING GIST(geometry);
```

Used for:
- Bounding box queries (`&&` operator)
- Point-in-polygon (`ST_Contains`)
- Nearby searches

### OSM Deduplication Index

```sql
CREATE UNIQUE INDEX idx_houses_osm_id_unique 
ON houses(osm_id) 
WHERE osm_id IS NOT NULL;
```

Used for:
- Preventing duplicate imports
- Fast OSM ID lookup

---

## Data Import

### From OpenStreetMap

Source: Overpass API

**Mapped Fields:**

| OSM Tag | Database Column |
|---------|-----------------|
| `element.id` | `osm_id` |
| `way.nodes` → coords | `geometry` |
| `building=*` | `building_type` |
| `building:levels=*` | `building_levels` |
| `addr:street=*` | `address_street` |
| `addr:housenumber=*` | `address_number` |
| `addr:city=*` | `address_city` |
| `addr:postcode=*` | `address_postcode` |

**Not Imported:**
- `building:material`
- `roof:*` tags
- `name` (for privacy)
- Multipolygon relations

---

## GeoJSON Response Format

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[13.41, 52.52], [13.42, 52.52], ...]]
      },
      "properties": {
        "id": "uuid",
        "osmId": 12345678,
        "address": {
          "street": "Alexanderplatz",
          "number": "1",
          "city": "Berlin",
          "postcode": "10178"
        },
        "building": {
          "type": "commercial",
          "levels": 5,
          "areaSqm": null
        }
      }
    }
  ]
}
```

---

## Price Estimate Model

```typescript
interface PriceEstimate {
  rentMin: number;      // €/month lower bound
  rentMax: number;      // €/month upper bound
  saleMin: number;      // € lower bound
  saleMax: number;      // € upper bound
  pricePerSqm?: number; // €/sqm average
  confidence: 'low' | 'medium' | 'high';
}
```

**Calculation Factors:**
- Building type
- Number of levels
- Area (estimated if not available)
- Location (Berlin averages)

---

## Migrations

### 0001_init

Initial schema with houses table.

### 0002_osm_unique

Add unique constraint on `osm_id` for import deduplication.

```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_houses_osm_id_unique 
ON houses(osm_id) 
WHERE osm_id IS NOT NULL;
```

---

## Data Statistics (Current)

| Metric | Value |
|--------|-------|
| Total houses | 513 |
| With address | ~60% |
| With building_levels | ~40% |
| Coverage | Berlin Alexanderplatz |
| Listings | 0 (demo) |

---

*Last updated: Phase 4A (January 2026)*
