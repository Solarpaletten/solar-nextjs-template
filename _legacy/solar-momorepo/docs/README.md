# 🏠 SolarHousePrice

**Premium Real Estate Price Intelligence Platform**

A next-generation property valuation tool featuring 3D satellite visualization, real building footprints from OpenStreetMap, and intelligent price estimation for the German real estate market.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![PostGIS](https://img.shields.io/badge/PostGIS-3.4-green)

---

## 🎬 Live Demo

🔗 **[solar-house-price.vercel.app](https://solar-house-price.vercel.app)** *(coming soon)*

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🛰️ **Satellite View** | Premium Mercedes Me-style 3D visualization |
| 🏗️ **Real Buildings** | 500+ actual building footprints from OpenStreetMap |
| 📐 **3D Extrusion** | Buildings rendered with real floor heights |
| 💰 **Price Estimates** | Rent & sale price ranges per building |
| 🖱️ **Interactive** | Click any building for detailed information |
| 📝 **Listing Portal** | Submit new property listings |

---

## 🖼️ Screenshots

### 3D Satellite View (Berlin Alexanderplatz)
*Premium visualization with real building data*

### Property Details Popup
*Click any building for price estimates*

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Maps** | Mapbox GL JS (3D fill-extrusion) |
| **Database** | PostgreSQL 16 + PostGIS 3.4 |
| **ORM** | Prisma 5 |
| **Data Source** | OpenStreetMap (Overpass API) |
| **Monorepo** | pnpm workspaces |
| **Deployment** | Vercel (frontend), Digital Ocean (database) |

---

## 📁 Project Structure

```
solar-monorepo/
├── apps/
│   ├── map-core/          # Main map application (Next.js)
│   └── listing-portal/    # Property listing submission
├── packages/
│   ├── db/                # Prisma schema & client
│   └── geo/               # GIS queries & OSM import
├── docs/                  # Architecture documentation
└── package.json           # Monorepo root
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed system design.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 16 with PostGIS
- Mapbox account (free tier)

### Installation

```bash
# Clone repository
git clone https://github.com/Solarpaletten/SolarHousePrice.git
cd SolarHousePrice

# Install dependencies
pnpm install

# Configure environment
cp apps/map-core/.env.example apps/map-core/.env
# Edit .env with your credentials

# Generate Prisma client
pnpm db:generate

# Start development server
pnpm dev
```

### Environment Variables

```env
# apps/map-core/.env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
DATABASE_URL=postgresql://user:pass@host:5433/solar_db
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start map-core in development |
| `pnpm build` | Build for production |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm osm:import --city=berlin-alex` | Import buildings from OSM |

---

## 🗺️ Data Import

Import real building footprints from OpenStreetMap:

```bash
# Import Berlin Alexanderplatz area (500 buildings)
pnpm osm:import --city=berlin-alex --limit=500

# Import custom bounding box
pnpm osm:import --bbox=13.40,52.515,13.42,52.525 --limit=300
```

Available cities: `berlin-mitte`, `berlin-alex`, `hamburg-hafencity`, `munich-center`

---

## 🌐 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Required Environment Variables on Vercel:**
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `DATABASE_URL`

### Database (Digital Ocean / Supabase)

PostgreSQL 16 with PostGIS extension enabled.

See [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) for detailed deployment instructions.

---

## 🗓️ Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ | Architecture & Planning |
| Phase 1 | ✅ | Database Foundation (Prisma + PostGIS) |
| Phase 2 | ✅ | Map Integration (Mapbox GL JS) |
| Phase 3A | ✅ | Listing Portal |
| Phase 3B | ✅ | OSM Building Import (500+ buildings) |
| Phase 4A | ✅ | **Premium 3D Satellite View** |
| Phase 5 | 🔜 | Price Algorithm Enhancement |
| Phase 6 | 🔜 | User Authentication |
| Phase 7 | 🔜 | Payment Integration |

---

## 📊 Current Data

| Metric | Value |
|--------|-------|
| Buildings imported | 513 |
| Coverage area | Berlin Alexanderplatz |
| Building types | residential, commercial, office, industrial |
| Data source | OpenStreetMap |

---

## ⚠️ Known Limitations

1. **Demo data only** — price estimates are algorithmic, not real market data
2. **Limited coverage** — currently Berlin Alexanderplatz area only
3. **No authentication** — all data is public
4. **Single-polygon buildings** — multipolygon relations not supported
5. **No caching** — API calls on every viewport change
6. **German market only** — pricing model for DE

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👥 Team

- **Leanid** — Development & Architecture
- **Dashka** — Product Management
- **Claude** — AI Development Assistant

---

## 🔗 Links

- [Documentation](docs/)
- [Architecture](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP_GUIDE.md)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [PostGIS](https://postgis.net/)
- [OpenStreetMap](https://www.openstreetmap.org/)

---

**Built with ❤️ for the German real estate market**
