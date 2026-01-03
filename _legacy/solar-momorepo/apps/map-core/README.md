# 🇨🇭 SolarHousePrice — Switzerland

## Real Estate Price Visualization for Monthey (Valais)

---

## 🏔️ What is this?

A premium 3D map visualization platform showing **real-time property price estimates** for the Swiss canton of Valais, starting with **Monthey**.

The platform displays:
- 🏠 3D building footprints from OpenStreetMap
- 💰 Price estimates in **CHF/m²**
- 🎨 Color-coded price overlay
- 📊 Click-for-details on any building

---

## 💰 How Prices are Calculated

### Stage A: Aggregation-based Estimation

Prices are calculated using a **transparent, rule-based system**:

```
Final Price = Base Price × Type Multiplier × Level Adjustment × Proximity Factors
```

### Base Prices (Valais)

| City | Base CHF/m² |
|------|-------------|
| Monthey | 7'800 |
| Martigny | 7'200 |
| Sion | 8'500 |

### Multipliers

| Factor | Effect |
|--------|--------|
| Apartments | +8% |
| Commercial | +15% |
| Per extra floor (above 2) | +1.5% |
| Mountain view | +6% |
| Near train station | +4% |
| Near industrial | -10% |

### Confidence Score

Each estimate includes a confidence score (0.55 - 0.90) based on available data.

---

## 🏔️ Why Monthey?

| Factor | Status |
|--------|--------|
| Entry market | ✅ Affordable compared to Geneva/Zurich |
| Stable demand | ✅ Growing population |
| Investor-friendly | ✅ Swiss quality, Valais prices |
| Mountain access | ✅ Near ski resorts |
| France border | ✅ Cross-border workers |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Solarpaletten/SolarHousePrice-CH.git
cd SolarHousePrice-CH/solar-monorepo
pnpm install
```

### 2. Configure Environment

Create `apps/map-core/.env`:

```env
DATABASE_URL=postgresql://user:pass@host:port/dbname
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

### 3. Database Setup

```bash
pnpm db:generate
pnpm db:migrate:dev
```

### 4. Import Buildings

```bash
# Monthey (recommended start)
pnpm osm:import --city=monthey --limit=500

# Or full area
pnpm osm:import --city=monthey-full --limit=800
```

### 5. Run

```bash
pnpm dev
# Open http://localhost:3000
```

---

## 🎨 Price Color Scale

| Color | Range (CHF/m²) | Category |
|-------|----------------|----------|
| 🔵 Blue | < 6'000 | Budget |
| 🟢 Green | 6'000 - 8'000 | Average |
| 🟡 Yellow | 8'000 - 10'000 | Above Average |
| 🟠 Orange | 10'000 - 12'000 | Premium |
| 🔴 Red | > 12'000 | Luxury |

---

## 🗺️ Available Regions

| Region | City | Status |
|--------|------|--------|
| `monthey` | Monthey | ✅ Active |
| `martigny` | Martigny | ✅ Ready |
| `sion` | Sion | ✅ Ready |
| `geneva` | Geneva | 🔜 Phase 9 |
| `zurich` | Zurich | 🔜 Phase 10 |

---

## 📁 Project Structure

```
solar-monorepo/
├── apps/
│   └── map-core/          # Main map application
├── packages/
│   ├── config/            # Region configurations
│   ├── db/                # Prisma + PostgreSQL
│   ├── geo/               # OSM import tools
│   └── pricing/           # Price estimation engine
└── docs/
```

---

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm osm:import --city=monthey` | Import buildings |
| `pnpm db:studio` | Open Prisma Studio |

---

## 📊 Roadmap

- [x] **Phase 7**: Monthey MVP
- [ ] **Phase 8**: ML-based pricing
- [ ] **Phase 9**: Geneva / Zurich
- [ ] **Phase 10**: Investor dashboard

---

## ⚠️ Disclaimer

> **This is an estimation tool, not an official appraisal.**
> 
> Price estimates are based on aggregated market data and statistical models. 
> For legal property valuations, consult a certified Swiss real estate appraiser.

---

## 👥 Team

- **Leanid** — Architect
- **Dashka** — Senior / PM  
- **Claude** — AI Engineer

---

## 📜 License

MIT © Solarpaletten 2026

---

## 🔗 Links

- **Production**: Coming soon
- **GitHub**: https://github.com/Solarpaletten/SolarHousePrice-CH
- **Berlin Version**: https://github.com/Solarpaletten/SolarHousePrice
- **Florida Version**: https://github.com/Solarpaletten/SolarHousePrice-USA
