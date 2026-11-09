import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CardGrid } from "@/components/layout/CardGrid";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BRAND_PARTNERS } from "@/data/hardware";
import { quoteHref, siteConfig } from "@/lib/site-config";
import styles from "./hardware.module.css";

export const metadata: Metadata = {
  title: "Hardware & Rentals",
  description:
    "Construction hardware supply, factory-cured concrete blocks, interlocking pavers and heavy equipment rentals.",
};

export default function HardwareHubPage() {
  return (
    <>
      <Hero
        eyebrow="Hardware & Rentals"
        title="Materials and equipment. One connected solution."
        description="Source certified hollow blocks, decorative paving, plant machinery and construction materials under one contract."
        image={{
          src: "/images/service-industrial.jpg",
          alt: "Warehouse materials and equipment storage",
        }}
        actions={
          <>
            <Button href="/divisions/hardware/blocks-pavers" withArrow>
              Blocks & Pavers Catalogue
            </Button>
            <Button href="/divisions/hardware/equipment" variant="outline" withArrow>
              Equipment Fleet
            </Button>
          </>
        }
      />

      {/* Sub-division Cards */}
      <Section
        id="sub-businesses"
        eyebrow="Our Operations"
        title="Direct factory supply & equipment hire"
        description="High volume production coupled with maintained heavy equipment hire."
      >
        <CardGrid columns={2}>
          <Card
            title="Blocks & Paving Manufacturing"
            image={{ src: "/images/service-residential.jpg", alt: "Concrete pavers and masonry blocks" }}
            href="/divisions/hardware/blocks-pavers"
            linkLabel="Explore Catalogue & Order"
          >
            Load-bearing hollow blocks, solid masonry units, and industrial interlocking pavers engineered to standard compressive strength.
          </Card>

          <Card
            title="Plant & Equipment Hire"
            image={{ src: "/images/hero-construction.jpg", alt: "Construction machinery on site" }}
            href="/divisions/hardware/equipment"
            linkLabel="View Fleet & Rental Terms"
          >
            Excavators, backhoes, compaction rollers, concrete boom pumps and site power generation available on flexible short or long-term lease.
          </Card>
        </CardGrid>
      </Section>

      {/* Store & Branch Information (HWD-01) */}
      <Container className={styles.storeContainer}>
        <div className={styles.storeCard}>
          <div className={styles.storeInfoCol}>
            <Eyebrow>Hardware Store & Trade Counter</Eyebrow>
            <h2 className={styles.storeTitle}>Direct trade counter sales & pickup</h2>
            <p className={styles.storeDesc}>
              Visit our central hardware branch for trade supplies, tools, steel reinforcement, cement and fittings.
            </p>
            <dl className={styles.storeDetails}>
              <div>
                <dt>Counter Hours</dt>
                <dd>Mon - Fri: 07:30 - 17:30 | Sat: 08:00 - 14:00 (Sun: Closed)</dd>
              </div>
              <div>
                <dt>Trade Counter Phone</dt>
                <dd>
                  <a href={`tel:${siteConfig.tradeCounterPhoneRaw}`} className={styles.phoneLink}>
                    📞 {siteConfig.tradeCounterPhone}
                  </a>
                  {" • "}
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=Hi%20Solidwin,%20I%20have%20a%20hardware%20trade%20counter%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappLink}
                  >
                    💬 WhatsApp Desk
                  </a>
                </dd>
              </div>
              <div>
                <dt>Branch Address</dt>
                <dd>Plot 42, Trade Gate Boulevard, Commercial Sector 3</dd>
              </div>
              <div>
                <dt>Bulk BOQ Uploads</dt>
                <dd>Accepts Excel (.xlsx/.xls) or PDF project bills of quantities up to 25 MB</dd>
              </div>
            </dl>

            <div className={styles.storeActionRow}>
              <Button href={quoteHref} withArrow>
                Upload BOQ for Pricing
              </Button>
              <a
                href="https://maps.google.com/?q=Solidwin+Hardware+Trade+Counter"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsBtn}
              >
                Get Driving Directions ↗
              </a>
            </div>
          </div>

          {/* Store Location Map (HWD-01) */}
          <div className={styles.mapCol}>
            <div className={styles.mapFrame}>
              <iframe
                title="Solidwin Hardware Trade Counter Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14476.366052733918!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM4LjUiTiA2N8KwMDAnMDQuMCJF!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="280"
                style={{ border: 0, borderRadius: "var(--radius-md)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className={styles.mapBadge}>
                <span>📍 Solidwin Trade Counter & Equipment Yard</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Brand Partners Showcase */}
      <Section
        id="brand-partners"
        eyebrow="Certified Suppliers"
        title="Trusted brand partners"
        description="We stock and partner with leading industrial machinery and tooling brands."
      >
        <div className={styles.brandGrid}>
          {BRAND_PARTNERS.map((brand) => (
            <div key={brand.name} className={styles.brandCard}>
              <div className={styles.brandLogoIcon}>★</div>
              <h4 className={styles.brandName}>{brand.name}</h4>
              <span className={styles.brandCategory}>{brand.category}</span>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
