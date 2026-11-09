export interface ManagedDocument {
  id: string;
  title: string;
  description: string;
  category: "profile" | "hseq" | "certificate" | "brochure";
  fileName: string;
  fileSize: string;
  fileUrl: string; // Base64 data URL or external download link
  version: string;
  updatedAt: string;
}

export const DEFAULT_DOCUMENTS: ManagedDocument[] = [
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
