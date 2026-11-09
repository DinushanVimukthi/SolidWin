import fs from "fs";
import path from "path";

function createValidPdf(title, subtitle, bullets) {
  // Construct valid PDF stream lines
  const lines = [
    "BT",
    "/F1 18 Tf",
    "50 730 Td",
    `(${title}) Tj`,
    "/F1 12 Tf",
    "0 -28 Td",
    `(${subtitle}) Tj`,
    "/F1 10 Tf",
    "0 -24 Td",
    "(--------------------------------------------------------------------------------------------------) Tj",
  ];

  let y = -22;
  for (const b of bullets) {
    const sanitized = b.replace(/[()]/g, "");
    lines.push(`0 ${y} Td`);
    lines.push(`(${sanitized}) Tj`);
    y = -18;
  }

  lines.push("0 -40 Td");
  lines.push("(SOLIDWIN HOLDINGS PLC - OFFICIAL AUDITED CORPORATE DOCUMENT 2026) Tj");
  lines.push("ET");

  const stream = lines.join("\n");
  const streamLength = Buffer.byteLength(stream, "utf-8");

  // Format valid PDF with exact byte offsets
  const header = "%PDF-1.4\n";
  const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const obj3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n";
  const obj4 = `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj\n`;
  const obj5 = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";

  const offset1 = Buffer.byteLength(header, "utf-8");
  const offset2 = offset1 + Buffer.byteLength(obj1, "utf-8");
  const offset3 = offset2 + Buffer.byteLength(obj2, "utf-8");
  const offset4 = offset3 + Buffer.byteLength(obj3, "utf-8");
  const offset5 = offset4 + Buffer.byteLength(obj4, "utf-8");
  const xrefOffset = offset5 + Buffer.byteLength(obj5, "utf-8");

  const pad = (n) => n.toString().padStart(10, "0");

  const xref = `xref\n0 6\n0000000000 65535 f \n${pad(offset1)} 00000 n \n${pad(offset2)} 00000 n \n${pad(offset3)} 00000 n \n${pad(offset4)} 00000 n \n${pad(offset5)} 00000 n \n`;
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;
}

const docsDir = path.join(process.cwd(), "public", "documents");
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const doc1 = createValidPdf(
  "SOLIDWIN HOLDINGS - CORPORATE PROFILE 2026",
  "Turnkey Civil Construction, Ready-Mix Concrete, and Heavy Hardware",
  [
    "1. Executive Overview: Multi-division infrastructure delivery across Sri Lanka and UAE.",
    "2. Ready-Mix Concrete Division: Batching plants delivering G20 to G45 certified mixes.",
    "3. Construction Services: Turnkey high-rise, commercial, and bridge infrastructure.",
    "4. Hardware & Equipment: Block manufacturing, scaffolding, and mobile equipment fleet.",
    "5. Compliance & Accreditations: ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certified.",
    "6. Contact: executive@solidwin.ae | +971 4 800 7654"
  ]
);
fs.writeFileSync(path.join(docsDir, "Solidwin_Corporate_Profile_2026.pdf"), doc1);

const doc2 = createValidPdf(
  "SOLIDWIN INTEGRATED HSEQ MANAGEMENT POLICY",
  "Health, Safety, Environment, and Quality Integrated Site Directives",
  [
    "1. Zero Harm Site Mandate: Mandatory PPE, daily toolbox briefings, and risk mitigation.",
    "2. Environmental Stewardship: Eco-batching recycling and slurry zero-discharge.",
    "3. Quality Assurance: Batch testing every 50 m3 to BS EN 206 and ASTM C94 standards.",
    "4. Incident Reporting & Investigation: Immediate notification to Safety Directorate.",
    "5. Emergency Hotline: +971 50 123 4567"
  ]
);
fs.writeFileSync(path.join(docsDir, "Solidwin_Integrated_HSEQ_Policy.pdf"), doc2);

const doc3 = createValidPdf(
  "SOLIDWIN ISO ACCREDITATIONS & CERTIFICATES PACK",
  "Audited ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 Certifications",
  [
    "Certificate Number: SL-QA-2026-98421",
    "Scope: Ready-Mix concrete production, block fabrication, and civil engineering execution.",
    "Accreditation Body: UKAS & SLAB Accredited Registrar.",
    "Validity Period: Valid through October 2029."
  ]
);
fs.writeFileSync(path.join(docsDir, "Solidwin_ISO_Accreditations_Pack.pdf"), doc3);

const doc4 = createValidPdf(
  "SOLIDWIN CONCRETE & BLOCKS TECHNICAL DATASHEET",
  "Mechanical Specifications, Slump Ranges, and Masonry Properties",
  [
    "1. Concrete Grades: G20, G25, G30, G35, G40, G45 with silica fume / fly ash options.",
    "2. Slump Classes: S2 (50-90mm), S3 (100-150mm), S4 (160-210mm pump mix).",
    "3. Hollow & Solid Blocks: 100mm, 150mm, 200mm compressive strength > 7.5 N/mm2.",
    "4. Interlocking Pavers: Heavy duty 80mm industrial pavers > 45 N/mm2."
  ]
);
fs.writeFileSync(path.join(docsDir, "Solidwin_Concrete_and_Blocks_Datasheet.pdf"), doc4);

console.log("Successfully generated all 4 official PDF files in public/documents/");
