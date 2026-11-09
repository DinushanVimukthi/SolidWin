# Solidwin Website Calculators Documentation

This document records the mathematical formulas, standard assumptions, and conversion factors implemented across the Solidwin interactive estimators.

---

## 1. Concrete Volume Calculator (RMC-02)

**Implementation:** `src/features/calculators/logic/concreteVolumeCalculator.ts`  
**UI Component:** `src/features/calculators/ConcreteVolumeCalculator.tsx`

### Supported Geometries & Formulas

1. **Rectangular Slab / Footing:**
   $$\text{Volume } (m^3) = \text{Length } (m) \times \text{Width } (m) \times \text{Depth } (m)$$
2. **Circular Column / Pier:**
   $$\text{Radius } (m) = \frac{\text{Diameter } (m)}{2}$$
   $$\text{Volume } (m^3) = \pi \times \text{Radius}^2 \times \text{Height } (m)$$
3. **Stairs:**
   $$\text{Volume } (m^3) = \text{Width } (m) \times \text{Run } (m) \times \text{Rise } (m) \times \frac{N(N + 1)}{2}$$
   *(where $N$ is the number of steps)*

### Unit Conversions & Wastage
- **Imperial Conversion:** $1\text{ ft} = 0.3048\text{ m}$; $1\text{ in} = 0.0254\text{ m}$.
- **Wastage Allowance:** Default optional toggle adding **$5\%$** to compensate for site unevenness, excavation irregularities, and pipe retention.
- **RFQ Bridge (RMC-03):** "Request Quote for this Volume" passes calculated volume and mix parameters as URL query parameters directly into the RFQ form.

---

## 2. Brick & Block Quantity Calculator (CON-03)

**Implementation:** `src/features/calculators/logic/brickBlockCalculator.ts`  
**UI Component:** `src/features/calculators/BrickBlockCalculator.tsx`

### Formulas
$$\text{Nominal Length } = \text{Block Length } (mm) + \text{Mortar Joint } (mm)$$
$$\text{Nominal Height } = \text{Block Height } (mm) + \text{Mortar Joint } (mm)$$
$$\text{Nominal Unit Area } (m^2) = \frac{\text{Nominal Length} \times \text{Nominal Height}}{1,000,000}$$
$$\text{Net Blocks Needed } = \left\lceil \frac{\text{Wall Length } (m) \times \text{Wall Height } (m)}{\text{Nominal Unit Area } (m^2)} \right\rceil$$
$$\text{Total Recommended Units } = \lceil \text{Net Blocks} \times (1 + \text{Breakage \%}) \rceil$$

### Assumptions
- **Standard Mortar Joint:** $10\text{ mm}$ (industry standard).
- **Breakage Allowance:** $5\%$ rounded up to nearest whole block.

---

## 3. Plaster & Paint Estimator (CON-04)

**Implementation:** `src/features/calculators/logic/plasterPaintCalculator.ts`  
**UI Component:** `src/features/calculators/PlasterPaintCalculator.tsx`

### Plaster Estimation
- **Dry Volume Multiplier:** $1.33$ (accounts for water compaction, sand voids, and surface indentation).
- **Mix Ratio:**
  - `1:4`: 1 part cement to 4 parts sand (exterior/load-bearing walls).
  - `1:6`: 1 part cement to 6 parts sand (internal partition plaster).
- **Cement Density:** $1,440\text{ kg}/m^3$, assuming standard $50\text{ kg}$ bags.

### Paint Estimation
- **Coverage Benchmark:** $10\text{ }m^2/\text{Litre}$ per coat on smooth primed plaster.
- **Coats:** 2 coats default recommended for full opacity.
