"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProjects } from "@/lib/cms/projects-store";
import type { ProjectSector } from "@/data/projects";
import styles from "./ProjectsFilterGrid.module.css";

export function ProjectsFilterGrid() {
  const { projects } = useProjects();
  const [selectedSector, setSelectedSector] = useState<"all" | ProjectSector>("all");

  const filtered = projects.filter((p) =>
    selectedSector === "all" ? true : p.sector === selectedSector
  );

  return (
    <div className={styles.container}>
      {/* Sector Filter Tabs (CON-02) */}
      <div className={styles.filterBar} role="tablist" aria-label="Portfolio sectors">
        <button
          type="button"
          role="tab"
          aria-selected={selectedSector === "all"}
          className={`${styles.tabBtn} ${selectedSector === "all" ? styles.activeTab : ""}`}
          onClick={() => setSelectedSector("all")}
        >
          All Projects
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedSector === "residential"}
          className={`${styles.tabBtn} ${selectedSector === "residential" ? styles.activeTab : ""}`}
          onClick={() => setSelectedSector("residential")}
        >
          Residential
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedSector === "commercial"}
          className={`${styles.tabBtn} ${selectedSector === "commercial" ? styles.activeTab : ""}`}
          onClick={() => setSelectedSector("commercial")}
        >
          Commercial
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedSector === "industrial"}
          className={`${styles.tabBtn} ${selectedSector === "industrial" ? styles.activeTab : ""}`}
          onClick={() => setSelectedSector("industrial")}
        >
          Industrial
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedSector === "infrastructure"}
          className={`${styles.tabBtn} ${selectedSector === "infrastructure" ? styles.activeTab : ""}`}
          onClick={() => setSelectedSector("infrastructure")}
        >
          Infrastructure
        </button>
      </div>

      {/* Grid of project cards */}
      <div className={styles.grid}>
        {filtered.map((proj) => (
          <article key={proj.slug} className={styles.card}>
            <div className={styles.media}>
              <Image
                src={proj.featuredImage}
                alt={proj.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className={styles.img}
              />
              <span className={styles.sectorBadge}>{proj.sector}</span>
            </div>

            <div className={styles.content}>
              <div className={styles.meta}>
                <span>{proj.location}</span>
                <span>•</span>
                <span>{proj.completionDate}</span>
              </div>
              <h3 className={styles.title}>{proj.title}</h3>
              <p className={styles.desc}>{proj.description}</p>
              <Link href={`/projects/${proj.slug}`} className={styles.link}>
                View Project Details <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
