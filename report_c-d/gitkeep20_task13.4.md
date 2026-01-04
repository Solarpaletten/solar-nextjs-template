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