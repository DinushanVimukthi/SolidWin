"use client";

import { useState } from "react";
import { Check, RefreshCw, Save, Sparkles, Plus, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  useCalculatorSettings,
  type CalculatorSettings,
  DEFAULT_CALCULATOR_SETTINGS,
} from "@/lib/cms/calculator-settings";
import styles from "../../admin.module.css";

export default function AdminCalculatorsPage() {
  const { updateSettings, resetToDefaults } = useCalculatorSettings();
  const [formData, setFormData] = useState<CalculatorSettings>(DEFAULT_CALCULATOR_SETTINGS);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"blocks" | "plaster" | "paint" | "concrete">("blocks");

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    showNotify("Calculator engineering parameters updated and published to public site!");
  };

  const handleReset = async () => {
    if (confirm("Reset all calculator parameters back to standard civil engineering defaults?")) {
      await resetToDefaults();
      setFormData(DEFAULT_CALCULATOR_SETTINGS);
      showNotify("Parameters restored to baseline engineering standards.");
    }
  };

  const handleAddPreset = () => {
    setFormData((prev) => ({
      ...prev,
      blockPresets: [
        ...prev.blockPresets,
        { name: "Custom Block (400 × 150 mm)", length: 400, height: 150 },
      ],
    }));
  };

  const handleRemovePreset = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      blockPresets: prev.blockPresets.filter((_, i) => i !== idx),
    }));
  };

  return (
    <>
      <AdminHeader
        title="Calculators & Engineering Parameters CMS"
        description="Configure dynamic calculation coefficients, material wastage allowances, and coverage metrics across all public estimators."
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

        {/* Top Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, background: "#f1f5f9", padding: 4, borderRadius: 8 }}>
            <button
              type="button"
              onClick={() => setActiveTab("blocks")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === "blocks" ? "#ffffff" : "transparent",
                color: activeTab === "blocks" ? "#310e54" : "#64748b",
                boxShadow: activeTab === "blocks" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              Brick &amp; Block Masonry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("plaster")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === "plaster" ? "#ffffff" : "transparent",
                color: activeTab === "plaster" ? "#310e54" : "#64748b",
                boxShadow: activeTab === "plaster" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              Plaster &amp; Cement Mortar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("paint")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === "paint" ? "#ffffff" : "transparent",
                color: activeTab === "paint" ? "#310e54" : "#64748b",
                boxShadow: activeTab === "paint" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              Paint &amp; Surface Coverage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("concrete")}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === "concrete" ? "#ffffff" : "transparent",
                color: activeTab === "concrete" ? "#310e54" : "#64748b",
                boxShadow: activeTab === "concrete" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              Ready-Mix Wastage Margin
            </button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleReset}
              className={styles.actionButton}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <RefreshCw size={14} />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
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
              <Save size={16} />
              <span>Save Parameters</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Brick & Block Parameters */}
        {activeTab === "blocks" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Masonry &amp; Block Wall Parameters</h3>
                  <p className={styles.cardSubtitle}>
                    Adjust standard tolerances applied to wall surface area equations
                  </p>
                </div>
              </div>
              <div className={styles.cardBody} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                    Standard Mortar Joint Thickness (mm)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={formData.mortarJointMm}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, mortarJointMm: parseInt(e.target.value, 10) || 10 }))
                      }
                      style={{ flex: 1 }}
                    />
                    <span
                      style={{
                        minWidth: 60,
                        textAlign: "center",
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#f1f5f9",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#310e54",
                      }}
                    >
                      {formData.mortarJointMm} mm
                    </span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>
                    Nominal mortar thickness added to length and height of each block during unit calculation.
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                    Wastage &amp; Breakage Allowance (%)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="1"
                      value={formData.blockBreakagePercent}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          blockBreakagePercent: parseInt(e.target.value, 10) || 0,
                        }))
                      }
                      style={{ flex: 1 }}
                    />
                    <span
                      style={{
                        minWidth: 60,
                        textAlign: "center",
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#f1f5f9",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#310e54",
                      }}
                    >
                      {formData.blockBreakagePercent} %
                    </span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>
                    Standard contingency for transit chipping, corner cuts, and site handling losses.
                  </p>
                </div>

                {/* Preset Block Dimensions */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                      Configurable Block Presets ({formData.blockPresets.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPreset}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        padding: "4px 8px",
                        borderRadius: 4,
                        border: "1px solid #cbd5e1",
                        background: "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <Plus size={12} /> Add Preset
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {formData.blockPresets.map((preset, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.5fr 1fr 1fr auto",
                          gap: 8,
                          alignItems: "center",
                          padding: 10,
                          borderRadius: 6,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <input
                          type="text"
                          value={preset.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => {
                              const list = [...prev.blockPresets];
                              list[idx] = { ...list[idx], name: val };
                              return { ...prev, blockPresets: list };
                            });
                          }}
                          placeholder="Preset Name"
                          style={{ padding: "6px 8px", borderRadius: 4, border: "1px solid #cbd5e1", fontSize: 12.5 }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <input
                            type="number"
                            value={preset.length}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setFormData((prev) => {
                                const list = [...prev.blockPresets];
                                list[idx] = { ...list[idx], length: val };
                                return { ...prev, blockPresets: list };
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid #cbd5e1", fontSize: 12.5 }}
                          />
                          <span style={{ fontSize: 11, color: "#64748b" }}>mm</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <input
                            type="number"
                            value={preset.height}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setFormData((prev) => {
                                const list = [...prev.blockPresets];
                                list[idx] = { ...list[idx], height: val };
                                return { ...prev, blockPresets: list };
                              });
                            }}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: 4, border: "1px solid #cbd5e1", fontSize: 12.5 }}
                          />
                          <span style={{ fontSize: 11, color: "#64748b" }}>mm</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePreset(idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: 4,
                          }}
                          title="Remove Preset"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Impact Preview */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={16} color="#310e54" />
                  <h3 className={styles.cardTitle}>Live Simulation (10m × 3m Wall)</h3>
                </div>
              </div>
              <div className={styles.cardBody}>
                {(() => {
                  const wallArea = 30; // 10m x 3m
                  const preset = formData.blockPresets[0] || { length: 400, height: 200, name: "Sample" };
                  const nominalArea = ((preset.length + formData.mortarJointMm) / 1000) * ((preset.height + formData.mortarJointMm) / 1000);
                  const netUnits = Math.ceil(wallArea / nominalArea);
                  const totalUnits = Math.ceil(netUnits * (1 + formData.blockBreakagePercent / 100));

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                        Applying selected configuration against standard 30 m² external wall with &ldquo;{preset.name}&rdquo;:
                      </p>

                      <div style={{ padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                          Calculated Total Units Required
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#310e54", margin: "4px 0" }}>
                          {totalUnits.toLocaleString()} units
                        </div>
                        <div style={{ fontSize: 12.5, color: "#059669" }}>
                          Net blocks: {netUnits} + {totalUnits - netUnits} buffer ({formData.blockBreakagePercent}%)
                        </div>
                      </div>

                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                        • Nominal block footprint: {preset.length + formData.mortarJointMm} × {preset.height + formData.mortarJointMm} mm<br />
                        • Single unit coverage: {Math.round(nominalArea * 10000) / 10000} m²<br />
                        • Public frontend updates automatically upon saving.
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Plaster & Mortar Parameters */}
        {activeTab === "plaster" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Plaster &amp; Cement Mortar Parameters</h3>
                  <p className={styles.cardSubtitle}>
                    Define dry volume factors, cement densities, and default mix ratios
                  </p>
                </div>
              </div>
              <div className={styles.cardBody} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                      Default Plaster Thickness (mm)
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="30"
                      value={formData.defaultPlasterThicknessMm}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          defaultPlasterThicknessMm: parseInt(e.target.value, 10) || 12,
                        }))
                      }
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                    />
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Standard internal/external coat (12mm default)</p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                      Default Mix Ratio
                    </label>
                    <select
                      value={formData.defaultPlasterMix}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          defaultPlasterMix: e.target.value as "1:4" | "1:6",
                        }))
                      }
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#ffffff" }}
                    >
                      <option value="1:4">1:4 (Exterior &amp; Structural)</option>
                      <option value="1:6">1:6 (Internal Partition Plaster)</option>
                    </select>
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Ratio of Portland cement to fine sand</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                      Dry Volume Compaction Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1.1"
                      max="1.6"
                      value={formData.dryVolumeFactor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dryVolumeFactor: parseFloat(e.target.value) || 1.33,
                        }))
                      }
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                    />
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Accounts for voids &amp; water reduction (1.33 standard)</p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                      Cement Density (kg/m³)
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={formData.cementDensityKgM3}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cementDensityKgM3: parseInt(e.target.value, 10) || 1440,
                        }))
                      }
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                    />
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Standard bulk density of Ordinary Portland Cement (1440 kg/m³)</p>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                    Standard Commercial Cement Bag Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.cementBagWeightKg}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cementBagWeightKg: parseInt(e.target.value, 10) || 50,
                      }))
                    }
                    style={{ width: "100%", maxWidth: 200, padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                  />
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Standard 50kg bag packaging</p>
                </div>
              </div>
            </div>

            {/* Live Simulation */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={16} color="#310e54" />
                  <h3 className={styles.cardTitle}>Live Simulation (100 m² Surface Area)</h3>
                </div>
              </div>
              <div className={styles.cardBody}>
                {(() => {
                  const areaM2 = 100;
                  const wetVol = areaM2 * (formData.defaultPlasterThicknessMm / 1000);
                  const dryVol = wetVol * formData.dryVolumeFactor;
                  const parts = formData.defaultPlasterMix === "1:4" ? { c: 1, s: 4, tot: 5 } : { c: 1, s: 6, tot: 7 };
                  const cVol = dryVol * (parts.c / parts.tot);
                  const sVol = dryVol * (parts.s / parts.tot);
                  const bags = Math.ceil((cVol * formData.cementDensityKgM3) / formData.cementBagWeightKg);

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                          Cement Requirement
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#310e54", margin: "4px 0" }}>
                          {bags} Bags ({formData.cementBagWeightKg}kg each)
                        </div>
                        <div style={{ fontSize: 12.5, color: "#059669" }}>
                          + {Math.round(sVol * 100) / 100} m³ fine plaster sand
                        </div>
                      </div>

                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                        • Wet plaster volume: {Math.round(wetVol * 1000) / 1000} m³<br />
                        • Dry compacted volume: {Math.round(dryVol * 1000) / 1000} m³ (× {formData.dryVolumeFactor})<br />
                        • Mix ratio: {formData.defaultPlasterMix} @ {formData.defaultPlasterThicknessMm}mm thickness.
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Paint Parameters */}
        {activeTab === "paint" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Paint &amp; Surface Coating Parameters</h3>
                  <p className={styles.cardSubtitle}>
                    Control default coat multipliers and spreading rates in square metres per litre
                  </p>
                </div>
              </div>
              <div className={styles.cardBody} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                    Standard Paint Coverage (m² per Litre per Coat)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="range"
                      min="6"
                      max="16"
                      step="0.5"
                      value={formData.paintCoverageM2PerLiter}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paintCoverageM2PerLiter: parseFloat(e.target.value) || 10,
                        }))
                      }
                      style={{ flex: 1 }}
                    />
                    <span
                      style={{
                        minWidth: 70,
                        textAlign: "center",
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#f1f5f9",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#310e54",
                      }}
                    >
                      {formData.paintCoverageM2PerLiter} m²/L
                    </span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>
                    Standard spreading rate for masonry emulsions on primed walls (10 m²/L standard).
                  </p>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                    Default Recommended Number of Coats
                  </label>
                  <select
                    value={formData.defaultPaintCoats}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        defaultPaintCoats: parseInt(e.target.value, 10) || 2,
                      }))
                    }
                    style={{ width: "100%", maxWidth: 260, padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#ffffff" }}
                  >
                    <option value={1}>1 Coat (Touch-up / Pre-coated)</option>
                    <option value={2}>2 Coats (Standard Architectural Finish)</option>
                    <option value={3}>3 Coats (High-Opacity / Exterior Extreme)</option>
                  </select>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#64748b" }}>Pre-selected coat count when user opens Paint Estimator</p>
                </div>
              </div>
            </div>

            {/* Simulation */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={16} color="#310e54" />
                  <h3 className={styles.cardTitle}>Live Simulation (150 m² Surface Area)</h3>
                </div>
              </div>
              <div className={styles.cardBody}>
                {(() => {
                  const areaM2 = 150;
                  const totalLitres = Math.ceil(((areaM2 * formData.defaultPaintCoats) / formData.paintCoverageM2PerLiter) * 10) / 10;

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                          Total Architectural Paint Required
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#310e54", margin: "4px 0" }}>
                          {totalLitres} Litres
                        </div>
                        <div style={{ fontSize: 12.5, color: "#059669" }}>
                          Covering 150 m² across {formData.defaultPaintCoats} coats
                        </div>
                      </div>

                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                        • Spreading rate: {formData.paintCoverageM2PerLiter} m² per litre per coat<br />
                        • Standard 20L drum estimation: ~{Math.ceil(totalLitres / 20)} drums needed.
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Concrete Volume Wastage Margin */}
        {activeTab === "concrete" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>Ready-Mix Concrete Wastage Margin</h3>
                  <p className={styles.cardSubtitle}>
                    Default allowance for excavation irregularities, formwork deflection, and slump settlement
                  </p>
                </div>
              </div>
              <div className={styles.cardBody} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                    Wastage &amp; Pour Overfill Margin (%)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="1"
                      value={formData.concreteWastagePercent}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          concreteWastagePercent: parseInt(e.target.value, 10) || 5,
                        }))
                      }
                      style={{ flex: 1 }}
                    />
                    <span
                      style={{
                        minWidth: 60,
                        textAlign: "center",
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#f1f5f9",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#310e54",
                      }}
                    >
                      {formData.concreteWastagePercent} %
                    </span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748b" }}>
                    Civil engineers recommend 5% to 10% contingency for unlevel subgrades and pump hose residue.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={16} color="#310e54" />
                  <h3 className={styles.cardTitle}>Live Simulation (12m × 6m × 0.15m Slab)</h3>
                </div>
              </div>
              <div className={styles.cardBody}>
                {(() => {
                  const baseVol = 12 * 6 * 0.15; // 10.8 m³
                  const withWaste = Math.round(baseVol * (1 + formData.concreteWastagePercent / 100) * 100) / 100;

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ padding: 16, background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>
                          Dispatched Concrete Order
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: "#310e54", margin: "4px 0" }}>
                          {withWaste} m³
                        </div>
                        <div style={{ fontSize: 12.5, color: "#059669" }}>
                          Base: {baseVol} m³ + {Math.round((withWaste - baseVol) * 100) / 100} m³ margin ({formData.concreteWastagePercent}%)
                        </div>
                      </div>

                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                        • Equivalent transit mixer loads: ~{Math.ceil(withWaste / 6)} trucks (6 m³ capacity each)<br />
                        • Public concrete volume calculator will automatically reflect this margin.
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
