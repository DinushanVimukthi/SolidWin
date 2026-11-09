/**
 * Pure calculation logic for the Concrete Volume Calculator (RMC-02).
 */

export type ConcreteShape = "slab" | "column" | "stairs";
export type MeasurementUnit = "metric" | "imperial";

export interface SlabInput {
  shape: "slab";
  length: number; // m or ft
  width: number;  // m or ft
  depth: number;  // m or in (if imperial, depth is in inches)
}

export interface ColumnInput {
  shape: "column";
  diameter: number; // m or ft (explicit diameter)
  height: number;   // m or ft
}

export interface StairsInput {
  shape: "stairs";
  numSteps: number;
  stepWidth: number; // m or ft
  stepRise: number;  // m or in
  stepRun: number;   // m or in
}

export type ConcreteVolumeInput = (SlabInput | ColumnInput | StairsInput) & {
  unit: MeasurementUnit;
  includeWastage?: boolean; // default wastage
  wastagePercentage?: number; // customizable margin %
};

export interface ConcreteCalculationResult {
  volumeCubicMeters: number;
  volumeWithWastage: number;
  wasteMarginPercentage: number;
  unit: MeasurementUnit;
}

const FEET_TO_METERS = 0.3048;
const INCHES_TO_METERS = 0.0254;
const DEFAULT_WASTAGE_PERCENTAGE = 5;

export function calculateConcreteVolume(input: ConcreteVolumeInput): ConcreteCalculationResult {
  let baseVolumeM3 = 0;
  const isMetric = input.unit === "metric";

  if (input.shape === "slab") {
    const l = isMetric ? input.length : input.length * FEET_TO_METERS;
    const w = isMetric ? input.width : input.width * FEET_TO_METERS;
    const d = isMetric ? input.depth : input.depth * INCHES_TO_METERS;
    baseVolumeM3 = Math.max(0, l * w * d);
  } else if (input.shape === "column") {
    const diamM = isMetric ? input.diameter : input.diameter * FEET_TO_METERS;
    const h = isMetric ? input.height : input.height * FEET_TO_METERS;
    const radiusM = diamM / 2;
    baseVolumeM3 = Math.max(0, Math.PI * Math.pow(radiusM, 2) * h);
  } else if (input.shape === "stairs") {
    const widthM = isMetric ? input.stepWidth : input.stepWidth * FEET_TO_METERS;
    const riseM = isMetric ? input.stepRise : input.stepRise * INCHES_TO_METERS;
    const runM = isMetric ? input.stepRun : input.stepRun * INCHES_TO_METERS;
    const steps = Math.max(0, Math.floor(input.numSteps));
    // Each step i (from 1 to N) has a rectangular prism volume of width * run * (i * rise)
    // Total = width * run * rise * sum(1..N) = width * run * rise * (N * (N + 1) / 2)
    const stepVolumeSum = (steps * (steps + 1)) / 2;
    baseVolumeM3 = Math.max(0, widthM * runM * riseM * stepVolumeSum);
  }

  const roundedBase = Math.round(baseVolumeM3 * 100) / 100;
  const wasteMargin = input.wastagePercentage ?? DEFAULT_WASTAGE_PERCENTAGE;
  const withWaste = Math.round(roundedBase * (1 + wasteMargin / 100) * 100) / 100;

  return {
    volumeCubicMeters: roundedBase,
    volumeWithWastage: input.includeWastage ? withWaste : roundedBase,
    wasteMarginPercentage: wasteMargin,
    unit: input.unit,
  };
}
