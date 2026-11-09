/**
 * Inquiry submission boundary. The UI depends on this interface only, so the mock
 * can be replaced by the real EXE portal API without touching components.
 */
export interface InquiryResult {
  ok: boolean;
  /** Idempotency key / request id, used to prevent duplicate leads on retry. */
  requestId: string;
}

export interface ContactSubmissionPayload {
  name: string;
  phone?: string;
  email: string;
  division?: string;
  message: string;
  consent?: boolean;
  requestId: string;
}

export interface StoredInquiry extends ContactSubmissionPayload {
  id: string;
  createdAt: string;
  status: "new" | "in_progress" | "closed" | "quoted";
  source: "contact_form" | "construction_rfq" | "ready_mix" | "hardware_boq" | "ai_assistant";
  staffNotes?: string[];
}

export interface InquiryService {
  submitContact(input: ContactSubmissionPayload): Promise<InquiryResult>;
  getInquiries(): Promise<StoredInquiry[]>;
  updateStatus(id: string, status: StoredInquiry["status"]): Promise<boolean>;
  addStaffNote(id: string, note: string): Promise<boolean>;
}

// Initial seed inquiries matching the requirements in the handover document
const initialInquiries: StoredInquiry[] = [
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
    createdAt: "2026-10-31T09:30:00Z",
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
    createdAt: "2026-10-30T14:15:00Z",
    staffNotes: ["Preliminary BOQ review completed by structural team."],
  },
  {
    id: "inq-103",
    requestId: "req-103",
    name: "Kareem Tarek",
    email: "kareem.t@delta-contracting.ae",
    phone: "+971 55 456 7890",
    division: "Hardware & Blocks",
    message: "Quote needed for 18,000 units of 200mm solid blocks and 3 mobile scissor lifts hire for 4 months.",
    consent: true,
    status: "quoted",
    source: "hardware_boq",
    createdAt: "2026-10-29T11:00:00Z",
    staffNotes: ["Discounted rate approved by branch manager."],
  },
  {
    id: "inq-104",
    requestId: "req-104",
    name: "Michael Ross",
    email: "m.ross@urbanliving.com",
    phone: "+971 56 321 0987",
    division: "Construction Services",
    message: "Villa luxury refurbishment enquiry in Palm Crescent. Estimated budget: $1.2M.",
    consent: true,
    status: "new",
    source: "contact_form",
    createdAt: "2026-10-31T08:00:00Z",
    staffNotes: [],
  },
  {
    id: "inq-105",
    requestId: "req-105",
    name: "Fatima Noor",
    email: "f.noor@greenhorizon.ae",
    phone: "+971 50 654 3210",
    division: "Ready-Mix Concrete",
    message: "Customer asked AI assistant about slump requirements for submerged retaining wall, requested engineer follow-up.",
    consent: true,
    status: "new",
    source: "ai_assistant",
    createdAt: "2026-10-31T11:45:00Z",
    staffNotes: ["Captured via Solidwin AI Assistant."],
  },
];

let inMemoryInquiries: StoredInquiry[] = [...initialInquiries];

/** Development stand-in with localStorage persistence when running in browser. */
export const mockInquiryService: InquiryService = {
  async submitContact(input) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newInquiry: StoredInquiry = {
      ...input,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "new",
      source: "contact_form",
      staffNotes: [],
    };
    inMemoryInquiries = [newInquiry, ...inMemoryInquiries];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("solidwin_inquiries", JSON.stringify(inMemoryInquiries));
      } catch {
        // ignore storage quota errors
      }
    }
    return { ok: true, requestId: input.requestId };
  },

  async getInquiries() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("solidwin_inquiries");
        if (stored) {
          inMemoryInquiries = JSON.parse(stored);
        }
      } catch {
        // ignore JSON parse error
      }
    }
    return [...inMemoryInquiries];
  },

  async updateStatus(id, status) {
    inMemoryInquiries = inMemoryInquiries.map((item) =>
      item.id === id ? { ...item, status } : item
    );
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("solidwin_inquiries", JSON.stringify(inMemoryInquiries));
      } catch {
        // ignore storage quota errors
      }
    }
    return true;
  },

  async addStaffNote(id, note) {
    inMemoryInquiries = inMemoryInquiries.map((item) =>
      item.id === id ? { ...item, staffNotes: [...(item.staffNotes ?? []), note] } : item
    );
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("solidwin_inquiries", JSON.stringify(inMemoryInquiries));
      } catch {
        // ignore storage quota errors
      }
    }
    return true;
  },
};
