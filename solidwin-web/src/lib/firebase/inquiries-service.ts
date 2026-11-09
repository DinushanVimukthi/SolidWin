/**
 * Legacy Inquiries Service Boundary
 * 
 * Re-routes to the Data Access Layer (DAL) InquiryRepository for clean modularity,
 * audit logging, and Jira Kanban lifecycle management.
 */

import { inquiryRepository } from "@/lib/dal/inquiry-repository";
import type { ContactSubmissionPayload, StoredInquiry } from "@/services/inquiry";
import type { InquiryItem, InquiryStatus } from "@/lib/dal/types";

function toStoredInquiry(item: InquiryItem): StoredInquiry {
  return {
    id: item.id,
    requestId: item.requestId,
    name: item.name,
    email: item.email,
    phone: item.phone,
    division: item.division,
    message: item.message,
    consent: item.consent,
    status: (item.status === "in_review" ? "in_progress" : item.status === "won" ? "closed" : item.status) as StoredInquiry["status"],
    source: item.source,
    createdAt: item.createdAt,
    staffNotes: item.staffNotes,
  };
}

export async function getAdminInquiries(): Promise<StoredInquiry[]> {
  const items = await inquiryRepository.getAll();
  return items.map(toStoredInquiry);
}

export async function submitInquiryToFirebase(input: ContactSubmissionPayload): Promise<{ ok: boolean; id: string }> {
  const created = await inquiryRepository.create({
    requestId: input.requestId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    division: input.division || "General",
    message: input.message,
    consent: input.consent ?? true,
    status: "new",
    source: "contact_form",
    staffNotes: [],
  });

  return { ok: true, id: created.id };
}

export async function updateAdminInquiryStatus(
  id: string,
  status: StoredInquiry["status"]
): Promise<boolean> {
  const dalStatus: InquiryStatus = status === "in_progress" ? "in_review" : (status as InquiryStatus);
  return inquiryRepository.updateStatus(id, dalStatus);
}

export async function addAdminStaffNote(id: string, note: string): Promise<boolean> {
  return inquiryRepository.addStaffNote(id, note);
}
