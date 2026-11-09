export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "Solidwin",
  tagline: "Building stronger spaces",
  description:
    "Solidwin delivers construction services, ready-mix concrete, and hardware supply with blocks, pavers and equipment rental.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+18005557654",
  tradeCounterPhone: "+1 (800) 555-7654",
  tradeCounterPhoneRaw: "+18005557654",
  batchingPlant: {
    name: "Solidwin Central Batching Plant",
    address: "Plot 88, Heavy Industrial Zone, Coastal Highway",
    coordinates: "24.8607° N, 67.0011° E",
    lat: 24.8607,
    lng: 67.0011,
    zones: [
      { km: 15, label: "Zone 1 (Express)", transitMin: 45, description: "Within 15 km: Rapid express pour, optimal hydration" },
      { km: 30, label: "Zone 2 (Standard)", transitMin: 70, description: "15–30 km: Standard transit with slump monitoring" },
      { km: 45, label: "Zone 3 (Extended)", transitMin: 90, description: "30–45 km: Extended dispatch (retarder admixture recommended)" },
    ],
  },
} as const;

export const primaryNav: readonly NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Divisions", href: "/divisions/construction" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export const divisionNav: readonly NavItem[] = [
  { label: "Construction Services", href: "/divisions/construction" },
  { label: "Ready-Mix Concrete", href: "/divisions/ready-mix" },
  { label: "Blocks & Pavers", href: "/divisions/hardware/blocks-pavers" },
  { label: "Equipment Rentals", href: "/divisions/hardware/equipment" },
  { label: "Precast Concrete (Coming Soon)", href: "/divisions/precast" },
];

export const exploreNav: readonly NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Projects & Gallery", href: "/projects" },
  { label: "Resources & HSEQ", href: "/resources" },
  { label: "Contact & Locations", href: "/contact" },
];

export const quoteHref = "/request-quote";
