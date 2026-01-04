# 🏠 Solar House Price

**Real Estate Visualization Platform**

Premium 3D satellite map visualization for real estate data with price estimates, clustering, and market segmentation.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env.local
# Fill in DATABASE_URL and NEXT_PUBLIC_MAPBOX_TOKEN

# 3. Generate Prisma client
pnpm db:generate

# 4. Push schema to database
pnpm db:push

# 5. Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
solar-template/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main map page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles + Mapbox CSS
│   └── api/
│       ├── clusters/      # GET /api/clusters
│       ├── segments/      # GET /api/segments
│       ├── houses/        # GET/POST /api/houses
│       ├── house/[id]/    # GET /api/house/:id
│       └── price/         # GET /api/price
│
├── components/
│   ├── map/               # Map components
│   │   ├── MapContainer   # Main map wrapper
│   │   ├── ClusterLayer   # Marker clustering
│   │   ├── Legend         # Price legend
│   │   └── SegmentPopup   # Cluster info popup
│   ├── listings/          # Listing components
│   │   ├── ListingCard    # Single listing card
│   │   └── ListingList    # List with states
│   └── ui/                # Reusable UI
│       └── Button
│
├── lib/                   # Business logic
│   ├── db.ts             # Prisma client
│   ├── pricing.ts        # Price calculation
│   ├── segmentation.ts   # Price segments
│   ├── clustering.ts     # Supercluster wrapper
│   ├── geo.ts            # GIS utilities
│   └── utils.ts          # Helpers
│
├── config/               # Configuration
│   ├── constants.ts      # App constants
│   ├── regions.ts        # Map regions
│   └── coefficients.ts   # Price coefficients
│
├── hooks/                # React hooks
│   ├── useMapbox.ts      # Mapbox integration
│   └── useClusters.ts    # Cluster data fetching
│
├── types/                # TypeScript types
│   ├── map.ts            # Map types
│   └── api.ts            # API types
│
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # SQL migrations
│
└── public/               # Static assets
```

---

## 🗺️ Features

### Map Visualization
- **Mapbox GL JS** with satellite imagery
- **3D building extrusion** at high zoom
- **45° pitch** for premium view
- **Smooth camera transitions**

### Clustering
- **Supercluster** for performance
- **Color-coded markers** by price segment
- **Click-to-expand** clusters
- **Segment popup** with statistics

### Price Estimation
- **Building type multipliers** (residential, commercial, industrial)
- **Billing area adjustments**
- **Confidence scoring** (50-95%)
- **24h cache** for performance

### Price Segments

| Segment | Color | Range |
|---------|-------|-------|
| 🟢 Low | `#22c55e` | < 6,000/m² |
| 🔵 Mid | `#3b82f6` | 6,000-8,000 |
| 🟠 Upper | `#f97316` | 8,000-10,000 |
| 🔴 Premium | `#ef4444` | > 10,000 |

---

## 📡 API Endpoints

### GET /api/clusters
```
?bbox=minLng,minLat,maxLng,maxLat&zoom=14
```
Returns GeoJSON FeatureCollection with clusters and points.

### GET /api/segments
```
?cluster_id=123
```
Returns segment breakdown for a cluster.

### GET /api/houses
```
?bbox=minLng,minLat,maxLng,maxLat&limit=100&offset=0
```
Returns houses in bounding box.

### GET /api/house/:id
Returns single house with price estimate.

### GET /api/price
```
?house_id=uuid
```
Returns price estimate with confidence score.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14 | React framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Styling |
| Mapbox GL | 3 | Maps |
| Supercluster | 8 | Clustering |
| Prisma | 5 | ORM |
| PostgreSQL | 16 | Database |
| PostGIS | 3.4 | Spatial data |

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production |
| `pnpm lint` | Lint code |
| `pnpm typecheck` | Type check |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to DB |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Prisma Studio |

---

## 🔧 Environment Variables

```env
# Database (PostgreSQL + PostGIS)
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="pk.xxx"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 👥 Team

| Role | Name |
|------|------|
| 🏗️ Architect | Leanid |
| 👔 Product Manager | Dashka |
| 🤖 AI Engineer | Claude |

---

## 📄 License

MIT

---

**Solar House Price** — *Real Estate Visualization Platform*

*v1.0.0 — January 2026*
