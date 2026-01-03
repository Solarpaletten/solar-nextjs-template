# 📊 @solar/pricing — Price Estimation Package

## Phase 5: Цены / Агрегация / ML-оценки

Premium real estate price estimation для SolarHousePrice platform.

---

## 🎯 Overview

Пакет предоставляет оценку стоимости недвижимости:

| Stage | Method | Description |
|-------|--------|-------------|
| **A** | Aggregation | Rule-based + nearby listings median |
| **B** | ML | Gradient Boosting model (offline trained) |
| **Fallback** | District avg | Районные коэффициенты Berlin |

---

## 📁 Structure

```
packages/pricing/
├── src/
│   ├── index.ts              # Main exports
│   ├── types.ts              # TypeScript interfaces
│   ├── coefficients.ts       # Berlin district coefficients
│   ├── aggregator.ts         # Stage A: Aggregation logic
│   ├── engine.ts             # PriceEngine orchestrator
│   ├── colorScale.ts         # UI color gradient
│   └── ml/
│       ├── features.ts       # Feature extraction
│       ├── predict.ts        # JS inference (from JSON weights)
│       ├── train.py          # Python training script
│       └── model.json        # Exported model weights
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Installation

```bash
# В корне solar-monorepo
cd packages/pricing
pnpm install
pnpm build
```

---

## 📖 Usage

### Basic Usage

```typescript
import { PriceEngine } from '@solar/pricing';

const engine = new PriceEngine();

const estimate = await engine.estimate({
  houseId: 'uuid-here',
  areaSqm: 85,
  buildingType: 'apartments',
  buildingLevels: 5,
  centroid: [13.4125, 52.5219], // [lng, lat]
});

console.log(estimate);
// {
//   priceSqm: 7420,
//   priceTotal: 630700,
//   method: 'aggregated',
//   confidence: 0.78,
//   details: { ... }
// }
```

### API Endpoint

```
GET /api/price/estimate?house_id=xxx
```

Response:
```json
{
  "price_sqm": 7420,
  "price_total": 630700,
  "method": "aggregated",
  "confidence": 0.78,
  "cached": false,
  "response_time_ms": 45
}
```

---

## ⚙️ Coefficients (Berlin Alexanderplatz)

| Parameter | Value | Description |
|-----------|-------|-------------|
| Base Price | 6,500 €/m² | District average |
| Residential | ×1.00 | Standard |
| Apartments | ×1.05 | +5% |
| Commercial | ×1.20 | +20% |
| Office | ×1.15 | +15% |
| Industrial | ×0.70 | -30% |
| Per Level >3 | +2% | Up to +15% max |
| Per km from center | -3% | Distance penalty |
| Water proximity | +8% | Within 100m |
| Park proximity | +5% | Within 200m |

---

## 🧮 Calculation Algorithm

### Stage A: Aggregation

```
1. Find listings within 500m radius
2. Calculate median €/m²
3. Apply building_type factor
4. Apply levels factor (>3 floors = bonus)
5. Apply proximity factor (distance to center)
6. Calculate confidence score

Final Price = base × type × levels × proximity
```

### Confidence Score

| Factor | Impact |
|--------|--------|
| Method = aggregated | +20% |
| Has area_sqm | +10% |
| 5+ nearby listings | +15% |
| Base | 50% |

---

## 🎨 Color Scale for UI

```typescript
import { getPriceColor } from '@solar/pricing';

// Berlin price range: 4,000 - 12,000 €/m²
getPriceColor(4000);  // '#3b82f6' (blue - cheap)
getPriceColor(6500);  // '#22c55e' (green - average)
getPriceColor(10000); // '#f97316' (orange - expensive)
getPriceColor(12000); // '#ef4444' (red - premium)
```

---

## 🤖 ML Training (Stage B)

### Features

| Feature | Type | Description |
|---------|------|-------------|
| area_sqm | numeric | Area in m² |
| building_levels | numeric | Number of floors |
| type_* | one-hot | Building type (5 cats) |
| centroid_lat/lng | numeric | Coordinates |
| distance_to_center_km | numeric | From Alexanderplatz |
| aggregated_price_sqm | numeric | Stage A estimate |

### Training

```bash
cd packages/pricing/src/ml
pip install pandas numpy scikit-learn
python train.py
```

---

## ✅ Acceptance Criteria

- [x] Цена для любого дома (с fallback)
- [x] API < 300 ms
- [x] Explainable logic
- [x] Версионируемые коэффициенты
- [x] Demo-ready

---

## 📜 License

MIT © Solarpaletten
