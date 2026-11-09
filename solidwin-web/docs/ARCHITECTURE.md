# Architecture

## Layers and dependency rule

```
app  →  features  →  components  →  lib / types
```

Dependencies only point right. `components` never import from `features`; features
never import from `app`. Features do not import each other's internals (use their
public `index.ts`).

| Layer          | Responsibility                                              |
| -------------- | ----------------------------------------------------------- |
| `src/app`      | Routes, layouts, metadata. Thin: compose features only      |
| `src/features` | Domain modules: UI, logic, schemas and tests together       |
| `src/components` | Reusable UI (`ui/`) and page chrome (`layout/`)           |
| `src/services` | Interfaces and implementations for external systems         |
| `src/lib`      | Pure utilities, config, constants                           |
| `src/styles`   | Design tokens and global CSS                                |

## Conventions

- Server Components by default. Add `"use client"` only for interactive leaves.
- CSS Modules per component; only consume variables from `tokens.css`.
- Calculators are pure functions with unit tests; assumptions are named constants.
- External systems (inquiries, uploads, catalogue) are behind service interfaces so
  mocks can be replaced by real APIs without UI changes.
- Analytics events go through a typed `track()` facade and never carry personal data.
- Accessibility: landmarks, visible focus, keyboard-operable widgets, labelled fields.

## Next.js 16 notes (verified in this repo)

- **Cache Components is enabled.** `new Date()` and other unstable values cannot be
  read during prerender in server or client components. Defer them to `useEffect`
  (see `CurrentYear.tsx`), wrap in `<Suspense>`, or use `"use cache"`.
- Route props use generated types such as `LayoutProps<"/">`; `params` are async.
- Image and sitemap defaults changed in v16. Check the bundled docs before relying on them.

## Delivery plan

See the approved plan: phases 0 to 9 (discovery, foundation, UI kit, core pages,
divisions and calculators, hardware, portfolio, RFQ, cross-cutting, hardening).
