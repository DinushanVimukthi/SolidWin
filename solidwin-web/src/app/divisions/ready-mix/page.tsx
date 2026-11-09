import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  BATCH_TO_BUILD_STEPS,
  CONCRETE_GRADES,
  READY_MIX_FAQS,
} from "@/data/readyMix";
import { ConcreteVolumeCalculator } from "@/features/calculators/ConcreteVolumeCalculator";
import { PlantCoverageMap } from "@/features/maps/PlantCoverageMap";
import { quoteHref } from "@/lib/site-config";
import styles from "./readyMix.module.css";

export const metadata: Metadata = {
  title: "Ready-Mix Concrete",
  description:
    "Certified ready-mix concrete formulations, interactive volume calculator, computerised batching and prompt GPS fleet delivery.",
};

export default function ReadyMixPage() {
  return (
    <>
      <Hero
        eyebrow="Ready-Mix Concrete"
        title="The right mix for your next project."
        description="Discuss concrete requirements, site access and delivery planning with our technical batching team."
        image={{
          src: "/images/service-industrial.jpg",
          alt: "Ready-mix batching facility and mixer trucks",
        }}
        actions={
          <>
            <Button href={quoteHref} withArrow>
              Request a Quote
            </Button>
            <Button href="/contact" variant="outline" withArrow>
              Contact Our Team
            </Button>
          </>
        }
      />

      {/* Calculator & Advisory Section */}
      <Section
        id="volume-calc"
        eyebrow="Concrete Volume Calculator"
        title="Calculate your concrete volume"
        description="Estimate volume from your project dimensions. Supports slabs, circular columns, and stairs with optional 5% wastage."
      >
        <div className={styles.calcLayout}>
          <div className={styles.calcCol}>
            <ConcreteVolumeCalculator />
          </div>

          <div className={styles.advisoryCol}>
            <div className={styles.advisoryCard}>
              <Eyebrow>Getting the right concrete</Eyebrow>
              <h3 className={styles.advisoryTitle}>Key planning factors</h3>
              <div className={styles.advisoryItems}>
                <div className={styles.advisoryItem}>
                  <div className={styles.advisoryNum}>1</div>
                  <div>
                    <h4 className={styles.advisoryHead}>Discuss grade selection</h4>
                    <p className={styles.advisoryDesc}>
                      Match structural load requirements from domestic blinding (G15) to heavy commercial beams (G35).
                    </p>
                  </div>
                </div>

                <div className={styles.advisoryItem}>
                  <div className={styles.advisoryNum}>2</div>
                  <div>
                    <h4 className={styles.advisoryHead}>Confirm site access</h4>
                    <p className={styles.advisoryDesc}>
                      Check turning radius, ground stability, overhead power lines, and whether a boom pump is needed.
                    </p>
                  </div>
                </div>

                <div className={styles.advisoryItem}>
                  <div className={styles.advisoryNum}>3</div>
                  <div>
                    <h4 className={styles.advisoryHead}>Plan your delivery</h4>
                    <p className={styles.advisoryDesc}>
                      Coordinate pour speed with labor availability. Concrete should be placed within 90 minutes of batching.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Grade Catalogue (RMC-01) */}
      <Section
        id="grade-catalogue"
        eyebrow="Mix Specifications"
        title="Certified concrete grade catalogue"
        description="All formulations batched under strict moisture-controlled laboratory conditions."
      >
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Grade</th>
                <th>28-Day Strength</th>
                <th>Standard Slump</th>
                <th>Recommended Applications</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {CONCRETE_GRADES.map((g) => (
                <tr key={g.grade}>
                  <td className={styles.gradeCell}>
                    <strong>{g.grade}</strong>
                  </td>
                  <td>{g.strengthNmm2} N/mm²</td>
                  <td>{g.slumpMm}</td>
                  <td>{g.applications}</td>
                  <td>
                    <Button
                      href={`/request-quote?service=ready-mix&grade=${g.grade}`}
                      size="sm"
                      variant="outline"
                      withArrow
                    >
                      Quote
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Batch to Build Process */}
      <Section
        id="batch-to-build"
        eyebrow="Our Process"
        title="From batch to build"
        description="Streamlined delivery coordination ensuring high workability and verified cube strength."
      >
        <div className={styles.processGrid}>
          {BATCH_TO_BUILD_STEPS.map((s) => (
            <div key={s.step} className={styles.processCard}>
              <div className={styles.stepImage}>
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className={styles.img}
                />
              </div>
              <div className={styles.stepContent}>
                <span className={styles.stepNum}>0{s.step}. {s.title}</span>
                <p className={styles.stepDesc}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Coverage & Dispatch Radius (RMC-05) */}
      <Section
        id="plant-coverage"
        eyebrow="Dispatch Coverage"
        title="Plant dispatch radius & delivery zones"
        description="Concentric 15 / 30 / 45 km radius rings from our computerized batching plant."
      >
        <PlantCoverageMap />
      </Section>

      {/* FAQ Accordion */}
      <Section
        id="rmc-faqs"
        eyebrow="Frequently Asked Questions"
        title="Common questions about ready-mix"
      >
        <Accordion items={READY_MIX_FAQS} />
      </Section>

      <CtaBand />
    </>
  );
}
