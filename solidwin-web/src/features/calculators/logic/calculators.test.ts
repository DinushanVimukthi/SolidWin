import { describe, expect, it } from "vitest";
import { calculateConcreteVolume } from "./concreteVolumeCalculator";
import { calculateBricksOrBlocks } from "./brickBlockCalculator";
import { calculatePlasterOrPaint } from "./plasterPaintCalculator";

describe("Concrete Volume Calculator (RMC-02)", () => {
  it("calculates rectangular slab correctly in metric", () => {
    // 6m length, 4m width, 0.15m depth = 3.60 m³
    const res = calculateConcreteVolume({
      shape: "slab",
      length: 6,
      width: 4,
      depth: 0.15,
      unit: "metric",
      includeWastage: false,
    });
    expect(res.volumeCubicMeters).toBe(3.6);
  });

  it("adds 5% wastage when requested", () => {
    const res = calculateConcreteVolume({
      shape: "slab",
      length: 10,
      width: 10,
      depth: 0.1,
      unit: "metric",
      includeWastage: true,
    });
    // 10 * 10 * 0.1 = 10 m³ => +5% = 10.5 m³
    expect(res.volumeCubicMeters).toBe(10);
    expect(res.volumeWithWastage).toBe(10.5);
  });

  it("calculates circular column volume with diameter", () => {
    // diameter 0.6m (radius 0.3m), height 3m => PI * 0.3^2 * 3 = 0.848 m³
    const res = calculateConcreteVolume({
      shape: "column",
      diameter: 0.6,
      height: 3,
      unit: "metric",
      includeWastage: false,
    });
    expect(res.volumeCubicMeters).toBe(0.85);
  });

  it("calculates stairs volume with step count", () => {
    // 5 steps, width 1m, rise 0.18m, run 0.28m
    const res = calculateConcreteVolume({
      shape: "stairs",
      numSteps: 5,
      stepWidth: 1,
      stepRise: 0.18,
      stepRun: 0.28,
      unit: "metric",
      includeWastage: false,
    });
    // 1 * 0.18 * 0.28 * (5*6/2 = 15) = 0.756 => 0.76 m³
    expect(res.volumeCubicMeters).toBe(0.76);
  });
});

describe("Brick & Block Calculator (CON-03)", () => {
  it("computes net blocks and adds 5% breakage allowance", () => {
    // 10m long, 3m high wall = 30 m²
    // Hollow block 400x200 with 10mm mortar = 410x210 mm = 0.0861 m² per block
    // 30 / 0.0861 = ~348.4 => net 349 blocks => +5% = Math.ceil(349 * 1.05) = 367
    const res = calculateBricksOrBlocks({
      wallLengthMeters: 10,
      wallHeightMeters: 3,
      blockLengthMm: 400,
      blockHeightMm: 200,
      mortarJointMm: 10,
      breakagePercentage: 5,
    });
    expect(res.wallAreaSquareMeters).toBe(30);
    expect(res.netBlocksNeeded).toBe(349);
    expect(res.totalBlocksRecommended).toBe(367);
  });
});

describe("Plaster & Paint Calculator (CON-04)", () => {
  it("computes cement bags for 100 m² plaster at 12mm thickness 1:4 mix", () => {
    const res = calculatePlasterOrPaint({
      type: "plaster",
      area: 100,
      unit: "m2",
      thicknessMm: 12,
      mixRatio: "1:4",
    });
    expect(res.type).toBe("plaster");
    if (res.type === "plaster") {
      expect(res.cementBags50kg).toBeGreaterThan(0);
      expect(res.sandVolumeM3).toBeGreaterThan(0);
    }
  });

  it("computes paint litres for 2 coats", () => {
    // 100 m² * 2 coats / 10 m²/L = 20 L
    const res = calculatePlasterOrPaint({
      type: "paint",
      area: 100,
      unit: "m2",
      coats: 2,
      coveragePerLiterSqM: 10,
    });
    expect(res.type).toBe("paint");
    if (res.type === "paint") {
      expect(res.paintLitresNeeded).toBe(20);
    }
  });
});
