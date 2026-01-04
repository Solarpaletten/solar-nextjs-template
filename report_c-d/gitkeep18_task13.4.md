leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % pnpm build

> solar-template@1.0.0 build /Users/leanid/Documents/ITproject/solar-nextjs-template
> next build

  ▲ Next.js 14.2.21
  - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types  ..Failed to compile.

./app/api/price/route.ts:109:26
Type error: Property 'updatedAt' does not exist on type '{ id: string; houseId: string; priceSqm: Decimal; priceTotal: Decimal | null; method: string; confidence: Decimal; details: JsonValue; calculatedAt: Date; expiresAt: Date; }'.

  107 |     });
  108 |
> 109 |     if (cached && cached.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      |                          ^
  110 |       return {
  111 |         priceSqm: Number(cached.priceSqm),
  112 |         priceTotal: cached.price ? Number(cached.price) : null,
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % 

13.4 Task