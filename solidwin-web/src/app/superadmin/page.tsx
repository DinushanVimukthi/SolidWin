"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  BarChart3,
  Sliders,
  FileClock,
  Inbox,
  Database,
  ArrowRight,
  Server,
} from "lucide-react";
import { inquiryRepository } from "@/lib/dal/inquiry-repository";
import { auditLogRepository } from "@/lib/dal/audit-repository";
import { analyticsRepository } from "@/lib/dal/analytics-repository";
import type { AuditLogEntry } from "@/lib/dal/types";

export default function SuperadminOverviewPage() {
  const [inquiryCount, setInquiryCount] = useState<number>(0);
  const [recentAudits, setRecentAudits] = useState<AuditLogEntry[]>([]);
  const [totalPageViews, setTotalPageViews] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      inquiryRepository.getAll(),
      auditLogRepository.getLogs(5),
      analyticsRepository.getMetrics("30d"),
    ]).then(([inqs, audits, metrics]) => {
      if (!active) return;
      setInquiryCount(inqs.length);
      setRecentAudits(audits);
      setTotalPageViews(metrics.totalPageViews);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #090d16 0%, #1f143d 100%)",
          borderRadius: 12,
          padding: "24px 28px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <ShieldCheck size={20} color="#f59e0b" />
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fbbf24" }}>
              EXE Multi-Tenant Control Plane
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Superadmin Governance &amp; System Health
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#cbd5e1" }}>
            Operational telemetry, database layer abstraction, conversion analytics, and immutable audit logs.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/superadmin/settings"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 8,
              background: "#310e54",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Sliders size={15} />
            <span>Site Configuration</span>
          </Link>
          <Link
            href="/superadmin/audit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <FileClock size={15} />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#64748b" }}>Live Database Inquiries</span>
            <Inbox size={18} color="#310e54" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>
            {loading ? "..." : inquiryCount}
          </div>
          <span style={{ fontSize: 11.5, color: "#16a34a", fontWeight: 600 }}>Active in Jira Swimlanes</span>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 10, padding: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#64748b" }}>Tracked Website Events</span>
            <BarChart3 size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>
            {loading ? "..." : totalPageViews.toLocaleString()}
          </div>
          <span style={{ fontSize: 11.5, color: "#0284c7", fontWeight: 600 }}>Real Client Interactions</span>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 10, padding: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#64748b" }}>Database Layer Status</span>
            <Database size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
            Firebase + DAL Ready
          </div>
          <span style={{ fontSize: 11.5, color: "#64748b" }}>Plug-and-play adapter architecture</span>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 10, padding: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#64748b" }}>Tenant Isolation</span>
            <Server size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
            tenant_solidwin_prod
          </div>
          <span style={{ fontSize: 11.5, color: "#16a34a", fontWeight: 600 }}>EXE Security Enforced</span>
        </div>
      </div>

      {/* Two Column Layout: Navigation modules & Recent Audits */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Modules Directory */}
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 24, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
            Superadmin Governance Modules
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              href="/superadmin/analytics"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                textDecoration: "none",
                background: "#f8fafc",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ padding: 8, borderRadius: 6, background: "#ede9fe", color: "#310e54" }}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                    Website Analytics &amp; Conversion Tracking
                  </h4>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
                    Live conversion funnels, calculator usage, real inquiries, and traffic metrics.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </Link>

            <Link
              href="/superadmin/settings"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                textDecoration: "none",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ padding: 8, borderRadius: 6, background: "#fef3c7", color: "#b45309" }}>
                  <Sliders size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                    Site Configuration Settings
                  </h4>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
                    Database abstraction switch, API layer connectors, tenant isolation, and security.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </Link>

            <Link
              href="/superadmin/audit"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                textDecoration: "none",
                background: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ padding: 8, borderRadius: 6, background: "#fee2e2", color: "#b91c1c" }}>
                  <FileClock size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                    Action History &amp; Audit Trail
                  </h4>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
                    Restricted action history recording all project, lead, calculator, and system modifications.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} color="#64748b" />
            </Link>
          </div>
        </div>

        {/* Live Recent Audit Stream */}
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Latest Audited Actions
            </h3>
            <Link href="/superadmin/audit" style={{ fontSize: 12, fontWeight: 600, color: "#310e54", textDecoration: "none" }}>
              View All
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentAudits.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  border: "1px solid #f1f5f9",
                  background: "#f8fafc",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: "#0f172a" }}>{item.action}</span>
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p style={{ margin: 0, color: "#475569", lineHeight: 1.4 }}>{item.details}</p>
                <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b" }}>
                  <span>Actor: {item.actor.name}</span>
                  <span>&bull;</span>
                  <span style={{ textTransform: "capitalize" }}>{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
