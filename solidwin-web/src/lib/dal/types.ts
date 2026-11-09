/**
 * Data Access Layer (DAL) Domain Types and Repository Contracts.
 * 
 * These interfaces decouple the application UI and business logic from the underlying
 * data store (Firebase Firestore, REST API, Supabase, or PostgreSQL).
 * To swap the database or API layer, simply provide a new implementation of these interfaces.
 */

export type InquiryStatus = "new" | "in_review" | "quoted" | "won" | "closed";
export type InquirySource = "contact_form" | "construction_rfq" | "ready_mix" | "hardware_boq" | "ai_assistant";

export interface InquiryItem {
  id: string;
  requestId: string;
  name: string;
  email: string;
  phone?: string;
  division?: string;
  message: string;
  consent?: boolean;
  status: InquiryStatus;
  source: InquirySource;
  createdAt: string;
  updatedAt?: string;
  estimatedValue?: number;
  priority?: "low" | "medium" | "high" | "urgent";
  staffNotes?: string[];
  assignedTo?: string;
}

export interface InquiryFilterOptions {
  division?: string;
  status?: InquiryStatus | "all";
  searchQuery?: string;
}

export interface IInquiryRepository {
  getAll(): Promise<InquiryItem[]>;
  getById(id: string): Promise<InquiryItem | null>;
  create(payload: Omit<InquiryItem, "id" | "createdAt">): Promise<InquiryItem>;
  updateStatus(id: string, status: InquiryStatus, actor?: AuditActor): Promise<boolean>;
  addStaffNote(id: string, note: string, actor?: AuditActor): Promise<boolean>;
  delete(id: string, actor?: AuditActor): Promise<boolean>;
}

// -------------------------------------------------------------
// Audit Log Contracts
// -------------------------------------------------------------

export interface AuditActor {
  name: string;
  email: string;
  role: "superadmin" | "admin" | "system";
}

export type AuditCategory =
  | "inquiries"
  | "projects"
  | "calculators"
  | "documents"
  | "security"
  | "settings"
  | "authentication";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: AuditActor;
  action: string;
  category: AuditCategory;
  targetId?: string;
  targetName?: string;
  details: string;
  metadata?: Record<string, unknown>;
}

export interface IAuditLogRepository {
  getLogs(limitCount?: number, category?: AuditCategory): Promise<AuditLogEntry[]>;
  recordLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry>;
  clearLogs?(): Promise<boolean>;
}

// -------------------------------------------------------------
// Real Analytics Contracts
// -------------------------------------------------------------

export type AnalyticsEventType =
  | "page_view"
  | "calculator_run"
  | "calculator_rfq_autofill"
  | "inquiry_submitted"
  | "whatsapp_click"
  | "document_download";

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: AnalyticsEventType;
  page: string;
  division?: string;
  sessionId?: string;
  details?: Record<string, unknown>;
}

export interface RealAnalyticsMetrics {
  totalPageViews: number;
  uniqueSessions: number;
  calculatorRuns: number;
  submittedInquiries: number;
  whatsAppInquiries: number;
  documentDownloads: number;
  conversionRate: number; // e.g., (inquiries / unique sessions) * 100
  topPages: { path: string; title: string; views: number }[];
  divisionBreakdown: { division: string; count: number; percentage: number }[];
  recentEvents: AnalyticsEvent[];
}

export interface IAnalyticsRepository {
  trackEvent(type: AnalyticsEventType, page: string, details?: Record<string, unknown>): Promise<void>;
  getMetrics(timeframe?: "7d" | "30d" | "90d"): Promise<RealAnalyticsMetrics>;
  getRawEvents(limitCount?: number): Promise<AnalyticsEvent[]>;
}
