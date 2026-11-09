import { db } from "./config";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { PROJECTS } from "@/data/projects";
import { DEFAULT_CALCULATOR_SETTINGS } from "@/lib/cms/calculator-settings";
import { DEFAULT_DOCUMENTS } from "@/lib/cms/documents-store";
import { CONCRETE_GRADES } from "@/data/readyMix";
import { BLOCK_PAVER_PRODUCTS, EQUIPMENT_PRODUCTS } from "@/data/hardware";

export interface SeedResult {
  success: boolean;
  message: string;
  counts: {
    projects: number;
    calculators: number;
    documents: number;
    inquiries: number;
    concrete: number;
    catalogue: number;
  };
  error?: string;
}

const INITIAL_INQUIRIES = [
  {
    id: "inq-101",
    requestId: "req-101",
    name: "Ahmed Al-Mansoor",
    email: "a.mansoor@apexconstruct.com",
    phone: "+971 50 123 4567",
    division: "Ready-Mix Concrete",
    message: "Requirement for 350 m³ of G30 pump mix for commercial foundation pour in Industrial Zone 2 next Tuesday.",
    consent: true,
    status: "new",
    source: "ready_mix",
    createdAt: new Date().toISOString(),
    staffNotes: ["Priority client. Batching plant 1 confirmed ready."],
  },
  {
    id: "inq-102",
    requestId: "req-102",
    name: "Sarah Jenkins",
    email: "s.jenkins@vertexdesign.org",
    phone: "+971 52 987 6543",
    division: "Construction Services",
    message: "Seeking turnkey design & build proposal for 4-storey commercial office development. Architectural drawings attached.",
    consent: true,
    status: "in_progress",
    source: "construction_rfq",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    staffNotes: ["Estimation team preparing BOQ."],
  },
  {
    id: "inq-103",
    requestId: "req-103",
    name: "Tariq Mahmood",
    email: "t.mahmood@gulflogistics.ae",
    phone: "+971 55 456 7890",
    division: "Hardware & Equipment",
    message: "Rental inquiry for 32m Mobile Boom Pump and CAT 320D excavator for 3-week infrastructure trenching project.",
    consent: true,
    status: "new",
    source: "hardware_boq",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    staffNotes: ["Equipment availability verified in dispatch yard."],
  },
  {
    id: "inq-104",
    requestId: "req-104",
    name: "Fatima Al-Zahra",
    email: "fatima@creekhorizon.com",
    phone: "+971 54 321 0987",
    division: "Construction Services",
    message: "Residential villa development request for structural block supply (200mm hollow blocks) and indicative plaster estimates.",
    consent: true,
    status: "quoted",
    source: "contact_form",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    staffNotes: ["Formal quotation #QUO-8821 dispatched via WhatsApp."],
  },
  {
    id: "inq-105",
    requestId: "req-105",
    name: "Marcus Vance",
    email: "m.vance@marinedevelopments.com",
    phone: "+971 58 765 4321",
    division: "Ready-Mix Concrete",
    message: "Marine-grade G35 concrete supply with corrosion inhibitors for coastal pier repair. Delivery access via low-tide route.",
    consent: true,
    status: "in_progress",
    source: "ready_mix",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    staffNotes: ["QA/QC lab approved silica fume mix design."],
  },
];

/**
 * Seeds all baseline corporate data into Firebase Cloud Firestore.
 */
export async function seedAllDataToFirebase(): Promise<SeedResult> {
  if (!db) {
    return {
      success: false,
      message: "Firebase Firestore is not initialized. Please ensure .env.local has valid Firebase credentials.",
      counts: { projects: 0, calculators: 0, documents: 0, inquiries: 0, concrete: 0, catalogue: 0 },
      error: "DB_NOT_INITIALIZED",
    };
  }

  const counts = {
    projects: 0,
    calculators: 0,
    documents: 0,
    inquiries: 0,
    concrete: 0,
    catalogue: 0,
  };

  try {
    // 1. Seed Projects
    for (const proj of PROJECTS) {
      await setDoc(doc(db, "solidwin_projects", proj.slug), proj, { merge: true });
      counts.projects++;
    }

    // 2. Seed Calculator Settings
    await setDoc(doc(db, "solidwin_settings", "calculators"), DEFAULT_CALCULATOR_SETTINGS, { merge: true });
    counts.calculators = 1;

    // 3. Seed Documents
    for (const d of DEFAULT_DOCUMENTS) {
      await setDoc(doc(db, "solidwin_documents", d.id), d, { merge: true });
      counts.documents++;
    }

    // 4. Seed Inquiries & Leads
    for (const inq of INITIAL_INQUIRIES) {
      await setDoc(doc(db, "solidwin_inquiries", inq.id), inq, { merge: true });
      counts.inquiries++;
    }

    // 5. Seed Concrete Grades
    for (const grade of CONCRETE_GRADES) {
      await setDoc(doc(db, "solidwin_concrete_grades", grade.grade), grade, { merge: true });
      counts.concrete++;
    }

    // 6. Seed Hardware Catalogue (Blocks & Equipment)
    for (const item of BLOCK_PAVER_PRODUCTS) {
      await setDoc(doc(db, "solidwin_catalogue", item.id), item, { merge: true });
      counts.catalogue++;
    }
    for (const item of EQUIPMENT_PRODUCTS) {
      await setDoc(doc(db, "solidwin_catalogue", item.id), item, { merge: true });
      counts.catalogue++;
    }

    return {
      success: true,
      message: `Successfully populated Firebase Firestore with ${counts.projects} projects, ${counts.calculators} calculator config, ${counts.documents} documents, ${counts.inquiries} inquiries, ${counts.concrete} concrete grades, and ${counts.catalogue} catalogue products.`,
      counts,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Firebase seeding error:", err);
    return {
      success: false,
      message: "Failed to write data to Firebase Firestore.",
      counts,
      error: errorMsg,
    };
  }
}

/**
 * Checks document counts in live Firestore collections.
 */
export async function checkFirebaseCollectionCounts(): Promise<{
  connected: boolean;
  counts: Record<string, number>;
  error?: string;
}> {
  if (!db) {
    return { connected: false, counts: {}, error: "Firestore not initialized" };
  }

  const collections = [
    "solidwin_projects",
    "solidwin_documents",
    "solidwin_inquiries",
    "solidwin_concrete_grades",
    "solidwin_catalogue",
  ];

  const counts: Record<string, number> = {};

  try {
    for (const col of collections) {
      try {
        const snap = await getDocs(collection(db, col));
        counts[col] = snap.size;
      } catch {
        counts[col] = 0;
      }
    }
    return { connected: true, counts };
  } catch (err: unknown) {
    return {
      connected: false,
      counts,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
