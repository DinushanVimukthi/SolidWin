"use client";

import { Plus, Edit3, Check } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import styles from "../../admin.module.css";

interface ConcreteGrade {
  code: string;
  strength: string;
  slump: string;
  applications: string;
  approved: boolean;
}

const grades: ConcreteGrade[] = [
  { code: "G15", strength: "15 N/mm²", slump: "75–100 mm", applications: "Blinding, mass concrete, non-structural levelling", approved: true },
  { code: "G20", strength: "20 N/mm²", slump: "100–125 mm", applications: "Single-storey domestic footings, light pavements", approved: true },
  { code: "G25", strength: "25 N/mm²", slump: "100–150 mm", applications: "General reinforced slabs, foundations, residential frames", approved: true },
  { code: "G30", strength: "30 N/mm²", slump: "125–175 mm", applications: "Commercial structures, beams, heavy suspended slabs", approved: true },
  { code: "G35", strength: "35 N/mm²", slump: "150–200 mm", applications: "High-rise columns, water-retaining structures, heavy loads", approved: true },
];

export default function AdminConcretePage() {
  return (
    <>
      <AdminHeader
        title="Ready-Mix Concrete Grade Catalogue"
        description="Manage published characteristic strength specifications and batching quality parameters."
      />

      <div className={styles.pageContainer}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Published in accordance with Solidwin QA/QC and client-approved mix designs.
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
            <span>Add Custom Mix Grade</span>
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Grade Code</th>
                  <th>Characteristic Strength</th>
                  <th>Slump Range</th>
                  <th>Recommended Applications</th>
                  <th>Client Approved</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.code}>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "#fef3c7",
                          color: "#92400e",
                        }}
                      >
                        {g.code}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{g.strength}</td>
                    <td style={{ color: "#64748b" }}>{g.slump}</td>
                    <td style={{ color: "#334155", maxWidth: 360 }}>{g.applications}</td>
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
                        <Check size={14} /> Approved
                      </span>
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
