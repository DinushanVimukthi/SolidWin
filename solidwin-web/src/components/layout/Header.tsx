"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { primaryNav, quoteHref, siteConfig } from "@/lib/site-config";
import { Container } from "./Container";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href.split("/").slice(0, 2).join("/")));

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin")) {
    return null;
  }

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label={`${siteConfig.name} home`}>
          <Image
            src="/logo-on-light.png"
            alt={siteConfig.name}
            width={180}
            height={44}
            priority
            className={styles.logo}
          />
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className={styles.burger} />
        </button>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={clsx(styles.nav, open && styles.navOpen)}
        >
          <ul className={styles.list}>
            {primaryNav.map((item) => {
              const hasDropdown = item.label === "About" || item.label === "Divisions" || item.label === "Resources";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(styles.link, isActive(item.href) && styles.active)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && <span className={styles.chevron} aria-hidden="true">▾</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.navActions}>
            <Link href="/projects" className={styles.searchBtn} aria-label="Search projects and services">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>
            <Button href={quoteHref} size="sm" withArrow>
              Request a Quote
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  );
}
