import type { Metadata } from "next";
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
            {/* Left: Illustrative Map Preview */}
            <div className={styles.mapCard}>
              <svg
                className={styles.mapPattern}
                viewBox="0 0 600 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Diagonal & orthogonal grid lines representing road network */}
                <line x1="0" y1="60" x2="600" y2="40" stroke="#cbd5e1" strokeWidth="12" />
                <line x1="0" y1="130" x2="600" y2="120" stroke="#cbd5e1" strokeWidth="16" />
                <line x1="0" y1="210" x2="600" y2="200" stroke="#cbd5e1" strokeWidth="14" />
                <line x1="120" y1="0" x2="160" y2="300" stroke="#cbd5e1" strokeWidth="10" />
                <line x1="280" y1="0" x2="260" y2="300" stroke="#cbd5e1" strokeWidth="16" />
                <line x1="420" y1="0" x2="440" y2="300" stroke="#cbd5e1" strokeWidth="12" />
                <line x1="530" y1="0" x2="550" y2="300" stroke="#cbd5e1" strokeWidth="8" />
                {/* Secondary connecting road lines */}
                <line x1="40" y1="280" x2="560" y2="30" stroke="#e2e8f0" strokeWidth="8" />
                <line x1="30" y1="40" x2="570" y2="260" stroke="#e2e8f0" strokeWidth="8" />
              </svg>

              <div className={styles.mapPinBadge} aria-hidden="true">
                <MapPin size={24} />
              </div>

              <div className={styles.mapCaption}>
                Illustrative map – location to be confirmed
              </div>
            </div>

            {/* Right: Branch Info Box */}
            <div className={styles.branchCard}>
              <div className={styles.branchIconBadge}>
                <MapPin size={24} />
              </div>
              <h3 className={styles.branchTitle}>Branch details to be confirmed</h3>
              <p className={styles.branchText}>
                Contact our team for current branch and site information.
              </p>
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
