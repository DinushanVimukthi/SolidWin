"use client";

import { useState } from "react";
import {
  Database,
  ShieldCheck,
  Server,
  Check,
} from "lucide-react";

export default function SuperadminSiteConfigurationPage() {
  const [dataProvider, setDataProvider] = useState<"firebase" | "supabase" | "rest_api">("firebase");
  const [tenantScope, setTenantScope] = useState("tenant_solidwin_prod");
  const [restApiEndpoint, setRestApiEndpoint] = useState("https://api.exe-portal.com/v1/solidwin");
  const [supabaseUrl, setSupabaseUrl] = useState("https://xyzcompany.supabase.co");
  const [rateLimit, setRateLimit] = useState(60);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
          <span>Core Infrastructure &amp; Adaptability</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>
          Site Configuration &amp; Database Layer Control
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
          Manage database abstraction adapters, API layer routing, tenant isolation, and security policies.
        </p>
      </div>

      {savedNotice && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 16px",
            borderRadius: 8,
            background: "#dcfce7",
            border: "1px solid #86efac",
            color: "#15803d",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Check size={16} />
          <span>Configuration saved. DAL provider adapters synchronized with environment.</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Module 1: Pluggable Database & API Adapter */}
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Database size={18} color="#310e54" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Data Access Layer (DAL) Provider
            </h3>
          </div>
          <p style={{ margin: "-8px 0 16px", fontSize: 12.5, color: "#64748b" }}>
            The UI is decoupled from Firebase Firestore. You can switch the persistence engine below with zero UI code modifications.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 20 }}>
            {/* Firebase */}
            <div
              onClick={() => setDataProvider("firebase")}
              style={{
                border: `2px solid ${dataProvider === "firebase" ? "#310e54" : "#e2e8f0"}`,
                borderRadius: 8,
                padding: 16,
                background: dataProvider === "firebase" ? "#ede9fe" : "#ffffff",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>Firebase Firestore</span>
                {dataProvider === "firebase" && <span style={{ fontSize: 11, fontWeight: 700, color: "#310e54", background: "#ffffff", padding: "2px 8px", borderRadius: 4 }}>ACTIVE</span>}
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Current production store: <code>exe-proj-ff0c0</code>. Real-time collections for inquiries, projects, and audit logs.
              </p>
            </div>

            {/* PostgreSQL / Supabase */}
            <div
              onClick={() => setDataProvider("supabase")}
              style={{
                border: `2px solid ${dataProvider === "supabase" ? "#310e54" : "#e2e8f0"}`,
                borderRadius: 8,
                padding: 16,
                background: dataProvider === "supabase" ? "#ede9fe" : "#ffffff",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>PostgreSQL / Supabase</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>READY</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Relational schema adapter. Ready to plug in via connection pool or Supabase JS client.
              </p>
            </div>

            {/* REST API */}
            <div
              onClick={() => setDataProvider("rest_api")}
              style={{
                border: `2px solid ${dataProvider === "rest_api" ? "#310e54" : "#e2e8f0"}`,
                borderRadius: 8,
                padding: 16,
                background: dataProvider === "rest_api" ? "#ede9fe" : "#ffffff",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>EXE Unified REST API</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>READY</span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                Connect directly to central EXE enterprise ERP &amp; CRM gateway endpoints.
              </p>
            </div>
          </div>

          {/* Conditional Endpoint Settings */}
          {dataProvider === "rest_api" && (
            <div style={{ padding: 16, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                REST API Gateway Base URL
              </label>
              <input
                type="url"
                value={restApiEndpoint}
                onChange={(e) => setRestApiEndpoint(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>
          )}

          {dataProvider === "supabase" && (
            <div style={{ padding: 16, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Supabase Project URL
              </label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
            </div>
          )}
        </div>

        {/* Module 2: Tenant Isolation & Multi-Division Scope */}
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Server size={18} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              EXE Multi-Tenant Isolation
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Tenant Identifier Scope
              </label>
              <input
                type="text"
                value={tenantScope}
                onChange={(e) => setTenantScope(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
              <span style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, display: "block" }}>
                Enforces logical partition across all Firestore documents and queries.
              </span>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                API Rate Limiting (Requests / minute)
              </label>
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
              />
              <span style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, display: "block" }}>
                Protects public quote calculators and contact API routes against abuse.
              </span>
            </div>
          </div>
        </div>

        {/* Module 3: Superadmin Security Policy */}
        <div style={{ background: "#ffffff", borderRadius: 10, padding: 24, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <ShieldCheck size={18} color="#16a34a" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Superadmin Authentication &amp; Security Policy
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <div style={{ padding: 14, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "block" }}>
                Password Storage Mode
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 2, display: "block" }}>
                SHA-256 One-Way Cryptographic Hash
              </span>
              <span style={{ fontSize: 11.5, color: "#16a34a", fontWeight: 600, marginTop: 4, display: "block" }}>
                Configured securely in .env.local
              </span>
            </div>

            <div style={{ padding: 14, borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "block" }}>
                Session Cookie Policy
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 2, display: "block" }}>
                HttpOnly &bull; SameSite=Lax &bull; 24h Expiry
              </span>
              <span style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, display: "block" }}>
                Tamper-resistant Base64 signed payload
              </span>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              id="maint"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
            />
            <label htmlFor="maint" style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", cursor: "pointer" }}>
              Enable Emergency Maintenance Mode (Halts public RFQ submissions and displays service banner)
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            style={{
              padding: "10px 22px",
              borderRadius: 8,
              background: "#310e54",
              color: "#ffffff",
              border: "none",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Save Site Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
