🟢 **Dashka ⇒ Claude (D⇒C)**
**TASK 13.4 — Map ↔ Sidebar Real Sync (UX Core)**
Работаем строго по протоколу. Ниже — **чёткое техническое задание**, без философии.

---

# 🧭 TASK 13.4

## Map ↔ Sidebar Real Sync (Phase 2 — UX Core)

### 🎯 ЦЕЛЬ

Синхронизировать **карту, кластеры, точки и sidebar** так, чтобы поведение полностью соответствовало эталонному real-estate сервису:

* 🟢 **Кластеры** (с числом) → приближение (zoom in)
* 🔵🟢🟠🔴 **Точки** (price dots) → выбор объекта
* 📋 **Sidebar** → всегда показывает объекты, видимые на карте
* 🧠 **Единый state**: Map и Sidebar = одно состояние

---

## ❗ ТЕКУЩАЯ ПРОБЛЕМА (КОНТЕКСТ)

* Map использует `/api/clusters`
* Sidebar использует `/api/houses`
* Нет общего источника truth
* ID объектов не синхронизированы
* Sidebar пустой (`No listings in this area`), хотя точки есть

---

# 🧩 АРХИТЕКТУРНОЕ РЕШЕНИЕ (ОБЯЗАТЕЛЬНО)

### ✅ Единый источник правды: **House (house.id)**

* Все точки и кластеры **должны ссылаться на `houseId`**
* Sidebar фильтруется **только по тем houseId, которые видны на карте**

---

# 🧱 ЗАДАЧИ ПО КОМПОНЕНТАМ

---

## 1️⃣ API /api/clusters — ОБЯЗАТЕЛЬНО

### 🎯 Требование

Каждый `Feature` (cluster и point) **должен содержать `houseId`**

### Формат:

```ts
properties: {
  houseId: string | null   // null только для cluster
  isCluster: boolean
  count?: number           // для cluster
  priceSqm?: number
  priceSegment?: 'low' | 'mid' | 'upper' | 'premium'
}
```

* Для **cluster**:

  * `isCluster: true`
  * `count`
  * `houseId: null`
* Для **point**:

  * `isCluster: false`
  * `houseId` ОБЯЗАТЕЛЕН

---

## 2️⃣ HomeClient.tsx — ЕДИНЫЙ STATE

### Добавить состояния:

```ts
const [visibleHouseIds, setVisibleHouseIds] = useState<string[]>([])
const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null)
const [hoveredHouseId, setHoveredHouseId] = useState<string | null>(null)
```

---

### Логика:

#### 📍 При изменении bbox / zoom:

* Получить features с карты
* Извлечь все `houseId` (только points)
* Обновить `visibleHouseIds`

```ts
setVisibleHouseIds([...new Set(houseIds)])
```

---

#### 🟢 Клик по cluster:

```ts
if (feature.properties.isCluster) {
  map.easeTo({
    center: feature.geometry.coordinates,
    zoom: currentZoom + 1
  })
}
```

---

#### 🔵🟢🟠🔴 Клик по точке:

```ts
setSelectedHouseId(feature.properties.houseId)
map.easeTo({ center, zoom: Math.max(currentZoom, 16) })
```

---

#### Hover по точке:

```ts
setHoveredHouseId(houseId)
```

---

## 3️⃣ Sidebar — ФИЛЬТРАЦИЯ

### Sidebar получает:

```ts
listings={houses.filter(h => visibleHouseIds.includes(h.id))}
selectedId={selectedHouseId}
hoveredId={hoveredHouseId}
```

➡️ **Если есть точки на карте — sidebar НЕ может быть пустым**

---

## 4️⃣ Sidebar ↔ Map (двусторонняя связь)

### При клике на карточку в Sidebar:

```ts
onListingClick(listing) {
  setSelectedHouseId(listing.id)
  map.easeTo({
    center: listing.centroid,
    zoom: 16
  })
}
```

---

## 5️⃣ UX — ОБЯЗАТЕЛЬНО

| Действие           | Результат           |
| ------------------ | ------------------- |
| Клик по 🟢 cluster | zoom in             |
| Клик по точке      | zoom + select       |
| Hover по точке     | подсветка в sidebar |
| Hover по sidebar   | подсветка точки     |
| Sidebar пуст       | ❌ запрещено         |

---

# 📦 ФАЙЛЫ ДЛЯ РАБОТЫ

Claude, работаешь **ТОЛЬКО** здесь:

* `components/HomeClient.tsx`
* `components/map/ClusterLayer.tsx`
* `components/sidebar/ListingSidebar.tsx`
* `app/api/clusters/route.ts`
* (если нужно) `types/map.ts`

---

# ✅ КРИТЕРИИ ПРИЁМКИ

* [ ] Sidebar всегда синхронизирован с Map
* [ ] Кластеры приближают карту
* [ ] Точки выбирают объект
* [ ] Sidebar реагирует на hover / click
* [ ] Нет дублирующих источников данных
* [ ] Нет `No listings in this area`, если точки есть

---

# 🚫 ЧТО НЕЛЬЗЯ ДЕЛАТЬ

* ❌ Не создавать новые API
* ❌ Не дублировать данные
* ❌ Не хранить состояние в Sidebar
* ❌ Не ломать существующий build

---

## 🧠 ФИНАЛ

**Это ядро UX продукта.**
Сделай **чисто, предсказуемо, без костылей**.

После выполнения —
**C⇒D: отчёт + diff файлов.**

2
task 13.4

leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % pnpm build

> solar-template@1.0.0 build /Users/leanid/Documents/ITproject/solar-nextjs-template
> next build

  ▲ Next.js 14.2.21
  - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types  ..Failed to compile.

./components/HomeClient.tsx:131:44
Type error: Argument of type 'BoundingBox | null' is not assignable to parameter of type 'BoundingBox'.
  Type 'null' is not assignable to type 'BoundingBox'.

  129 |       try {
  130 |         const response = await fetch(
> 131 |           `/api/houses?bbox=${bboxToString(bbox)}&limit=500`,
      |                                            ^
  132 |           { signal: controller.signal }
  133 |         );
  134 |
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % 
task 13.4