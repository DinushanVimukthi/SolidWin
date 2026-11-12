import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Hero } from "@/components/layout/Hero";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/features/contact/ContactForm";
import { FileText, Briefcase, MessageSquare, MapPin } from "lucide-react";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact and Locations | Solidwin",
  description: "Get in touch with the Solidwin team about construction, concrete, materials and equipment needs.",
};

export default function ContactPage() {
  return (
    <div className={styles.contactPage}>
      {/* Hero Section matching Figma */}
      <Hero
        eyebrow="CONTACT & LOCATIONS"
        title="Let's talk about your next project."
        description="Our team is here to help with your construction, materials and equipment needs."
        actions={
          <>
            <Button href="#get-in-touch" variant="primary" withArrow>
              Contact Our Team
            </Button>
            <Button href="/divisions/construction" variant="outlineInverse" withArrow>
              Explore Divisions
            </Button>
          </>
        }
        image={{
          src: "/images/hero-contact.jpg",
          alt: "Solidwin engineering team on site",
        }}
      />

      {/* Main Form & Action Cards Section */}
      <section id="get-in-touch" className={styles.mainSection} aria-label="Get in touch">
        <Container>
          <div className={styles.gridContainer}>
            {/* Left Column: Get in touch form */}
            <div>
              <ContactForm />
            </div>

            {/* Right Column: 3 Contact Action Cards */}
            <div className={styles.enquiryCardsCol}>
              {/* Card 1: Project Enquiries */}
              <div className={styles.enquiryCard}>
                <div className={styles.cardIcon}>
                  <FileText size={28} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className={styles.cardTitle}>Project Enquiries</h3>
                <p className={styles.cardText}>
                  Talk to our team about construction, design and project requirements.
                </p>
                <div className={styles.cardAction}>
                  <Button href="/request-quote" variant="outline" size="sm" withArrow>
                    Contact our team
                  </Button>
                </div>
              </div>

              {/* Card 2: Materials & Equipment */}
              <div className={styles.enquiryCard}>
                <div className={styles.cardIcon}>
                  <Briefcase size={28} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className={styles.cardTitle}>Materials &amp; Equipment</h3>
                <p className={styles.cardText}>
                  Ask about concrete, blocks, pavers and equipment rental.
                </p>
                <div className={styles.cardAction}>
                  <Button href="/divisions/ready-mix" variant="outline" size="sm" withArrow>
                    Contact our team
                  </Button>
                </div>
              </div>

              {/* Card 3: Free Guidance */}
              <div className={styles.enquiryCard}>
                <div className={styles.cardIcon}>
                  <MessageSquare size={28} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className={styles.cardTitle}>Free Guidance</h3>
                <p className={styles.cardText}>
                  Not sure where to start? Ask Solidwin Assistant for guidance.
                </p>
                <div className={styles.cardAction}>
                  <Button href="/contact#assistant" variant="outline" size="sm" withArrow>
                    Ask Solidwin
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* OUR LOCATIONS Section */}
      <section className={styles.locationsSection} aria-labelledby="locations-heading">
        <Container>
          <div className={styles.sectionHeader}>
            <div className={styles.accentDash} aria-hidden="true" />
            <p className={styles.sectionEyebrow}>OUR LOCATIONS</p>
            <h2 id="locations-heading" className={styles.sectionTitle}>
              Find the right point of contact.
            </h2>
          </div>

          <div className={styles.locationsGrid}>
            {/* Left: Branch Photo Preview */}
            <div className={styles.mapCard} style={{ position: "relative", minHeight: 280, overflow: "hidden" }}>
              <Image
                src="/images/hardware/hardware-store-exterior-wide.jpg"
                alt="Solidwin Hardware branch building and materials yard in Kahawa, Kosgama"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                style={{ objectFit: "cover" }}
              />
              <div className={styles.mapCaption}>
                📍 Solidwin Hardware Branch &amp; Materials Yard — Kahawa, Kosgama
              </div>
            </div>

            {/* Right: Branch Info Box */}
            <div className={styles.branchCard}>
              <div className={styles.branchIconBadge}>
                <MapPin size={24} />
              </div>
              <h3 className={styles.branchTitle}>Solidwin Hardware &amp; Trade Counter</h3>
              <p className={styles.branchText}>
                <strong>Address:</strong> No. 237/1, Kahawa, Kosgama (High Level Road)<br />
                <strong>Direct Counter Phone:</strong> 036 2250660<br />
                <strong>Customer Hotline:</strong> 077 727 2272 / 076 615 0036<br />
                <strong>Operating Hours:</strong> Mon – Fri: 07:30 – 17:30 | Sat: 08:00 – 14:00
              </p>
              <div style={{ marginTop: 8 }}>
                <Button
                  href="https://maps.google.com/?q=Solidwin+Hardware+Kosgama"
                  variant="outline"
                  size="sm"
                  withArrow
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pre-footer LET'S BUILD TOGETHER Call to Action */}
      <section className={styles.ctaBand} aria-labelledby="cta-heading">
        <Container>
          <div className={styles.ctaInner}>
            <div className={styles.ctaContent}>
              <div className={styles.ctaEyebrow}>
                <span className={styles.accentDash} style={{ marginBottom: 0 }} aria-hidden="true" />
                LET&apos;S BUILD TOGETHER
              </div>
              <h2 id="cta-heading" className={styles.ctaTitle}>
                Your next project starts here.
              </h2>
              <p className={styles.ctaSubtitle}>
                Talk to our team about construction, concrete, materials and equipment.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Button href="/request-quote" variant="primary" withArrow>
                Request a Quote
              </Button>
              <Button href="#get-in-touch" variant="secondary" withArrow>
                Contact Our Team
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
