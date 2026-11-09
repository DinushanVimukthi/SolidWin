import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/layout/Hero";
import { RfqForm } from "@/features/rfq/RfqForm";
import styles from "./requestQuote.module.css";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request pricing for construction contracts, certified ready-mix concrete pours, and bulk masonry or equipment hire.",
};

export default function RequestQuotePage() {
  return (
    <>
      <Hero
        eyebrow="Request For Quote"
        title="Tell us what you're planning."
        description="Share your project requirements, target pour dates, or bills of quantities for an itemised proposal from our engineering estimators."
        image={{
          src: "/images/service-turnkey.jpg",
          alt: "Engineers reviewing technical drawings on site",
        }}
      />

      <Container className={styles.layout}>
        <div className={styles.formCol}>
          <RfqForm />
        </div>

        <aside className={styles.sidebarCol}>
          <div className={styles.helpCard}>
            <h3 className={styles.helpTitle}>Need immediate technical help?</h3>
            <p className={styles.helpDesc}>
              For urgent same-day concrete dispatch changes, plant accessibility inspections or emergency equipment breakdown hire:
            </p>
            <ul className={styles.helpList}>
              <li>
                <strong>Direct Dispatch Desk</strong>
                <span>Available Mon-Sat from 07:00</span>
              </li>
              <li>
                <strong>Technical Batching Consult</strong>
                <span>Custom mix design & strength certification</span>
              </li>
              <li>
                <strong>On-site Pour Coordinators</strong>
                <span>Pump truck & staging inspections</span>
              </li>
            </ul>
          </div>
        </aside>
      </Container>
    </>
  );
}
