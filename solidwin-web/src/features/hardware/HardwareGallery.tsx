"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { HARDWARE_GALLERY, type HardwareGalleryItem } from "@/data/hardware";
import styles from "./HardwareGallery.module.css";

type CategoryFilter = "all" | "store" | "tools" | "paints" | "materials" | "fleet";

const CATEGORIES: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All Items" },
  { key: "store", label: "Store & Showroom" },
  { key: "tools", label: "Power & Hand Tools" },
  { key: "paints", label: "Paints & Waterproofing" },
  { key: "materials", label: "Steel & Materials" },
  { key: "fleet", label: "Machinery & Fleet" },
];

export function HardwareGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedItem, setSelectedItem] = useState<HardwareGalleryItem | null>(null);

  const filteredItems = HARDWARE_GALLERY.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedItem) return;

      if (e.key === "Escape") {
        setSelectedItem(null);
      } else if (e.key === "ArrowRight") {
        const currentIndex = filteredItems.findIndex((it) => it.id === selectedItem.id);
        if (currentIndex < filteredItems.length - 1) {
          setSelectedItem(filteredItems[currentIndex + 1]);
        }
      } else if (e.key === "ArrowLeft") {
        const currentIndex = filteredItems.findIndex((it) => it.id === selectedItem.id);
        if (currentIndex > 0) {
          setSelectedItem(filteredItems[currentIndex - 1]);
        }
      }
    },
    [selectedItem, filteredItems]
  );

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem, handleKeyDown]);

  return (
    <div className={styles.galleryWrapper}>
      {/* Category Filter Tabs */}
      <div className={styles.tabBar} role="tablist" aria-label="Hardware gallery categories">
        {CATEGORIES.map((cat) => {
          const count =
            cat.key === "all"
              ? HARDWARE_GALLERY.length
              : HARDWARE_GALLERY.filter((item) => item.category === cat.key).length;

          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <span>{cat.label}</span>
              <span className={styles.countBadge}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      <div className={styles.grid}>
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className={styles.card}
            onClick={() => setSelectedItem(item)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedItem(item);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${item.title}`}
          >
            <div className={styles.mediaContainer}>
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw"
                className={styles.thumb}
              />
              <div className={styles.overlay}>
                <span className={styles.zoomHint}>🔍 View Details</span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.tagRow}>
                {item.tags?.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className={styles.lightboxBackdrop}
          onClick={() => setSelectedItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div
            className={styles.lightboxCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setSelectedItem(null)}
              aria-label="Close image preview"
            >
              ✕
            </button>

            <div className={styles.lightboxMedia}>
              <Image
                src={selectedItem.image}
                alt={selectedItem.alt}
                fill
                priority
                sizes="(min-width: 1024px) 800px, 95vw"
                className={styles.lightboxImg}
              />
            </div>

            <div className={styles.lightboxDetails}>
              <div className={styles.lightboxMeta}>
                <span className={styles.categoryPill}>{selectedItem.category.toUpperCase()}</span>
                {selectedItem.tags?.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <h2 id="lightbox-title" className={styles.lightboxTitle}>
                {selectedItem.title}
              </h2>
              <p className={styles.lightboxDesc}>{selectedItem.description}</p>

              <div className={styles.lightboxActions}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => {
                    const currentIndex = filteredItems.findIndex((it) => it.id === selectedItem.id);
                    if (currentIndex > 0) {
                      setSelectedItem(filteredItems[currentIndex - 1]);
                    }
                  }}
                  disabled={filteredItems.findIndex((it) => it.id === selectedItem.id) === 0}
                >
                  ← Previous
                </button>
                <span className={styles.indexIndicator}>
                  {filteredItems.findIndex((it) => it.id === selectedItem.id) + 1} of {filteredItems.length}
                </span>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => {
                    const currentIndex = filteredItems.findIndex((it) => it.id === selectedItem.id);
                    if (currentIndex < filteredItems.length - 1) {
                      setSelectedItem(filteredItems[currentIndex + 1]);
                    }
                  }}
                  disabled={
                    filteredItems.findIndex((it) => it.id === selectedItem.id) ===
                    filteredItems.length - 1
                  }
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

