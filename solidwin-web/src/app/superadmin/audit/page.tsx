"use client";

import { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { auditLogRepository } from "@/lib/dal/audit-repository";
import type { AuditLogEntry, AuditCategory } from "@/lib/dal/types";

export default function SuperadminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    auditLogRepository.getLogs(150).then((data) => {
      setLogs(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    let active = true;
    auditLogRepository.getLogs(150).then((data) => {
      if (active) {
        setLogs(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (categoryFilter !== "all" && log.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchActor = log.actor.name.toLowerCase().includes(q) || log.actor.email.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchTarget = log.targetName?.toLowerCase().includes(q) || false;
      return matchAction || matchActor || matchDetails || matchTarget;
    }
    return true;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes("DELETE") || action.includes("FAILED")) return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" };
    if (action.includes("CREATE") || action.includes("SUCCESS")) return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" };
    if (action.includes("STATUS") || action.includes("TUNED")) return { bg: "#ede9fe", text: "#6b21a8", border: "#ddd6fe" };
    return { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
            <span>Security Compliance &amp; Governance</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Restricted Action History &amp; Audit Trail
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Immutable chronological record of all administrative modifications, lead state transitions, and security operations.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            fontSize: 12.5,
            fontWeight: 600,
            color: "#334155",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 10,
          padding: 16,
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* Category Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Events" },
            { id: "inquiries", label: "Inquiries & Leads" },
            { id: "projects", label: "Projects & Portfolio" },
            { id: "calculators", label: "Calculators" },
            { id: "security", label: "Security & Auth" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id as AuditCategory | "all")}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid",
                borderColor: categoryFilter === cat.id ? "#310e54" : "#e2e8f0",
                background: categoryFilter === cat.id ? "#ede9fe" : "#ffffff",
                color: categoryFilter === cat.id ? "#310e54" : "#475569",
                cursor: "pointer",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", minWidth: 260 }}>
          <Search
            size={15}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
          />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 12px 7px 32px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              fontSize: 12.5,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Audit Log Table / Stream */}
      <div style={{ background: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "grid",
            gridTemplateColumns: "180px 220px 180px 1fr 30px",
            fontSize: 11.5,
            fontWeight: 700,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          <span>Timestamp</span>
          <span>Action / Event</span>
          <span>Actor / Role</span>
          <span>Target &amp; Details</span>
          <span />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: 13 }}>
              Loading audit trail records...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: 13 }}>
              No audit logs match your search filter.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getActionBadgeColor(log.action);
              const isExpanded = expandedId === log.id;
              return (
                <div
                  key={log.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    transition: "background 0.15s ease",
                  }}
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    style={{
                      padding: "12px 20px",
                      display: "grid",
                      gridTemplateColumns: "180px 220px 180px 1fr 30px",
                      alignItems: "center",
                      cursor: "pointer",
                      background: isExpanded ? "#faf5ff" : "transparent",
                    }}
                  >
                    {/* Timestamp */}
                    <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
                      <Clock size={13} color="#94a3b8" />
                      <span>{new Date(log.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "medium" })}</span>
                    </div>

                    {/* Action Badge */}
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                        }}
                      >
                        {log.action}
                      </span>
                    </div>

                    {/* Actor */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>
                        {log.actor.name}
                      </span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>
                        {log.actor.role} ({log.actor.email})
                      </span>
                    </div>

                    {/* Target & Details */}
                    <div style={{ fontSize: 12.5, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 10 }}>
                      {log.targetName && (
                        <strong style={{ color: "#0f172a", marginRight: 6 }}>[{log.targetName}]</strong>
                      )}
                      <span>{log.details}</span>
                    </div>

                    {/* Expand icon */}
                    <div>
                      {isExpanded ? <ChevronDown size={16} color="#64748b" /> : <ChevronRight size={16} color="#94a3b8" />}
                    </div>
                  </div>

                  {/* Expanded JSON details */}
                  {isExpanded && (
                    <div style={{ padding: "12px 24px 16px 200px", background: "#f8fafc", borderTop: "1px dashed #e2e8f0" }}>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
                        <strong>Full Audit Record ID:</strong> <code>{log.id}</code> &bull; <strong>Category:</strong> {log.category}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
                        <strong>Event Description:</strong> {log.details}
                      </div>
                      {log.metadata && (
                        <div style={{ marginTop: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                            Structured Payload Metadata:
                          </span>
                          <pre
                            style={{
                              margin: "4px 0 0",
                              padding: 10,
                              borderRadius: 6,
                              background: "#090d16",
                              color: "#a7f3d0",
                              fontSize: 11.5,
                              fontFamily: "monospace",
                              overflowX: "auto",
                            }}
                          >
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
