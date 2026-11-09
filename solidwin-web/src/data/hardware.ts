export interface BlockPaverProduct {
  id: string;
  name: string;
  category: "blocks" | "pavers";
  dimensionsMm: string;
  compressiveStrength: string;
  applications: string;
  image: string;
  unit: string;
}

export interface EquipmentProduct {
  id: string;
  name: string;
  category: "earthmoving" | "compaction" | "concrete" | "power";
  specifications: string;
  minHireDuration: string;
  terms: string;
  image: string;
}

export interface BrandPartner {
  name: string;
  category: string;
}

export const BLOCK_PAVER_PRODUCTS: readonly BlockPaverProduct[] = [
  {
    id: "hollow-block-200",
    name: "Standard Hollow Block (200mm)",
    category: "blocks",
    dimensionsMm: "400 × 200 × 200 mm",
    compressiveStrength: "7.0 N/mm² (Load bearing)",
    applications: "External perimeter walls, commercial basements, foundation load-bearing partitions.",
    image: "/images/service-industrial.jpg",
    unit: "block",
  },
  {
    id: "hollow-block-150",
    name: "Partition Hollow Block (150mm)",
    category: "blocks",
    dimensionsMm: "400 × 200 × 150 mm",
    compressiveStrength: "5.0 N/mm²",
    applications: "Internal partition walls, light perimeter enclosures, infill masonry.",
    image: "/images/service-commercial.jpg",
    unit: "block",
  },
  {
    id: "solid-block-100",
    name: "Solid Concrete Block (100mm)",
    category: "blocks",
    dimensionsMm: "400 × 200 × 100 mm",
    compressiveStrength: "10.5 N/mm²",
    applications: "High-density acoustic partitions, party walls, retaining foundations.",
    image: "/images/service-residential.jpg",
    unit: "block",
  },
  {
    id: "rectangular-paver-60",
    name: "Heavy Duty Rectangular Pavers (60mm)",
    category: "pavers",
    dimensionsMm: "200 × 100 × 60 mm",
    compressiveStrength: "45.0 N/mm²",
    applications: "Domestic driveways, shopping plaza walk-ways, residential pathways.",
    image: "/images/service-residential.jpg",
    unit: "m²",
  },
  {
    id: "interlocking-paver-80",
    name: "Interlocking Uni-Pavers (80mm)",
    category: "pavers",
    dimensionsMm: "225 × 112 × 80 mm",
    compressiveStrength: "50.0 N/mm² (Industrial traffic)",
    applications: "Commercial container yards, industrial access roads, petrol station forecourts.",
    image: "/images/service-industrial.jpg",
    unit: "m²",
  },
];

export const EQUIPMENT_PRODUCTS: readonly EquipmentProduct[] = [
  {
    id: "excavator-20t",
    name: "Crawler Excavator 20-Tonne",
    category: "earthmoving",
    specifications: "1.0 m³ bucket, max dig depth 6.6m, hydraulic quick-hitch.",
    minHireDuration: "3 Days",
    terms: "Dry hire or with certified operator. Fuel excluded. Daily maintenance inspection required.",
    image: "/images/hero-construction.jpg",
  },
  {
    id: "backhoe-loader",
    name: "4WD Backhoe Loader",
    category: "earthmoving",
    specifications: "Front 1.1 m³ loader bucket, rear telescopic arm, hammer piping.",
    minHireDuration: "1 Day",
    terms: "Includes operator. Travel mobilization charged beyond 20km.",
    image: "/images/service-turnkey.jpg",
  },
  {
    id: "compactor-roller",
    name: "Tandem Vibratory Roller 3-Tonne",
    category: "compaction",
    specifications: "1200mm drum width, pressurized water spray system, dual vibratory frequencies.",
    minHireDuration: "2 Days",
    terms: "Delivered on low-bed. Requires certified operator or competence card.",
    image: "/images/service-industrial.jpg",
  },
  {
    id: "concrete-boom-pump",
    name: "Truck-Mounted Concrete Boom Pump (36m)",
    category: "concrete",
    specifications: "36m vertical reach, 4-section Z-fold boom, 160 m³/hour max output.",
    minHireDuration: "Per Pour Session (Half/Full Day)",
    terms: "Supplied strictly with 2-man operating crew. Pipe washout area must be provided on site.",
    image: "/images/service-commercial.jpg",
  },
  {
    id: "diesel-generator-100kva",
    name: "Silent Diesel Generator 100 kVA",
    category: "power",
    specifications: "Soundproof acoustic canopy, 415V/240V, 3-phase, auto-mains failure panel.",
    minHireDuration: "1 Week",
    terms: "Dry hire with logbook. Fuel service available on request.",
    image: "/images/service-industrial.jpg",
  },
];

export const BRAND_PARTNERS: readonly BrandPartner[] = [
  { name: "Caterpillar", category: "Heavy Equipment" },
  { name: "JCB", category: "Earthmoving" },
  { name: "Komatsu", category: "Excavation" },
  { name: "Sany", category: "Concrete Machinery" },
  { name: "BOMAG", category: "Compaction" },
  { name: "DeWalt & Bosch", category: "Power Tools" },
];
