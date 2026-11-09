import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log("Connecting to Firebase project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data payloads
const PROJECTS = [
  {
    slug: "modern-residence-apex",
    title: "Apex Horizon Luxury Villa",
    sector: "residential",
    location: "Greenfield Hills",
    completionDate: "June 2026",
    scope: "Turnkey Design & Build, 650 m² luxury villa, pool & hardscaping",
    description: "A turnkey architectural showcase featuring post-tensioned concrete slabs, high-spec acoustic partitions, and expansive double-glazed curtain walls.",
    featuredImage: "/images/service-residential.jpg",
    gallery: ["/images/service-residential.jpg", "/images/hero-construction.jpg", "/images/service-turnkey.jpg"],
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
    description: "Delivered with continuous batching plant dispatch and precision pump placement, completing the structural core two weeks ahead of schedule.",
    featuredImage: "/images/service-commercial.jpg",
    gallery: ["/images/service-commercial.jpg", "/images/service-turnkey.jpg", "/images/hero-construction.jpg"],
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
    description: "Engineered for high-tonnage container forklift operations with laser-guided screed floors and certified 50 N/mm² interlocking pavers.",
    featuredImage: "/images/service-industrial.jpg",
    gallery: ["/images/service-industrial.jpg", "/images/service-commercial.jpg", "/images/hero-construction.jpg"],
  },
  {
    slug: "coastal-bypass-bridge",
    title: "North Coastal Arterial Bridge",
    sector: "infrastructure",
    location: "North Coast Link",
    completionDate: "April 2025",
    scope: "Cast-in-situ reinforced concrete abutments, high-durability marine concrete",
    description: "Marine-grade concrete formulated with silica fume and corrosion inhibitors, poured with specialized boom pumps over the tidal zone.",
    featuredImage: "/images/hero-construction.jpg",
    gallery: ["/images/hero-construction.jpg", "/images/service-industrial.jpg", "/images/service-turnkey.jpg"],
  },
];

const CALCULATOR_SETTINGS = {
  mortarJointMm: 10,
  blockBreakagePercent: 5,
  blockPresets: [
    { name: "Hollow Block (400 × 200 mm)", length: 400, height: 200 },
    { name: "Standard Brick (215 × 65 mm)", length: 215, height: 65 },
    { name: "Solid Concrete Block (440 × 215 mm)", length: 440, height: 215 },
  ],
  defaultPlasterThicknessMm: 12,
  defaultPlasterMix: "1:4",
  dryVolumeFactor: 1.33,
  cementDensityKgM3: 1440,
  cementBagWeightKg: 50,
  defaultPaintCoats: 2,
  paintCoverageM2PerLiter: 10,
  concreteWastagePercent: 5,
  updatedAt: new Date().toISOString(),
};

const DOCUMENTS = [
  {
    id: "company-profile-2026",
    title: "Company Profile 2026",
    description: "Executive summary, multi-division capabilities, turnkey portfolio, and plant equipment fleet.",
    category: "profile",
    fileName: "Solidwin_Corporate_Profile_2026.pdf",
    fileSize: "4.8 MB",
    fileUrl: "/documents/Solidwin_Corporate_Profile_2026.pdf",
    version: "v2.4",
    updatedAt: "26 October 2026",
  },
  {
    id: "hseq-policy-manual",
    title: "Integrated HSEQ Management Policy",
    description: "Health, Safety, Environmental and Quality framework, zero-harm site protocols and compliance.",
    category: "hseq",
    fileName: "Solidwin_Integrated_HSEQ_Policy.pdf",
    fileSize: "2.1 MB",
    fileUrl: "/documents/Solidwin_Integrated_HSEQ_Policy.pdf",
    version: "v3.1",
    updatedAt: "15 September 2026",
  },
  {
    id: "iso-certificates",
    title: "ISO 9001:2015 & ISO 45001:2018 Certificates",
    description: "Accredited certifications for batching quality control and occupational health & safety.",
    category: "certificate",
    fileName: "Solidwin_ISO_Accreditations_Pack.pdf",
    fileSize: "1.4 MB",
    fileUrl: "/documents/Solidwin_ISO_Accreditations_Pack.pdf",
    version: "2026 Renewal",
    updatedAt: "10 August 2026",
  },
  {
    id: "technical-datasheet",
    title: "Concrete Mix & Masonry Technical Guide",
    description: "Characteristic compressive strengths, slump tolerances, and batching QA/QC methodologies.",
    category: "brochure",
    fileName: "Solidwin_Concrete_and_Blocks_Datasheet.pdf",
    fileSize: "3.2 MB",
    fileUrl: "/documents/Solidwin_Concrete_and_Blocks_Datasheet.pdf",
    version: "v1.8",
    updatedAt: "01 October 2026",
  },
];

const INQUIRIES = [
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

async function seed() {
  try {
    console.log("1. Writing projects to 'solidwin_projects'...");
    for (const p of PROJECTS) {
      await setDoc(doc(db, "solidwin_projects", p.slug), p, { merge: true });
      console.log(`  ✓ Project: ${p.title} (${p.slug})`);
    }

    console.log("2. Writing calculator parameters to 'solidwin_settings/calculators'...");
    await setDoc(doc(db, "solidwin_settings", "calculators"), CALCULATOR_SETTINGS, { merge: true });
    console.log("  ✓ Calculators parameters updated");

    console.log("3. Writing documents to 'solidwin_documents'...");
    for (const d of DOCUMENTS) {
      await setDoc(doc(db, "solidwin_documents", d.id), d, { merge: true });
      console.log(`  ✓ Document: ${d.title} (${d.id})`);
    }

    console.log("4. Writing initial leads to 'solidwin_inquiries'...");
    for (const i of INQUIRIES) {
      await setDoc(doc(db, "solidwin_inquiries", i.id), i, { merge: true });
      console.log(`  ✓ Inquiry: ${i.name} (${i.id})`);
    }

    console.log("\n🎉 ALL SEED DATA SUCCESSFULLY WRITTEN TO FIREBASE FIRESTORE!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Error writing to Firebase Firestore:", err);
    process.exit(1);
  }
}

seed();
