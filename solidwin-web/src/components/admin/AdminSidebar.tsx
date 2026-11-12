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
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import styles from "./AdminSidebar.module.css";
import { useAdminAuth } from "./AdminAuthGuard";

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
  const { user, logout } = useAdminAuth();

  const isItemActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const displayName = user?.name || "Solidwin Admin";
  const initials =
    displayName
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SW";

  const displayRole = user?.role
    ? `${user.role.toUpperCase()} • EXE Central`
    : "Solidwin Administrator";

  const exePortalUrl =
    process.env.NEXT_PUBLIC_EXE_PORTAL_URL || "http://localhost:3001";

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
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userMeta}>
            <span className={styles.userName} title={user?.email || displayName}>
              {displayName}
            </span>
            <span className={styles.userRole}>{displayRole}</span>
          </div>
        </div>

        <div className={styles.ssoBadge}>
          <span className={styles.greenDot} />
          <span>EXE SSO Active</span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <a
            href={`${exePortalUrl}/dashboard`}
            className={styles.portalReturnLink}
            style={{ flex: 1 }}
            title="Return to EXE Central Portal"
          >
            <ExternalLink size={13} />
            <span>EXE Portal</span>
          </a>
          <Link
            href="/"
            className={styles.liveSiteLink}
            target="_blank"
            style={{ flex: 1 }}
            title="Open Public Solidwin Website"
          >
            <ExternalLink size={13} />
            <span>Public Site</span>
          </Link>
        </div>

        <button
          onClick={logout}
          className={styles.logoutButton}
          title="Sign out of Solidwin Admin session"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
