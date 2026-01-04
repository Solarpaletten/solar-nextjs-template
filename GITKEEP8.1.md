
D=>C task6 отправлен Посмотри GITKEEP*.md и приступай. подключись через project_knowledge_search GitHub https://github.com/Solarpaletten/solar-nextjs-template 

  130 |         return {
  131 |           id: house.id,
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % pnpm dev

> solar-template@1.0.0 dev /Users/leanid/Documents/ITproject/solar-nextjs-template
> next dev

  ▲ Next.js 14.2.21
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Starting...
 ✓ Ready in 1096ms
 ○ Compiling / ...
 ✓ Compiled / in 3.1s (504 modules)
 GET / 200 in 3247ms
 ○ Compiling /_not-found ...
 ✓ Compiled /_not-found in 610ms (498 modules)
 GET /apple-touch-icon-precomposed.png 404 in 632ms
 GET /apple-touch-icon.png 404 in 630ms
 ✓ Compiled /api/clusters in 54ms (277 modules)
 ⨯ Error: Cannot find module '.prisma/client/default'
Require stack:
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:55:36
    at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
    at Module._load (node:internal/modules/cjs/loader:1226:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js:2:6)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at @prisma/client (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:22:18)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./lib/db.ts:6:72)
    at (rsc)/./lib/db.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:82:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./app/api/clusters/route.ts:6:65)
    at (rsc)/./app/api/clusters/route.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:62:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:139)
    at (rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:52:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:112:39)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:199
    at __webpack_require__.X (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:168:21)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:47
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:116:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js:109:84)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:84
    at async loadComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:26)
    at async DevServer.findPageComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/next-server.js:709:36)
    at async DevServer.findPageComponents (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/next-dev-server.js:577:20) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js'
  ],
  page: '/api/clusters'
}
 ○ Compiling /_error ...
 ✓ Compiled /_error in 821ms (746 modules)
 GET /api/clusters?bbox=6.912028793336788,46.24365250899396,6.995971206667662,46.277687939339984&zoom=14 500 in 962ms
 ⨯ Error: Cannot find module '.prisma/client/default'
Require stack:
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:55:36
    at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
    at Module._load (node:internal/modules/cjs/loader:1226:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js:2:6)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at @prisma/client (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:22:18)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./lib/db.ts:6:72)
    at (rsc)/./lib/db.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:82:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./app/api/clusters/route.ts:6:65)
    at (rsc)/./app/api/clusters/route.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:62:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:139)
    at (rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:52:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:112:39)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:199
    at __webpack_require__.X (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:168:21)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:47
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:116:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js:109:84)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:84
    at async loadComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:26)
    at async DevServer.findPageComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/next-server.js:709:36)
    at async DevServer.findPageComponents (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/next-dev-server.js:577:20) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js'
  ],
  page: '/api/clusters'
}
 GET /api/clusters?bbox=6.920975735249243,46.24596330401974,6.987537506129058,46.27295214750109&zoom=14 500 in 19ms
 ⨯ Error: Cannot find module '.prisma/client/default'
Require stack:
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:55:36
    at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
    at Module._load (node:internal/modules/cjs/loader:1226:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js:2:6)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at @prisma/client (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:22:18)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./lib/db.ts:6:72)
    at (rsc)/./lib/db.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:82:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./app/api/clusters/route.ts:6:65)
    at (rsc)/./app/api/clusters/route.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:62:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:139)
    at (rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:52:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:112:39)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:199
    at __webpack_require__.X (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:168:21)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:47
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:116:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js:109:84)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:84
    at async loadComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:26)
    at async DevServer.findPageComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/next-server.js:709:36)
    at async DevServer.findPageComponents (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/next-dev-server.js:577:20) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js'
  ],
  page: '/api/clusters'
}
 GET /api/clusters?bbox=6.934211625709622,46.24965106648244,6.976502031848241,46.266798970106805&zoom=15 500 in 10ms
 ⨯ Error: Cannot find module '.prisma/client/default'
Require stack:
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:55:36
    at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
    at Module._load (node:internal/modules/cjs/loader:1226:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js:2:6)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at @prisma/client (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:22:18)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./lib/db.ts:6:72)
    at (rsc)/./lib/db.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:82:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./app/api/clusters/route.ts:6:65)
    at (rsc)/./app/api/clusters/route.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:62:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:139)
    at (rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:52:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:112:39)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:199
    at __webpack_require__.X (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:168:21)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:47
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:116:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js:109:84)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:84
    at async loadComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:26)
    at async DevServer.findPageComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/next-server.js:709:36)
    at async DevServer.findPageComponents (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/next-dev-server.js:577:20) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js'
  ],
  page: '/api/clusters'
}
 GET /api/clusters?bbox=6.921689906689863,46.246838788116065,6.986894945776157,46.2732772272754&zoom=14 500 in 12ms
 ⨯ Error: Cannot find module '.prisma/client/default'
Require stack:
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:55:36
    at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
    at Module._load (node:internal/modules/cjs/loader:1226:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js:2:6)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at @prisma/client (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:22:18)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./lib/db.ts:6:72)
    at (rsc)/./lib/db.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:82:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./app/api/clusters/route.ts:6:65)
    at (rsc)/./app/api/clusters/route.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:62:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:139)
    at (rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:52:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:112:39)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:199
    at __webpack_require__.X (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:168:21)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:47
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:116:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js:109:84)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:84
    at async loadComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:26)
    at async DevServer.findPageComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/next-server.js:709:36)
    at async DevServer.findPageComponents (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/next-dev-server.js:577:20) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js'
  ],
  page: '/api/clusters'
}
 GET /api/clusters?bbox=6.91216624232834,46.24469975241695,6.994799501346591,46.27820389330637&zoom=14 500 in 10ms
 ⨯ Error: Cannot find module '.prisma/client/default'
Require stack:
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:55:36
    at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
    at Module._load (node:internal/modules/cjs/loader:1226:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js:2:6)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at @prisma/client (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:22:18)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./lib/db.ts:6:72)
    at (rsc)/./lib/db.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:82:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./app/api/clusters/route.ts:6:65)
    at (rsc)/./app/api/clusters/route.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:62:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:139)
    at (rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:52:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:112:39)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:199
    at __webpack_require__.X (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:168:21)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:47
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:116:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js:109:84)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:84
    at async loadComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:26)
    at async DevServer.findPageComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/next-server.js:709:36)
    at async DevServer.findPageComponents (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/next-dev-server.js:577:20) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js'
  ],
  page: '/api/clusters'
}
 GET /api/clusters?bbox=6.877489628570856,46.24165187004803,7.008356681920219,46.29470617203742&zoom=13 500 in 11ms
 ⨯ Error: Cannot find module '.prisma/client/default'
Require stack:
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js
- /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1420:15)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:55:36
    at defaultResolveImpl (node:internal/modules/cjs/loader:1058:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1063:22)
    at Module._load (node:internal/modules/cjs/loader:1226:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js:2:6)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at @prisma/client (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:22:18)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./lib/db.ts:6:72)
    at (rsc)/./lib/db.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:82:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./app/api/clusters/route.ts:6:65)
    at (rsc)/./app/api/clusters/route.ts (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:62:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at eval (webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!:15:139)
    at (rsc)/./node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fclusters%2Froute&page=%2Fapi%2Fclusters%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fclusters%2Froute.ts&appDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fleanid%2FDocuments%2FITproject%2Fsolar-nextjs-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:52:1)
    at __webpack_require__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:33:42)
    at __webpack_exec__ (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:112:39)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:199
    at __webpack_require__.X (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/webpack-runtime.js:168:21)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:113:47
    at Object.<anonymous> (/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js:116:3)
    at Module._compile (node:internal/modules/cjs/loader:1760:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1892:10)
    at Module.load (node:internal/modules/cjs/loader:1480:32)
    at Module._load (node:internal/modules/cjs/loader:1299:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:245:24)
    at Module.require (node:internal/modules/cjs/loader:1503:12)
    at mod.require (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require-hook.js:65:28)
    at require (node:internal/modules/helpers:152:16)
    at requirePage (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js:109:84)
    at /Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:84
    at async loadComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js:98:26)
    at async DevServer.findPageComponentsImpl (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/next-server.js:709:36)
    at async DevServer.findPageComponents (/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/next-dev-server.js:577:20) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client/default.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/.next/server/app/api/clusters/route.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/require.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/load-components.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/build/utils.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-middleware.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/dev/hot-reloader-webpack.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/router-server.js',
    '/Users/leanid/Documents/ITproject/solar-nextjs-template/node_modules/.pnpm/next@14.2.21_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/server/lib/start-server.js'
  ],
  page: '/api/clusters'
}
 GET /api/clusters?bbox=6.8866901956238,46.24477632145687,7.002909828405848,46.29189233740297&zoom=14 500 in 11ms
^C
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % git add .
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % git commit -m "fix: add clsx dependency"
[main b70281a] fix: add clsx dependency
 Committer: LeanidHamburg <leanid@MacBook-Pro-LeanidHamburg.local>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly. Run the
following command and follow the instructions in your editor to edit
your configuration file:

    git config --global --edit

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author

 4 files changed, 264 insertions(+), 9 deletions(-)
 create mode 100644 utils1.ts
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % 