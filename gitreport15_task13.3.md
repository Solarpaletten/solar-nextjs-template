**L=>D=>C**

## 🎉 DEPLOYED! solar-nextjs-template.vercel.app

Вижу на скриншоте:
- ✅ Sidebar работает
- ✅ Карта с кластерами и точками
- ✅ Легенда цен
- ✅ Valais, Switzerland

---

## 🐛 Найденные баги:

### Bug #1: "Listings пропадают"

**Причина:** Mock listings в `HomeClient.tsx` имеют координаты **Berlin**, а карта показывает **Valais, Switzerland**.

Bbox filter отсеивает все listings → "No listings in this area"

**Fix (2 варианта):**

**A) Быстрый — поменять координаты mock на Valais:**
```
📍 Файл: components/HomeClient.tsx
📍 MOCK_LISTINGS → изменить centroid на Monthey координаты
```

**B) Правильный — Phase 2: загружать listings из API по bbox**

---

### Bug #2: "Кружочки убегают"

**Причина:** При клике на кластер `flyTo` с offset, но popup закрывается или анимация конфликтует.

**Уже фиксили в Task 8:**
```typescript
flyTo({ lat: lat - 0.003, lng }, viewport.zoom + 2);
```

Возможно offset недостаточный или проблема в timing.

---

## 🛠️ Quick Fix Plan (Task 16)

**Хотите чтобы я:**

1. **Обновил MOCK_LISTINGS** на координаты Monthey/Valais — тогда sidebar будет показывать listings

2. **Проверил flyTo** поведение для кластеров

---

**Жду команду: `D=>C task16 GO` — и даю fix файлы.** 🚀


**C=>D**

Подключён к GitHub через project_knowledge_search.
Обнаружен файл: **gitkeep16_task16.md** — TASK 13 Phase 2: Real Data

---

## ✅ TASK 13.1 — DATA AUDIT (COMPLETE)

### Каноническая модель `House` (из prisma/schema.prisma):

```typescript
interface House {
  id: string;              // UUID
  osm_id: string | null;   // OSM reference
  building_type: string | null;  // 'residential', 'apartments', etc.
  area_sqm: number | null; // площадь
  floors: number | null;   // этажность
  centroid: {              // PostGIS Point
    lat: number;
    lng: number;
  } | null;
  created_at: Date;
  updated_at: Date;
}
```

### Связанная модель `PriceEstimate`:

```typescript
interface PriceEstimate {
  price: number;      // общая цена
  priceSqm: number;   // цена за m²
  segment: string;    // 'low' | 'mid' | 'upper' | 'premium'
  confidence: string; // 'low' | 'medium' | 'high'
}
```

---

## ✅ TASK 13.2 — API STATUS

**Уже существует и работает:**

| Endpoint | Status | Функционал |
|----------|--------|------------|
| `GET /api/houses?bbox=...` | ✅ | Houses по bbox |
| `GET /api/house/:id` | ✅ | Single house + price |
| `GET /api/clusters?bbox=...&zoom=...` | ✅ | Clusters для карты |
| `GET /api/price?house_id=...` | ✅ | Price estimate |

**API контракт готов!**

---

## 🔧 TASK 13.3 — Frontend: mock → real

### Что нужно изменить:

**📍 Файл:** `components/HomeClient.tsx`

**Изменения:**
1. Убрать `MOCK_LISTINGS`
2. Добавить `useEffect` для загрузки houses из API
3. Трансформировать `House` → `SyncListing`

### Новая архитектура:

```
HomeClient
├── state: houses[], bbox, selectedId, hoveredId
├── useEffect: bbox изменился → fetch /api/houses?bbox=...
├── visibleListings = houses (уже отфильтрованы по bbox на backend)
│
├── ListingSidebar
│   └── показывает houses из API
│
└── MapContainer
    └── clusters из /api/clusters (уже работает)
```

---

## 📋 TASK 13.3 — IMPLEMENTATION PLAN

### Нужен новый файл `HomeClient.tsx`:

**Основные изменения:**
1. Убрать `MOCK_LISTINGS` (50+ строк)
2. Добавить `fetchHouses(bbox)` function
3. Добавить `useEffect` для fetch при изменении bbox
4. Трансформация `House` API → `SyncListing` формат
5. Loading state

---

## Жду команду:

**`D=>C: TASK 13.3 GO`** — выдам полный новый `HomeClient.tsx`

Или вопросы по Data Audit / API контракту.

🚀

task13.3