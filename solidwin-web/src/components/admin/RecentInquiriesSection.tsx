"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Truck,
  Building2,
  Layers,
  Bot,
  Calculator,
  FileText,
  Clock,
  DollarSign,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { InquiryItem, InquiryStatus } from "@/lib/dal/types";
import styles from "./RecentInquiriesSection.module.css";

interface RecentInquiriesSectionProps {
  inquiries: InquiryItem[];
  onStatusChange: (id: string, status: InquiryStatus) => Promise<void>;
  onAddNote: (id: string, note: string) => Promise<void>;
}

type FilterTab = "all" | "new" | "urgent" | "ready_mix" | "construction" | "hardware";

function formatRelativeTime(isoDate?: string): string {
  if (!isoDate) return "Recently";
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatAED(value?: number): string {
  if (!value || isNaN(value)) return "—";
  return `AED ${value.toLocaleString()}`;
}

function getDivisionVisual(divisionName?: string) {
  const norm = (divisionName || "").toLowerCase();
  if (norm.includes("ready") || norm.includes("mix") || norm.includes("concrete")) {
    return {
      label: "Ready-Mix Concrete",
      icon: Truck,
      bg: "#fffbeb",
      color: "#b45309",
      border: "#fde68a",
      avatarBg: "#fef3c7",
      avatarColor: "#92400e",
    };
  }
  if (norm.includes("hardware") || norm.includes("block") || norm.includes("equipment")) {
    return {
      label: "Hardware & Blocks",
      icon: Layers,
      bg: "#f0f9ff",
      color: "#0369a1",
      border: "#bae6fd",
      avatarBg: "#e0f2fe",
      avatarColor: "#075985",
    };
  }
  return {
    label: "Construction Services",
    icon: Building2,
    bg: "#f5f3ff",
    color: "#6d28d9",
    border: "#ddd6fe",
    avatarBg: "#ede9fe",
    avatarColor: "#5b21b6",
  };
}

function getSourceVisual(source?: string) {
  switch (source) {
    case "ai_assistant":
      return { label: "AI Guidance", icon: Bot };
    case "ready_mix":
      return { label: "Volume Calc", icon: Calculator };
    case "hardware_boq":
      return { label: "Hardware BOQ", icon: Layers };
    case "construction_rfq":
      return { label: "Turnkey RFQ", icon: FileText };
    default:
      return { label: "Web Inquiry", icon: MessageSquare };
  }
}

export function RecentInquiriesSection({
  inquiries,
  onStatusChange,
  onAddNote,
}: RecentInquiriesSectionProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [newNote, setNewNote] = useState("");
  const [statusMenuOpenId, setStatusMenuOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Derived telemetry metrics
  const totalCount = inquiries.length;
  const urgentCount = inquiries.filter(
    (i) => i.priority === "urgent" || (i.status === "new" && !i.updatedAt)
  ).length;
  const pipelineSum = inquiries.reduce(
    (sum, i) => sum + (i.status !== "closed" ? i.estimatedValue || 0 : 0),
    0
  );

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      // Tab filter
      if (activeTab === "new" && inq.status !== "new") return false;
      if (
        activeTab === "urgent" &&
        inq.priority !== "urgent" &&
        inq.priority !== "high"
      ) {
        return false;
      }
      if (
        activeTab === "ready_mix" &&
        !inq.division?.toLowerCase().includes("ready") &&
        !inq.division?.toLowerCase().includes("mix")
      ) {
        return false;
      }
      if (
        activeTab === "construction" &&
        !inq.division?.toLowerCase().includes("construct")
      ) {
        return false;
      }
      if (
        activeTab === "hardware" &&
        !inq.division?.toLowerCase().includes("hardw") &&
        !inq.division?.toLowerCase().includes("block")
      ) {
        return false;
      }

      // Search query filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        (inq.phone && inq.phone.toLowerCase().includes(q)) ||
        (inq.requestId && inq.requestId.toLowerCase().includes(q)) ||
        (inq.division && inq.division.toLowerCase().includes(q)) ||
        inq.message.toLowerCase().includes(q)
      );
    });
  }, [inquiries, activeTab, search]);

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleStatusSelect = async (
    e: React.MouseEvent,
    id: string,
    newStatus: InquiryStatus
  ) => {
    e.stopPropagation();
    setStatusMenuOpenId(null);
    await onStatusChange(id, newStatus);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAddStaffNote = async () => {
    if (!selectedInquiry || !newNote.trim()) return;
    const noteText = newNote.trim();
    await onAddNote(selectedInquiry.id, noteText);
    setSelectedInquiry((prev) =>
      prev
        ? {
            ...prev,
            staffNotes: [...(prev.staffNotes || []), noteText],
          }
        : null
    );
    setNewNote("");
  };

  const handleCopyRfqSummary = () => {
    if (!selectedInquiry) return;
    const summary = [
      `SOLIDWIN RFQ SUMMARY [${selectedInquiry.requestId || selectedInquiry.id}]`,
      `Client: ${selectedInquiry.name}`,
      `Contact: ${selectedInquiry.email} | ${selectedInquiry.phone || "No phone"}`,
      `Division: ${selectedInquiry.division || "General"}`,
      `Est. Value: ${formatAED(selectedInquiry.estimatedValue)}`,
      `Priority: ${(selectedInquiry.priority || "Medium").toUpperCase()}`,
      `Scope Requirements:`,
      selectedInquiry.message,
    ].join("\n");

    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    }
  };

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <div className={styles.titleRow}>
              <h2 className={styles.cardTitle}>Recent Inquiries &amp; RFQs</h2>
              <span className={styles.liveBadge}>
                <span className={styles.liveDot} />
                Live Stream
              </span>
            </div>
            <p className={styles.cardSubtitle}>
              Multi-channel lead capture from website, calculators &amp; AI assistant
            </p>
          </div>

          <Link href="/admin/inquiries" className={styles.viewAllLink}>
            <span>View All Board ({totalCount})</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Live Operational Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statPill}>
            <span>Active Pipeline:</span>
            <span className={styles.statPillStrong}>{totalCount} leads</span>
          </div>

          {urgentCount > 0 && (
            <div className={`${styles.statPill} ${styles.statUrgent}`}>
              <AlertCircle size={13} />
              <span>Priority Action:</span>
              <span className={styles.statPillStrong}>{urgentCount} urgent</span>
            </div>
          )}

          {pipelineSum > 0 && (
            <div className={`${styles.statPill} ${styles.statPipeline}`}>
              <DollarSign size={13} />
              <span>Est. Pipeline Value:</span>
              <span className={styles.statPillStrong}>{formatAED(pipelineSum)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Filter & Search Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by client, email, phone or scope..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className={styles.clearSearchBtn}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Segmented Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            type="button"
            className={`${styles.filterTab} ${
              activeTab === "all" ? styles.filterTabActive : ""
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Leads ({totalCount})
          </button>
          <button
            type="button"
            className={`${styles.filterTab} ${
              activeTab === "new" ? styles.filterTabActive : ""
            }`}
            onClick={() => setActiveTab("new")}
          >
            Needs Action ({inquiries.filter((i) => i.status === "new").length})
          </button>
          <button
            type="button"
            className={`${styles.filterTab} ${
              activeTab === "urgent" ? styles.filterTabActive : ""
            }`}
            onClick={() => setActiveTab("urgent")}
          >
            Urgent / High ({urgentCount})
          </button>
          <button
            type="button"
            className={`${styles.filterTab} ${
              activeTab === "ready_mix" ? styles.filterTabActive : ""
            }`}
            onClick={() => setActiveTab("ready_mix")}
          >
            Ready-Mix
          </button>
          <button
            type="button"
            className={`${styles.filterTab} ${
              activeTab === "construction" ? styles.filterTabActive : ""
            }`}
            onClick={() => setActiveTab("construction")}
          >
            Construction
          </button>
          <button
            type="button"
            className={`${styles.filterTab} ${
              activeTab === "hardware" ? styles.filterTabActive : ""
            }`}
            onClick={() => setActiveTab("hardware")}
          >
            Hardware
          </button>
        </div>
      </div>

      {/* Main Table / Data List */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client / Reference</th>
              <th>Division &amp; Source</th>
              <th>Commercial Scope &amp; Request</th>
              <th>Pipeline Status</th>
              <th style={{ textAlign: "right" }}>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                      <Search size={22} />
                    </div>
                    <h3 className={styles.emptyTitle}>No matching inquiries found</h3>
                    <p className={styles.emptySub}>
                      Try adjusting your search criteria or switch to another filter tab.
                    </p>
                    {(search || activeTab !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setActiveTab("all");
                        }}
                        className={styles.clearFilterBtn}
                      >
                        Reset all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredInquiries.slice(0, 6).map((inq) => {
                const divVis = getDivisionVisual(inq.division);
                const srcVis = getSourceVisual(inq.source);
                const DivIcon = divVis.icon;
                const SrcIcon = srcVis.icon;
                const initials = (inq.name || "Client")
                  .split(" ")
                  .map((p) => p[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                const isSelected = selectedInquiry?.id === inq.id;

                return (
                  <tr
                    key={inq.id}
                    className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                    onClick={() => setSelectedInquiry(inq)}
                  >
                    {/* Client & Reference */}
                    <td>
                      <div className={styles.clientCell}>
                        <div
                          className={styles.avatar}
                          style={{
                            background: divVis.avatarBg,
                            color: divVis.avatarColor,
                          }}
                        >
                          {initials}
                        </div>
                        <div className={styles.clientMeta}>
                          <div className={styles.clientTop}>
                            <span className={styles.clientName} title={inq.name}>
                              {inq.name}
                            </span>
                            <span
                              className={styles.reqBadge}
                              title="Click to copy request ID"
                              onClick={(e) =>
                                handleCopy(
                                  e,
                                  inq.requestId || inq.id,
                                  `req-${inq.id}`
                                )
                              }
                            >
                              {copiedId === `req-${inq.id}` ? (
                                <span style={{ color: "#10b981" }}>Copied!</span>
                              ) : (
                                `#${inq.requestId || inq.id.slice(-6)}`
                              )}
                            </span>
                          </div>
                          <div className={styles.clientContact}>
                            <span>{inq.email}</span>
                            <span>•</span>
                            <span className={styles.timeAgo}>
                              {formatRelativeTime(inq.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Division & Channel */}
                    <td>
                      <div className={styles.divisionCell}>
                        <span
                          className={styles.divisionPill}
                          style={{
                            background: divVis.bg,
                            color: divVis.color,
                            border: `1px solid ${divVis.border}`,
                          }}
                        >
                          <DivIcon size={12} />
                          <span>{divVis.label}</span>
                        </span>
                        <br />
                        <span className={styles.channelPill}>
                          <SrcIcon size={11} />
                          <span>{srcVis.label}</span>
                        </span>
                      </div>
                    </td>

                    {/* Commercial Scope & Message Snippet */}
                    <td>
                      <div className={styles.scopeCell}>
                        <div className={styles.scopeTop}>
                          {inq.estimatedValue && inq.estimatedValue > 0 ? (
                            <span className={styles.valueBadge}>
                              <DollarSign size={11} />
                              <span>{formatAED(inq.estimatedValue)}</span>
                            </span>
                          ) : null}

                          {inq.priority === "urgent" && (
                            <span
                              className={`${styles.priorityBadge} ${styles.priorityUrgent}`}
                            >
                              ● Urgent
                            </span>
                          )}
                          {inq.priority === "high" && (
                            <span
                              className={`${styles.priorityBadge} ${styles.priorityHigh}`}
                            >
                              ● High
                            </span>
                          )}
                        </div>
                        <p className={styles.messageSnippet} title={inq.message}>
                          {inq.message}
                        </p>
                      </div>
                    </td>

                    {/* Status with Quick Triage Dropdown */}
                    <td>
                      <div className={styles.statusCell}>
                        <button
                          type="button"
                          className={styles.statusDropdownTrigger}
                          onClick={(e) => {
                            e.stopPropagation();
                            setStatusMenuOpenId((prev) =>
                              prev === inq.id ? null : inq.id
                            );
                          }}
                          title="Click to quick-change status"
                        >
                          <StatusBadge status={inq.status} size="sm" />
                          <ChevronDown size={12} color="#94a3b8" />
                        </button>

                        {/* Inline Status Menu */}
                        {statusMenuOpenId === inq.id && (
                          <div
                            className={styles.statusMenu}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className={styles.statusOption}
                              onClick={(e) => handleStatusSelect(e, inq.id, "new")}
                            >
                              <span style={{ color: "#2563eb" }}>●</span>
                              <span>New / Inbox</span>
                            </button>
                            <button
                              type="button"
                              className={styles.statusOption}
                              onClick={(e) =>
                                handleStatusSelect(e, inq.id, "in_review")
                              }
                            >
                              <span style={{ color: "#d97706" }}>●</span>
                              <span>In Review</span>
                            </button>
                            <button
                              type="button"
                              className={styles.statusOption}
                              onClick={(e) =>
                                handleStatusSelect(e, inq.id, "quoted")
                              }
                            >
                              <span style={{ color: "#7c3aed" }}>●</span>
                              <span>Quoted</span>
                            </button>
                            <button
                              type="button"
                              className={styles.statusOption}
                              onClick={(e) => handleStatusSelect(e, inq.id, "won")}
                            >
                              <span style={{ color: "#16a34a" }}>●</span>
                              <span>Won</span>
                            </button>
                            <button
                              type="button"
                              className={styles.statusOption}
                              onClick={(e) => handleStatusSelect(e, inq.id, "closed")}
                            >
                              <span style={{ color: "#64748b" }}>●</span>
                              <span>Closed</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action Group */}
                    <td className={styles.actionsCell}>
                      <div className={styles.actionButtonGroup}>
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.iconBtn}
                            title={`WhatsApp ${inq.name} (${inq.phone})`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={13} color="#16a34a" />
                          </a>
                        )}

                        <a
                          href={`mailto:${inq.email}?subject=Solidwin - Your Inquiry Ref: ${
                            inq.requestId || inq.id
                          }`}
                          className={styles.iconBtn}
                          title={`Email ${inq.email}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail size={13} />
                        </a>

                        <button
                          type="button"
                          className={styles.inspectBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInquiry(inq);
                          }}
                          title="Open detailed lead slide-over drawer"
                        >
                          <span>Inspect</span>
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================ */}
      {/* Slide-Over Inspection Drawer                                 */}
      {/* ============================================================ */}
      {selectedInquiry && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setSelectedInquiry(null)}
        >
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerHeaderTitle}>
                <span className={styles.reqBadge}>
                  #{selectedInquiry.requestId || selectedInquiry.id}
                </span>
                <StatusBadge status={selectedInquiry.status} size="sm" />
              </div>
              <button
                type="button"
                className={styles.drawerCloseBtn}
                onClick={() => setSelectedInquiry(null)}
                title="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className={styles.drawerBody}>
              {/* Hero Contact Card */}
              <div className={styles.drawerHero}>
                <div>
                  <h3 className={styles.drawerHeroName}>{selectedInquiry.name}</h3>
                  <div className={styles.drawerHeroContacts}>
                    <span>📧 {selectedInquiry.email}</span>
                    {selectedInquiry.phone && <span>📞 {selectedInquiry.phone}</span>}
                  </div>
                </div>

                <div className={styles.drawerQuickActions}>
                  {selectedInquiry.phone && (
                    <a
                      href={`https://wa.me/${selectedInquiry.phone.replace(
                        /[^0-9]/g,
                        ""
                      )}?text=${encodeURIComponent(
                        `Hello ${selectedInquiry.name}, thank you for contacting Solidwin regarding your ${selectedInquiry.division || "inquiry"}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.drawerActionLink} ${styles.whatsappLink}`}
                    >
                      <Phone size={13} />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Solidwin - Regarding your Inquiry ${
                      selectedInquiry.requestId || selectedInquiry.id
                    }`}
                    className={styles.drawerActionLink}
                  >
                    <Mail size={13} />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* 2x2 Commercial & Operational Specs Grid */}
              <div className={styles.specsGrid}>
                <div className={styles.specCard}>
                  <span className={styles.specLabel}>Division Unit</span>
                  <span className={styles.specValue}>
                    {selectedInquiry.division || "General Enquiry"}
                  </span>
                </div>
                <div className={styles.specCard}>
                  <span className={styles.specLabel}>Estimated Value</span>
                  <span className={styles.specValue} style={{ color: "#047857" }}>
                    {formatAED(selectedInquiry.estimatedValue)}
                  </span>
                </div>
                <div className={styles.specCard}>
                  <span className={styles.specLabel}>Acquisition Channel</span>
                  <span className={styles.specValue}>
                    {getSourceVisual(selectedInquiry.source).label}
                  </span>
                </div>
                <div className={styles.specCard}>
                  <span className={styles.specLabel}>Logged Timestamp</span>
                  <span className={styles.specValue}>
                    {formatRelativeTime(selectedInquiry.createdAt)} (
                    {new Date(selectedInquiry.createdAt).toLocaleDateString()})
                  </span>
                </div>
              </div>

              {/* Customer Requirements / Message Box */}
              <div>
                <h4 className={styles.sectionTitle}>Customer Requirement Scope</h4>
                <div className={styles.messageBox}>{selectedInquiry.message}</div>
              </div>

              {/* Internal Staff Notes */}
              <div>
                <h4 className={styles.sectionTitle}>
                  Internal Operations Notes ({selectedInquiry.staffNotes?.length || 0})
                </h4>

                {selectedInquiry.staffNotes && selectedInquiry.staffNotes.length > 0 ? (
                  <div className={styles.notesList}>
                    {selectedInquiry.staffNotes.map((note, idx) => (
                      <div key={idx} className={styles.noteItem}>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>
                          <strong>Staff Internal Log:</strong>
                        </div>
                        <div>{note}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#94a3b8",
                      fontStyle: "italic",
                      marginBottom: 10,
                    }}
                  >
                    No internal staff notes recorded yet.
                  </div>
                )}

                <div className={styles.addNoteBox}>
                  <textarea
                    placeholder="Append technical review note, pricing margin approval or plant dispatch update..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className={styles.noteTextarea}
                  />
                  <button
                    type="button"
                    onClick={handleAddStaffNote}
                    disabled={!newNote.trim()}
                    className={styles.addNoteBtn}
                  >
                    Append Staff Note
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className={styles.drawerFooter}>
              <button
                type="button"
                onClick={handleCopyRfqSummary}
                className={styles.drawerActionLink}
                title="Copy entire RFQ dossier to clipboard for dispatch"
              >
                {copiedSummary ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copiedSummary ? "RFQ Copied!" : "Copy RFQ Summary"}</span>
              </button>

              <div style={{ display: "flex", gap: 8 }}>
                {selectedInquiry.status !== "quoted" && (
                  <button
                    type="button"
                    className={styles.drawerActionLink}
                    onClick={(e) => handleStatusSelect(e, selectedInquiry.id, "quoted")}
                    style={{ background: "#f5f3ff", color: "#6d28d9", borderColor: "#ddd6fe" }}
                  >
                    Mark as Quoted
                  </button>
                )}
                {selectedInquiry.status !== "won" && (
                  <button
                    type="button"
                    className={styles.drawerActionLink}
                    onClick={(e) => handleStatusSelect(e, selectedInquiry.id, "won")}
                    style={{ background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" }}
                  >
                    Mark as Won
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
