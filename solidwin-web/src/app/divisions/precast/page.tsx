import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { quoteHref } from "@/lib/site-config";
import styles from "./precast.module.css";

export const metadata: Metadata = {
  title: "Precast Concrete (Future Division)",
  description:
    "Modular structural and architectural precast elements, prestressed beams, wall panels and custom moulds.",
};

const PLANNED_ELEMENTS = [
  {
    title: "Prestressed Hollow-Core Slabs",
    desc: "Long-span floor and roof decking engineered for rapid assembly and superior load-bearing capacity.",
    status: "Tooling in progress",
  },
  {
    title: "Precast Columns & Beams",
    desc: "High-strength factory-cured structural members designed to reduce on-site formwork and curing delays.",
    status: "Specification stage",
  },
  {
    title: "Architectural Cladding Panels",
    desc: "Custom decorative and insulated exterior wall panels available in sandblasted and exposed aggregate finishes.",
    status: "Tooling in progress",
  },
  {
    title: "Precast Culverts & Drainage",
    desc: "Standard box culverts, retaining wall units, and utility channels for municipal infrastructure.",
    status: "Specification stage",
  },
];

export default function PrecastDivisionPage() {
  return (
    <>
      <Hero
        eyebrow="Future Division • Modular Engineering"
        title="Precast concrete solutions"
        description="Factory-engineered structural and architectural precast elements designed for rapid on-site assembly and precision tolerances."
        image={{
          src: "/images/service-industrial.jpg",
          alt: "Precast concrete manufacturing plant",
        }}
        actions={
          <>
            <Button href={quoteHref} withArrow>
              Register Early Project Interest
            </Button>
            <Button href="/divisions/ready-mix" variant="outline" withArrow>
              Explore Ready-Mix
            </Button>
          </>
        }
      />

      {/* Planned Product Architecture */}
      <Section
        id="precast-elements"
        eyebrow="Product Roadmap"
        title="Forthcoming precast catalogue"
        description="Our dedicated precast casting yard and steam-curing bays are currently being commissioned."
      >
        <div className={styles.grid}>
          {PLANNED_ELEMENTS.map((elem) => (
            <div key={elem.title} className={styles.card}>
              <div className={styles.badge}>{elem.status}</div>
              <h3 className={styles.cardTitle}>{elem.title}</h3>
              <p className={styles.cardDesc}>{elem.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Drawing Upload Workflow Notice */}
      <Container className={styles.workflowContainer}>
        <div className={styles.workflowBox}>
          <div>
            <Eyebrow inverse>Engineering Preparation</Eyebrow>
            <h2 className={styles.workflowTitle}>CAD & BIM drawing upload workflow</h2>
            <p className={styles.workflowText}>
              The digital precast portal will allow structural engineers and contractors to upload DWG, DXF and IFC BIM models for automated reinforcement validation and casting schedules.
            </p>
            <p className={styles.workflowSub}>
              Have an immediate requirement or structural drawings for upcoming bids? Contact our technical engineering team directly.
            </p>
          </div>
          <div className={styles.workflowAction}>
            <Button href={quoteHref} withArrow>
              Submit Preliminary Drawings
            </Button>
          </div>
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
