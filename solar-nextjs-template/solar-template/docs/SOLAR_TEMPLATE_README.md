# 🏠 Solar Next.js Template v1

## Swiss Real Estate Visualization Platform

---

## 🎯 Философия

> **"Открыл → Понял"**

Solar Template создан для **скорости разработки** и **минимальной когнитивной нагрузки**.

### Принципы:
- **Один проект** — нет monorepo, нет packages
- **Один package.json** — нет зависимостей между пакетами
- **Один tsconfig** — единая конфигурация TypeScript
- **Говорящие имена** — папка = функция

---

## 📁 Структура проекта

```
solar-template/
│
├── 📁 app/                 # Next.js App Router (routes)
│   ├── page.tsx            # / — главная страница
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles
│   ├── listings/           # /listings — объявления
│   └── api/                # API endpoints
│       ├── clusters/       # GET /api/clusters
│       ├── segments/       # GET /api/segments
│       └── houses/         # GET /api/houses
│
├── 📁 components/          # React компоненты
│   ├── map/                # Карта и кластеры
│   │   ├── MapContainer.tsx
│   │   ├── ClusterLayer.tsx
│   │   ├── Legend.tsx
│   │   └── SegmentPopup.tsx
│   ├── listings/           # Объявления
│   └── ui/                 # Переиспользуемые UI
│       └── Button.tsx
│
├── 📁 lib/                 # Бизнес-логика
│   ├── db.ts               # Prisma client
│   ├── pricing.ts          # Ценообразование
│   ├── segmentation.ts     # Ценовые сегменты
│   ├── clustering.ts       # Supercluster
│   ├── geo.ts              # GIS утилиты
│   └── utils.ts            # Хелперы
│
├── 📁 config/              # Конфигурация
│   ├── regions.ts          # Регионы (Monthey, Sion...)
│   ├── coefficients.ts     # Коэффициенты цен
│   ├── constants.ts        # Константы приложения
│   └── segments.ts         # Настройки сегментов
│
├── 📁 hooks/               # React hooks
│   ├── useMapbox.ts        # Mapbox интеграция
│   └── useClusters.ts      # Загрузка кластеров
│
├── 📁 types/               # TypeScript типы
│   ├── map.ts              # Типы карты
│   └── api.ts              # Типы API
│
├── 📁 prisma/              # Database
│   └── schema.prisma       # Схема БД
│
├── 📁 public/              # Static files
├── 📁 docs/                # Документация
│
├── package.json            # 📦 ОДИН
├── tsconfig.json           # 📦 ОДИН
├── next.config.js
├── tailwind.config.ts
└── README.md
```

---

## 🚀 Быстрый старт

### 1. Клонировать шаблон

```bash
git clone https://github.com/your/solar-template.git my-project
cd my-project
```

### 2. Установить зависимости

```bash
pnpm install
```

### 3. Настроить окружение

```bash
cp .env.example .env.local
# Заполнить DATABASE_URL и NEXT_PUBLIC_MAPBOX_TOKEN
```

### 4. Инициализировать базу данных

```bash
pnpm db:push
```

### 5. Запустить

```bash
pnpm dev
```

Открыть [http://localhost:3000](http://localhost:3000)

---

## 📍 Правило "Открыл → Понял"

### Где искать?

| Вопрос | Ответ |
|--------|-------|
| Где логика ценообразования? | `lib/pricing.ts` |
| Где компоненты карты? | `components/map/` |
| Где API для кластеров? | `app/api/clusters/route.ts` |
| Где конфигурация регионов? | `config/regions.ts` |
| Где типы для карты? | `types/map.ts` |
| Где хук для Mapbox? | `hooks/useMapbox.ts` |
| Где Prisma схема? | `prisma/schema.prisma` |

### Импорты (стандарт Solar)

```typescript
// ✅ ПРАВИЛЬНО — все через @/
import { prisma } from '@/lib/db';
import { getSegment } from '@/lib/segmentation';
import { REGIONS } from '@/config/regions';
import { Button } from '@/components/ui/Button';

// ❌ НЕПРАВИЛЬНО
import { prisma } from '../../../lib/db';
import { getSegment } from '@solar/pricing';
```

---

## 🎨 Ценовые сегменты

| Сегмент | Цвет | CHF/m² | Описание |
|---------|------|--------|----------|
| 🟢 low | `#22c55e` | < 6'000 | Доступное жильё |
| 🔵 mid | `#3b82f6` | 6'000-8'000 | Средний рынок |
| 🟠 upper | `#f97316` | 8'000-10'000 | Выше среднего |
| 🔴 premium | `#ef4444` | > 10'000 | Премиум |

---

## 🗺️ Регионы (Valais)

| ID | Название | Координаты |
|----|----------|------------|
| `monthey` | Monthey | 46.255, 6.954 |
| `martigny` | Martigny | 46.102, 7.072 |
| `sion` | Sion | 46.233, 7.360 |

---

## 📡 API Endpoints

### GET /api/clusters

```bash
GET /api/clusters?bbox=6.90,46.22,7.00,46.29&zoom=14
```

### GET /api/segments

```bash
GET /api/segments?cluster_id=1
```

---

## 🔧 Как добавить новый домен

### Пример: добавить VAT (налоги)

1. **Логика** → `lib/vat.ts`
2. **Типы** → `types/vat.ts`
3. **Конфигурация** → `config/vat-rates.ts`
4. **API** → `app/api/vat/route.ts`
5. **Компоненты** → `components/vat/`
6. **Hook** → `hooks/useVat.ts`

```
solar/
├── lib/vat.ts              # Расчёты VAT
├── types/vat.ts            # Типы
├── config/vat-rates.ts     # Ставки по кантонам
├── app/api/vat/route.ts    # API endpoint
├── components/vat/
│   └── VatCalculator.tsx
└── hooks/useVat.ts
```

---

## 📦 Скрипты

| Команда | Описание |
|---------|----------|
| `pnpm dev` | Запуск dev-сервера |
| `pnpm build` | Production сборка |
| `pnpm start` | Запуск production |
| `pnpm lint` | Проверка кода |
| `pnpm typecheck` | Проверка типов |
| `pnpm db:push` | Синхронизация схемы БД |
| `pnpm db:studio` | Открыть Prisma Studio |

---

## 🏗️ Технологии

| Технология | Версия | Назначение |
|------------|--------|------------|
| Next.js | 14 | React framework |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Стилизация |
| Mapbox GL | 3 | Карты |
| Supercluster | 8 | Кластеризация |
| Prisma | 5 | ORM |
| PostgreSQL | 16 | База данных |
| PostGIS | 3.4 | Геоданные |

---

## 📚 Документация

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — архитектура
- [API.md](docs/API.md) — спецификация API
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) — как контрибьютить

---

## 👥 Команда

| Role | Name |
|------|------|
| 🏗️ Architect | Leanid |
| 👔 Product Manager | Dashka |
| 🤖 AI Engineer | Claude |

---

## 📄 License

MIT

---

**Built with ❤️ for Swiss Real Estate Market**

*Solar Template v1 — January 2026*
