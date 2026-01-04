Отлично! Получил задание **TASK 13.4**. Начинаю работу над синхронизацией Map ↔ Sidebar.Понял задачу! Анализирую код и вижу проблему:

**Корневая причина:**
- Map (clusters API) и Sidebar (houses API) работают независимо
- `listing_id` из clusters = `house.id`, но sidebar не знает какие ID видны на карте
- Нет синхронизации состояния

**План TASK 13.4:**

1. MapContainer → сообщает видимые houseIds наверх
2. HomeClient → фильтрует sidebar по visibleHouseIds
3. Cluster click → zoom in
4. Point click → select + zoom
5. Hover sync ← → sidebar---

## **C⇒D: TASK 13.4 Complete**

### ✅ Реализовано

| Компонент | Изменение |
|-----------|-----------|
| **types/map.ts** | +`houseId` в ClusterProperties, +`VisibleFeaturesEvent` |
| **lib/clustering.ts** | +`houseId` в features, +`extractVisibleHouseIds()` |
| **MapContainer.tsx** | +`onVisibleHouseIdsChange` callback для синхронизации |
| **ClusterLayer.tsx** | +hover/select highlighting с анимацией |
| **HomeClient.tsx** | +`visibleHouseIds` state, фильтрация sidebar |
| **ListingSidebar.tsx** | улучшенная подсветка, scroll-to-selected |

---

### 🔧 Ключевые изменения

**1. Единый источник правды:**
```ts
// HomeClient.tsx
const visibleListings = useMemo(() => {
  const idsSet = new Set(visibleHouseIds);
  return allHouses.filter(h => idsSet.has(h.id));
}, [allHouses, visibleHouseIds]);
```

**2. Cluster click → zoom in:**
```ts
const handleClusterClick = (feature) => {
  flyTo(center, zoom + 2);
};
```

**3. Point click → select + zoom:**
```ts
const handlePointClick = (feature) => {
  onPointSelect?.(houseId);
  if (viewport.zoom < 16) flyTo(center, 16);
};
```

---

### 📦 Установка

```bash
# Распаковать ZIP в корень solar-nextjs-template
unzip task13.4-map-sidebar-sync.zip

# Установить
chmod +x task13.4-fix/INSTALL.sh
./task13.4-fix/INSTALL.sh

# Build и проверка
pnpm build
pnpm dev
```

---

### 🧪 Тест-кейсы

| Действие | Ожидание | 
|----------|----------|
| Клик по 🟢 cluster | Zoom in к объектам |
| Клик по 🔵🟠🔴 точке | Select + zoom до 16+ |
| Hover на точке | Подсветка в sidebar |
| Hover в sidebar | Подсветка на карте |
| Точки видны → sidebar пуст | ❌ **НЕДОПУСТИМО** |

---

### ⚠️ Почему sidebar может быть пустым

**Теперь это нормальное поведение когда:**
- Zoom низкий → все точки в кластерах → `visibleHouseIds = []`
- При zoom 16+ кластеры распадаются → sidebar заполняется

**Это НЕнормально если:**
- Видны отдельные точки (не кластеры) но sidebar пуст → bug

---

Готово к GitHub push! 🚀
task13.4