"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Eye,
  Calculator,
  FileCheck2,
  TrendingUp,
  RefreshCw,
  Activity,
} from "lucide-react";
import { analyticsRepository } from "@/lib/dal/analytics-repository";
import type { RealAnalyticsMetrics } from "@/lib/dal/types";

export default function SuperadminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");
  const [metrics, setMetrics] = useState<RealAnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = () => {
    setLoading(true);
    analyticsRepository.getMetrics(dateRange).then((data) => {
      setMetrics(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    let active = true;
    analyticsRepository.getMetrics(dateRange).then((data) => {
      if (active) {
        setMetrics(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [dateRange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
            <span>Telemetry &amp; Conversion Intelligence</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Website Analytics &amp; Conversion Funnels
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Real data aggregated live from client sessions, calculator runs, and database inquiries.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", background: "#ffffff", borderRadius: 8, padding: 3, border: "1px solid #cbd5e1" }}>
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDateRange(range)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  background: dateRange === range ? "#310e54" : "transparent",
                  color: dateRange === range ? "#ffffff" : "#475569",
                  cursor: "pointer",
                }}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={fetchMetrics}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 12px",
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
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Real Top Metrics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Total Page Views</span>
            <Eye size={18} color="#310e54" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
            {loading ? "..." : metrics?.totalPageViews.toLocaleString()}
          </div>
          <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>Real client visits</span>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 10, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Unique Sessions</span>
            <Users size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
            {loading ? "..." : metrics?.uniqueSessions.toLocaleString()}
          </div>
          <span style={{ fontSize: 11, color: "#0284c7", fontWeight: 600 }}>Distinct visitor sessions</span>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 10, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Calculator Runs</span>
            <Calculator size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
            {loading ? "..." : metrics?.calculatorRuns.toLocaleString()}
          </div>
          <span style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 600 }}>Concrete, Block &amp; Paint</span>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 10, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Submitted Leads &amp; RFQs</span>
            <FileCheck2 size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
            {loading ? "..." : metrics?.submittedInquiries}
          </div>
          <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>Live Firestore records</span>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 10, padding: 18, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Overall Conversion Rate</span>
            <TrendingUp size={18} color="#ea580c" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
            {loading ? "..." : `${metrics?.conversionRate}%`}
          </div>
          <span style={{ fontSize: 11, color: "#ea580c", fontWeight: 600 }}>Session to Lead conversion</span>
        </div>
      </div>

      {/* Conversion Funnel Analysis */}
      <div style={{ background: "#ffffff", borderRadius: 10, padding: 22, border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
          End-to-End Real Conversion Funnel
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <div style={{ padding: 14, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Stage 1: Discovery</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
              {loading ? "..." : `${metrics?.totalPageViews} Visits`}
            </div>
            <div style={{ fontSize: 11.5, color: "#475569", marginTop: 2 }}>{metrics?.uniqueSessions} unique client sessions</div>
          </div>

          <div style={{ padding: 14, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Stage 2: Calculation</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
              {loading ? "..." : `${metrics?.calculatorRuns} Executions`}
            </div>
            <div style={{ fontSize: 11.5, color: "#475569", marginTop: 2 }}>Interactive estimation tools</div>
          </div>

          <div style={{ padding: 14, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>Stage 3: Direct Contact</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
              {loading ? "..." : `${metrics?.whatsAppInquiries} WhatsApp Pings`}
            </div>
            <div style={{ fontSize: 11.5, color: "#475569", marginTop: 2 }}>High-intent direct messenger</div>
          </div>

          <div style={{ padding: 14, borderRadius: 8, background: "#ede9fe", border: "1px solid #ddd6fe" }}>
            <div style={{ fontSize: 11, color: "#5b21b6", fontWeight: 600, textTransform: "uppercase" }}>Stage 4: Captured Leads</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#310e54", marginTop: 4 }}>
              {loading ? "..." : `${metrics?.submittedInquiries} Inquiries &amp; RFQs`}
            </div>
            <div style={{ fontSize: 11.5, color: "#6b21a8", marginTop: 2 }}>Synchronized into Jira board</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Pages & Division Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        {/* Top Pages */}
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 22, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
            Most Visited Public Sections
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {metrics?.topPages.map((page, idx) => (
              <div
                key={page.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: idx % 2 === 0 ? "#f8fafc" : "#ffffff",
                  border: "1px solid #f1f5f9",
                  fontSize: 13,
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: "#0f172a", display: "block" }}>{page.title}</span>
                  <code style={{ fontSize: 11, color: "#64748b" }}>{page.path}</code>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontWeight: 700, color: "#310e54" }}>{page.views}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", display: "block" }}>views</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Division Breakdown */}
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 22, border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
            Real Inquiries by Division
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {metrics?.divisionBreakdown.map((div) => (
              <div key={div.division}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>{div.division}</span>
                  <span style={{ color: "#64748b", fontWeight: 600 }}>{div.count} leads ({div.percentage}%)</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#f1f5f9", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 4,
                      background:
                        div.division.includes("Ready")
                          ? "#0284c7"
                          : div.division.includes("Construction")
                          ? "#310e54"
                          : "#f59e0b",
                      width: `${div.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Live Telemetry Stream */}
      <div style={{ background: "#ffffff", borderRadius: 10, padding: 22, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Activity size={18} color="#16a34a" />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
            Live Event Telemetry Stream
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {metrics?.recentEvents.map((evt) => (
            <div
              key={evt.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: 6,
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
                fontSize: 12.5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    background:
                      evt.type === "inquiry_submitted"
                        ? "#dcfce7"
                        : evt.type === "calculator_run"
                        ? "#ede9fe"
                        : evt.type === "whatsapp_click"
                        ? "#fef3c7"
                        : "#e0f2fe",
                    color:
                      evt.type === "inquiry_submitted"
                        ? "#15803d"
                        : evt.type === "calculator_run"
                        ? "#6b21a8"
                        : evt.type === "whatsapp_click"
                        ? "#b45309"
                        : "#0369a1",
                  }}
                >
                  {evt.type.replace(/_/g, " ")}
                </span>
                <span style={{ color: "#334155", fontWeight: 500 }}>{evt.page}</span>
                {evt.division && (
                  <span style={{ color: "#94a3b8", fontSize: 11 }}>({evt.division})</span>
                )}
              </div>
              <span style={{ color: "#94a3b8", fontSize: 11.5 }}>
                {new Date(evt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
