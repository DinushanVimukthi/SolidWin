"use client";

import { Plus, Edit3 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import styles from "../../admin.module.css";

export default function AdminFaqPage() {
  const faqs = [
    {
      topic: "Concrete Delivery Radius",
      question: "What is the delivery radius for ready-mix concrete?",
      answer: "We service 3 concentric radial zones from our central batching plant: Zone 1 (up to 15 km express), Zone 2 (15–30 km standard), and Zone 3 (30–45 km with certified retarder mix).",
    },
    {
      topic: "Block Breakage & Calculations",
      question: "How does the block calculator factor breakage?",
      answer: "The Solidwin Brick/Block Calculator accounts for standard mortar joints and adds a rounded-up 5% wastage allowance per standard engineering estimates.",
    },
    {
      topic: "Pump Truck Dispatch",
      question: "Can concrete pump trucks be booked with ready-mix orders?",
      answer: "Yes, 32m and 42m boom pump trucks can be scheduled directly during volume reservation. Site clearance and access roads must be verified by staff prior to dispatch.",
    },
    {
      topic: "Attachment BOQ Uploads",
      question: "What file formats and sizes are supported for tender submissions?",
      answer: "Architectural drawings and BOQ spreadsheets in PDF, DWG, PNG, JPG, and XLSX formats up to 25 MB are accepted via direct private object storage.",
    },
  ];

  return (
    <>
      <AdminHeader
        title="AI Assistant Knowledge Base & FAQs"
        description="Ground chatbot guidance in Solidwin-approved technical specifications, regions, and services."
      />

      <div className={styles.pageContainer}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Knowledge items are automatically synchronized with the floating Solidwin AI Assistant.
          </p>
          <button
            type="button"
            className={styles.actionButton}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#310e54",
              color: "#ffffff",
              borderColor: "#310e54",
            }}
          >
            <Plus size={16} />
            <span>Add Knowledge Item</span>
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>User Query / FAQ</th>
                  <th>Grounded Technical Response</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f.topic}>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "#e0f2fe",
                          color: "#0369a1",
                        }}
                      >
                        {f.topic}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "#0f172a", maxWidth: 220 }}>{f.question}</td>
                    <td style={{ color: "#475569", fontSize: 13, lineHeight: 1.5, maxWidth: 440 }}>
                      {f.answer}
                    </td>
                    <td>
                      <button type="button" className={styles.actionButton}>
                        <Edit3 size={14} />
                      </button>
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
