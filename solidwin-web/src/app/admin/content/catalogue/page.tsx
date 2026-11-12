"use client";

import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BLOCK_PAVER_PRODUCTS, EQUIPMENT_PRODUCTS, HARDWARE_GALLERY } from "@/data/hardware";
import styles from "../../admin.module.css";

export default function AdminCataloguePage() {
  return (
    <>
      <AdminHeader
        title="Hardware, Blocks & Machinery Catalogue"
        description="Manage manufactured masonry blocks, interlocking pavers, heavy equipment inventory, and on-site media assets."
      />

      <div className={styles.pageContainer}>
        {/* Blocks Section */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Manufactured Masonry Blocks &amp; Pavers</h3>
              <p className={styles.cardSubtitle}>
                {BLOCK_PAVER_PRODUCTS.length} active products with dimensional tolerances and test data
              </p>
            </div>
          </div>
          <div className={styles.cardBody} style={{ padding: 0 }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 64 }}>Preview</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Dimensions (L × W × H)</th>
                  <th>Compressive Strength</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {BLOCK_PAVER_PRODUCTS.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ position: "relative", width: 44, height: 36, borderRadius: 6, overflow: "hidden", background: "#f1f5f9" }}>
                        <Image src={b.image} alt={b.name} fill style={{ objectFit: "cover" }} sizes="44px" />
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{b.name}</td>
                    <td>
                      <span style={{ textTransform: "capitalize", fontSize: 12, padding: "2px 8px", background: "#f1f5f9", borderRadius: 4, fontWeight: 600 }}>
                        {b.category}
                      </span>
                    </td>
                    <td style={{ color: "#64748b" }}>{b.dimensionsMm}</td>
                    <td style={{ fontWeight: 600, color: "#310e54" }}>{b.compressiveStrength}</td>
                    <td>
                      <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>● Active</span>
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
              <p className={styles.cardSubtitle}>
                {EQUIPMENT_PRODUCTS.length} heavy construction units and site equipment available for mobilization
              </p>
            </div>
          </div>
          <div className={styles.cardBody} style={{ padding: 0 }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 64 }}>Preview</th>
                  <th>Equipment Description</th>
                  <th>Category</th>
                  <th>Key Specifications</th>
                  <th>Min Duration</th>
                  <th>Terms</th>
                </tr>
              </thead>
              <tbody>
                {EQUIPMENT_PRODUCTS.map((eq) => (
                  <tr key={eq.id}>
                    <td>
                      <div style={{ position: "relative", width: 44, height: 36, borderRadius: 6, overflow: "hidden", background: "#f1f5f9" }}>
                        <Image src={eq.image} alt={eq.name} fill style={{ objectFit: "cover" }} sizes="44px" />
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{eq.name}</td>
                    <td>
                      <span style={{ textTransform: "capitalize", fontSize: 12, padding: "2px 8px", background: "#f1f5f9", borderRadius: 4, fontWeight: 600 }}>
                        {eq.category}
                      </span>
                    </td>
                    <td style={{ color: "#64748b", fontSize: 13 }}>{eq.specifications}</td>
                    <td style={{ fontWeight: 600, color: "#310e54", fontSize: 13 }}>{eq.minHireDuration}</td>
                    <td style={{ color: "#64748b", fontSize: 12.5, maxWidth: 220 }}>{eq.terms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hardware On-Site Media Assets Gallery */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>Hardware On-Site Media Assets</h3>
              <p className={styles.cardSubtitle}>
                {HARDWARE_GALLERY.length} real photography assets indexed across store, tool wall, paint depot, steel bays, and rental machinery
              </p>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {HARDWARE_GALLERY.map((img) => (
                <div
                  key={img.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "4/3", width: "100%", background: "#0f172a" }}>
                    <Image src={img.image} alt={img.alt} fill style={{ objectFit: "cover" }} sizes="220px" />
                    <span
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(15, 23, 42, 0.8)",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {img.category}
                    </span>
                  </div>
                  <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{img.title}</div>
                    <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4, marginTop: "auto" }}>
                      {img.image.replace("/images/hardware/", "")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
