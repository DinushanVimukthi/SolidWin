import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EQUIPMENT_PRODUCTS } from "@/data/hardware";
import { quoteHref } from "@/lib/site-config";
import styles from "./equipment.module.css";

export const metadata: Metadata = {
  title: "Equipment Rentals",
  description:
    "Well-maintained construction plant hire: excavators, backhoes, compaction rollers, boom pumps and power generators.",
};

export default function EquipmentRentalsPage() {
  return (
    <>
      <Hero
        eyebrow="Equipment Rentals"
        title="Keep your project moving."
        description="Well-maintained heavy construction equipment, plant machinery and power generation with flexible daily and monthly rental terms."
        image={{
          src: "/images/hardware/equipment-rental-garage.jpg",
          alt: "Solidwin heavy construction plant hire and equipment workshop",
        }}
        actions={
          <>
            <Button href={quoteHref} withArrow>
              Request Rental Quote
            </Button>
            <Button href="/contact" variant="outline" withArrow>
              Discuss Site Mobilization
            </Button>
          </>
        }
      />

      <Section
        id="fleet-section"
        eyebrow="Rental Machinery"
        title="Plant & machinery hire fleet"
        description="Certified machinery with routine preventative maintenance and optional licensed operators."
      >
        <div className={styles.grid}>
          {EQUIPMENT_PRODUCTS.map((eq) => (
            <article key={eq.id} className={styles.card}>
              <div className={styles.media}>
                <Image
                  src={eq.image}
                  alt={eq.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className={styles.img}
                />
                <span className={styles.categoryBadge}>{eq.category}</span>
              </div>

              <div className={styles.body}>
                <h3 className={styles.title}>{eq.name}</h3>
                <p className={styles.specs}>{eq.specifications}</p>

                <div className={styles.detailsBox}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Min Duration</span>
                    <span className={styles.detailVal}>{eq.minHireDuration}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Rental Terms</span>
                    <span className={styles.termsText}>{eq.terms}</span>
                  </div>
                </div>

                <Button
                  href={`/request-quote?service=hardware&equipment=${encodeURIComponent(eq.name)}`}
                  size="sm"
                  withArrow
                >
                  Request Machine Hire
                </Button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
