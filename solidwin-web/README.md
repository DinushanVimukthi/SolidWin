# Solidwin Web

Public website for Solidwin (Construction, Ready-Mix Concrete, Hardware).
Built with Next.js (App Router), TypeScript and vanilla CSS Modules.

Requirements: see `../Documentation/Solidwin_Developer_Requirements_and_Design_Handover.md`.
Delivery plan: see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

> This Next.js version (16.x) has Cache Components enabled and differs from older
> versions. Read `node_modules/next/dist/docs/` before changing framework-level code.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script                 | Purpose                    |
| ---------------------- | -------------------------- |
| `npm run dev`          | Development server         |
| `npm run build`        | Production build           |
| `npm run lint`         | ESLint                     |
| `npm run typecheck`    | TypeScript, no emit        |
| `npm test`             | Unit tests (Vitest)        |
| `npm run format`       | Prettier write             |
| `npm run format:check` | Prettier check (CI)        |

## Environment variables

| Variable                       | Purpose                              |
| ------------------------------ | ------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`         | Canonical URL (metadata, sitemap)    |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`  | Floating WhatsApp action target      |

## Status

| Phase                               | State    |
| ----------------------------------- | -------- |
| 0 Discovery & Tokens                | Complete |
| 1 Foundation & Tooling              | Complete |
| 2 UI Kit Primitives                 | Complete |
| 3 Core Pages (Home, About, etc.)    | Complete |
| 4 Divisions & Calculators           | Complete |
| 5 Hardware, Pavers & Equipment      | Complete |
| 6 Portfolio & Before/After Slider   | Complete |
| 7 Multi-Step RFQ & 25MB Upload      | Complete |
| 8 Cross-Cutting (Chat, Sitemap, SEO)| Complete |
| 9 Verification & Documentation      | Complete |

Design tokens in `src/styles/tokens.css` are **provisional** until exact values are
extracted from Figma Dev Mode (this needs a signed-in Figma session).
