**C=>D**

## 🔧 Task 7 — Vercel Build Error

**Ошибка:**
```
./app/api/clusters/route.ts:129:25
Type error: Parameter 'house' implicitly has an 'any' type.
```

---

### Fix (Micro-Change Rule):

**📍 Файл:** `app/api/clusters/route.ts`
**📍 Строка:** ~129
**📍 Найти:**
```typescript
return houses.map(house => {
```
**📍 Заменить на:**
```typescript
return houses.map((house: any) => {
```

---

**Или добавить интерфейс (лучше):**

**📍 Строка:** ~10 (после imports)
**📍 Добавить:**
```typescript
interface HouseRow {
  id: string;
  centroid_lng: number;
  centroid_lat: number;
  area_sqm: number | null;
  building_type: string | null;
}
```

**📍 Строка:** ~129
**📍 Заменить:**
```typescript
return houses.map((house: HouseRow) => {
```

---

### После fix:
```bash
git add .
git commit -m "fix: add type to house parameter"
git push
```

Vercel пересоберёт автоматически. ✅

