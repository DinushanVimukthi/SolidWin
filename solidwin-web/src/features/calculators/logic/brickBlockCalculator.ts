/**
 * Brick & Block Calculator (CON-03).
 * Accepts wall length, height, block dimensions, and applies a standard 10mm mortar joint
 * and 5% breakage allowance, returning a rounded-up whole-block count.
 */

export interface BrickBlockInput {
  wallLengthMeters: number;
  wallHeightMeters: number;
  // Standard block size in mm (e.g., 400 x 200 x 200 or 440 x 215 x 100)
  blockLengthMm: number;
  blockHeightMm: number;
  mortarJointMm?: number; // default 10mm
  breakagePercentage?: number; // default 5%
}

export interface BrickBlockResult {
  wallAreaSquareMeters: number;
  singleBlockNominalAreaSqM: number;
  netBlocksNeeded: number;
  breakageAllowanceBlocks: number;
  totalBlocksRecommended: number;
  breakagePercentage: number;
  mortarJointMm: number;
}

export const DEFAULT_MORTAR_JOINT_MM = 10;
export const DEFAULT_BREAKAGE_PERCENT = 5;

// Standard block presets
export const STANDARD_BLOCK_PRESETS = [
  { name: "Hollow Block (400 × 200 mm)", length: 400, height: 200 },
  { name: "Standard Brick (215 × 65 mm)", length: 215, height: 65 },
  { name: "Solid Concrete Block (440 × 215 mm)", length: 440, height: 215 },
] as const;

export function calculateBricksOrBlocks(input: BrickBlockInput): BrickBlockResult {
  const mortar = input.mortarJointMm ?? DEFAULT_MORTAR_JOINT_MM;
  const breakage = input.breakagePercentage ?? DEFAULT_BREAKAGE_PERCENT;

  const wallArea = Math.max(0, input.wallLengthMeters * input.wallHeightMeters);

  // Nominal block dimensions including 10mm mortar joint
  const nominalLengthM = (input.blockLengthMm + mortar) / 1000;
  const nominalHeightM = (input.blockHeightMm + mortar) / 1000;
  const nominalBlockArea = nominalLengthM * nominalHeightM;

  if (nominalBlockArea <= 0 || wallArea <= 0) {
    return {
      wallAreaSquareMeters: 0,
      singleBlockNominalAreaSqM: 0,
      netBlocksNeeded: 0,
      breakageAllowanceBlocks: 0,
      totalBlocksRecommended: 0,
      breakagePercentage: breakage,
      mortarJointMm: mortar,
    };
  }

  const rawBlocks = wallArea / nominalBlockArea;
  const netBlocks = Math.ceil(rawBlocks);
  const withBreakage = Math.ceil(netBlocks * (1 + breakage / 100));

  return {
    wallAreaSquareMeters: Math.round(wallArea * 100) / 100,
    singleBlockNominalAreaSqM: Math.round(nominalBlockArea * 10000) / 10000,
    netBlocksNeeded: netBlocks,
    breakageAllowanceBlocks: withBreakage - netBlocks,
    totalBlocksRecommended: withBreakage,
    breakagePercentage: breakage,
    mortarJointMm: mortar,
  };
}
