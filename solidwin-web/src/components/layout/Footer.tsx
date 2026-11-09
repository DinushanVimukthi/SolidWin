"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { quoteHref, siteConfig } from "@/lib/site-config";
import { Container } from "./Container";
import { CurrentYear } from "./CurrentYear";
import styles from "./Footer.module.css";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin")) {
    return null;
  }
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLink} aria-label={`${siteConfig.name} home`}>
              <Image
                src="/logo-on-light.png"
                alt={siteConfig.name}
                width={170}
                height={42}
                className={styles.logo}
              />
            </Link>
            <p className={styles.brandTagline}>
              Building stronger spaces with quality, care and dependable service.
            </p>
          </div>

          {/* Our Divisions */}
          <nav aria-label="Our divisions">
            <h2 className={styles.heading}>Our Divisions</h2>
            <ul className={styles.list}>
              <li>
                <Link href="/divisions/construction">Construction Services</Link>
              </li>
              <li>
                <Link href="/divisions/ready-mix">Ready-Mix Concrete</Link>
              </li>
              <li>
                <Link href="/divisions/hardware/blocks-pavers">Blocks &amp; Pavers</Link>
              </li>
              <li>
                <Link href="/divisions/hardware/equipment">Equipment Rentals</Link>
              </li>
            </ul>
          </nav>

          {/* Explore Solidwin */}
          <nav aria-label="Explore Solidwin">
            <h2 className={styles.heading}>Explore Solidwin</h2>
            <ul className={styles.list}>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/projects">Projects &amp; Gallery</Link>
              </li>
              <li>
                <Link href="/resources">Resources &amp; HSEQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact &amp; Locations</Link>
              </li>
            </ul>
          </nav>

          {/* How can we help? */}
          <div className={styles.helpCol}>
            <h2 className={styles.heading}>How can we help?</h2>
            <ul className={styles.list}>
              <li>
                <Link href={quoteHref}>Request a Quote</Link>
              </li>
              <li>
                <Link href="/divisions/ready-mix#volume-calc">Material Calculators</Link>
              </li>
              <li>
                <Link href="/contact">Customer Support</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Attribution Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.legal}>
            &copy; <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>

          <div className={styles.legalLinks}>
            <Link href="/about">Privacy Policy</Link>
            <span aria-hidden="true">•</span>
            <Link href="/about">Terms of Use</Link>
            <span aria-hidden="true">•</span>
            <Link href="/about">Cookie Preferences</Link>
            <span aria-hidden="true">•</span>
            <span className={styles.exeAttribution}>Website by EXE</span>
            <span aria-hidden="true">•</span>
            <span style={{ fontWeight: 600, color: "#94a3b8" }}>v0.1.0</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
