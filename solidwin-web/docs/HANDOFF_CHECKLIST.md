# Solidwin Frontend Handoff Checklist

This checklist tracks the delivery of the Solidwin Multi-Division Corporate Website frontend against the supplied Figma designs and developer requirements handover.

---

## 1. Route & Screen Implementation Status

| Screen / Figma Frame | Route | Status | Key Features Delivered |
| :--- | :--- | :--- | :--- |
| **Home Page** | `/` | Complete | Responsive brand header, curved purple hero cut-out, 4 service cards, 3 division cards, CTA band, multi-column corporate footer, floating assistant launcher. |
| **About Us** | `/about` | Complete | Brand ethos, 3 core company values (Quality, Safety, Partnership), integrated multi-division capabilities. |
| **Resources & HSEQ** | `/resources` | Complete | HSEQ certifications, Company Profile PDF download section, accessible native accordion FAQ. |
| **Contact & Locations** | `/contact` | Complete | Direct inquiry contact form with client/server validation, branch opening hours, contact details. |
| **Construction Services** | `/divisions/construction` | Complete | Specialisation cards (Residential, Commercial, Industrial, Turnkey), 4-step execution process (Discuss, Plan, Build, Handover), Brick/Block calculator, Plaster/Paint estimator. |
| **Ready-Mix Concrete** | `/divisions/ready-mix` | Complete | Certified grade catalogue (G15–G35), Concrete Volume Calculator with shape switching and 5% wastage toggle, "From Batch to Build" 3-step process, dispatch radius zones, FAQ. |
| **Hardware & Rentals** | `/divisions/hardware` | Complete | Hub overview for manufacturing and equipment hire, store & trade desk information, brand partner logo grid. |
| **Blocks & Pavers** | `/divisions/hardware/blocks-pavers` | Complete | Masonry product catalogue with category filter, search bar, quantity adjusters, and interactive Quote Basket sidebar with bulk quote forwarding. |
| **Equipment Rentals** | `/divisions/hardware/equipment` | Complete | Plant machinery fleet catalogue with technical specs, minimum hire durations, terms, and machine hire inquiry links. |
| **Portfolio Grid** | `/projects` | Complete | Interactive sector filtering (All, Residential, Commercial, Industrial, Infrastructure), project card grid with metadata. |
| **Project Details** | `/projects/[slug]` | Complete | Overview, scope, client/date specs, touch & keyboard accessible **Before/After comparison slider**, full photo gallery, and related case studies. |
| **Request for Quote** | `/request-quote` | Complete | Multi-division RFQ form supporting Construction, Ready-Mix, and Hardware options; prefill support from calculators/basket; 25 MB file upload; submission confirmation with lead reference number. |
| **404 Page** | `/_not-found` | Complete | Accessible, brand-aligned 404 page with return to home navigation. |
| **XML Sitemap** | `/sitemap.xml` | Complete | Dynamic XML sitemap covering all core pages and dynamic project case studies. |
| **Robots Policy** | `/robots.txt` | Complete | Automated indexing controls allowing production indexing and disallowing preview environments. |

---

## 2. Verification & Quality Acceptance

- **Automated Tests:** 19 unit tests passing (`vitest run`).
- **TypeScript:** Strict typecheck passing with zero errors (`tsc --noEmit`).
- **ESLint:** Zero warnings and zero errors (`eslint`).
- **Production Build:** Next.js 16 App Router build successful (`next build`) with static generation and partial prerendering.
- **Accessibility:** Semantic HTML landmarks (`header`, `main`, `footer`, `nav`, `section`, `article`, `aside`), visible focus indicators, native `<details>` for FAQs, accessible input labeling and error announcements.
