"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  calculateConcreteVolume,
  type ConcreteShape,
  type MeasurementUnit,
} from "./logic/concreteVolumeCalculator";
import { useCalculatorSettings } from "@/lib/cms/calculator-settings";
import styles from "./ConcreteVolumeCalculator.module.css";

export function ConcreteVolumeCalculator() {
  const { settings } = useCalculatorSettings();
  const wastageMargin = settings.concreteWastagePercent ?? 5;
  const [shape, setShape] = useState<ConcreteShape>("slab");
  const [unit, setUnit] = useState<MeasurementUnit>("metric");
  const [includeWastage, setIncludeWastage] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("G25");

  // Slab inputs (default matches Figma screenshot: L=6, W=4, D=0.15 => 3.60 m³)
  const [length, setLength] = useState<number>(6);
  const [width, setWidth] = useState<number>(4);
  const [depth, setDepth] = useState<number>(0.15);

  // Column inputs
  const [diameter, setDiameter] = useState<number>(0.6);
  const [height, setHeight] = useState<number>(3);

  // Stairs inputs
  const [numSteps, setNumSteps] = useState<number>(5);
  const [stepWidth, setStepWidth] = useState<number>(1);
  const [stepRise, setStepRise] = useState<number>(0.18);
  const [stepRun, setStepRun] = useState<number>(0.28);

  const result = calculateConcreteVolume(
    shape === "slab"
      ? { shape: "slab", length, width, depth, unit, includeWastage, wastagePercentage: wastageMargin }
      : shape === "column"
      ? { shape: "column", diameter, height, unit, includeWastage, wastagePercentage: wastageMargin }
      : { shape: "stairs", numSteps, stepWidth, stepRise, stepRun, unit, includeWastage, wastagePercentage: wastageMargin }
  );

  const displayVolume = includeWastage ? result.volumeWithWastage : result.volumeCubicMeters;
  const quoteUrl = `/request-quote?service=ready-mix&volume=${displayVolume.toFixed(2)}&grade=${selectedGrade}&unit=m3&shape=${shape}${
    includeWastage ? `&wastage=${wastageMargin}` : ""
  }`;

  return (
    <div className={styles.calculator} aria-label="Concrete volume calculator">
      <div className={styles.header}>
        <div className={styles.unitToggle}>
          <button
            type="button"
            className={`${styles.tabBtn} ${unit === "metric" ? styles.activeTab : ""}`}
            onClick={() => setUnit("metric")}
          >
            Metric (m)
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${unit === "imperial" ? styles.activeTab : ""}`}
            onClick={() => setUnit("imperial")}
          >
            Imperial (ft / in)
          </button>
        </div>
      </div>

      <div className={styles.shapeSelector}>
        <label htmlFor="shape-select" className={styles.label}>
          Project shape
        </label>
        <select
          id="shape-select"
          className={styles.select}
          value={shape}
          onChange={(e) => setShape(e.target.value as ConcreteShape)}
        >
          <option value="slab">Rectangular slab / footing</option>
          <option value="column">Round column / pier</option>
          <option value="stairs">Stairs</option>
        </select>
      </div>

      <div className={styles.inputsGrid}>
        {shape === "slab" && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="slab-length" className={styles.label}>
                Length ({unit === "metric" ? "m" : "ft"})
              </label>
              <input
                id="slab-length"
                type="number"
                min="0.1"
                step="0.05"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="slab-width" className={styles.label}>
                Width ({unit === "metric" ? "m" : "ft"})
              </label>
              <input
                id="slab-width"
                type="number"
                min="0.1"
                step="0.05"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="slab-depth" className={styles.label}>
                Depth / Thickness ({unit === "metric" ? "m" : "in"})
              </label>
              <input
                id="slab-depth"
                type="number"
                min="0.01"
                step="0.01"
                value={depth}
                onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
          </>
        )}

        {shape === "column" && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="column-diameter" className={styles.label}>
                Diameter ({unit === "metric" ? "m" : "ft"})
              </label>
              <input
                id="column-diameter"
                type="number"
                min="0.1"
                step="0.05"
                value={diameter}
                onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="column-height" className={styles.label}>
                Height ({unit === "metric" ? "m" : "ft"})
              </label>
              <input
                id="column-height"
                type="number"
                min="0.1"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
          </>
        )}

        {shape === "stairs" && (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="stairs-steps" className={styles.label}>
                Number of steps
              </label>
              <input
                id="stairs-steps"
                type="number"
                min="1"
                max="50"
                step="1"
                value={numSteps}
                onChange={(e) => setNumSteps(parseInt(e.target.value, 10) || 1)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="stairs-width" className={styles.label}>
                Width ({unit === "metric" ? "m" : "ft"})
              </label>
              <input
                id="stairs-width"
                type="number"
                min="0.1"
                step="0.05"
                value={stepWidth}
                onChange={(e) => setStepWidth(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="stairs-rise" className={styles.label}>
                Step Rise ({unit === "metric" ? "m" : "in"})
              </label>
              <input
                id="stairs-rise"
                type="number"
                min="0.05"
                step="0.01"
                value={stepRise}
                onChange={(e) => setStepRise(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="stairs-run" className={styles.label}>
                Step Run ({unit === "metric" ? "m" : "in"})
              </label>
              <input
                id="stairs-run"
                type="number"
                min="0.05"
                step="0.01"
                value={stepRun}
                onChange={(e) => setStepRun(parseFloat(e.target.value) || 0)}
                className={styles.input}
              />
            </div>
          </>
        )}
      </div>

      <div className={styles.wastageRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={includeWastage}
            onChange={(e) => setIncludeWastage(e.target.checked)}
          />
          <span>Include {wastageMargin}% wastage allowance (recommended for site pouring)</span>
        </label>

        {/* Concrete Mix Grade Selection for RFQ Auto-Fill (RMC-03) */}
        <div className={styles.gradeRow}>
          <label htmlFor="calc-grade-select" className={styles.gradeLabel}>
            Target Mix Grade:
          </label>
          <select
            id="calc-grade-select"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className={styles.gradeSelect}
          >
            <option value="G15">G15 - Blinding & Mass Concrete (15 N/mm²)</option>
            <option value="G20">G20 - Domestic Ground Slabs (20 N/mm²)</option>
            <option value="G25">G25 - Reinforced Slabs & Footings (25 N/mm²)</option>
            <option value="G30">G30 - Columns, Beams & Retaining (30 N/mm²)</option>
            <option value="G35">G35 - Heavy Commercial & Industrial (35 N/mm²)</option>
          </select>
        </div>
      </div>

      <div className={styles.resultBox}>
        <div>
          <span className={styles.resultLabel}>Estimated concrete volume</span>
          <div className={styles.resultValue}>
            {displayVolume.toFixed(2)}{" "}
            <span className={styles.resultUnit}>m³</span>
          </div>
          <p className={styles.resultNote}>
            {includeWastage
              ? "Includes 5% wastage buffer. Actual requirements depend on site & ground conditions."
              : "Excludes wastage. Actual requirements depend on site conditions."}
          </p>
        </div>
        <Button href={quoteUrl} withArrow>
          Request Quote for {displayVolume.toFixed(2)} m³ ({selectedGrade})
        </Button>
      </div>
    </div>
  );
}
