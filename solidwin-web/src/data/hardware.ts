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

export interface HardwareGalleryItem {
  id: string;
  title: string;
  category: "store" | "tools" | "paints" | "fleet" | "materials";
  image: string;
  alt: string;
  description: string;
  tags?: string[];
}

export const BLOCK_PAVER_PRODUCTS: readonly BlockPaverProduct[] = [
  {
    id: "hollow-block-200",
    name: "Standard Hollow Block (200mm)",
    category: "blocks",
    dimensionsMm: "400 × 200 × 200 mm",
    compressiveStrength: "7.0 N/mm² (Load bearing)",
    applications: "External perimeter walls, commercial basements, foundation load-bearing partitions.",
    image: "/images/hardware/cement-adhesive-pallets.jpg",
    unit: "block",
  },
  {
    id: "hollow-block-150",
    name: "Partition Hollow Block (150mm)",
    category: "blocks",
    dimensionsMm: "400 × 200 × 150 mm",
    compressiveStrength: "5.0 N/mm²",
    applications: "Internal partition walls, light perimeter enclosures, infill masonry.",
    image: "/images/hardware/warehouse-delivery-truck.jpg",
    unit: "block",
  },
  {
    id: "solid-block-100",
    name: "Solid Concrete Block (100mm)",
    category: "blocks",
    dimensionsMm: "400 × 200 × 100 mm",
    compressiveStrength: "10.5 N/mm²",
    applications: "High-density acoustic partitions, party walls, retaining foundations.",
    image: "/images/hardware/forklift-and-loader.jpg",
    unit: "block",
  },
  {
    id: "rectangular-paver-60",
    name: "Heavy Duty Rectangular Pavers (60mm)",
    category: "pavers",
    dimensionsMm: "200 × 100 × 60 mm",
    compressiveStrength: "45.0 N/mm²",
    applications: "Domestic driveways, shopping plaza walk-ways, residential pathways.",
    image: "/images/hardware/storefront-signboard-paved.jpg",
    unit: "m²",
  },
  {
    id: "interlocking-paver-80",
    name: "Interlocking Uni-Pavers (80mm)",
    category: "pavers",
    dimensionsMm: "225 × 112 × 80 mm",
    compressiveStrength: "50.0 N/mm² (Industrial traffic)",
    applications: "Commercial container yards, industrial access roads, petrol station forecourts.",
    image: "/images/hardware/storefront-wheelbarrows-wide.jpg",
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
    image: "/images/hardware/tipper-truck.jpg",
  },
  {
    id: "backhoe-loader",
    name: "4WD Backhoe Loader & Yard Forklift",
    category: "earthmoving",
    specifications: "Front 1.1 m³ loader bucket, rear telescopic arm, hammer piping & pallet forks.",
    minHireDuration: "1 Day",
    terms: "Includes operator. Travel mobilization charged beyond 20km.",
    image: "/images/hardware/forklift-and-loader.jpg",
  },
  {
    id: "compactor-roller",
    name: "Compaction Rammer & Vibratory Plant",
    category: "compaction",
    specifications: "Heavy-duty impact rammer, trench compaction, dual vibratory frequencies.",
    minHireDuration: "1 Day",
    terms: "Delivered on site. Operator guidance and safety kit provided.",
    image: "/images/hardware/compactor-rammer.jpg",
  },
  {
    id: "concrete-boom-pump",
    name: "Isuzu Concrete Transit Mixer (Fleet)",
    category: "concrete",
    specifications: "High-capacity rotating drum, computerized slump retention, rapid discharge chute.",
    minHireDuration: "Per Pour Session (Half/Full Day)",
    terms: "Supplied strictly with experienced driver. Washout facilities required on site.",
    image: "/images/hardware/concrete-transit-mixer.jpg",
  },
  {
    id: "diesel-generator-100kva",
    name: "Heavy Equipment & Generator Workshop",
    category: "power",
    specifications: "Site power generation, portable air compressors, floor cutting saws, scaffolding.",
    minHireDuration: "1 Week",
    terms: "Dry hire with logbook. Fuel service available on request.",
    image: "/images/hardware/equipment-rental-garage.jpg",
  },
];

export const BRAND_PARTNERS: readonly BrandPartner[] = [
  { name: "Nippon Paint", category: "Authorized Dealer — Coatings" },
  { name: "Asian Paints Causeway", category: "Paints & Waterproofing" },
  { name: "MEN Power Tools", category: "Heavy Duty Machinery & Tools" },
  { name: "Bellucci", category: "Door Locking Systems" },
  { name: "Orange Electric", category: "Electrical & Conduits" },
  { name: "Wurth", category: "Fasteners & Chemicals" },
  { name: "Megakem", category: "Construction Chemicals" },
  { name: "Isuzu Commercial", category: "Logistics & Mixer Fleet" },
];

export const HARDWARE_GALLERY: readonly HardwareGalleryItem[] = [
  {
    id: "gal-store-exterior",
    title: "Solidwin Hardware & Nippon Paint Center",
    category: "store",
    image: "/images/hardware/hardware-store-exterior-wide.jpg",
    alt: "Solidwin Hardware commercial showroom and yard in Kahawa, Kosgama",
    description: "Multi-storey commercial trade showroom with complete building materials yard and customer parking.",
    tags: ["Exterior", "Showroom", "Kosgama"],
  },
  {
    id: "gal-store-entrance",
    title: "Trade Entrance & Paint Depot",
    category: "store",
    image: "/images/hardware/store-entrance-nippon.jpg",
    alt: "Trade counter entrance with Nippon Paint branding and wheelbarrows display",
    description: "Direct customer trade counter entrance featuring contractor paint drums, wheelbarrows, and site tools.",
    tags: ["Entrance", "Trade Counter"],
  },
  {
    id: "gal-store-interior",
    title: "Showroom Aisles & Builders Hardware",
    category: "store",
    image: "/images/hardware/hardware-store-interior.jpg",
    alt: "Interior of Solidwin hardware store with stocked shelves and tools",
    description: "Fully organized retail aisles featuring fasteners, fittings, ceiling fans, plumbing, and safety gear.",
    tags: ["Showroom", "Fittings", "Stock"],
  },
  {
    id: "gal-store-desk",
    title: "Contractor Order & Trade Desk",
    category: "store",
    image: "/images/hardware/trade-counter-desk.jpg",
    alt: "Solidwin trade counter desk and computerized order billing station",
    description: "Counter sales desk equipped with technical estimating assistance, BOQ takeoff support, and order dispatch.",
    tags: ["Trade Desk", "Support"],
  },
  {
    id: "gal-bellucci-locks",
    title: "Bellucci Architectural Door Hardware",
    category: "store",
    image: "/images/hardware/door-handles-showcase.jpg",
    alt: "Bellucci designer brass door handles and mortise locks in glass showcase",
    description: "Authorized showcase of premium Italian-standard Bellucci door handles, mortise locksets, and security cylinders.",
    tags: ["Bellucci", "Locks", "Finishes"],
  },
  {
    id: "gal-power-tools-men",
    title: "MEN Heavy Duty Power Tools",
    category: "tools",
    image: "/images/hardware/power-tools-display.jpg",
    alt: "MEN Built to Last power tools wall board with rotary hammers, saws, and grinders",
    description: "Sri Lanka's #1 selling brand: rotary hammer drills, heavy duty circular saws, angle grinders, and lawn equipment.",
    tags: ["Power Tools", "MEN", "Drills"],
  },
  {
    id: "gal-hand-tools",
    title: "Contractor Hand Tools & Accessories",
    category: "tools",
    image: "/images/hardware/hand-tools-pliers-blades.jpg",
    alt: "Professional pliers, cutters, socket sets, and SDS drill bits display",
    description: "High-grade industrial pliers, wire strippers, tinsmith shears, socket wrench sets, and carbide masonry bits.",
    tags: ["Hand Tools", "Pliers", "Drill Bits"],
  },
  {
    id: "gal-cutting-discs",
    title: "Diamond Blades, Cutting Discs & Sealants",
    category: "tools",
    image: "/images/hardware/cutting-discs-sealants.jpg",
    alt: "Diamond cutting blades, grinding wheels, silicone sealants, and tapes",
    description: "Continuous and segmented diamond blades for concrete cutting, steel abrasive discs, silicones, and adhesives.",
    tags: ["Abrasives", "Blades", "Sealants"],
  },
  {
    id: "gal-nippon-paints",
    title: "Nippon Paint & Megakem Coatings Bar",
    category: "paints",
    image: "/images/hardware/nippon-paint-shelves.jpg",
    alt: "Nippon Paint interior/exterior coatings and Megakem waterproofing cans",
    description: "Extensive stock of Nippon Weatherbond, Odour-less interior emulsions, wood care, and Megakem waterproof sealers.",
    tags: ["Nippon Paint", "Megakem", "Waterproofing"],
  },
  {
    id: "gal-paint-pails",
    title: "Contractor Bulk Pails & Rollers",
    category: "paints",
    image: "/images/hardware/paint-accessories-pails.jpg",
    alt: "Bulk paint buckets, rollers, brushes, and masking supplies",
    description: "Commercial paint pails (10L & 20L), weather-resistant exterior primers, professional rollers, and brushes.",
    tags: ["Coatings", "Bulk Pails", "Application"],
  },
  {
    id: "gal-steel-tubing",
    title: "Structural Steel Tubes & Hollow Sections",
    category: "materials",
    image: "/images/hardware/steel-pipes-tubing.jpg",
    alt: "Racks of round steel pipes, square tubing, and structural metal sections",
    description: "Heavy structural racks holding round steel pipes, RHS and SHS hollow sections for steel fabrication.",
    tags: ["Steel", "Pipes", "Fabrication"],
  },
  {
    id: "gal-rebar-steel",
    title: "Certified High-Yield Deformed Rebar",
    category: "materials",
    image: "/images/hardware/rebar-steel-rods.jpg",
    alt: "Structural reinforcement steel bars arranged with color-coded ends",
    description: "Grade 500 deformed rebar rods stored in organized bays with color-coded diameter identifiers.",
    tags: ["Rebar", "Reinforcement", "Civil"],
  },
  {
    id: "gal-wire-mesh",
    title: "Wire Mesh, Fencing & PVC Conduits",
    category: "materials",
    image: "/images/hardware/wire-mesh-conduits.jpg",
    alt: "Wire mesh rolls, chain-link, and electrical PVC conduits in warehouse",
    description: "Reinforced BRC wire mesh, chain-link security rolls, PVC electrical conduits, and cable protection tubing.",
    tags: ["Wire Mesh", "Conduits", "Electrical"],
  },
  {
    id: "gal-cement-pallets",
    title: "Ultra Flex Tile Adhesive & Cement Pallets",
    category: "materials",
    image: "/images/hardware/cement-adhesive-pallets.jpg",
    alt: "Pallets of Ultra Flex tile adhesive and bagged cement in covered warehouse",
    description: "Dry warehouse storage for polymer-modified tile adhesives, Portland cement, and joint grouting compounds.",
    tags: ["Adhesive", "Cement", "Pallets"],
  },
  {
    id: "gal-transit-mixer",
    title: "Solidwin Concrete Transit Mixer Fleet",
    category: "fleet",
    image: "/images/hardware/concrete-transit-mixer.jpg",
    alt: "Isuzu Forward Juston concrete transit mixer truck parked in Solidwin yard",
    description: "Dedicated computerized Isuzu mixer trucks ready to transport high-specification concrete mixes directly to your site.",
    tags: ["Transit Mixer", "Concrete", "Isuzu"],
  },
  {
    id: "gal-forklift-loader",
    title: "Material Handling Forklift & Yard Loader",
    category: "fleet",
    image: "/images/hardware/forklift-and-loader.jpg",
    alt: "Toyota yard forklift and blue tractor loader in the material yard",
    description: "Heavy yard handling equipment ensuring swift and damage-free loading of brick pallets, pavers, and cement bags.",
    tags: ["Forklift", "Loader", "Yard"],
  },
  {
    id: "gal-compactor-rammer",
    title: "Soil & Trench Compaction Rammer",
    category: "fleet",
    image: "/images/hardware/compactor-rammer.jpg",
    alt: "Yellow tamping rammer compactor and control panel ready for site hire",
    description: "High-impact jumping jack compaction rammers for foundation trenches, road bases, and backfill compaction.",
    tags: ["Compaction", "Rammer", "Rental"],
  },
  {
    id: "gal-rental-garage",
    title: "Rental Machinery & Tool Workshop",
    category: "fleet",
    image: "/images/hardware/equipment-rental-garage.jpg",
    alt: "Equipment workshop with floor saws, bar benders, air compressors, and wheelbarrows",
    description: "Maintained workshop fleet with concrete floor cutters, bar benders, mobile compressors, and heavy wheelbarrows.",
    tags: ["Machinery", "Workshop", "Hire Fleet"],
  },
];
