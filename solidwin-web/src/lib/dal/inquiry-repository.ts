import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { auditLogRepository } from "./audit-repository";
import type { IInquiryRepository, InquiryItem, InquiryStatus, AuditActor } from "./types";

const COLLECTION_NAME = "solidwin_inquiries";
const LOCAL_STORAGE_KEY = "solidwin_inquiries_store_v2";

const SEED_INQUIRIES: InquiryItem[] = [
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
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    estimatedValue: 125000,
    priority: "urgent",
    staffNotes: ["Priority client. Batching plant 1 confirmed ready for morning slot."],
    assignedTo: "Tariq Mansour",
  },
  {
    id: "inq-102",
    requestId: "req-102",
    name: "Sarah Jenkins",
    email: "s.jenkins@vertexdesign.org",
    phone: "+971 52 987 6543",
    division: "Construction Services",
    message: "Seeking turnkey design & build proposal for 4-storey commercial office development. Architectural drawings ready.",
    consent: true,
    status: "in_review",
    source: "construction_rfq",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    estimatedValue: 2400000,
    priority: "high",
    staffNotes: ["Preliminary BOQ review completed by structural engineering team."],
    assignedTo: "Marcus Vance",
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
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    estimatedValue: 84000,
    priority: "medium",
    staffNotes: ["Discounted bulk rate of 3.80 AED/unit approved by branch manager."],
    assignedTo: "Elena Rostova",
  },
  {
    id: "inq-104",
    requestId: "req-104",
    name: "Michael Ross",
    email: "m.ross@urbanliving.com",
    phone: "+971 56 321 0987",
    division: "Construction Services",
    message: "Villa luxury refurbishment enquiry in Palm Crescent. Architectural fit-out & pool terrace.",
    consent: true,
    status: "won",
    source: "contact_form",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    estimatedValue: 1200000,
    priority: "high",
    staffNotes: ["Contract signed. Initial milestone payment processed."],
    assignedTo: "Tariq Mansour",
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
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    estimatedValue: 45000,
    priority: "medium",
    staffNotes: ["Captured via Solidwin AI Assistant. Mix code C35/40 recommended."],
  },
];

class FirebaseInquiryRepository implements IInquiryRepository {
  private inMemory: InquiryItem[] = [...SEED_INQUIRIES];

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.inMemory = parsed;
          }
        }
      } catch {
        // Fallback
      }
    }
  }

  private persistLocal() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.inMemory));
      } catch {
        // quota
      }
    }
  }

  async getAll(): Promise<InquiryItem[]> {
    if (db && typeof window !== "undefined") {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const q = query(colRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const list: InquiryItem[] = [];
          snapshot.forEach((snap) => {
            const data = snap.data();
            list.push({
              id: snap.id,
              requestId: data.requestId || snap.id,
              name: data.name || "Anonymous",
              email: data.email || "",
              phone: data.phone || "",
              division: data.division || "General",
              message: data.message || "",
              consent: data.consent ?? true,
              status: (data.status as InquiryStatus) || "new",
              source: data.source || "contact_form",
              createdAt:
                typeof data.createdAt?.toDate === "function"
                  ? data.createdAt.toDate().toISOString()
                  : data.createdAt || new Date().toISOString(),
              updatedAt:
                typeof data.updatedAt?.toDate === "function"
                  ? data.updatedAt.toDate().toISOString()
                  : data.updatedAt,
              estimatedValue: data.estimatedValue,
              priority: data.priority || "medium",
              staffNotes: data.staffNotes || [],
              assignedTo: data.assignedTo,
            });
          });

          // Ensure seeds exist if not in Firestore yet
          const seen = new Set(list.map((i) => i.id));
          for (const seed of this.inMemory) {
            if (!seen.has(seed.id)) {
              list.push(seed);
            }
          }
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return list;
        }
      } catch {
        // Fallback to local
      }
    }

    return [...this.inMemory];
  }

  async getById(id: string): Promise<InquiryItem | null> {
    const list = await this.getAll();
    return list.find((i) => i.id === id) || null;
  }

  async create(payload: Omit<InquiryItem, "id" | "createdAt">): Promise<InquiryItem> {
    const newInquiry: InquiryItem = {
      ...payload,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: payload.status || "new",
      staffNotes: payload.staffNotes || [],
    };

    this.inMemory.unshift(newInquiry);
    this.persistLocal();

    // Log action to audit repository
    await auditLogRepository.recordLog({
      actor: { name: "Web Inbound Lead", email: payload.email, role: "system" },
      action: "LEAD_CREATED",
      category: "inquiries",
      targetId: newInquiry.id,
      targetName: `${newInquiry.name} (${newInquiry.division || "General"})`,
      details: `New inquiry submitted from source '${newInquiry.source}'.`,
    });

    if (db && typeof window !== "undefined") {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(colRef, {
          ...newInquiry,
          createdAt: serverTimestamp(),
        });
        newInquiry.id = docRef.id;
      } catch {
        // Offline
      }
    }

    return newInquiry;
  }

  async updateStatus(
    id: string,
    status: InquiryStatus,
    actor: AuditActor = { name: "Administrator", email: "admin@solidwin.ae", role: "admin" }
  ): Promise<boolean> {
    const existing = this.inMemory.find((i) => i.id === id);
    const prevStatus = existing?.status || "new";

    this.inMemory = this.inMemory.map((item) =>
      item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
    );
    this.persistLocal();

    // Audit log
    await auditLogRepository.recordLog({
      actor,
      action: "INQUIRY_STATUS_CHANGED",
      category: "inquiries",
      targetId: id,
      targetName: existing ? `${existing.name} (${existing.division})` : id,
      details: `Lead status changed from '${prevStatus}' to '${status}'.`,
      metadata: { previousStatus: prevStatus, newStatus: status },
    });

    if (db && typeof window !== "undefined" && !id.startsWith("inq-10")) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
          status,
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Handled locally
      }
    }

    return true;
  }

  async addStaffNote(
    id: string,
    note: string,
    actor: AuditActor = { name: "Administrator", email: "admin@solidwin.ae", role: "admin" }
  ): Promise<boolean> {
    const existing = this.inMemory.find((i) => i.id === id);
    this.inMemory = this.inMemory.map((item) =>
      item.id === id
        ? {
            ...item,
            staffNotes: [...(item.staffNotes ?? []), note],
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    this.persistLocal();

    await auditLogRepository.recordLog({
      actor,
      action: "STAFF_NOTE_ADDED",
      category: "inquiries",
      targetId: id,
      targetName: existing ? existing.name : id,
      details: `Added staff note: "${note.substring(0, 60)}${note.length > 60 ? "..." : ""}"`,
    });

    if (db && typeof window !== "undefined" && !id.startsWith("inq-10")) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
          staffNotes: [...(existing?.staffNotes ?? []), note],
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Handled locally
      }
    }

    return true;
  }

  async delete(
    id: string,
    actor: AuditActor = { name: "Administrator", email: "admin@solidwin.ae", role: "admin" }
  ): Promise<boolean> {
    const existing = this.inMemory.find((i) => i.id === id);
    this.inMemory = this.inMemory.filter((i) => i.id !== id);
    this.persistLocal();

    await auditLogRepository.recordLog({
      actor,
      action: "INQUIRY_DELETED",
      category: "inquiries",
      targetId: id,
      targetName: existing ? existing.name : id,
      details: `Lead inquiry deleted from workspace.`,
    });

    if (db && typeof window !== "undefined" && !id.startsWith("inq-10")) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
      } catch {
        // Handled locally
      }
    }

    return true;
  }
}

export const inquiryRepository = new FirebaseInquiryRepository();
