"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Flame, ChevronRight, ChevronDown, Globe } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import styles from "./AdminHeader.module.css";

interface AdminHeaderProps {
  title?: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const pathname = usePathname();
  const firebaseReady = isFirebaseConfigured();

  // Extract breadcrumb label from pathname
  const segments = pathname.split("/").filter(Boolean);
  const currentSection = segments.length > 1 ? segments[segments.length - 1] : "overview";
  const formattedSection = currentSection
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.breadcrumbs}>
          <span className={styles.crumbRoot}>Solidwin Workspace</span>
          <ChevronRight size={14} className={styles.crumbArrow} />
          <span className={styles.crumbCurrent}>{formattedSection}</span>
        </div>
        {title && (
          <div className={styles.headingGroup}>
            <h1 className={styles.pageTitle}>{title}</h1>
            {description && <p className={styles.pageDescription}>{description}</p>}
          </div>
        )}
      </div>

      <div className={styles.right}>
        {/* Firebase Status Badge */}
        <Link href="/admin/settings" className={styles.statusBadge} title="Workspace Settings & Cloud Status">
          <Flame size={14} className={firebaseReady ? styles.flameActive : styles.flameStandby} />
          <span>Firebase</span>
          <ChevronDown size={13} style={{ color: "#94a3b8", marginLeft: 2 }} />
        </Link>

        {/* Public Website Link */}
        <Link href="/" className={styles.siteLink} target="_blank" title="Open Public Website">
          <Globe size={16} />
          <span>Website</span>
        </Link>

        {/* Notification Bell */}
        <div className={styles.bellButton} title="Notifications">
          <Bell size={18} />
          <span className={styles.bellDot} />
        </div>
      </div>
    </header>
  );
}
