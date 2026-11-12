import type { AccordionItem } from "@/components/ui/Accordion";

export interface ConcreteGrade {
  grade: string; // e.g. "G15", "G20", "G25", "G30", "G35"
  strengthNmm2: number;
  slumpMm: string;
  applications: string;
  curationDays: number;
}

export const CONCRETE_GRADES: readonly ConcreteGrade[] = [
  {
    grade: "G15",
    strengthNmm2: 15,
    slumpMm: "50 - 75 mm",
    applications: "Blinding concrete, non-structural floor leveling, mass concrete foundations.",
    curationDays: 28,
  },
  {
    grade: "G20",
    strengthNmm2: 20,
    slumpMm: "75 - 100 mm",
    applications: "Domestic floors, light footings, driveways, boundary walls and pathways.",
    curationDays: 28,
  },
  {
    grade: "G25",
    strengthNmm2: 25,
    slumpMm: "75 - 100 mm",
    applications: "General reinforced foundations, ground slabs, residential retaining walls.",
    curationDays: 28,
  },
  {
    grade: "G30",
    strengthNmm2: 30,
    slumpMm: "100 - 125 mm",
    applications: "Structural columns, beams, suspended slabs, commercial floors and pavements.",
    curationDays: 28,
  },
  {
    grade: "G35",
    strengthNmm2: 35,
    slumpMm: "100 - 125 mm",
    applications: "Heavy-duty commercial structures, bridge decks, water-retaining structures.",
    curationDays: 28,
  },
];

export const BATCH_TO_BUILD_STEPS = [
  {
    step: "1",
    title: "Mixing",
    description: "Computerized batching to precise client-approved mix designs and moisture compensation.",
    image: "/images/hero-construction.jpg",
  },
  {
    step: "2",
    title: "Delivery",
    description: "GPS-tracked transit mixer fleet ensuring prompt arrival within certified slump and setting times.",
    image: "/images/hardware/concrete-transit-mixer.jpg",
  },
  {
    step: "3",
    title: "Pour",
    description: "Coordinated discharge with optional boom pump truck support for rapid, clean placement.",
    image: "/images/service-turnkey.jpg",
  },
] as const;

export const READY_MIX_FAQS: readonly AccordionItem[] = [
  {
    id: "rmc-faq-1",
    question: "How do I estimate the concrete volume I need?",
    answer:
      "Use our Concrete Volume Calculator above. For rectangular slabs, multiply Length × Width × Thickness (in metres). For circular columns, use π × radius² × height. We strongly recommend adding 5% for site wastage and uneven excavation.",
  },
  {
    id: "rmc-faq-2",
    question: "What information should I provide for a quote?",
    answer:
      "Please provide the delivery location, estimated quantity in cubic metres (m³), required concrete grade (e.g., G25 or G30), preferred pour date, and whether a concrete pump truck is required.",
  },
  {
    id: "rmc-faq-3",
    question: "How far in advance should I plan a delivery?",
    answer:
      "We recommend scheduling standard pours at least 48 to 72 hours in advance. For large commercial pours (>50 m³) or continuous weekend pours, please contact us 5–7 days ahead.",
  },
  {
    id: "rmc-faq-4",
    question: "What if my delivery requirements or site conditions change?",
    answer:
      "Contact our dispatch team as early as possible. Slump adjustments, site access rescheduling or dispatch hold can be accommodated with advance notice before transit mixers leave the batching plant.",
  },
];
