export type ProjectSector = "residential" | "commercial" | "industrial" | "infrastructure";

export interface ProjectItem {
  slug: string;
  title: string;
  sector: ProjectSector;
  location: string;
  completionDate: string;
  scope: string;
  description: string;
  featuredImage: string;
  gallery: string[];
  hasBeforeAfter?: boolean;
  beforeImage?: string;
  afterImage?: string;
}

export const PROJECTS: readonly ProjectItem[] = [
  {
    slug: "modern-residence-apex",
    title: "Apex Horizon Luxury Villa",
    sector: "residential",
    location: "Greenfield Hills",
    completionDate: "June 2026",
    scope: "Turnkey Design & Build, 650 m² luxury villa, pool & hardscaping",
    description:
      "A turnkey architectural showcase featuring post-tensioned concrete slabs, high-spec acoustic partitions, and expansive double-glazed curtain walls.",
    featuredImage: "/images/service-residential.jpg",
    gallery: [
      "/images/service-residential.jpg",
      "/images/hero-construction.jpg",
      "/images/service-turnkey.jpg",
    ],
    hasBeforeAfter: true,
    beforeImage: "/images/service-industrial.jpg",
    afterImage: "/images/service-residential.jpg",
  },
  {
    slug: "metro-tower-commercial",
    title: "Metro Plaza Commercial Headquarters",
    sector: "commercial",
    location: "Central Business District",
    completionDate: "January 2026",
    scope: "G+14 Reinforced Concrete Frame, 12,000 m³ G35 Concrete, Turnkey Facade",
    description:
      "Delivered with continuous batching plant dispatch and precision pump placement, completing the structural core two weeks ahead of schedule.",
    featuredImage: "/images/service-commercial.jpg",
    gallery: [
      "/images/service-commercial.jpg",
      "/images/service-turnkey.jpg",
      "/images/hero-construction.jpg",
    ],
    hasBeforeAfter: true,
    beforeImage: "/images/hero-construction.jpg",
    afterImage: "/images/service-commercial.jpg",
  },
  {
    slug: "logistics-hub-east",
    title: "Eastern Logistics & Warehousing Hub",
    sector: "industrial",
    location: "Industrial Corridor Sector 4",
    completionDate: "September 2025",
    scope: "Heavy industrial floor slabs, 25,000 m² 80mm interlocking traffic pavers",
    description:
      "Engineered for high-tonnage container forklift operations with laser-guided screed floors and certified 50 N/mm² interlocking pavers.",
    featuredImage: "/images/service-industrial.jpg",
    gallery: [
      "/images/service-industrial.jpg",
      "/images/service-commercial.jpg",
      "/images/hero-construction.jpg",
    ],
  },
  {
    slug: "coastal-bypass-bridge",
    title: "North Coastal Arterial Bridge",
    sector: "infrastructure",
    location: "North Coast Link",
    completionDate: "April 2025",
    scope: "Cast-in-situ reinforced concrete abutments, high-durability marine concrete",
    description:
      "Marine-grade concrete formulated with silica fume and corrosion inhibitors, poured with specialized boom pumps over the tidal zone.",
    featuredImage: "/images/hero-construction.jpg",
    gallery: [
      "/images/hero-construction.jpg",
      "/images/service-industrial.jpg",
      "/images/service-turnkey.jpg",
    ],
  },
];
