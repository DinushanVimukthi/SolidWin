"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { calculateBricksOrBlocks } from "./logic/brickBlockCalculator";
import { useCalculatorSettings } from "@/lib/cms/calculator-settings";
import styles from "./ConcreteVolumeCalculator.module.css";

export function BrickBlockCalculator() {
  const { settings } = useCalculatorSettings();
  const [wallLength, setWallLength] = useState<number>(10);
  const [wallHeight, setWallHeight] = useState<number>(3);
  const [presetIndex, setPresetIndex] = useState<number>(0);

  const presets = settings.blockPresets && settings.blockPresets.length > 0
    ? settings.blockPresets
    : [
        { name: "Hollow Block (400 × 200 mm)", length: 400, height: 200 },
        { name: "Standard Brick (215 × 65 mm)", length: 215, height: 65 },
        { name: "Solid Concrete Block (440 × 215 mm)", length: 440, height: 215 },
      ];

  const safePresetIndex = presetIndex < presets.length ? presetIndex : 0;
  const selectedPreset = presets[safePresetIndex];

  const mortarMm = settings.mortarJointMm ?? 10;
  const breakagePct = settings.blockBreakagePercent ?? 5;

  const result = calculateBricksOrBlocks({
    wallLengthMeters: wallLength,
    wallHeightMeters: wallHeight,
    blockLengthMm: selectedPreset.length,
    blockHeightMm: selectedPreset.height,
    mortarJointMm: mortarMm,
    breakagePercentage: breakagePct,
  });

  return (
    <div className={styles.calculator} aria-label="Brick and block calculator">
      <div className={styles.shapeSelector}>
        <label htmlFor="block-preset" className={styles.label}>
          Block / Brick Type
        </label>
        <select
          id="block-preset"
          className={styles.select}
          value={safePresetIndex}
          onChange={(e) => setPresetIndex(parseInt(e.target.value, 10))}
        >
          {presets.map((p, idx) => (
            <option key={p.name + idx} value={idx}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputsGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="wall-length" className={styles.label}>
            Wall Length (m)
          </label>
          <input
            id="wall-length"
            type="number"
            min="0.5"
            step="0.1"
            value={wallLength}
            onChange={(e) => setWallLength(parseFloat(e.target.value) || 0)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="wall-height" className={styles.label}>
            Wall Height (m)
          </label>
          <input
            id="wall-height"
            type="number"
            min="0.5"
            step="0.1"
            value={wallHeight}
            onChange={(e) => setWallHeight(parseFloat(e.target.value) || 0)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Wall Area</label>
          <input
            type="text"
            readOnly
            value={`${result.wallAreaSquareMeters} m²`}
            className={styles.input}
            style={{ background: "var(--color-bg)", fontWeight: "600" }}
          />
        </div>
      </div>

      <div className={styles.wastageRow}>
        <p className={styles.resultNote}>
          Assumptions: Standard {mortarMm}mm mortar joint applied to {selectedPreset.length}×{selectedPreset.height}mm blocks. Includes {breakagePct}% wastage/breakage allowance.
        </p>
      </div>

      <div className={styles.resultBox}>
        <div>
          <span className={styles.resultLabel}>Total Recommended Units</span>
          <div className={styles.resultValue}>
            {result.totalBlocksRecommended.toLocaleString()}{" "}
            <span className={styles.resultUnit}>units</span>
          </div>
          <p className={styles.resultNote}>
            Net: {result.netBlocksNeeded.toLocaleString()} blocks + {result.breakageAllowanceBlocks} breakage buffer ({breakagePct}%).
          </p>
        </div>
        <Button href={`/request-quote?service=construction&item=${encodeURIComponent(selectedPreset.name)}&quantity=${result.totalBlocksRecommended}`} withArrow>
          Request Quote
        </Button>
      </div>
    </div>
  );
}
