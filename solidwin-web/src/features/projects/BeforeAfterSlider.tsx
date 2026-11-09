"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./BeforeAfterSlider.module.css";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Site before construction",
  afterAlt = "Completed build after construction",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  return (
    <div className={styles.container} aria-label="Before and after transformation slider">
      <div className={styles.imageWrapper}>
        {/* Background "After" image */}
        <div className={styles.afterImage}>
          <Image
            src={afterImage}
            alt={afterAlt}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className={styles.img}
          />
          <span className={`${styles.label} ${styles.afterLabel}`}>After</span>
        </div>

        {/* Clipped "Before" image */}
        <div
          className={styles.beforeImage}
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className={styles.img}
          />
          <span className={`${styles.label} ${styles.beforeLabel}`}>Before</span>
        </div>

        {/* Visual Divider Line and Handle */}
        <div className={styles.handle} style={{ left: `${sliderPosition}%` }}>
          <div className={styles.handlePill}>
            <span aria-hidden="true">‹ ›</span>
          </div>
        </div>

        {/* Accessible Range Input covering the slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          aria-label="Comparison slider position percentage"
          className={styles.rangeInput}
        />
      </div>
      <p className={styles.caption}>
        Drag the slider or use Arrow keys to compare the construction progress from initial site work to project handover.
      </p>
    </div>
  );
}
