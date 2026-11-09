/**
 * Data Access Layer (DAL) Factory & Entrypoint.
 * 
 * Central registry for repositories. Enables switching between Firebase Firestore,
 * REST API, Supabase, or in-memory mock adapters without touching consumer components.
 */

export * from "./types";
export { inquiryRepository } from "./inquiry-repository";
export { auditLogRepository } from "./audit-repository";
export { analyticsRepository } from "./analytics-repository";

import { inquiryRepository } from "./inquiry-repository";
import { auditLogRepository } from "./audit-repository";
import { analyticsRepository } from "./analytics-repository";
import type { IInquiryRepository, IAuditLogRepository, IAnalyticsRepository } from "./types";

/**
 * Access the active Inquiry repository.
 */
export function getInquiryRepository(): IInquiryRepository {
  return inquiryRepository;
}

/**
 * Access the active Audit Log repository.
 */
export function getAuditLogRepository(): IAuditLogRepository {
  return auditLogRepository;
}

/**
 * Access the active Real Analytics repository.
 */
export function getAnalyticsRepository(): IAnalyticsRepository {
  return analyticsRepository;
}
