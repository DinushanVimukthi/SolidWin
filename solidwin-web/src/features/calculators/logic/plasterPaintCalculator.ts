/**
 * Plaster & Paint Calculator (CON-04).
 * Computes indicative cement bags (50kg), sand requirement (bags / m³),
 * and paint in litres based on standard coverage benchmarks.
 */

export type CalculationType = "plaster" | "paint";
export type AreaUnit = "m2" | "sqft";

export interface PlasterPaintInput {
  type: CalculationType;
  area: number;
  unit: AreaUnit;
  // For Plaster:
  thicknessMm?: number; // standard default 12mm
  mixRatio?: "1:4" | "1:6"; // 1:4 richer / exterior, 1:6 internal
  dryVolumeFactor?: number; // default 1.33
  cementDensityKgM3?: number; // default 1440
  cementBagWeightKg?: number; // default 50
  // For Paint:
  coats?: number; // default 2 coats
  coveragePerLiterSqM?: number; // standard ~10-12 m²/liter per coat
}

export interface PlasterResult {
  type: "plaster";
  surfaceAreaM2: number;
  thicknessMm: number;
  mixRatio: string;
  cementBags50kg: number;
  sandVolumeM3: number;
  dryVolumeMultiplier: number;
}

export interface PaintResult {
  type: "paint";
  surfaceAreaM2: number;
  numberOfCoats: number;
  coveragePerLiterSqM: number;
  paintLitresNeeded: number;
}

export type PlasterPaintResult = PlasterResult | PaintResult;

const SQFT_TO_M2 = 0.092903;
export const DEFAULT_PLASTER_THICKNESS_MM = 12;
export const DEFAULT_PLASTER_MIX = "1:4";
export const DEFAULT_PAINT_COATS = 2;
export const DEFAULT_PAINT_COVERAGE_M2_PER_LITER = 10; // 10 m² per litre per coat

export function calculatePlasterOrPaint(input: PlasterPaintInput): PlasterPaintResult {
  const areaM2 = Math.max(0, input.unit === "sqft" ? input.area * SQFT_TO_M2 : input.area);

  if (input.type === "plaster") {
    const thickness = input.thicknessMm ?? DEFAULT_PLASTER_THICKNESS_MM;
    const mix = input.mixRatio ?? DEFAULT_PLASTER_MIX;
    const wetVolumeM3 = areaM2 * (thickness / 1000);
    // Standard engineering dry volume factor (accounts for voids & water compaction ~ 1.3 to 1.35)
    const dryVolumeFactor = input.dryVolumeFactor ?? 1.33;
    const dryVolumeM3 = wetVolumeM3 * dryVolumeFactor;

    // Mix ratio parts: 1:4 = 1 part cement, 4 parts sand (total 5)
    // 1:6 = 1 part cement, 6 parts sand (total 7)
    const parts = mix === "1:4" ? { cement: 1, sand: 4, total: 5 } : { cement: 1, sand: 6, total: 7 };
    const cementVolumeM3 = dryVolumeM3 * (parts.cement / parts.total);
    const sandVolumeM3 = dryVolumeM3 * (parts.sand / parts.total);

    // Density of cement = 1440 kg/m³. 1 bag = 50 kg => 0.0347 m³ per bag (~28.8 bags/m³)
    const density = input.cementDensityKgM3 ?? 1440;
    const bagWeight = input.cementBagWeightKg ?? 50;
    const cementKg = cementVolumeM3 * density;
    const cementBags = Math.ceil(cementKg / bagWeight);

    return {
      type: "plaster",
      surfaceAreaM2: Math.round(areaM2 * 100) / 100,
      thicknessMm: thickness,
      mixRatio: mix,
      cementBags50kg: cementBags,
      sandVolumeM3: Math.round(sandVolumeM3 * 100) / 100,
      dryVolumeMultiplier: dryVolumeFactor,
    };
  }

  const coats = input.coats ?? DEFAULT_PAINT_COATS;
  const coverage = input.coveragePerLiterSqM ?? DEFAULT_PAINT_COVERAGE_M2_PER_LITER;
  const totalLitres = coverage > 0 ? (areaM2 * coats) / coverage : 0;

  return {
    type: "paint",
    surfaceAreaM2: Math.round(areaM2 * 100) / 100,
    numberOfCoats: coats,
    coveragePerLiterSqM: coverage,
    paintLitresNeeded: Math.ceil(totalLitres * 10) / 10,
  };
}
