**C=>D**

Подключён к GitHub через project_knowledge_search.
Обнаружен файл: **gitkeep11.1_task11.md** — TASK 11: MAP ↔ LISTINGS SYNC

---

## C=>D — gitreport11.md

### TASK 11 — MAP ↔ LISTINGS SYNC (Analysis)

---

### 1. UX Сценарий

#### Desktop Layout:
```
┌──────────────────────────────────────────────────────┐
│  SolarHousePrice                        [Filters] ☰  │
├────────────────────────┬─────────────────────────────┤
│                        │                             │
│      SIDEBAR           │          MAP                │
│    (Listings)          │       (Mapbox)              │
│      ~350px            │        flex-1               │
│                        │                             │
│   ┌──────────────┐     │     [clusters]              │
│   │ Listing 1    │◄────┼──── hover sync              │
│   └──────────────┘     │                             │
│   ┌──────────────┐     │                             │
│   │ Listing 2    │     │                             │
│   └──────────────┘     │                             │
│        ...             │                             │
│                        │                             │
├────────────────────────┴─────────────────────────────┤
│  Legend                                              │
└──────────────────────────────────────────────────────┘
```

#### Mobile Layout:
```
┌─────────────────────┐
│  SolarHousePrice    │
├─────────────────────┤
│                     │
│       MAP           │
│     (100vh-header)  │
│                     │
├─────────────────────┤
│  [▲ Show 5 listings]│  ← Bottom sheet (collapsible)
└─────────────────────┘
```

**UX Answers:**
- Sidebar: **collapsible** на mobile, **visible** на desktop
- Desktop vs mobile: **responsive breakpoint** (lg: 1024px)
- Route: **`/`** (home page with split view)

---

### 2. Где должен жить State

**Текущая архитектура:**
```
app/page.tsx
└── MapContainer (client)
    ├── state: selectedCluster
    ├── useMapbox → map, viewport, bbox
    └── useClusters → clusters
```

**Проблема:** State изолирован внутри `MapContainer` — Sidebar не имеет доступа.

**Решение — Lifted State:**
```
app/page.tsx (server)
└── HomeClient (client)         ← NEW wrapper
    ├── state: selectedId, hoveredId, bbox
    ├── MapContainer
    │   └── receives: onSelect, onHover, bbox
    └── ListingSidebar           ← NEW
        └── receives: listings, selectedId, onHover, onSelect
```

**Почему не Context:**
- Простой use case (1 уровень)
- Context = overhead для 2 компонентов
- Lifted state достаточно

---

### 3. Синхронизация

#### 3.1 Карта → Список

| Action | Map Event | Sidebar Effect |
|--------|-----------|----------------|
| Zoom/Pan | `onMove` | Filter listings by bbox |
| Click cluster | `onClusterClick` | Show cluster listings |
| Click point | `onPointClick` | Highlight + scroll to listing |
| Hover marker | `onMarkerHover` | Highlight listing row |

**Implementation:**
```typescript
// HomeClient.tsx
const [visibleListings, setVisibleListings] = useState<Listing[]>([]);
const [selectedId, setSelectedId] = useState<string | null>(null);

// Map updates bbox → filter listings
useEffect(() => {
  if (bbox) {
    const filtered = allListings.filter(l => isInBbox(l.centroid, bbox));
    setVisibleListings(filtered);
  }
}, [bbox]);
```

#### 3.2 Список → Карта

| Action | Sidebar Event | Map Effect |
|--------|---------------|------------|
| Hover listing | `onMouseEnter` | Highlight marker |
| Click listing | `onClick` | `flyTo` + open popup |
| Scroll | - | (no effect) |

**Implementation:**
```typescript
// ListingSidebar.tsx
<ListingCard
  onMouseEnter={() => setHoveredId(listing.id)}
  onMouseLeave={() => setHoveredId(null)}
  onClick={() => {
    setSelectedId(listing.id);
    map.flyTo(listing.centroid);
  }}
/>

// ClusterLayer.tsx
const isHighlighted = hoveredId === feature.properties.listing_id;
// → add CSS class for highlight
```

---

### 4. Архитектурные Риски

| Risk | Level | Mitigation |
|------|-------|------------|
| SSR boundary | ⚠️ Medium | HomeClient = 'use client' wrapper |
| Performance (re-renders) | ⚠️ Medium | useMemo for filtered listings |
| Data source | 🔴 High | Need unified listing source (now: mock) |
| Mobile UX | ⚠️ Medium | Bottom sheet vs sidebar |
| Debounce | 🟢 Low | Already in useClusters |

**Critical Risk:**
> Сейчас `/api/clusters` возвращает points из DB (houses).
> Sidebar показывает mock listings.
> **Нет единого источника данных!**

---

### 5. План Реализации

#### Phase 1 — MVP Sync (1-2 часа)

**Scope:**
- Создать `HomeClient.tsx` wrapper
- Добавить `ListingSidebar.tsx` (mock data)
- Lift state: `bbox`, `selectedId`, `hoveredId`
- Basic sync: bbox filter, click → flyTo

**Files:**
```
components/
├── HomeClient.tsx       ← NEW
└── sidebar/
    ├── ListingSidebar.tsx  ← NEW
    └── index.ts            ← NEW
```

**No backend changes.**

#### Phase 2 — Real Data (2-4 часа)

**Scope:**
- Унифицировать data model: `houses` → `listings`
- API: `/api/listings?bbox=...`
- Sidebar fetches from API
- Sync cluster points with sidebar listings

**Files:**
```
app/api/listings/route.ts  ← NEW
lib/listings.ts            ← NEW
```

#### Phase 3 — Polish (1-2 часа)

**Scope:**
- Mobile bottom sheet
- Hover highlight animation
- Scroll-to-view on select
- Loading states

---

### ИТОГ

## ✅ RECOMMENDED — doable без ломки архитектуры

**Phase 1 достаточно для MVP demo.**

**Критический момент:**
> Унификация данных (houses → listings) — обязательна для Phase 2.
> Без этого sync будет "fake" (mock data in sidebar).

---

**Рекомендация:**
1. ✅ Делаем Phase 1 (mock sync)
2. ⏸️ Phase 2 после demo/feedback
3. ⏸️ Phase 3 — polish

---

**Жду команду:**
- `D=>C: Phase 1 GO` — приступаю к реализации
- `D=>C: HOLD` — замораживаем MVP

🚀