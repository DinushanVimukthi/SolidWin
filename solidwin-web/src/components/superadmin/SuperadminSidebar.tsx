"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Sliders,
  FileClock,
  ShieldCheck,
  Search,
  ExternalLink,
  LogOut,
  FolderSync,
} from "lucide-react";
import clsx from "clsx";
import styles from "./SuperadminSidebar.module.css";

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
    title: "GOVERNANCE & METRICS",
    items: [
      { label: "Executive Overview", href: "/superadmin", icon: LayoutDashboard },
      { label: "Website Analytics", href: "/superadmin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "SYSTEM & AUDITING",
    items: [
      { label: "Site Configuration", href: "/superadmin/settings", icon: Sliders },
      { label: "Action History & Audit", href: "/superadmin/audit", icon: FileClock },
    ],
  },
  {
    title: "PORTAL & ENVIRONMENT",
    items: [
      { label: "Standard Admin Portal", href: "/admin", icon: FolderSync },
      { label: "Public Website", href: "/", icon: ExternalLink },
    ],
  },
];

interface SuperadminSidebarProps {
  user?: { email: string; name: string } | null;
}

export function SuperadminSidebar({ user }: SuperadminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isItemActive = (href: string) => {
    if (href === "/superadmin") return pathname === "/superadmin";
    if (href === "/admin" || href === "/") return false;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/superadmin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    router.push("/superadmin/login");
  };

  return (
    <aside className={styles.sidebar}>
      {/* Brand & Superadmin Badge Header */}
      <div className={styles.brandContainer}>
        <div className={styles.brandRow}>
          <Link href="/superadmin" className={styles.brandLink}>
            <Image
              src="/logo-on-light.png"
              alt="Solidwin"
              width={125}
              height={30}
              className={styles.brandLogo}
            />
          </Link>
          <div className={styles.roleBadge} title="Superadmin Role Activated">
            <ShieldCheck size={13} />
            <span>Superadmin</span>
          </div>
        </div>
      </div>

      {/* Quick Search Box */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search governance..."
            className={styles.searchInput}
            readOnly
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
                const isExternal = item.href === "/";
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
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

      {/* Superadmin User Session Footer */}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>SA</div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user?.name || "Superadmin"}</span>
            <span className={styles.userRole}>Security &amp; DAL Controller</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
            title="Log Out of Superadmin"
          >
            <LogOut size={16} />
          </button>
        </div>

        <div className={styles.footerActions}>
          <Link href="/admin" className={styles.portalLink}>
            <FolderSync size={13} />
            <span>Admin Workspace</span>
          </Link>
          <span className={styles.versionBadge} title="Application Version">
            v0.1.0
          </span>
        </div>
      </div>
    </aside>
  );
}
