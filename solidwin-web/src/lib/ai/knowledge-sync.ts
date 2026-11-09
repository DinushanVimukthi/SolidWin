import fs from "fs";
import path from "path";
import { siteConfig } from "@/lib/site-config";
import { PROJECTS } from "@/data/projects";
import { DEFAULT_DOCUMENTS } from "@/data/documents";
import { generalFaqs } from "@/data/faqs";

const KNOWLEDGE_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "solidwin-knowledge-base.md"
);

const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

let syncTimerStarted = false;

export function compileKnowledgeBase(): string {
  const now = new Date().toISOString();

  let projectsMd = "";
  for (const p of PROJECTS) {
    projectsMd += `\n### ${p.title}
- **Sector:** ${p.sector}
- **Location:** ${p.location}
- **Completion Date:** ${p.completionDate}
- **Scope:** ${p.scope}
- **Description:** ${p.description}
- **Transformation Comparison:** ${p.hasBeforeAfter ? "Active (Before/After inspection)" : "Standard"}
`;
  }

  let docsMd = "";
  for (const d of DEFAULT_DOCUMENTS) {
    docsMd += `- **${d.title}** (${d.version}) — Category: ${d.category.toUpperCase()} | File: \`${d.fileName}\` (${d.fileSize}) | Updated: ${d.updatedAt}\n  _${d.description}_\n`;
  }

  let faqsMd = "";
  for (const f of generalFaqs) {
    faqsMd += `**Q: ${f.question}**\n**A:** ${f.answer}\n\n`;
  }

  return `# Solidwin Holdings — Corporate Engineering & Technical Knowledge Base
**Classification:** Official Corporate Data & AI Context
**System Scope:** Multi-Division Construction, Certified Ready-Mix Concrete, Hardware & Equipment Rentals
**Last Synced:** ${now}
**Sync Cycle:** Every 5 minutes from active system database

---

## 1. Company Executive Overview & Profile
- **Company Name:** ${siteConfig.name} Holdings PLC
- **Tagline:** ${siteConfig.tagline}
- **Description:** ${siteConfig.description}
- **Operating Regions:** Sri Lanka, UAE, and GCC regional infrastructure corridors.
- **Trade Counter & Hotline:** ${siteConfig.tradeCounterPhone}
- **WhatsApp Dispatch:** ${siteConfig.whatsappNumber}
- **Central Batching Facility:** ${siteConfig.batchingPlant.name}
  - Address: ${siteConfig.batchingPlant.address}
  - Coordinates: ${siteConfig.batchingPlant.coordinates}
  - Zone 1 (0–15 km): Rapid express pour (within 45 min)
  - Zone 2 (15–30 km): Standard pour with slump testing (within 70 min)
  - Zone 3 (30–45 km): Extended dispatch with retarder admixture (within 90 min)
- **Accreditations:** ISO 9001:2015 (Quality), ISO 14001:2015 (Environment), ISO 45001:2018 (Health & Safety)

---

## 2. Divisions & Technical Capabilities
### Construction Services Division:
Turnkey design and civil build execution, reinforced concrete framing, post-tensioned slabs, high-rise commercial structures, and industrial warehouses.

### Ready-Mix Concrete Division:
- Computerized wet-batch plants delivering certified G15, G20, G25, G30, G35, G40, and G45 mixes.
- Minimum batch size: 6.0 m³ per transit mixer truck.
- Workability slump: 120 ± 25 mm (standard) up to 160 ± 30 mm (superplasticized pump mixes).
- Mandatory 7-day and 28-day concrete cube compression testing on all structural deliveries.

### Hardware, Blocks & Pavers:
- 200mm (8-inch) Hollow Blocks: 400 × 200 × 200 mm, compressive strength 5.0–7.0 N/mm² (load-bearing external walls).
- 150mm (6-inch) Hollow Blocks: 400 × 150 × 200 mm (perimeter and partition walls).
- 100mm (4-inch) Partition Blocks: 400 × 100 × 200 mm (internal non-load-bearing room dividers).
- Interlocking Pavers: 60mm (45 N/mm²) for pedestrian/parking; 80mm (50 N/mm²) for heavy industrial and container terminal pavement.

### Heavy Equipment Rental Fleet:
- 32-Meter Concrete Boom Pump (90 m³/hour continuous placement).
- CAT 320D 20-Ton Hydraulic Excavators with bucket and rock breaker.
- 4x4 Backhoe Loaders for site prep and utility trenching.
- 10-Ton Vibratory Compaction Rollers for road base and gravel compaction.
- 60 kVA Soundproof Mobile Diesel Generators (continuous 3-phase duty).

---

## 3. Engineering Estimators & Formulas
1. **Brick & Block Quantity Formula:**
   - Formula: (Wall Area / 0.08 m²) × 1.05 = ~12.5 blocks per m² (includes 10mm mortar joint & 5% site buffer).
2. **Plaster & Paint Formula:**
   - Internal 12mm single coat plaster: 0.25 bags (50kg) cement per m².
   - External 18mm render: 0.38 bags cement per m² with waterproofing additive.
   - Paint Coverage: 10 to 12 m² per litre (for 2 complete coats).
3. **Concrete Volume Formula:**
   - Formula: Length (m) × Width (m) × Depth (m) × 1.05 (with 5% buffer for pump line losses).

---

## 4. Published Portfolio Projects
${projectsMd}

---

## 5. Official Documents & Technical Downloads
${docsMd}

---

## 6. Frequently Asked Questions (FAQs)
${faqsMd}

---

## 7. Customer Inquiries & Quote Routing
When clients ask for quotations or express interest in placing an order:
1. Always offer to connect them directly to technical dispatch or take their contact details.
2. Leads captured through the chatbot are routed to the Solidwin Inquiry Board with priority classification.
3. Official quote requests can also be submitted at \`/request-quote\`.
`;
}

/**
 * Writes or refreshes the markdown file if it does not exist or if more than 5 minutes have elapsed.
 */
export async function syncKnowledgeBase(force = false): Promise<{ synced: boolean; timestamp: string }> {
  try {
    let shouldSync = force;

    if (!shouldSync) {
      if (!fs.existsSync(KNOWLEDGE_FILE_PATH)) {
        shouldSync = true;
      } else {
        const stats = fs.statSync(KNOWLEDGE_FILE_PATH);
        const ageMs = Date.now() - stats.mtimeMs;
        if (ageMs > SYNC_INTERVAL_MS) {
          shouldSync = true;
        }
      }
    }

    if (shouldSync) {
      const content = compileKnowledgeBase();
      const dir = path.dirname(KNOWLEDGE_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(KNOWLEDGE_FILE_PATH, content, "utf-8");
      return { synced: true, timestamp: new Date().toISOString() };
    }

    return { synced: false, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error("Error syncing Solidwin knowledge base:", err);
    return { synced: false, timestamp: new Date().toISOString() };
  }
}

/**
 * Returns the latest knowledge base markdown, refreshing if 5 minutes have elapsed.
 */
export async function getKnowledgeBaseMarkdown(): Promise<string> {
  await syncKnowledgeBase(false);

  try {
    if (fs.existsSync(KNOWLEDGE_FILE_PATH)) {
      return fs.readFileSync(KNOWLEDGE_FILE_PATH, "utf-8");
    }
  } catch (err) {
    console.warn("Could not read knowledge file from disk, compiling in memory:", err);
  }

  return compileKnowledgeBase();
}

/**
 * Starts automated 5-minute background sync timer in server environment.
 */
export function initAutomatedKnowledgeSync(): void {
  if (syncTimerStarted) return;
  if (typeof window !== "undefined") return;

  syncTimerStarted = true;
  // Run initial sync
  syncKnowledgeBase(false).catch((err) => console.error("Initial knowledge sync failed:", err));

  // Schedule recurring 5-minute background sync
  setInterval(() => {
    syncKnowledgeBase(true)
      .then((res) => {
        if (res.synced) {
          console.log(`[Solidwin AI] Knowledge base updated successfully at ${res.timestamp}`);
        }
      })
      .catch((err) => console.error("[Solidwin AI] Knowledge base sync error:", err));
  }, SYNC_INTERVAL_MS);
}

// Auto-initialize when loaded on the server
initAutomatedKnowledgeSync();
