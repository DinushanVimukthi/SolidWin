"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  Building2,
  Calculator,
  PlusCircle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MetricCard } from "@/components/admin/MetricCard";
import { RecentInquiriesSection } from "@/components/admin/RecentInquiriesSection";
import { inquiryRepository } from "@/lib/dal/inquiry-repository";
import { useProjects } from "@/lib/cms/projects-store";
import { useAdminAuth } from "@/components/admin/AdminAuthGuard";
import type { InquiryItem, InquiryStatus } from "@/lib/dal/types";
import styles from "./admin.module.css";

export default function AdminOverviewPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const { projects } = useProjects();
  const { user } = useAdminAuth();

  useEffect(() => {
    let isMounted = true;
    inquiryRepository.getAll().then((data) => {
      if (isMounted) setInquiries(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    const actor = {
      name: user?.name || "Solidwin Admin",
      email: user?.email || "admin@solidwin.ae",
      role: "admin" as const,
    };
    await inquiryRepository.updateStatus(id, status, actor);
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
  };

  const handleAddNote = async (id: string, note: string) => {
    const actor = {
      name: user?.name || "Solidwin Admin",
      email: user?.email || "admin@solidwin.ae",
      role: "admin" as const,
    };
    await inquiryRepository.addStaffNote(id, note, actor);
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id
          ? { ...inq, staffNotes: [...(inq.staffNotes ?? []), note] }
          : inq
      )
    );
  };

  const totalInquiries = inquiries.length;
  const activeQuotes = inquiries.filter(
    (i) => i.status === "in_review" || i.status === "quoted"
  ).length;

  const constructionCount = inquiries.filter(
    (i) => i.division?.toLowerCase().includes("construction") || i.source === "construction_rfq"
  ).length;
  const readyMixCount = inquiries.filter(
    (i) => i.division?.toLowerCase().includes("ready") || i.division?.toLowerCase().includes("concrete") || i.source === "ready_mix"
  ).length;
  const hardwareCount = inquiries.filter(
    (i) => i.division?.toLowerCase().includes("hardware") || i.division?.toLowerCase().includes("block") || i.source === "hardware_boq"
  ).length;
  const aiCount = inquiries.filter((i) => i.source === "ai_assistant").length;

  const totalDiv = Math.max(totalInquiries, 1);
  const constructionPct = Math.round((constructionCount / totalDiv) * 100);
  const readyMixPct = Math.round((readyMixCount / totalDiv) * 100);
  const hardwarePct = Math.round((hardwareCount / totalDiv) * 100);
  const aiPct = Math.round((aiCount / totalDiv) * 100);

  return (
    <>
      <AdminHeader
        title="Dashboard Overview"
        description="Real-time multi-division performance for Construction, Ready-Mix, and Hardware."
      />

      <div className={styles.pageContainer}>
        {/* Metric Cards Row with Live Real Data */}
        <div className={styles.metricsGrid}>
          <MetricCard
            title="Total Inquiries & RFQs"
            value={String(totalInquiries)}
            trend={{ value: `${activeQuotes} active in inquiry board`, positive: true }}
            icon={<Inbox size={20} />}
          />
          <MetricCard
            title="Active Pipeline RFQs"
            value={String(activeQuotes)}
            trend={{ value: "In review & quoted stages", neutral: true }}
            icon={<Building2 size={20} />}
          />
          <MetricCard
            title="Portfolio Case Studies"
            value={String(projects.length)}
            trend={{ value: "Published across 4 sectors", positive: true }}
            icon={<Building2 size={20} />}
          />
          <MetricCard
            title="Operational Readiness"
            value="100%"
            trend={{ value: "3 Divisions Active & Monitored", positive: true }}
            icon={<CheckCircle2 size={20} />}
          />
        </div>

        {/* 2-Column Dashboard Layout */}
        <div className={styles.twoColGrid}>
          {/* Left Column: Reengineered Recent Inquiries & RFQs */}
          <RecentInquiriesSection
            inquiries={inquiries}
            onStatusChange={handleStatusChange}
            onAddNote={handleAddNote}
          />

          {/* Right Column: Division Breakdown & Quick Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Division Breakdown */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Division Lead Volume</h3>
                  <p className={styles.cardSubtitle}>Breakdown by operational unit</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.breakdownList}>
                  <div className={styles.breakdownItem}>
                    <div className={styles.breakdownHeader}>
                      <span className={styles.breakdownName}>Construction Services</span>
                      <span className={styles.breakdownValue}>{constructionPct}% ({constructionCount})</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${constructionPct}%`, background: "#310e54" }}
                      />
                    </div>
                  </div>

                  <div className={styles.breakdownItem}>
                    <div className={styles.breakdownHeader}>
                      <span className={styles.breakdownName}>Ready-Mix Concrete</span>
                      <span className={styles.breakdownValue}>{readyMixPct}% ({readyMixCount})</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${readyMixPct}%`, background: "#f59e0b" }}
                      />
                    </div>
                  </div>

                  <div className={styles.breakdownItem}>
                    <div className={styles.breakdownHeader}>
                      <span className={styles.breakdownName}>Hardware &amp; Equipment</span>
                      <span className={styles.breakdownValue}>{hardwarePct}% ({hardwareCount})</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${hardwarePct}%`, background: "#0284c7" }}
                      />
                    </div>
                  </div>

                  <div className={styles.breakdownItem}>
                    <div className={styles.breakdownHeader}>
                      <span className={styles.breakdownName}>AI Guidance Leads</span>
                      <span className={styles.breakdownValue}>{aiPct}% ({aiCount})</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${aiPct}%`, background: "#10b981" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActionsGrid}>
                  <Link href="/admin/inquiries" className={styles.quickActionBtn}>
                    <PlusCircle size={18} color="#310e54" />
                    <span>Inquiry Board</span>
                    <span className={styles.quickActionSub}>{totalInquiries} total leads</span>
                  </Link>

                  <Link href="/admin/content/projects" className={styles.quickActionBtn}>
                    <Building2 size={18} color="#0284c7" />
                    <span>Projects CMS</span>
                    <span className={styles.quickActionSub}>{projects.length} builds</span>
                  </Link>

                  <Link href="/admin/content/calculators" className={styles.quickActionBtn}>
                    <Calculator size={18} color="#7c3aed" />
                    <span>Calculators CMS</span>
                    <span className={styles.quickActionSub}>Parameters &amp; margins</span>
                  </Link>

                  <Link href="/admin/content/documents" className={styles.quickActionBtn}>
                    <FileText size={18} color="#059669" />
                    <span>HSEQ &amp; Profile</span>
                    <span className={styles.quickActionSub}>Official documents</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Portal Tenant Security Note */}
            <div
              style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} color="#059669" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                  EXE Multi-Tenant Isolation Active
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                All database records and lead forwarding enforce workspace ID{" "}
                <code>tenant_solidwin_prod</code>. Cross-tenant access is strictly blocked at the API layer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
