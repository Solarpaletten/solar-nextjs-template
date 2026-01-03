# 🚀 Setup Guide

Complete guide for setting up SolarHousePrice locally and deploying to production.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| pnpm | 8+ | Package manager |
| PostgreSQL | 16+ | Database |
| PostGIS | 3.4+ | Spatial extension |
| Mapbox | Account | Map tiles & GL |

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Solarpaletten/SolarHousePrice.git
cd SolarHousePrice
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL

```bash
# macOS with Homebrew
brew install postgresql@16 postgis

# Start PostgreSQL
brew services start postgresql@16

# Create database
createdb solar_db

# Enable PostGIS
psql -d solar_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -d solar_db -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

#### Option B: Docker

```bash
docker run -d \
  --name solar-postgres \
  -e POSTGRES_DB=solar_db \
  -e POSTGRES_USER=solar_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgis/postgis:16-3.4
```

### 4. Environment Configuration

```bash
# Create environment file
cp apps/map-core/.env.example apps/map-core/.env
```

Edit `apps/map-core/.env`:

```env
# Database
DATABASE_URL="postgresql://solar_user:your_password@localhost:5432/solar_db"

# Mapbox (get from https://account.mapbox.com/access-tokens/)
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1Ijoix..."
```

### 5. Initialize Database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push
```

### 6. Import Building Data

```bash
# Import Berlin Alexanderplatz buildings
pnpm osm:import --city=berlin-alex --limit=500
```

### 7. Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000

---

## Mapbox Setup

### 1. Create Account

1. Go to [mapbox.com](https://www.mapbox.com/)
2. Sign up (free tier: 50K loads/month)
3. Navigate to Access Tokens

### 2. Create Token

1. Click "Create a token"
2. Name: `SolarHousePrice`
3. Scopes: Default (public)
4. URL restrictions (production): Add your domain
5. Copy token starting with `pk.`

### 3. Configure

Add to `.env`:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJj...
```

---

## OSM Import Tool

### Usage

```bash
# By city preset
pnpm osm:import --city=berlin-alex --limit=500
pnpm osm:import --city=berlin-mitte --limit=300
pnpm osm:import --city=hamburg-hafencity --limit=200
pnpm osm:import --city=munich-center --limit=200

# By custom bounding box
pnpm osm:import --bbox=13.40,52.515,13.42,52.525 --limit=300

# Options
--limit=N     Maximum buildings to import (default: 500)
--help        Show help
```

### City Bounding Boxes

| City | BBox (minLng, minLat, maxLng, maxLat) |
|------|---------------------------------------|
| berlin-mitte | 13.38, 52.51, 13.43, 52.53 |
| berlin-alex | 13.40, 52.515, 13.425, 52.525 |
| hamburg-hafencity | 9.98, 53.535, 10.02, 53.55 |
| munich-center | 11.56, 48.13, 11.59, 48.145 |

### Expected Output

```
🏙️  City: berlin-alex

🏗️  OSM BUILDING IMPORT
══════════════════════════════════════════════════
📍 BBox: [13.4, 52.515, 13.425, 52.525]
📊 Limit: 500
══════════════════════════════════════════════════
📡 Fetching from Overpass API...
   Found 6676 nodes, 539 building ways

✅ Received 539 building features
📥 Processing...

══════════════════════════════════════════════════
📊 IMPORT SUMMARY
══════════════════════════════════════════════════
   ✅ Imported:  369
   ⏭️  Skipped:   131
   ❌ Errors:    0
   ⏱️  Duration:  101.45s
══════════════════════════════════════════════════
```

---

## Production Deployment

### Vercel (Frontend)

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Link Project

```bash
cd apps/map-core
vercel link
```

#### 3. Configure Environment

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.xxx` | Production |
| `DATABASE_URL` | `postgresql://...` | Production |

#### 4. Deploy

```bash
vercel --prod
```

Or via GitHub integration:
1. Connect GitHub repo
2. Set root directory: `apps/map-core`
3. Framework preset: Next.js
4. Auto-deploy on push to `main`

### Database (Digital Ocean)

#### 1. Create Managed Database

1. Digital Ocean → Databases → Create
2. PostgreSQL 16
3. Region: Frankfurt (closest to Berlin)
4. Plan: Basic ($15/month)

#### 2. Enable PostGIS

```bash
# Connect via psql
psql "postgresql://doadmin:password@host:25060/defaultdb?sslmode=require"

# Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### 3. Configure Trusted Sources

Add Vercel IP ranges to trusted sources in DO dashboard.

#### 4. Get Connection String

Format:
```
postgresql://user:password@host:port/database?sslmode=require
```

---

## Troubleshooting

### Map not loading

1. Check Mapbox token in `.env`
2. Verify token permissions in Mapbox dashboard
3. Check browser console for errors

### Database connection failed

1. Verify `DATABASE_URL` format
2. Check PostgreSQL is running
3. Verify user permissions
4. Check firewall/trusted sources (production)

### No buildings displayed

1. Check zoom level (must be ≥ 14)
2. Verify OSM import completed
3. Check API response: `GET /api/houses?bbox=...`
4. Look for PostGIS errors in console

### OSM import fails

1. Check network connectivity
2. Overpass API may be overloaded (wait 1-2 min)
3. Reduce bbox size for large areas
4. Check database connection

### 3D not working

1. Zoom must be ≥ 15
2. Check browser WebGL support
3. Verify `houses3DLayer` in console

---

## Useful Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm lint                   # Run linter

# Database
pnpm db:generate            # Generate Prisma client
pnpm db:push                # Push schema changes
pnpm db:studio              # Open Prisma Studio

# Data
pnpm osm:import --help      # Show import options

# Deployment
vercel                      # Deploy preview
vercel --prod               # Deploy production
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | ✅ | Mapbox public access token |
| `PRISMA_LOG_QUERIES` | ❌ | Enable Prisma query logging |

---

*Last updated: Phase 4A (January 2026)*
