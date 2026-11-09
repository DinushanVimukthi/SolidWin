import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { IAuditLogRepository, AuditLogEntry, AuditCategory } from "./types";

const COLLECTION_NAME = "solidwin_audit_logs";
const LOCAL_STORAGE_KEY = "solidwin_audit_logs_v1";

const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actor: {
      name: "Marcus Vance",
      email: "m.vance@exe.ae",
      role: "superadmin",
    },
    action: "SYSTEM_TENANT_VERIFIED",
    category: "security",
    targetId: "tenant_solidwin_prod",
    targetName: "EXE Multi-Tenant Scope",
    details: "Superadmin verified tenant isolation boundary and multi-division data routing rules.",
  },
  {
    id: "audit-002",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    actor: {
      name: "Tariq Mansour",
      email: "t.mansour@solidwin.ae",
      role: "admin",
    },
    action: "PROJECT_CREATED",
    category: "projects",
    targetId: "metro-tower-commercial",
    targetName: "Metro Plaza Commercial Headquarters",
    details: "Created portfolio case study with 16:9 hero image and 4:3 excavation before/after slider.",
  },
  {
    id: "audit-003",
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    actor: {
      name: "Elena Rostova",
      email: "e.rostova@exe.ae",
      role: "admin",
    },
    action: "CALCULATOR_PARAMETERS_TUNED",
    category: "calculators",
    targetId: "calc-blocks-200mm",
    targetName: "Standard 200mm Hollow Block",
    details: "Updated unit rate to 3.85 AED and waste allowance factor to 6.5%.",
  },
  {
    id: "audit-004",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    actor: {
      name: "System Dispatcher",
      email: "dispatcher@solidwin.ae",
      role: "system",
    },
    action: "INQUIRY_RECEIVED",
    category: "inquiries",
    targetId: "inq-101",
    targetName: "Ahmed Al-Mansoor (Ready-Mix)",
    details: "New RFQ captured from Ready-Mix Concrete Calculator: 350 m³ G30 pump mix.",
  },
];

class FirebaseAuditLogRepository implements IAuditLogRepository {
  private inMemoryLogs: AuditLogEntry[] = [...SEED_AUDIT_LOGS];

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.inMemoryLogs = parsed;
          }
        }
      } catch {
        // LocalStorage fallback handled gracefully
      }
    }
  }

  private persistLocal() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.inMemoryLogs));
      } catch {
        // quota errors ignored
      }
    }
  }

  async getLogs(limitCount = 100, category?: AuditCategory): Promise<AuditLogEntry[]> {
    if (db && typeof window !== "undefined") {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const q = query(colRef, orderBy("timestamp", "desc"), limit(limitCount));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const list: AuditLogEntry[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            list.push({
              id: d.id,
              timestamp:
                typeof data.timestamp?.toDate === "function"
                  ? data.timestamp.toDate().toISOString()
                  : data.timestamp || new Date().toISOString(),
              actor: data.actor || { name: "Administrator", email: "admin@solidwin.ae", role: "admin" },
              action: data.action || "UNKNOWN_ACTION",
              category: data.category || "security",
              targetId: data.targetId,
              targetName: data.targetName,
              details: data.details || "",
              metadata: data.metadata,
            });
          });

          // Merge with memory/seed ensuring no duplicates
          const seen = new Set(list.map((l) => l.id));
          for (const item of this.inMemoryLogs) {
            if (!seen.has(item.id)) {
              list.push(item);
            }
          }
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          return category ? list.filter((l) => l.category === category) : list;
        }
      } catch {
        // Fallback to local
      }
    }

    return category
      ? this.inMemoryLogs.filter((l) => l.category === category)
      : [...this.inMemoryLogs];
  }

  async recordLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry> {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };

    this.inMemoryLogs.unshift(newEntry);
    this.persistLocal();

    if (db && typeof window !== "undefined") {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        await addDoc(colRef, {
          ...entry,
          timestamp: serverTimestamp(),
        });
      } catch {
        // Offline / Fallback handled
      }
    }

    return newEntry;
  }

  async clearLogs(): Promise<boolean> {
    this.inMemoryLogs = [];
    this.persistLocal();
    return true;
  }
}

export const auditLogRepository = new FirebaseAuditLogRepository();
