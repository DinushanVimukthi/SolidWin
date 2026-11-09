"use client";

import { useState } from "react";
import {
  Building2,
  Bell,
  Users,
  ShieldCheck,
  Check,
  Save,
  Mail,
  Phone,
  MapPin,
  Clock,
  UserPlus,
  X,
  Lock,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import styles from "../admin.module.css";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "EXE Administrator" | "Solidwin Administrator" | "Solidwin Content Editor" | "Solidwin Viewer";
  status: "Active" | "Pending Invite";
  lastActive: string;
}

interface WorkspaceConfig {
  companyName: string;
  tradeLicense: string;
  email: string;
  phone: string;
  address: string;
  operatingHours: string;

  // Notifications & Routing
  constructionEmail: string;
  readyMixEmail: string;
  hardwareEmail: string;
  whatsappAlertNumber: string;
  autoResponderEnabled: boolean;
  autoResponderText: string;

  // Security & Maintenance
  maintenanceMode: boolean;
  searchEngineIndexing: boolean;
  sessionTimeoutMinutes: number;
}

const DEFAULT_CONFIG: WorkspaceConfig = {
  companyName: "Solidwin Construction & Building Materials LLC",
  tradeLicense: "CR-2024-98421-DXB",
  email: "info@solidwin.ae",
  phone: "+971 4 800 SOLID (76543)",
  address: "Plot 482, Industrial Area 3, Dubai, United Arab Emirates",
  operatingHours: "Monday – Saturday: 07:00 AM – 06:00 PM (Batching 24/7 on pour schedule)",

  constructionEmail: "construction.quotes@solidwin.ae",
  readyMixEmail: "dispatch.concrete@solidwin.ae",
  hardwareEmail: "equipment.rental@solidwin.ae",
  whatsappAlertNumber: "+971 50 123 4567",
  autoResponderEnabled: true,
  autoResponderText:
    "Thank you for contacting Solidwin. Our estimating and dispatch engineering team has received your inquiry and will follow up with pricing within 24 business hours.",

  maintenanceMode: false,
  searchEngineIndexing: true,
  sessionTimeoutMinutes: 60,
};

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "usr-1",
    name: "Ahmed Mansoor",
    email: "a.mansoor@solidwin.ae",
    role: "Solidwin Administrator",
    status: "Active",
    lastActive: "Today at 10:14 AM",
  },
  {
    id: "usr-2",
    name: "Sarah Jenkins",
    email: "s.jenkins@solidwin.ae",
    role: "Solidwin Content Editor",
    status: "Active",
    lastActive: "Yesterday at 4:30 PM",
  },
  {
    id: "usr-3",
    name: "Tariq Mahmood",
    email: "t.mahmood@solidwin.ae",
    role: "Solidwin Viewer",
    status: "Active",
    lastActive: "28 Oct 2026",
  },
  {
    id: "usr-4",
    name: "EXE Platform Support",
    email: "support@exe-portal.io",
    role: "EXE Administrator",
    status: "Active",
    lastActive: "Provisioned Session",
  },
];

const STORAGE_KEY = "solidwin_workspace_settings";
const TEAM_STORAGE_KEY = "solidwin_team_members";

function getInitialConfig(): WorkspaceConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch {
    // fallback
  }
  return DEFAULT_CONFIG;
}

function getInitialTeam(): TeamMember[] {
  if (typeof window === "undefined") return DEFAULT_TEAM;
  try {
    const saved = localStorage.getItem(TEAM_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return DEFAULT_TEAM;
}

export default function GenericSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "routing" | "team" | "security">("general");
  const [config, setConfig] = useState<WorkspaceConfig>(getInitialConfig);
  const [team, setTeam] = useState<TeamMember[]>(getInitialTeam);
  const [notification, setNotification] = useState<string | null>(null);

  // Invite modal state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Solidwin Content Editor");

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      console.warn("Storage save error:", err);
    }
    showNotify("Workspace settings updated successfully!");
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      alert("Please provide member name and email");
      return;
    }

    const newMember: TeamMember = {
      id: `usr-${Date.now().toString(36)}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "Pending Invite",
      lastActive: "Invited just now",
    };

    const updatedTeam = [...team, newMember];
    setTeam(updatedTeam);
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedTeam));
    } catch (err) {
      console.warn("Team save error:", err);
    }

    setIsInviteModalOpen(false);
    setInviteName("");
    setInviteEmail("");
    showNotify(`Invitation sent to ${newMember.email}`);
  };

  const handleRemoveMember = (id: string, name: string) => {
    if (confirm(`Revoke workspace access for ${name}?`)) {
      const updated = team.filter((m) => m.id !== id);
      setTeam(updated);
      try {
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("Team remove error:", err);
      }
      showNotify(`Revoked access for ${name}`);
    }
  };

  return (
    <>
      <AdminHeader
        title="Workspace Settings"
        description="Manage company details, division lead routing, team member access, and workspace preferences."
      />

      <div className={styles.pageContainer}>
        {notification && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 8,
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Check size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 6, background: "#f1f5f9", padding: 4, borderRadius: 8 }}>
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === "general" ? "#ffffff" : "transparent",
                color: activeTab === "general" ? "#310e54" : "#64748b",
                boxShadow: activeTab === "general" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <Building2 size={15} />
              <span>General &amp; Company</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("routing")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === "routing" ? "#ffffff" : "transparent",
                color: activeTab === "routing" ? "#310e54" : "#64748b",
                boxShadow: activeTab === "routing" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <Bell size={15} />
              <span>Lead Routing &amp; Alerts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("team")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === "team" ? "#ffffff" : "transparent",
                color: activeTab === "team" ? "#310e54" : "#64748b",
                boxShadow: activeTab === "team" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <Users size={15} />
              <span>Team &amp; Roles</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === "security" ? "#ffffff" : "transparent",
                color: activeTab === "security" ? "#310e54" : "#64748b",
                boxShadow: activeTab === "security" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <ShieldCheck size={15} />
              <span>Security &amp; Tenant</span>
            </button>
          </div>

          {activeTab !== "team" && (
            <button
              type="button"
              onClick={handleSaveConfig}
              className={styles.actionButton}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#310e54",
                color: "#ffffff",
                borderColor: "#310e54",
                padding: "8px 18px",
              }}
            >
              <Save size={15} />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        {/* Tab 1: General & Company Profile */}
        {activeTab === "general" && (
          <form onSubmit={handleSaveConfig} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Organization Information</h3>
                  <p className={styles.cardSubtitle}>
                    Official commercial credentials displayed across quotes, contracts, and public contact pages
                  </p>
                </div>
              </div>

              <div className={styles.cardBody} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Company Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={config.companyName}
                      onChange={(e) => setConfig((prev) => ({ ...prev, companyName: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Trade License / Commercial Reg. No.
                    </label>
                    <input
                      type="text"
                      value={config.tradeLicense}
                      onChange={(e) => setConfig((prev) => ({ ...prev, tradeLicense: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      <Mail size={14} color="#64748b" />
                      <span>Primary Corporate Email *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={config.email}
                      onChange={(e) => setConfig((prev) => ({ ...prev, email: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      <Phone size={14} color="#64748b" />
                      <span>Primary Contact Telephone *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={config.phone}
                      onChange={(e) => setConfig((prev) => ({ ...prev, phone: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5 }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    <MapPin size={14} color="#64748b" />
                    <span>Headquarters &amp; Batching Plant Address</span>
                  </label>
                  <input
                    type="text"
                    value={config.address}
                    onChange={(e) => setConfig((prev) => ({ ...prev, address: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5 }}
                  />
                </div>

                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    <Clock size={14} color="#64748b" />
                    <span>Standard Business &amp; Dispatch Operating Hours</span>
                  </label>
                  <input
                    type="text"
                    value={config.operatingHours}
                    onChange={(e) => setConfig((prev) => ({ ...prev, operatingHours: e.target.value }))}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13.5 }}
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Lead Routing & Alerts */}
        {activeTab === "routing" && (
          <form onSubmit={handleSaveConfig} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Division Lead Dispatch Routing</h3>
                  <p className={styles.cardSubtitle}>
                    Configure departmental inboxes that receive RFQs and customer enquiries
                  </p>
                </div>
              </div>

              <div className={styles.cardBody} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Construction Services Inbox
                    </label>
                    <input
                      type="email"
                      value={config.constructionEmail}
                      onChange={(e) => setConfig((prev) => ({ ...prev, constructionEmail: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                    />
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Turnkey &amp; commercial build requests</p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Ready-Mix Concrete Dispatch Inbox
                    </label>
                    <input
                      type="email"
                      value={config.readyMixEmail}
                      onChange={(e) => setConfig((prev) => ({ ...prev, readyMixEmail: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                    />
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Batch plant dispatch &amp; pump bookings</p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                      Hardware &amp; Machinery Rental Inbox
                    </label>
                    <input
                      type="email"
                      value={config.hardwareEmail}
                      onChange={(e) => setConfig((prev) => ({ ...prev, hardwareEmail: e.target.value }))}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                    />
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Block orders &amp; fleet hire inquiries</p>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Instant WhatsApp Alert Dispatch Phone Number
                  </label>
                  <input
                    type="text"
                    value={config.whatsappAlertNumber}
                    onChange={(e) => setConfig((prev) => ({ ...prev, whatsappAlertNumber: e.target.value }))}
                    style={{ width: "100%", maxWidth: 360, padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>
                    Standard international format (e.g. +971 50 123 4567) to receive immediate push payloads
                  </p>
                </div>

                <div style={{ paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontWeight: 600, fontSize: 13.5 }}>
                    <input
                      type="checkbox"
                      checked={config.autoResponderEnabled}
                      onChange={(e) => setConfig((prev) => ({ ...prev, autoResponderEnabled: e.target.checked }))}
                    />
                    <span>Send automated confirmation email to customers upon submission</span>
                  </label>

                  {config.autoResponderEnabled && (
                    <div style={{ marginTop: 10 }}>
                      <label style={{ display: "block", fontSize: 12.5, color: "#64748b", marginBottom: 4 }}>
                        Customer Auto-Response Message Body:
                      </label>
                      <textarea
                        rows={3}
                        value={config.autoResponderText}
                        onChange={(e) => setConfig((prev) => ({ ...prev, autoResponderText: e.target.value }))}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, fontFamily: "inherit" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Tab 3: Team Members & Access Roles */}
        {activeTab === "team" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Authorized Portal Staff &amp; Roles</h3>
                  <p className={styles.cardSubtitle}>
                    Role-appropriate access for managing Solidwin website content, RFQs, and analytics
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(true)}
                  className={styles.actionButton}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#310e54",
                    color: "#ffffff",
                    borderColor: "#310e54",
                    padding: "8px 16px",
                  }}
                >
                  <UserPlus size={15} />
                  <span>Invite Team Member</span>
                </button>
              </div>

              <div className={styles.cardBody} style={{ padding: 0 }}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email Address</th>
                        <th>Role &amp; Permissions</th>
                        <th>Status</th>
                        <th>Activity</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.map((member) => (
                        <tr key={member.id}>
                          <td>
                            <span style={{ fontWeight: 600, color: "#0f172a" }}>{member.name}</span>
                          </td>
                          <td style={{ color: "#64748b" }}>{member.email}</td>
                          <td>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "3px 8px",
                                borderRadius: 4,
                                background:
                                  member.role === "EXE Administrator"
                                    ? "#fef3c7"
                                    : member.role === "Solidwin Administrator"
                                    ? "#ede9fe"
                                    : member.role === "Solidwin Content Editor"
                                    ? "#e0f2fe"
                                    : "#f1f5f9",
                                color:
                                  member.role === "EXE Administrator"
                                    ? "#92400e"
                                    : member.role === "Solidwin Administrator"
                                    ? "#6d28d9"
                                    : member.role === "Solidwin Content Editor"
                                    ? "#0369a1"
                                    : "#334155",
                              }}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: member.status === "Active" ? "#059669" : "#d97706",
                              }}
                            >
                              ● {member.status}
                            </span>
                          </td>
                          <td style={{ color: "#64748b", fontSize: 12.5 }}>{member.lastActive}</td>
                          <td style={{ textAlign: "right" }}>
                            {member.role !== "EXE Administrator" && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMember(member.id, member.name)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#dc2626",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Role Reference Summary per Handover Spec */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Role &amp; Permission Structure</h3>
              </div>
              <div className={styles.cardBody} style={{ fontSize: 13, lineHeight: 1.6, color: "#334155" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: 700, color: "#310e54" }}>Solidwin Administrator</div>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
                      Manage all Solidwin content, team permissions, customer inquiries, and conversion analytics.
                    </p>
                  </div>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: 700, color: "#0284c7" }}>Solidwin Content Editor</div>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
                      Update approved project portfolios, catalogue items, and HSEQ documents. No access to other tenants.
                    </p>
                  </div>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: 700, color: "#475569" }}>Solidwin Viewer</div>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
                      Read-only access to inquiries, status history, and dashboard performance metrics.
                    </p>
                  </div>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: 700, color: "#b45309" }}>EXE Platform Administrator</div>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
                      Provisions website workspace, configures platform integrations, and manages client contracts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security, Tenant & Maintenance */}
        {activeTab === "security" && (
          <form onSubmit={handleSaveConfig} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Multi-Tenant Session Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={18} color="#310e54" />
                  <div>
                    <h3 className={styles.cardTitle}>EXE Client Portal Multi-Tenant Isolation</h3>
                    <p className={styles.cardSubtitle}>
                      Every API operation enforces Solidwin tenant membership on the server
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: "#ecfdf5",
                    color: "#059669",
                  }}
                >
                  ✓ Server-Enforced Isolation
                </span>
              </div>

              <div className={styles.cardBody} style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: 12, color: "#64748b", display: "block" }}>Active Tenant ID</span>
                    <span style={{ fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>tenant_solidwin_prod</span>
                  </div>
                  <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: 12, color: "#64748b", display: "block" }}>Session Authentication</span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>EXE Unified SSO (OAuth2 / JWT)</span>
                  </div>
                </div>

                <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                  Per handover requirements: Tenant scope is strictly derived from the verified session rather than trusting a tenant ID supplied by the browser. Solidwin users can never query or mutate another client&apos;s workspace.
                </p>
              </div>
            </div>

            {/* Maintenance Mode & Controls */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Platform Maintenance &amp; Indexing Controls</h3>
                  <p className={styles.cardSubtitle}>Configure staging visibility and active operational status</p>
                </div>
              </div>

              <div className={styles.cardBody} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#0f172a", display: "block" }}>Search Engine Indexing</span>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>
                      Allow Google &amp; search bots to index the public site (Disable during staging reviews)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.searchEngineIndexing}
                    onChange={(e) => setConfig((prev) => ({ ...prev, searchEngineIndexing: e.target.checked }))}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#0f172a", display: "block" }}>Maintenance Mode</span>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>
                      Show temporary maintenance notice to public visitors during scheduled infrastructure updates
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.maintenanceMode}
                    onChange={(e) => setConfig((prev) => ({ ...prev, maintenanceMode: e.target.checked }))}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#0f172a", display: "block" }}>Session Inactivity Timeout</span>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>
                      Automatically lock inactive portal sessions to protect client pricing data
                    </span>
                  </div>
                  <select
                    value={config.sessionTimeoutMinutes}
                    onChange={(e) => setConfig((prev) => ({ ...prev, sessionTimeoutMinutes: parseInt(e.target.value, 10) }))}
                    style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>60 Minutes (Standard)</option>
                    <option value={240}>4 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Modal: Invite Team Member */}
        {isInviteModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(15, 23, 42, 0.65)",
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
                maxWidth: 480,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                  Invite Team Member
                </h3>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Tariq Mansoor"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Corporate Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. t.mansoor@solidwin.ae"
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Assigned Role *
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, background: "#ffffff" }}
                  >
                    <option value="Solidwin Administrator">Solidwin Administrator (Full Control)</option>
                    <option value="Solidwin Content Editor">Solidwin Content Editor (Content &amp; Products)</option>
                    <option value="Solidwin Viewer">Solidwin Viewer (Read Only)</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 6,
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 18px",
                      borderRadius: 6,
                      border: "1px solid #310e54",
                      background: "#310e54",
                      color: "#ffffff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
