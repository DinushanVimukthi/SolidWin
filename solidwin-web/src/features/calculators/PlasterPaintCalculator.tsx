"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  calculatePlasterOrPaint,
  type CalculationType,
  type AreaUnit,
} from "./logic/plasterPaintCalculator";
import { useCalculatorSettings } from "@/lib/cms/calculator-settings";
import styles from "./ConcreteVolumeCalculator.module.css";

export function PlasterPaintCalculator() {
  const { settings } = useCalculatorSettings();
  const [calcType, setCalcType] = useState<CalculationType>("plaster");
  const [unit, setUnit] = useState<AreaUnit>("m2");
  const [area, setArea] = useState<number>(100);

  // Overrides if explicitly changed by user
  const [userThickness, setUserThickness] = useState<number | null>(null);
  const [userMixRatio, setUserMixRatio] = useState<"1:4" | "1:6" | null>(null);
  const [userCoats, setUserCoats] = useState<number | null>(null);

  const thickness = userThickness ?? settings.defaultPlasterThicknessMm ?? 12;
  const mixRatio = userMixRatio ?? settings.defaultPlasterMix ?? "1:4";
  const coats = userCoats ?? settings.defaultPaintCoats ?? 2;

  const result = calculatePlasterOrPaint({
    type: calcType,
    area,
    unit,
    thicknessMm: thickness,
    mixRatio,
    dryVolumeFactor: settings.dryVolumeFactor,
    cementDensityKgM3: settings.cementDensityKgM3,
    cementBagWeightKg: settings.cementBagWeightKg,
    coats,
    coveragePerLiterSqM: settings.paintCoverageM2PerLiter,
  });

  return (
    <div className={styles.calculator} aria-label="Plaster and paint calculator">
      <div className={styles.header}>
        <div className={styles.unitToggle}>
          <button
            type="button"
            className={`${styles.tabBtn} ${calcType === "plaster" ? styles.activeTab : ""}`}
            onClick={() => setCalcType("plaster")}
          >
            Plaster Estimator
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${calcType === "paint" ? styles.activeTab : ""}`}
            onClick={() => setCalcType("paint")}
          >
            Paint Estimator
          </button>
        </div>
      </div>

      <div className={styles.inputsGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="area-input" className={styles.label}>
            Surface Area ({unit === "m2" ? "m²" : "sq ft"})
          </label>
          <input
            id="area-input"
            type="number"
            min="1"
            step="1"
            value={area}
            onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="unit-select" className={styles.label}>
            Area Unit
          </label>
          <select
            id="unit-select"
            className={styles.select}
            value={unit}
            onChange={(e) => setUnit(e.target.value as AreaUnit)}
          >
            <option value="m2">Square Metres (m²)</option>
            <option value="sqft">Square Feet (sq ft)</option>
          </select>
        </div>

        {calcType === "plaster" ? (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="thickness-select" className={styles.label}>
                Plaster Thickness
              </label>
              <select
                id="thickness-select"
                className={styles.select}
                value={thickness}
                onChange={(e) => setUserThickness(parseInt(e.target.value, 10) || 12)}
              >
                <option value={10}>10 mm (Internal Thin)</option>
                <option value={12}>12 mm (Standard Wall)</option>
                <option value={15}>15 mm (Ceiling / Rough)</option>
                <option value={20}>20 mm (Exterior Heavy)</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="mix-select" className={styles.label}>
                Mortar Mix Ratio
              </label>
              <select
                id="mix-select"
                className={styles.select}
                value={mixRatio}
                onChange={(e) => setUserMixRatio(e.target.value as "1:4" | "1:6")}
              >
                <option value="1:4">1:4 (Exterior / Structural)</option>
                <option value="1:6">1:6 (Internal)</option>
              </select>
            </div>
          </>
        ) : (
          <div className={styles.inputGroup}>
            <label htmlFor="coats-select" className={styles.label}>
              Number of Coats
            </label>
            <select
              id="coats-select"
              className={styles.select}
              value={coats}
              onChange={(e) => setUserCoats(parseInt(e.target.value, 10) || 1)}
            >
              <option value={1}>1 Coat</option>
              <option value={2}>2 Coats (Standard recommended)</option>
              <option value={3}>3 Coats</option>
            </select>
          </div>
        )}
      </div>

      <div className={styles.wastageRow}>
        <p className={styles.resultNote}>
          {calcType === "plaster"
            ? `Assumptions: ${thickness}mm nominal thickness, ${settings.cementBagWeightKg || 50}kg bag standard cement, ${settings.dryVolumeFactor || 1.33} dry volume factor.`
            : `Assumptions: ~${settings.paintCoverageM2PerLiter || 10} m²/Litre standard coverage per coat for smooth finished surface.`}
        </p>
      </div>

      <div className={styles.resultBox}>
        {result.type === "plaster" ? (
          <div>
            <span className={styles.resultLabel}>Required Materials</span>
            <div className={styles.resultValue}>
              {result.cementBags50kg}{" "}
              <span className={styles.resultUnit}>Bags Cement ({settings.cementBagWeightKg || 50}kg)</span>
            </div>
            <p className={styles.resultNote}>
              + {result.sandVolumeM3} m³ fine plaster sand.
            </p>
          </div>
        ) : (
          <div>
            <span className={styles.resultLabel}>Required Paint</span>
            <div className={styles.resultValue}>
              {result.paintLitresNeeded}{" "}
              <span className={styles.resultUnit}>Litres</span>
            </div>
            <p className={styles.resultNote}>
              For {result.surfaceAreaM2} m² coverage over {result.numberOfCoats} coats.
            </p>
          </div>
        )}

        <Button
          href={`/request-quote?service=construction&type=${calcType}&area=${area}${unit}`}
          withArrow
        >
          Request Quote
        </Button>
      </div>
    </div>
  );
}
