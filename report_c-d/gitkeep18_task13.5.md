leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % pnpm build                                       

> solar-template@1.0.0 build /Users/leanid/Documents/ITproject/solar-nextjs-template
> next build

  ▲ Next.js 14.2.21
  - Environments: .env

   Creating an optimized production build ...
Failed to compile.

./app/api/price/route.ts
Error: 
  x Expected a semicolon
     ,-[/Users/leanid/Documents/ITproject/solar-nextjs-template/app/api/price/route.ts:145:1]
 145 |         expiresAt,
 146 |       },
 147 |     });
 148 |   });
     :    ^
 149 | } catch {
 150 |   console.warn('Could not cache price estimate');
 151 | }
     `----

  x Expression expected
     ,-[/Users/leanid/Documents/ITproject/solar-nextjs-template/app/api/price/route.ts:145:1]
 145 |         expiresAt,
 146 |       },
 147 |     });
 148 |   });
     :    ^
 149 | } catch {
 150 |   console.warn('Could not cache price estimate');
 151 | }
     `----

Caused by:
    Syntax Error

Import trace for requested module:
./app/api/price/route.ts


> Build failed because of webpack errors
 ELIFECYCLE  Command failed with exit code 1.
leanid@MacBook-Pro-LeanidHamburg solar-nextjs-template % 
13.5 task 