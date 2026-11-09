"use client";

import { useState, useEffect } from "react";
import {
  Search,
  X,
  Kanban,
  List,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { inquiryRepository } from "@/lib/dal/inquiry-repository";
import type { InquiryItem, InquiryStatus } from "@/lib/dal/types";
import styles from "../admin.module.css";

type DivisionTab = "all" | "construction" | "ready_mix" | "hardware" | "ai_assistant";

const COLUMNS: { id: InquiryStatus; title: string; color: string; bg: string }[] = [
  { id: "new", title: "New / Inbox", color: "#0284c7", bg: "#f0f9ff" },
  { id: "in_review", title: "In Review / Technical", color: "#d97706", bg: "#fffbeb" },
  { id: "quoted", title: "Quoted / Proposal", color: "#7c3aed", bg: "#f5f3ff" },
  { id: "won", title: "Won", color: "#16a34a", bg: "#f0fdf4" },
  { id: "closed", title: "Closed / Archived", color: "#64748b", bg: "#f8fafc" },
];

export default function AdminInquiriesJiraPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [activeTab, setActiveTab] = useState<DivisionTab>("all");
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [newNote, setNewNote] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [draggedInquiryId, setDraggedInquiryId] = useState<string | null>(null);
  const [tablePage, setTablePage] = useState(1);
  const tablePageSize = 10;

  useEffect(() => {
    let active = true;
    inquiryRepository.getAll().then((data) => {
      if (active) setInquiries(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    const actor = {
      name: "Tariq Mansour",
      email: "t.mansour@solidwin.ae",
      role: "admin" as const,
    };

    await inquiryRepository.updateStatus(id, newStatus, actor);
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showNotify(`Lead #${id} moved to ${newStatus.replace("_", " ").toUpperCase()}`);
  };

  const handleAddNote = async (id: string) => {
    if (!newNote.trim()) return;
    const actor = {
      name: "Tariq Mansour",
      email: "t.mansour@solidwin.ae",
      role: "admin" as const,
    };

    await inquiryRepository.addStaffNote(id, newNote.trim(), actor);
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id ? { ...inq, staffNotes: [...(inq.staffNotes ?? []), newNote.trim()] } : inq
      )
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) =>
        prev ? { ...prev, staffNotes: [...(prev.staffNotes ?? []), newNote.trim()] } : null
      );
    }
    setNewNote("");
    showNotify("Staff internal note appended.");
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedInquiryId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, columnId: InquiryStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedInquiryId;
    if (id) {
      await handleStatusChange(id, columnId);
      setDraggedInquiryId(null);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    // Division filter
    if (activeTab === "construction" && !inq.division?.toLowerCase().includes("construction") && inq.source !== "construction_rfq") {
      return false;
    }
    if (activeTab === "ready_mix" && !inq.division?.toLowerCase().includes("ready") && !inq.division?.toLowerCase().includes("concrete") && inq.source !== "ready_mix") {
      return false;
    }
    if (activeTab === "hardware" && !inq.division?.toLowerCase().includes("hardware") && !inq.division?.toLowerCase().includes("block") && inq.source !== "hardware_boq") {
      return false;
    }
    if (activeTab === "ai_assistant" && inq.source !== "ai_assistant") {
      return false;
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = inq.name.toLowerCase().includes(q);
      const matchEmail = inq.email.toLowerCase().includes(q);
      const matchMsg = inq.message.toLowerCase().includes(q);
      return matchName || matchEmail || matchMsg;
    }

    return true;
  });

  const tableTotalPages = Math.ceil(filteredInquiries.length / tablePageSize) || 1;
  const currentTablePage = Math.min(tablePage, tableTotalPages);
  const pagedTableInquiries = filteredInquiries.slice(
    (currentTablePage - 1) * tablePageSize,
    currentTablePage * tablePageSize
  );

  return (
    <>
      <AdminHeader
        title="Inquiries & RFQ Lead Management"
        description="Visual Kanban swimlanes for tracking leads across Construction, Ready-Mix, and Hardware."
      />

      <div className={styles.pageContainer}>
        {/* Toast Notification */}
        {notification && (
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              background: "#310e54",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CheckCircle2 size={16} color="#34d399" />
            <span>{notification}</span>
          </div>
        )}

        {/* Top Controls: Division Tabs & View Mode Switcher */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          {/* Division Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { id: "all", label: "All Leads" },
              { id: "construction", label: "Construction Services" },
              { id: "ready_mix", label: "Ready-Mix Concrete" },
              { id: "hardware", label: "Hardware & Blocks" },
              { id: "ai_assistant", label: "AI Assistant Leads" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as DivisionTab);
                  setTablePage(1);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 600,
                  border: "1px solid",
                  borderColor: activeTab === tab.id ? "#310e54" : "#e2e8f0",
                  background: activeTab === tab.id ? "#ede9fe" : "#ffffff",
                  color: activeTab === tab.id ? "#310e54" : "#475569",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Search & Board / Table Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* View Switcher */}
            <div style={{ display: "flex", background: "#ffffff", borderRadius: 6, padding: 3, border: "1px solid #cbd5e1" }}>
              <button
                type="button"
                onClick={() => setViewMode("board")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  background: viewMode === "board" ? "#310e54" : "transparent",
                  color: viewMode === "board" ? "#ffffff" : "#64748b",
                  cursor: "pointer",
                }}
              >
                <Kanban size={14} />
                <span>Inquiry Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  background: viewMode === "table" ? "#310e54" : "transparent",
                  color: viewMode === "table" ? "#ffffff" : "#64748b",
                  cursor: "pointer",
                }}
              >
                <List size={14} />
                <span>Table</span>
              </button>
            </div>

            {/* Search */}
            <div style={{ position: "relative", minWidth: 220 }}>
              <Search
                size={14}
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
              />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setTablePage(1);
                }}
                style={{
                  width: "100%",
                  padding: "6px 10px 6px 30px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  fontSize: 12.5,
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* INQUIRY BOARD VIEW */}
        {viewMode === "board" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(280px, 1fr))",
              gap: 14,
              overflowX: "auto",
              height: "calc(100vh - 210px)",
              minHeight: 560,
              alignItems: "stretch",
              paddingBottom: 4,
            }}
          >
            {COLUMNS.map((col) => {
              const colInquiries = filteredInquiries.filter((inq) => inq.status === col.id);
              return (
                <div
                  key={col.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                  style={{
                    background: col.bg,
                    borderRadius: 10,
                    border: `1.5px dashed ${col.color}40`,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  {/* Column Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingBottom: 8,
                      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: col.color,
                        }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                        {col.title}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 999,
                        background: "#ffffff",
                        color: col.color,
                        border: `1px solid ${col.color}40`,
                      }}
                    >
                      {colInquiries.length}
                    </span>
                  </div>

                  {/* Cards Container - Independently Scrollable */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      flex: 1,
                      overflowY: "auto",
                      paddingRight: 4,
                    }}
                  >
                    {colInquiries.length === 0 ? (
                      <div
                        style={{
                          padding: 24,
                          textAlign: "center",
                          fontSize: 12,
                          color: "#94a3b8",
                          borderRadius: 6,
                          border: "1px dashed #cbd5e1",
                          background: "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        Drop leads here
                      </div>
                    ) : (
                      colInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, inq.id)}
                          style={{
                            background: "#ffffff",
                            borderRadius: 8,
                            padding: 12,
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                            border: "1px solid #e2e8f0",
                            cursor: "grab",
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            transition: "all 0.15s ease",
                          }}
                        >
                          {/* Card Top: Ref ID & Division Badge */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                              #{inq.requestId || inq.id.slice(-6)}
                            </span>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 600,
                                padding: "2px 6px",
                                borderRadius: 4,
                                background: inq.division?.includes("Ready")
                                  ? "#e0f2fe"
                                  : inq.division?.includes("Construction")
                                  ? "#ede9fe"
                                  : "#fef3c7",
                                color: inq.division?.includes("Ready")
                                  ? "#0369a1"
                                  : inq.division?.includes("Construction")
                                  ? "#6b21a8"
                                  : "#b45309",
                              }}
                            >
                              {inq.division || "General"}
                            </span>
                          </div>

                          {/* Client Name & Estimated Value */}
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", display: "block" }}>
                              {inq.name}
                            </span>
                            {inq.estimatedValue && (
                              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#16a34a" }}>
                                {inq.estimatedValue.toLocaleString()} AED Est.
                              </span>
                            )}
                          </div>

                          {/* Message snippet */}
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11.5,
                              color: "#475569",
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {inq.message}
                          </p>

                          {/* Card Footer: Metadata & Quick Actions */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingTop: 6,
                              borderTop: "1px solid #f1f5f9",
                            }}
                          >
                            <span style={{ fontSize: 10.5, color: "#94a3b8" }}>
                              {new Date(inq.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                            </span>

                            <div style={{ display: "flex", gap: 4 }}>
                              <button
                                type="button"
                                onClick={() => setSelectedInquiry(inq)}
                                style={{
                                  padding: "3px 8px",
                                  borderRadius: 4,
                                  border: "1px solid #cbd5e1",
                                  background: "#f8fafc",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: "#310e54",
                                  cursor: "pointer",
                                }}
                              >
                                Details
                              </button>

                              {/* Quick Move Forward */}
                              {col.id !== "closed" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextIdx = COLUMNS.findIndex((c) => c.id === col.id) + 1;
                                    if (nextIdx < COLUMNS.length) {
                                      handleStatusChange(inq.id, COLUMNS[nextIdx].id);
                                    }
                                  }}
                                  style={{
                                    padding: "3px 6px",
                                    borderRadius: 4,
                                    border: "1px solid #cbd5e1",
                                    background: "#ffffff",
                                    color: "#64748b",
                                    cursor: "pointer",
                                  }}
                                  title="Advance to next swimlane"
                                >
                                  <ArrowRight size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TABLE VIEW FALLBACK */}
        {viewMode === "table" && (
          <div style={{ background: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: 11.5, textTransform: "uppercase" }}>
                  <th style={{ padding: "12px 16px" }}>Ref ID</th>
                  <th style={{ padding: "12px 16px" }}>Client</th>
                  <th style={{ padding: "12px 16px" }}>Division</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px" }}>Created</th>
                  <th style={{ padding: "12px 16px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedTableInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
                      No matching inquiry records found.
                    </td>
                  </tr>
                ) : (
                  pagedTableInquiries.map((inq) => (
                    <tr key={inq.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>#{inq.requestId || inq.id.slice(-6)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontWeight: 600, color: "#0f172a", display: "block" }}>{inq.name}</span>
                        <span style={{ fontSize: 11.5, color: "#64748b" }}>{inq.email}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>{inq.division}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                          style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#64748b" }}>
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(inq)}
                          style={{ padding: "4px 10px", borderRadius: 4, background: "#f8fafc", border: "1px solid #cbd5e1", fontSize: 12, cursor: "pointer" }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Inquiries Table Pagination */}
            {filteredInquiries.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  background: "#f8fafc",
                  borderTop: "1px solid #e2e8f0",
                  fontSize: 12.5,
                  color: "#64748b",
                }}
              >
                <span>
                  Showing {Math.min((currentTablePage - 1) * tablePageSize + 1, filteredInquiries.length)} to{" "}
                  {Math.min(currentTablePage * tablePageSize, filteredInquiries.length)} of {filteredInquiries.length} leads
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    type="button"
                    disabled={currentTablePage <= 1}
                    onClick={() => setTablePage((p) => Math.max(1, p - 1))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      border: "1px solid #cbd5e1",
                      background: currentTablePage <= 1 ? "#f1f5f9" : "#ffffff",
                      color: currentTablePage <= 1 ? "#94a3b8" : "#0f172a",
                      cursor: currentTablePage <= 1 ? "not-allowed" : "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ fontWeight: 600, color: "#0f172a", padding: "0 4px" }}>
                    Page {currentTablePage} of {tableTotalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentTablePage >= tableTotalPages}
                    onClick={() => setTablePage((p) => Math.min(tableTotalPages, p + 1))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      border: "1px solid #cbd5e1",
                      background: currentTablePage >= tableTotalPages ? "#f1f5f9" : "#ffffff",
                      color: currentTablePage >= tableTotalPages ? "#94a3b8" : "#0f172a",
                      cursor: currentTablePage >= tableTotalPages ? "not-allowed" : "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lead Detail & Staff Notes Modal */}
        {selectedInquiry && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: 20,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: 12,
                width: "100%",
                maxWidth: 640,
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                    Lead Record #{selectedInquiry.requestId || selectedInquiry.id}
                  </span>
                  <h3 style={{ margin: "2px 0 0", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                    {selectedInquiry.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Status Switcher & Division */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                      Jira Lifecycle Swimlane
                    </label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)}
                      style={{
                        width: "100%",
                        padding: "7px 10px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {COLUMNS.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                      Operating Division
                    </label>
                    <div style={{ padding: "7px 10px", borderRadius: 6, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                      {selectedInquiry.division || "General"}
                    </div>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div style={{ padding: 12, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ fontSize: 12.5, color: "#334155" }}>
                    <strong>Email:</strong> {selectedInquiry.email}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#334155" }}>
                    <strong>Phone:</strong> {selectedInquiry.phone || "Not provided"}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#334155" }}>
                    <strong>Source:</strong> {selectedInquiry.source}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#334155" }}>
                    <strong>Submitted:</strong> {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Lead Message */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                    Client Inquiry Specifications
                  </label>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 6,
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      fontSize: 13,
                      color: "#1e293b",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Staff Internal Notes & Audit Trail */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                    Staff Internal Comments &amp; Notes (Audited)
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                    {selectedInquiry.staffNotes && selectedInquiry.staffNotes.length > 0 ? (
                      selectedInquiry.staffNotes.map((note, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 6,
                            background: "#ede9fe",
                            border: "1px solid #ddd6fe",
                            fontSize: 12,
                            color: "#310e54",
                          }}
                        >
                          {note}
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>No staff notes yet.</span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Add an internal note or review finding..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddNote(selectedInquiry.id);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "7px 10px",
                        borderRadius: 6,
                        border: "1px solid #cbd5e1",
                        fontSize: 12.5,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddNote(selectedInquiry.id)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 6,
                        background: "#310e54",
                        color: "#ffffff",
                        border: "none",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Post Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
