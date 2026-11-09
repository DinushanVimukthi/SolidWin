"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import styles from "../../admin.module.css";

export default function AdminCataloguePage() {
  const blocks = [
    { name: "200mm Hollow Block", dimensions: "400 × 200 × 200 mm", strength: "7.0 N/mm²", stock: "In Stock" },
    { name: "150mm Partition Block", dimensions: "400 × 150 × 200 mm", strength: "5.5 N/mm²", stock: "In Stock" },
    { name: "100mm Solid Block", dimensions: "400 × 100 × 200 mm", strength: "12.5 N/mm²", stock: "In Stock" },
    { name: "80mm Heavy Interlocking Paver", dimensions: "200 × 100 × 80 mm", strength: "45.0 N/mm²", stock: "In Stock" },
  ];

  const equipment = [
    { name: "20-Ton Hydraulic Excavator", model: "CAT 320D", terms: "Daily / Weekly / Monthly", operator: "Available" },
    { name: "32m Mobile Concrete Boom Pump", model: "Putzmeister BSF 36", terms: "Per Pour / Shift", operator: "Certified Operator Included" },
    { name: "10-Ton Vibratory Soil Compactor", model: "Bomag BW 211", terms: "Weekly / Monthly", operator: "Optional" },
  ];

  return (
    <>
      <AdminHeader
        title="Hardware, Blocks & Machinery Catalogue"
        description="Manage manufactured masonry blocks, interlocking pavers, and leased heavy equipment inventory."
      />

      <div className={styles.pageContainer}>
        {/* Blocks Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Manufactured Masonry Blocks &amp; Pavers</h3>
              <p className={styles.cardSubtitle}>Dimensions, compressive strengths, and availability</p>
            </div>
          </div>
          <div className={styles.cardBody} style={{ padding: 0 }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Dimensions (L × W × H)</th>
                  <th>Compressive Strength</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {blocks.map((b) => (
                  <tr key={b.name}>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{b.name}</td>
                    <td style={{ color: "#64748b" }}>{b.dimensions}</td>
                    <td style={{ fontWeight: 600, color: "#310e54" }}>{b.strength}</td>
                    <td>
                      <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>● {b.stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Equipment Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Rental Machinery &amp; Fleet</h3>
              <p className={styles.cardSubtitle}>Heavy construction equipment and hire conditions</p>
            </div>
          </div>
          <div className={styles.cardBody} style={{ padding: 0 }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Equipment Description</th>
                  <th>Model</th>
                  <th>Rental Terms</th>
                  <th>Operator Requirement</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((eq) => (
                  <tr key={eq.name}>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{eq.name}</td>
                    <td style={{ color: "#64748b" }}>{eq.model}</td>
                    <td style={{ color: "#334155" }}>{eq.terms}</td>
                    <td style={{ color: "#64748b", fontSize: 12.5 }}>{eq.operator}</td>
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
