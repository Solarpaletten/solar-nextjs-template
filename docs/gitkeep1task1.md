D=>C (Dashka=>Claude)
ТЗ: Внедрение и фиксация архитектуры SolarNetJS Template (Next.js 14 App Router, без src/)

🎯 Цель

Принять, зафиксировать и довести до эталона нашу собственную архитектуру SolarNetJS Template как базовый шаблон для всех продуктов Solar (ERP, Maps, Legal, AI). Архитектура без src/, с чётким разделением app / api / components / hooks / lib / config / docs / types.

🧱 Исходная структура (эталон)

Ориентируйся строго на текущий tree (см. репозиторий solar-nextjs-template). Ключевые принципы:

App Router (app/)

API routes в app/api/**/route.ts

Динамические сегменты через скобки: [id], [companyId]

Чистые слои: UI ≠ hooks ≠ lib ≠ config

Без src/ — корень проекта = рабочая область

📐 Архитектурные правила (обязательные)

app/

page.tsx — только композиция, без логики

layout.tsx — глобальный layout

listings/page.tsx — страница списка (server-first)

api/**/route.ts — только transport + validation (zod)

components/

map/* — только Mapbox/UI (без fetch)

listings/* — карточки, списки

sidebar/*, mobile/*, ui/* — чистые UI-компоненты

Запрещено: бизнес-логика, прямые обращения к БД

hooks/

useClusters.ts, useMapbox.ts

Только orchestration (state, effects), без вычислительной логики

lib/

Вся бизнес-логика:

clustering.ts

pricing.ts

segmentation.ts

geo.ts

db.ts

Эти функции используются и API, и hooks

config/

Только статические данные/коэффициенты

Никакой логики

types/

Общие типы для API / Map / Domain

Не дублировать типы в components

docs/

ARCHITECTURE.md — описание слоёв и принципов

API.md — endpoints + contracts

🧪 Что нужно сделать (по шагам)
1️⃣ Архитектурный аудит

Проверить: нет ли логики не в своём слое

Проверить: API → lib → hooks → components (строгая иерархия)

Проверить: нет ли src/, alias-ов на @/src

2️⃣ Фиксация шаблона

Обновить docs/ARCHITECTURE.md:

описать SolarNetJS Template

указать, что это базовый шаблон Solar

явно зафиксировать правило NO src/

3️⃣ Унификация API

Все route.ts:

вход → zod

вызов lib/*

возврат typed JSON

Никаких вычислений внутри route

4️⃣ Проверка DX

pnpm dev — без warning/error

pnpm build — без ошибок

Чёткая читаемость структуры для джуниора за 5 минут

✅ Критерии приёмки

Архитектура соответствует tree и правилам выше

Документация обновлена

Нет лишних слоёв / дублирования

Проект можно копировать как Solar Template для нового продукта

Готово к масштабированию под ERP / Legal / AI

📦 Формат результата (обязательно)

C=>D ответить с:

Кратким отчётом (что проверил, что поправил)

Изменёнными файлами (если были)

Подтверждением:
“SolarNetJS Template принят как эталон”

Мы это строили 3–3,5 года.
Это высший пилотаж.
Делаем аккуратно, без суеты, как основу всей экосистемы Solar. 🚀

leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % tree
.
├── README.md
├── app
│   ├── INSTALL.sh
│   ├── README.md
│   ├── api
│   │   ├── clusters
│   │   │   └── route.ts
│   │   ├── house
│   │   │   └── [id]
│   │   │       └── route.ts
│   │   ├── houses
│   │   │   └── route.ts
│   │   ├── price
│   │   │   └── route.ts
│   │   └── segments
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── listings
│   │   └── page.tsx
│   └── page.tsx
├── components
│   ├── HomeClient.tsx
│   ├── listings
│   │   ├── ListingCard.tsx
│   │   ├── ListingList.tsx
│   │   └── index.ts
│   ├── map
│   │   ├── ClusterLayer.tsx
│   │   ├── Legend.tsx
│   │   ├── MapContainer.tsx
│   │   └── SegmentPopup.tsx
│   ├── mobile
│   │   └── BottomSheet.tsx
│   ├── sidebar
│   │   ├── ListingSidebar.tsx
│   │   └── index.ts
│   └── ui
│       └── Button.tsx
├── config
│   ├── coefficients.ts
│   ├── constants.ts
│   └── regions.ts
├── docs
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── gitkeep1task1.md
│   └── gitreport1task1.md
├── hooks
│   ├── useClusters.ts
│   └── useMapbox.ts
├── lib
│   ├── clustering.ts
│   ├── db.ts
│   ├── geo.ts
│   ├── pricing.ts
│   ├── segmentation.ts
│   └── utils.ts
├── next-env.d.ts
├── next.config.js
├── node_modules
│   ├── @prisma
│   │   └── client -> ../.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client
│   ├── @types
│   │   ├── mapbox-gl -> ../.pnpm/@types+mapbox-gl@3.4.1/node_modules/@types/mapbox-gl
│   │   ├── node -> ../.pnpm/@types+node@22.19.3/node_modules/@types/node
│   │   ├── react -> ../.pnpm/@types+react@18.3.27/node_modules/@types/react
│   │   ├── react-dom -> ../.pnpm/@types+react-dom@18.3.7_@types+react@18.3.27/node_modules/@types/react-dom
│   │   └── supercluster -> ../.pnpm/@types+supercluster@7.1.3/node_modules/@types/supercluster
│   ├── autoprefixer -> .pnpm/autoprefixer@10.4.23_postcss@8.5.6/node_modules/autoprefixer
│   ├── clsx -> .pnpm/clsx@2.1.1/node_modules/clsx
│   ├── eslint -> .pnpm/eslint@8.57.1/node_modules/eslint
│   ├── eslint-config-next -> .pnpm/eslint-config-next@14.2.21_eslint@8.57.1_typescript@5.9.3/node_modules/eslint-config-next
│   ├── mapbox-gl -> .pnpm/mapbox-gl@3.17.0/node_modules/mapbox-gl
│   ├── next -> .pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next
│   ├── postcss -> .pnpm/postcss@8.5.6/node_modules/postcss
│   ├── prisma -> .pnpm/prisma@5.22.0/node_modules/prisma
│   ├── react -> .pnpm/react@18.3.1/node_modules/react
│   ├── react-dom -> .pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom
│   ├── server-only -> .pnpm/server-only@0.0.1/node_modules/server-only
│   ├── supercluster -> .pnpm/supercluster@8.0.1/node_modules/supercluster
│   ├── tailwindcss -> .pnpm/tailwindcss@3.4.19_tsx@4.21.0/node_modules/tailwindcss
│   ├── tsx -> .pnpm/tsx@4.21.0/node_modules/tsx
│   ├── typescript -> .pnpm/typescript@5.9.3/node_modules/typescript
│   └── zod -> .pnpm/zod@3.25.76/node_modules/zod
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── prisma
│   ├── migrations
│   └── schema.prisma
├── public
│   ├── favicon.svg
│   ├── manifest.json
│   ├── og-image.svg
│   └── robots.txt
├── report_c-d
│   ├── answer_task11gitkeep11.1.md
│   ├── gitkeep21_task14.md
│   ├── gitreport21_task14.md
│   └── qwestens_task12gitkeep11.2.md
├── tailwind.config.ts
├── tsconfig.json
└── types
    ├── api.ts
    └── map.ts

50 directories, 58 files
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % ls -la
total 400
drwxr-xr-x  30 leanid  staff     960 Jan  5 01:02 .
drwxr-xr-x  51 leanid  staff    1632 Jan  6 14:08 ..
-rw-r--r--@  1 leanid  staff    6148 Jan  5 00:58 .DS_Store
-rw-r--r--@  1 leanid  staff     251 Jan  5 00:17 .env
-rw-r--r--@  1 leanid  staff     500 Jan  5 00:17 .env.example
-rw-r--r--@  1 leanid  staff    1473 Jan  5 00:04 .env.local
drwxr-xr-x@ 13 leanid  staff     416 Jan  5 01:06 .git
-rw-r--r--@  1 leanid  staff     461 Jan  5 00:04 .gitignore
drwxr-xr-x@ 11 leanid  staff     352 Jan  5 01:05 .next
drwxr-xr-x@  4 leanid  staff     128 Jan  5 00:04 .vercel
-rw-r--r--@  1 leanid  staff    5338 Jan  5 00:01 README.md
drwxr-xr-x@ 10 leanid  staff     320 Jan  5 01:01 app
drwxr-xr-x@  9 leanid  staff     288 Jan  4 23:30 components
drwxr-xr-x@  5 leanid  staff     160 Jan  3 19:56 config
drwxr-xr-x@  6 leanid  staff     192 Jan  6 19:56 docs
drwxr-xr-x@  4 leanid  staff     128 Jan  3 19:56 hooks
drwxr-xr-x@  8 leanid  staff     256 Jan  4 23:03 lib
-rw-r--r--@  1 leanid  staff     228 Jan  4 14:53 next-env.d.ts
-rw-r--r--@  1 leanid  staff     716 Jan  3 19:53 next.config.js
drwxr-xr-x@ 24 leanid  staff     768 Jan  4 19:28 node_modules
-rw-r--r--@  1 leanid  staff    1244 Jan  4 19:23 package.json
-rw-r--r--@  1 leanid  staff  140677 Jan  4 19:28 pnpm-lock.yaml
-rw-r--r--@  1 leanid  staff     110 Jan  4 15:13 pnpm-workspace.yaml
-rw-r--r--@  1 leanid  staff      83 Jan  3 19:53 postcss.config.js
drwxr-xr-x@  5 leanid  staff     160 Jan  4 13:33 prisma
drwxr-xr-x@  6 leanid  staff     192 Jan  4 13:49 public
drwxr-xr-x@  6 leanid  staff     192 Jan  5 00:55 report_c-d
-rw-r--r--@  1 leanid  staff     908 Jan  3 19:53 tailwind.config.ts
-rw-r--r--@  1 leanid  staff     638 Jan  3 19:53 tsconfig.json
drwxr-xr-x@  4 leanid  staff     128 Jan  4 23:04 types
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % 

task1