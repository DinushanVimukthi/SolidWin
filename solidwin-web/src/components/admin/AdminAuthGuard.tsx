"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import adminStyles from "@/app/admin/admin.module.css";
import guardStyles from "./AdminAuthGuard.module.css";

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  ssoProvider: "exe";
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
  refresh: async () => {},
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // If on the SSO callback route, let the callback page execute the handshake directly
  const isCallbackRoute = pathname?.startsWith("/admin/sso");

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth/session", {
        method: "GET",
        headers: { "Cache-Control": "no-store" },
      });
      const data = await res.json();
      if (res.ok && data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Session check error:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isCallbackRoute) {
      checkSession();
    } else {
      setLoading(false);
    }
  }, [isCallbackRoute, checkSession]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Pass-through for callback route
  if (isCallbackRoute) {
    return (
      <AdminAuthContext.Provider
        value={{
          user,
          loading: false,
          isAuthenticated: false,
          logout,
          refresh: checkSession,
        }}
      >
        {children}
      </AdminAuthContext.Provider>
    );
  }

  // Loading spinner while verifying authentication
  if (loading) {
    return (
      <div className={guardStyles.guardOverlay}>
        <div className={guardStyles.guardCard}>
          <div className={guardStyles.cardGlow} />
          <div className={guardStyles.loadingBox}>
            <Loader2 size={44} className={guardStyles.spinner} />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Verifying EXE Central Session...
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Connecting to EXE Single Sign-On provider
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated: Show Central SSO Gate
  if (!isAuthenticated) {
    const portalBaseUrl =
      process.env.NEXT_PUBLIC_EXE_PORTAL_URL || "http://localhost:3001";
    const currentOrigin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname + window.location.search : "/admin";
    const redirectUri = `${currentOrigin}${currentPath}`;
    const ssoSignInUrl = `${portalBaseUrl}/admin/sign-in?sso_target=solidwin&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;

    return (
      <div className={guardStyles.guardOverlay}>
        <div className={guardStyles.guardCard}>
          <div className={guardStyles.cardGlow} />

          {/* Unified Brand Header */}
          <div className={guardStyles.brandRow}>
            <div className={guardStyles.exeBadge}>EXE.</div>
            <div className={guardStyles.exchangeIcon}>
              <ArrowRight size={18} />
            </div>
            <Image
              src="/logo-on-light.png"
              alt="Solidwin"
              width={125}
              height={32}
              className={guardStyles.solidwinLogo}
              priority
            />
          </div>

          <div className={guardStyles.ssoTag}>
            <ShieldCheck size={14} />
            <span>Central Single Sign-On (SSO)</span>
          </div>

          <h1 className={guardStyles.title}>Solidwin Workspace Gate</h1>
          <p className={guardStyles.description}>
            Solidwin administration is centrally managed via EXE Portal IAM.
            Sign in with your EXE Central Administrator account to access this
            workspace without a separate password.
          </p>

          <div className={guardStyles.actionSection}>
            <a href={ssoSignInUrl} className={guardStyles.ssoButton}>
              <span>Sign In with EXE Central Portal</span>
              <ArrowRight size={16} />
            </a>

            <Link href="/" className={guardStyles.returnLink}>
              <ArrowLeft size={14} />
              <span>Return to Public Website</span>
            </Link>
          </div>

          <div className={guardStyles.securityFooter}>
            <Lock size={13} className={guardStyles.securityIcon} />
            <span>End-to-End Cryptographic HMAC Token Exchange</span>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Render Admin Dashboard layout
  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading: false,
        isAuthenticated: true,
        logout,
        refresh: checkSession,
      }}
    >
      <div className={adminStyles.adminRoot}>
        <AdminSidebar />
        <div className={adminStyles.adminContent}>
          {children}
          <footer
            style={{
              padding: "8px 32px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "11px",
              color: "#94a3b8",
              marginTop: "auto",
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <span>
              Authenticated via <strong>EXE Central SSO</strong>
            </span>
            <span>Version v0.1.0</span>
          </footer>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
}
