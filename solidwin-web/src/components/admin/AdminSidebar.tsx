"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Calculator,
  FileText,
  Truck,
  Layers,
  Bot,
  Settings,
  PhoneCall,
  Search,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";
import styles from "./AdminSidebar.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "DASHBOARDS & LEADS",
    items: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Inquiries & RFQs", href: "/admin/inquiries", icon: Inbox },
    ],
  },
  {
    title: "CONTENT MANAGEMENT",
    items: [
      { label: "Projects & Portfolio", href: "/admin/content/projects", icon: Building2 },
      { label: "Calculators & Parameters", href: "/admin/content/calculators", icon: Calculator },
      { label: "HSEQ & Company Profile", href: "/admin/content/documents", icon: FileText },
      { label: "Ready-Mix Concrete", href: "/admin/content/concrete", icon: Truck },
      { label: "Hardware & Equipment", href: "/admin/content/catalogue", icon: Layers },
      { label: "AI Knowledge & FAQ", href: "/admin/content/faq", icon: Bot },
    ],
  },
  {
    title: "PORTAL & INTEGRATIONS",
    items: [
      { label: "Workspace Settings", href: "/admin/settings", icon: Settings },
      { label: "WhatsApp Dispatches", href: "/admin/settings/whatsapp", icon: PhoneCall },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Brand Header */}
      <div className={styles.brandContainer}>
        <Link href="/admin" className={styles.brandLink}>
          <Image
            src="/logo-on-light.png"
            alt="Solidwin"
            width={130}
            height={32}
            className={styles.brandLogo}
          />
        </Link>
      </div>

      {/* Quick Search Input */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search portal..."
            className={styles.searchInput}
            readOnly
            onClick={() => {
              // placeholder for cmd-k
            }}
          />
          <kbd className={styles.kbd}>⌘K</kbd>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className={styles.nav}>
        {navGroups.map((group) => (
          <div key={group.title} className={styles.navGroup}>
            <div className={styles.groupTitle}>{group.title}</div>
            <ul className={styles.itemList}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(styles.navLink, active && styles.navLinkActive)}
                    >
                      <Icon size={18} className={styles.itemIcon} />
                      <span className={styles.itemLabel}>{item.label}</span>
                      {item.badge && <span className={styles.badge}>{item.badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>AM</div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>Ahmed Mansoor</span>
            <span className={styles.userRole}>Solidwin Administrator</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <Link href="/" className={styles.liveSiteLink} target="_blank" style={{ flex: 1 }}>
            <ExternalLink size={14} />
            <span>View Public Site</span>
          </Link>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: 6,
              background: "#e2e8f0",
              color: "#475569",
              letterSpacing: "0.02em",
            }}
            title="Application Version"
          >
            v0.1.0
          </span>
        </div>
      </div>
    </aside>
  );
}
