# Database Package

Shared database layer for all applications.

## Tech Stack

- **Prisma ORM** — schema-first, type-safe
- **PostgreSQL 15+** — primary database
- **PostGIS 3.3+** — spatial extension

## Structure

```
/db
├── prisma/
│   ├── schema.prisma       # Prisma schema
│   └── migrations/
│       └── 0001_init/      # Initial migration with PostGIS
├── client.ts               # Prisma Client singleton
├── index.ts                # Exports
└── package.json
```

## Models

| Model | Purpose |
|-------|---------|
| `House` | Building footprints from OSM |
| `PriceEstimate` | Calculated price ranges |
| `LightListing` | User-submitted listings |

## PostGIS Strategy

Geometry fields use `Unsupported("geometry")` in Prisma schema.
All spatial queries via `$queryRaw`:

```typescript
import { prisma } from '@solar/db';

const houses = await prisma.$queryRaw`
  SELECT id, ST_AsGeoJSON(geometry) as geojson
  FROM houses
  WHERE geometry && ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326)
`;
```

## Commands

```bash
# Generate Prisma Client
pnpm generate

# Create migration
pnpm migrate:dev

# Apply migrations (production)
pnpm migrate:deploy

# Open Prisma Studio
pnpm studio
```

## Status

✅ Schema defined (Prisma)
✅ Migrations with PostGIS
✅ Client singleton ready
