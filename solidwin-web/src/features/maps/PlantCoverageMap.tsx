"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import styles from "./PlantCoverageMap.module.css";

export function PlantCoverageMap() {
  const [activeZone, setActiveZone] = useState<number | "all">("all");
  const [testDistance, setTestDistance] = useState<number>(22);

  const zones = siteConfig.batchingPlant.zones;

  const getDistanceZone = (dist: number) => {
    if (dist <= 15) {
      return {
        zone: "Zone 1 (Express Pour)",
        color: "var(--color-success, #16a34a)",
        badge: "Within 15 km",
        transit: "30–45 mins",
        advisory: "Rapid express delivery. Ideal for high-spec monolithic slab pours with zero slump loss.",
      };
    }
    if (dist <= 30) {
      return {
        zone: "Zone 2 (Standard Delivery)",
        color: "var(--color-accent-600, #d97706)",
        badge: "15–30 km",
        transit: "45–70 mins",
        advisory: "Standard transit envelope. Slump monitored upon site arrival before discharge.",
      };
    }
    if (dist <= 45) {
      return {
        zone: "Zone 3 (Extended Dispatch)",
        color: "var(--color-primary-600, #4c1d95)",
        badge: "30–45 km",
        transit: "70–90 mins",
        advisory: "Retarder admixture required to maintain workability within certified 90-minute limit.",
      };
    }
    return {
      zone: "Beyond Standard Radius (>45 km)",
      color: "var(--color-danger, #dc2626)",
      badge: "Special Approval",
      transit: "90+ mins",
      advisory: "Requires site-batching coordination or mobile plant setup. Contact engineering dispatch.",
    };
  };

  const currentZone = getDistanceZone(testDistance);

  return (
    <div className={styles.container} aria-label="Batching plant dispatch radius map">
      {/* Plant Metadata Header */}
      <div className={styles.header}>
        <div>
          <span className={styles.badge}>Live Dispatch Network</span>
          <h3 className={styles.plantName}>{siteConfig.batchingPlant.name}</h3>
          <p className={styles.coords}>
            <strong>Coordinates:</strong> {siteConfig.batchingPlant.coordinates} • {siteConfig.batchingPlant.address}
          </p>
        </div>

        <a
          href={`https://maps.google.com/?q=${siteConfig.batchingPlant.lat},${siteConfig.batchingPlant.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
        >
          Open in Google Maps ↗
        </a>
      </div>

      {/* Zone Controls */}
      <div className={styles.zoneControls}>
        <span className={styles.filterLabel}>Filter Coverage Rings:</span>
        <button
          type="button"
          className={`${styles.filterBtn} ${activeZone === "all" ? styles.filterActive : ""}`}
          onClick={() => setActiveZone("all")}
        >
          All Rings (15 / 30 / 45 km)
        </button>
        {zones.map((z) => (
          <button
            key={z.km}
            type="button"
            className={`${styles.filterBtn} ${activeZone === z.km ? styles.filterActive : ""}`}
            onClick={() => setActiveZone(z.km)}
          >
            {z.km} km Radius
          </button>
        ))}
      </div>

      {/* Interactive Map Visual with Concentric Radius Rings */}
      <div className={styles.mapVisual}>
        <svg viewBox="0 0 600 400" className={styles.svgMap} aria-hidden="true">
          <defs>
            <radialGradient id="plantGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#2e1065" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#2e1065" stopOpacity="0.25" />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="200" x2="600" y2="200" stroke="#e2e8f0" strokeDasharray="4 4" />
          <line x1="300" y1="0" x2="300" y2="400" stroke="#e2e8f0" strokeDasharray="4 4" />

          {/* 45km Ring */}
          {(activeZone === "all" || activeZone === 45) && (
            <g className={styles.ringGroup}>
              <circle cx="300" cy="200" r="180" fill="url(#ringGlow)" stroke="#7c3aed" strokeWidth="2" strokeDasharray="6 4" />
              <text x="300" y="30" textAnchor="middle" fill="#6d28d9" fontSize="12" fontWeight="700">
                45 km Radius Ring • Extended Zone (Retarder required)
              </text>
            </g>
          )}

          {/* 30km Ring */}
          {(activeZone === "all" || activeZone === 30) && (
            <g className={styles.ringGroup}>
              <circle cx="300" cy="200" r="120" fill="rgba(217, 119, 6, 0.06)" stroke="#d97706" strokeWidth="2" strokeDasharray="6 4" />
              <text x="300" y="92" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="700">
                30 km Radius Ring • Standard Zone (Slump monitored)
              </text>
            </g>
          )}

          {/* 15km Ring */}
          {(activeZone === "all" || activeZone === 15) && (
            <g className={styles.ringGroup}>
              <circle cx="300" cy="200" r="65" fill="rgba(22, 163, 74, 0.08)" stroke="#16a34a" strokeWidth="2.5" />
              <text x="300" y="148" textAnchor="middle" fill="#15803d" fontSize="11" fontWeight="700">
                15 km Radius Ring • Express Pour
              </text>
            </g>
          )}

          {/* Major Corridor Callouts */}
          <circle cx="210" cy="140" r="4" fill="#64748b" />
          <text x="200" y="132" textAnchor="end" fill="#475569" fontSize="10" fontWeight="600">
            North Industrial Corridor
          </text>

          <circle cx="390" cy="150" r="4" fill="#64748b" />
          <text x="400" y="142" textAnchor="start" fill="#475569" fontSize="10" fontWeight="600">
            Metro Commercial Hub
          </text>

          <circle cx="360" cy="280" r="4" fill="#64748b" />
          <text x="370" y="292" textAnchor="start" fill="#475569" fontSize="10" fontWeight="600">
            Coastal Infrastructure Expressway
          </text>

          <circle cx="160" cy="260" r="4" fill="#64748b" />
          <text x="150" y="272" textAnchor="end" fill="#475569" fontSize="10" fontWeight="600">
            Port Logistics Corridor
          </text>

          {/* Center Batching Plant Marker */}
          <circle cx="300" cy="200" r="28" fill="url(#plantGlow)" />
          <circle cx="300" cy="200" r="8" fill="#d97706" stroke="#ffffff" strokeWidth="2.5" />
          <text x="300" y="222" textAnchor="middle" fill="#1e1b4b" fontSize="12" fontWeight="800">
            SOLIDWIN BATCHING PLANT
          </text>
        </svg>

        {/* Legend Overlay */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.dot15}`} />
            <span>15 km (Express • &lt;45m)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.dot30}`} />
            <span>30 km (Standard • &lt;70m)</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.dot} ${styles.dot45}`} />
            <span>45 km (Extended • &lt;90m)</span>
          </div>
        </div>
      </div>

      {/* Interactive Distance Checker */}
      <div className={styles.checkerBox}>
        <div className={styles.checkerInputCol}>
          <label htmlFor="site-dist-slider" className={styles.checkerLabel}>
            Check Your Site Distance from Plant: <strong>{testDistance} km</strong>
          </label>
          <input
            id="site-dist-slider"
            type="range"
            min="3"
            max="60"
            step="1"
            value={testDistance}
            onChange={(e) => setTestDistance(Number(e.target.value))}
            className={styles.slider}
          />
          <div className={styles.sliderScale}>
            <span>0 km</span>
            <span>15 km</span>
            <span>30 km</span>
            <span>45 km</span>
            <span>60+ km</span>
          </div>
        </div>

        <div className={styles.checkerResultCol}>
          <div className={styles.resultBadge} style={{ borderColor: currentZone.color, color: currentZone.color }}>
            {currentZone.badge}
          </div>
          <h4 className={styles.resultTitle}>{currentZone.zone}</h4>
          <p className={styles.resultTransit}>
            <strong>Estimated Transit:</strong> {currentZone.transit}
          </p>
          <p className={styles.resultAdvisory}>{currentZone.advisory}</p>
        </div>
      </div>

      {/* RMC-05 Mandatory Compliance Disclaimer */}
      <div className={styles.disclaimerBox}>
        <strong>RMC-05 Coverage Notice:</strong> Radius rings represent indicative straight-line coverage from our central batching plant, not driving distance or guaranteed dispatch eligibility. Actual delivery eligibility depends on road transit time, traffic conditions, site access, and ambient temperature to guarantee certified slump upon discharge.
      </div>
    </div>
  );
}
