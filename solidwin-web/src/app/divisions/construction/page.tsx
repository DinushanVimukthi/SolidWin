import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CardGrid } from "@/components/layout/CardGrid";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { constructionServices } from "@/data/divisions";
import { BrickBlockCalculator } from "@/features/calculators/BrickBlockCalculator";
import { PlasterPaintCalculator } from "@/features/calculators/PlasterPaintCalculator";
import { quoteHref } from "@/lib/site-config";
import styles from "./construction.module.css";

export const metadata: Metadata = {
  title: "Construction Services",
  description:
    "Quality construction for homes, businesses and industries—built safely, delivered on time.",
};

const PROCESS_STEPS = [
  {
    step: "1",
    title: "Discuss",
    desc: "Understand your goals, scope, engineering requirements and budget expectations.",
  },
  {
    step: "2",
    title: "Plan",
    desc: "Coordinate architectural designs, structural calculations, permits and procurement programme.",
  },
  {
    step: "3",
    title: "Build",
    desc: "Rigorous execution with certified materials, continuous HSEQ safety audits and quality control.",
  },
  {
    step: "4",
    title: "Handover",
    desc: "Final inspections, compliance documentation, warranties and post-handover support.",
  },
];

export default function ConstructionPage() {
  return (
    <>
      <Hero
        eyebrow="Construction Services"
        title="Built around your vision."
        description="Quality construction for homes, businesses and industries—built safely, delivered on time."
        image={{
          src: "/images/hero-construction.jpg",
          alt: "Engineers reviewing construction blueprints",
        }}
        actions={
          <>
            <Button href={quoteHref} withArrow>
              Request a Quote
            </Button>
            <Button href="/projects" variant="outline" withArrow>
              View Projects
            </Button>
          </>
        }
      />

      {/* Services Grid */}
      <Section
        id="construction-services"
        eyebrow="Specialisations"
        title="Comprehensive building capabilities"
        description="From bespoke architectural villas to heavy industrial and turnkey EPC delivery."
      >
        <CardGrid columns={4}>
          {constructionServices.map((service) => (
            <Card
              key={service.id}
              title={service.title}
              image={service.image}
              href="/request-quote"
              linkLabel="Get a Quote"
            >
              {service.description}
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* 4-Step Process */}
      <Section
        id="process-section"
        eyebrow="Our Construction Process"
        title="A clear path from idea to handover"
        description="A structured, transparent delivery methodology that ensures on-time, on-budget completion."
      >
        <div className={styles.processGrid}>
          {PROCESS_STEPS.map((p) => (
            <div key={p.step} className={styles.processCard}>
              <div className={styles.stepBadge}>0{p.step}</div>
              <h3 className={styles.stepTitle}>{p.title}</h3>
              <p className={styles.stepDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Interactive Calculators Section (CON-03 & CON-04) */}
      <Section
        id="calculators-section"
        eyebrow="Material Estimators"
        title="Plan your construction requirements"
        description="Calculate estimated brick counts, cement bags and paint volume with standard site allowances."
      >
        <div className={styles.calcGrid}>
          <div>
            <h3 className={styles.calcTitle}>Brick & Block Quantity Calculator</h3>
            <p className={styles.calcSub}>
              Calculates nominal wall block count with 10mm mortar joints and 5% breakage buffer.
            </p>
            <BrickBlockCalculator />
          </div>

          <div>
            <h3 className={styles.calcTitle}>Plaster & Paint Estimator</h3>
            <p className={styles.calcSub}>
              Estimate cement & sand bags or paint litres for interior and exterior wall finishes.
            </p>
            <PlasterPaintCalculator />
          </div>
        </div>
      </Section>

      {/* Vision, Mission & Why Choose Solidwin (CON-01) */}
      <Section
        id="vision-mission"
        eyebrow="Vision & Excellence"
        title="Why partners choose Solidwin"
        description="Combining certified engineering, self-manufactured materials, and uncompromising safety standards."
      >
        <div className={styles.vmGrid}>
          <div className={styles.vmCard}>
            <span className={styles.vmPill}>Our Vision</span>
            <h3 className={styles.vmHeading}>Engineered for generations</h3>
            <p className={styles.vmText}>
              To be the premier multi-division construction partner, delivering resilient residential, commercial and industrial infrastructure that sets new benchmarks in durability, environmental stewardship, and architectural finish.
            </p>
          </div>
          <div className={styles.vmCard}>
            <span className={styles.vmPill}>Our Mission</span>
            <h3 className={styles.vmHeading}>Total delivery assurance</h3>
            <p className={styles.vmText}>
              Unite vertically-integrated manufacturing—from certified ready-mix concrete to high-density blocks—with transparent project management to eliminate delays, control costs, and protect client investments.
            </p>
          </div>
        </div>

        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>
            <div className={styles.whyIcon}>01</div>
            <h4 className={styles.whyTitle}>Direct Material Control</h4>
            <p className={styles.whyText}>
              We supply our own certified concrete and masonry blocks, preventing supply delays and third-party markup.
            </p>
          </div>
          <div className={styles.whyCard}>
            <div className={styles.whyIcon}>02</div>
            <h4 className={styles.whyTitle}>ISO 9001:2015 Quality</h4>
            <p className={styles.whyText}>
              Every pour, structural column, and mortar joint adheres to strict laboratory cube testing and building code audits.
            </p>
          </div>
          <div className={styles.whyCard}>
            <div className={styles.whyIcon}>03</div>
            <h4 className={styles.whyTitle}>Turnkey Transparency</h4>
            <p className={styles.whyText}>
              Fixed milestone schedules, weekly photographic progress reporting, and a dedicated structural project engineer.
            </p>
          </div>
          <div className={styles.whyCard}>
            <div className={styles.whyIcon}>04</div>
            <h4 className={styles.whyTitle}>Zero-Harm HSEQ Culture</h4>
            <p className={styles.whyText}>
              Daily tool-box safety briefings, certified rigging, PPE enforcement, and compliant environmental disposal.
            </p>
          </div>
        </div>
      </Section>

      {/* HSEQ Documents, Certificates & Company Profile PDF (CON-01) */}
      <Section
        id="hseq-downloads"
        eyebrow="Compliance & Governance"
        title="HSEQ documents & company profile"
        description="Download certified credentials, health & safety manuals, and our comprehensive corporate profile."
      >
        <div className={styles.docsGrid}>
          <div className={styles.docCard}>
            <div className={styles.docBadge}>PDF • 4.2 MB</div>
            <h4 className={styles.docTitle}>Solidwin Corporate Profile</h4>
            <p className={styles.docDesc}>
              Complete overview of divisions, structural equipment fleet, batching facilities, leadership and representative projects.
            </p>
            <Button href="/resources" size="sm" variant="outline" withArrow>
              Download PDF
            </Button>
          </div>

          <div className={styles.docCard}>
            <div className={styles.docBadge}>PDF • 1.8 MB</div>
            <h4 className={styles.docTitle}>ISO 9001:2015 Quality Certificate</h4>
            <p className={styles.docDesc}>
              Certified quality management framework for commercial design, civil execution, and ready-mix concrete production.
            </p>
            <Button href="/resources" size="sm" variant="outline" withArrow>
              View Certificate
            </Button>
          </div>

          <div className={styles.docCard}>
            <div className={styles.docBadge}>PDF • 2.6 MB</div>
            <h4 className={styles.docTitle}>HSEQ Manual & Safety Plan</h4>
            <p className={styles.docDesc}>
              Comprehensive health, safety, and environmental standards governing site operations, PPE compliance and emergency protocols.
            </p>
            <Button href="/resources" size="sm" variant="outline" withArrow>
              View Document
            </Button>
          </div>
        </div>
      </Section>

      {/* Quality Commitments */}
      <Container className={styles.commitmentContainer}>
        <div className={styles.commitmentBox}>
          <div>
            <Eyebrow inverse>From Concept to Completion</Eyebrow>
            <h2 className={styles.commitmentTitle}>Delivering on every detail.</h2>
            <ul className={styles.checkList}>
              <li>✓ Comprehensive scope & drawing coordination</li>
              <li>✓ Rigorous site planning & safety protocols</li>
              <li>✓ Single point of contact project management</li>
              <li>✓ Guaranteed adherence to approved building codes</li>
            </ul>
          </div>
          <div className={styles.commitmentAction}>
            <p className={styles.commitmentText}>
              Ready to break ground on your commercial, residential or industrial project?
            </p>
            <Button href={quoteHref} withArrow>
              Start Your Project Consultation
            </Button>
          </div>
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
