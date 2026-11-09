"use client";

import { CheckCircle2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import styles from "../../admin.module.css";

export default function AdminWhatsAppLogsPage() {
  const logs = [
    {
      id: "wa-901",
      leadId: "inq-101",
      recipient: "+971 50 *** 9988 (Management Desk)",
      division: "Ready-Mix Concrete",
      summary: "350 m³ G30 pump mix for Ahmed Al-Mansoor",
      timestamp: "Today at 09:30 AM",
      status: "delivered",
      attempts: 1,
    },
    {
      id: "wa-902",
      leadId: "inq-102",
      recipient: "+971 50 *** 9988 (Management Desk)",
      division: "Construction Services",
      summary: "Turnkey design & build proposal for Sarah Jenkins",
      timestamp: "Yesterday at 02:15 PM",
      status: "delivered",
      attempts: 1,
    },
    {
      id: "wa-903",
      leadId: "inq-103",
      recipient: "+971 50 *** 9988 (Management Desk)",
      division: "Hardware & Blocks",
      summary: "18,000 solid blocks + scissor lifts for Kareem Tarek",
      timestamp: "29 Oct at 11:00 AM",
      status: "delivered",
      attempts: 1,
    },
    {
      id: "wa-904",
      leadId: "inq-105",
      recipient: "+971 50 *** 9988 (Management Desk)",
      division: "AI Assistant Lead",
      summary: "Slump recommendation callback request for Fatima Noor",
      timestamp: "Today at 11:45 AM",
      status: "delivered",
      attempts: 1,
    },
  ];

  return (
    <>
      <AdminHeader
        title="WhatsApp Forwarding Audit & Delivery Logs"
        description="Immutable logs of lead payloads dispatched via the WhatsApp Business API."
      />

      <div className={styles.pageContainer}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Durable background dispatch queue with automatic idempotency to prevent duplicate leads.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#059669", fontWeight: 600 }}>
            <CheckCircle2 size={16} /> 100% Provider Delivery Rate
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Dispatch ID</th>
                  <th>Lead Reference</th>
                  <th>Division</th>
                  <th>Payload Summary</th>
                  <th>Timestamp</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: "monospace", fontSize: 12, color: "#64748b" }}>
                      {log.id}
                    </td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{log.leadId}</td>
                    <td>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "#f1f5f9",
                        }}
                      >
                        {log.division}
                      </span>
                    </td>
                    <td style={{ color: "#334155" }}>{log.summary}</td>
                    <td style={{ color: "#64748b", fontSize: 12 }}>{log.timestamp}</td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#059669",
                        }}
                      >
                        <CheckCircle2 size={14} /> Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
