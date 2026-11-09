export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string };
}

export interface Division {
  id: string;
  title: string;
  description: string;
  href: string;
}

/** Construction service cards (CON-01). Copy mirrors the Figma frames. */
export const constructionServices: readonly ServiceCard[] = [
  {
    id: "residential",
    title: "Residential",
    description: "Custom homes and residential developments.",
    href: "/divisions/construction",
    image: { src: "/images/service-residential.jpg", alt: "Modern residential house at dusk" },
  },
  {
    id: "commercial",
    title: "Commercial",
    description: "Offices, retail and commercial spaces.",
    href: "/divisions/construction",
    image: { src: "/images/service-commercial.jpg", alt: "Glass commercial office building" },
  },
  {
    id: "industrial",
    title: "Industrial",
    description: "Buildings for manufacturing, logistics and warehousing.",
    href: "/divisions/construction",
    image: { src: "/images/service-industrial.jpg", alt: "Industrial warehouse with loading bays" },
  },
  {
    id: "turnkey",
    title: "Turnkey Design & Build",
    description: "From planning to construction and handover.",
    href: "/divisions/construction",
    image: { src: "/images/service-turnkey.jpg", alt: "Site team reviewing blueprints" },
  },
];

/** The three divisions shown as entry points on the home page. */
export const divisions: readonly Division[] = [
  {
    id: "construction",
    title: "Construction Services",
    description: "Residential, commercial, industrial and turnkey design and build.",
    href: "/divisions/construction",
  },
  {
    id: "ready-mix",
    title: "Ready-Mix Concrete",
    description: "Concrete grades, volume estimating and delivery requests.",
    href: "/divisions/ready-mix",
  },
  {
    id: "hardware",
    title: "Hardware & Rentals",
    description: "Blocks, pavers, materials and equipment hire.",
    href: "/divisions/hardware",
  },
];
