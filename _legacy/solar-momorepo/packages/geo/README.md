# @solar/geo

Geo utilities and OSM data import for Solar Platform.

## OSM Building Import

Import real building footprints from OpenStreetMap into the database.

### Quick Start

```bash
# Import Berlin Mitte (recommended for demo)
pnpm osm:import --city=berlin-mitte

# Import Berlin Alexanderplatz area
pnpm osm:import --city=berlin-alex --limit=200

# Custom bounding box
pnpm osm:import --bbox=13.40,52.52,13.42,52.53 --limit=100
```

### Available Cities

| City | BBox | Approx. Buildings |
|------|------|-------------------|
| `berlin-mitte` | 13.38,52.51,13.43,52.53 | 500-1000 |
| `berlin-alex` | 13.40,52.515,13.425,52.525 | 200-400 |
| `hamburg-hafencity` | 9.98,53.535,10.02,53.55 | 300-500 |
| `munich-center` | 11.56,48.13,11.59,48.145 | 400-600 |

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--city=<n>` | Use predefined city bbox | - |
| `--bbox=<coords>` | Custom bbox (minLng,minLat,maxLng,maxLat) | - |
| `--limit=<n>` | Max buildings to import | 500 |
| `--quiet` | Suppress progress output | false |
| `--help` | Show help | - |

### Data Flow

```
Overpass API → Parse JSON → Convert to WKT → PostGIS INSERT
```

### Imported Fields

| DB Column | OSM Source |
|-----------|-----------|
| `osm_id` | element id |
| `geometry` | way coordinates → POLYGON |
| `centroid` | ST_Centroid(geometry) |
| `building_type` | `building=*` |
| `building_levels` | `building:levels=*` |
| `address_street` | `addr:street=*` |
| `address_number` | `addr:housenumber=*` |
| `address_city` | `addr:city=*` |
| `address_postcode` | `addr:postcode=*` |

### Duplicate Handling

- Uses `osm_id` as unique key
- Existing buildings are skipped (ON CONFLICT DO NOTHING)
- Re-running import is safe

### Limitations

⚠️ **Demo-grade import**, not for production:

- No background workers
- No incremental updates
- No relation/multipolygon support
- Limited to ~1000 buildings per run

## Geo Queries

See `src/queries.ts` for PostGIS spatial queries:

- `getHousesInBBox()` - Get buildings within bounding box
- `getHouseById()` - Get single building with GeoJSON
