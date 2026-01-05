# TASK 14 — Switzerland Only / City Lock

## 🎯 Цель

Привести проект в состояние **"Switzerland → Monthey only"**.

Это **географический фундамент продукта**, не фича.

---

## ❌ Что удалено

| Было | Удалено |
|------|---------|
| Berlin | ✅ Удалено |
| Alexanderplatz | ✅ Удалено |
| Friedrichstraße | ✅ Удалено |
| Prenzlauer Allee | ✅ Удалено |
| Kurfürstendamm | ✅ Удалено |
| Karl-Marx-Allee | ✅ Удалено |
| 52.52, 13.405 | ✅ Удалено |
| € (Euro) | → CHF |

---

## ✅ Что установлено

| Параметр | Значение |
|----------|----------|
| **Country** | Switzerland 🇨🇭 |
| **City** | Monthey |
| **Canton** | Valais (VS) |
| **Coordinates** | 46.255, 6.954 |
| **Currency** | CHF |
| **Locale** | de-CH |

---

## 📁 Изменённые файлы

### 1. `app/listings/page.tsx`

**Было:**
```typescript
{ address: 'Alexanderplatz 1, Berlin', price: 450000 }
{ address: 'Friedrichstraße 42, Berlin', price: 1800 }
```

**Стало:**
```typescript
{ address: 'Avenue de la Gare 15, Monthey', price: 650000 }
{ address: 'Rue du Commerce 8, Monthey', price: 1850 }
```

### 2. `app/api/segments/route.ts`

**Было:**
```typescript
center: { lat: 52.5200, lng: 13.4050 }
area_name: 'Berlin Alexanderplatz'
label: '< €6,000/m²'
```

**Стало:**
```typescript
center: { lat: 46.255, lng: 6.954 }
area_name: 'Monthey Centre'
label: '< CHF 6\'000/m²'
```

### 3. `app/api/clusters/route.ts`

**Было:**
```typescript
const DEMO_POINTS = [
  { coordinates: [13.4050, 52.5200] }, // Berlin!
  ...
];
```

**Стало:**
```typescript
// Dynamic generation within bbox - no hardcoded coordinates
function generateDemoPoints(bbox, count) {
  const lat = bbox.minLat + Math.random() * (bbox.maxLat - bbox.minLat);
  const lng = bbox.minLng + Math.random() * (bbox.maxLng - bbox.minLng);
  ...
}
```

---

## ✅ Уже правильно настроено

Эти файлы уже были на Switzerland:

| Файл | Значение |
|------|----------|
| `config/constants.ts` | `MAP_DEFAULT_CENTER: [6.954, 46.255]` |
| `config/regions.ts` | `DEFAULT_REGION = REGIONS.monthey` |
| `app/layout.tsx` | `lang="de-CH"` |
| `lib/utils.ts` | `Intl.NumberFormat('de-CH')` |
| `lib/pricing.ts` | `formatCHF()` |
| `config/coefficients.ts` | `VALAIS_COEFFICIENTS` |

---

## 🚀 Установка

```bash
# В корне solar-nextjs-template
chmod +x task14-fix/INSTALL.sh
./task14-fix/INSTALL.sh

# Build
pnpm build

# Test
pnpm dev
```

---

## 🧪 Проверка

| Действие | Ожидание |
|----------|----------|
| Открыть localhost:3000 | Карта на Monthey |
| Zoom level | 14 |
| Coordinates | ~46.255, 6.954 |
| /listings page | Адреса Monthey |
| Currency | CHF (не €) |
| `grep -r "berlin"` | **0 результатов** |

---

## 🔍 Верификация Germany = 0

```bash
grep -rn -i "berlin\|germany\|52\.52\|13\.405" \
  --include="*.ts" --include="*.tsx" \
  app/ components/ lib/ config/ hooks/ types/
```

**Ожидаемый результат:** пусто (no matches)

---

## 📊 Архитектурный принцип

> **Один город = одна истина**

Дальнейшее расширение (Lausanne, Sion, Martigny, Genève) — **только после решения архитектора**.

---

## 🇨🇭 Switzerland is now the ONLY geography!
