"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auth pages (login, callback) render without the admin shell
  const isAuthRoute =
    pathname === "/admin/login" || pathname?.startsWith("/admin/sso");

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
        if (!isAuthRoute) {
          const redirect = encodeURIComponent(pathname || "/admin");
          router.replace(`/admin/login?redirect=${redirect}`);
        }
      }
    } catch (err) {
      console.error("Session check error:", err);
      setUser(null);
      setIsAuthenticated(false);
      if (!isAuthRoute) {
        router.replace("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthRoute, pathname, router]);

  useEffect(() => {
    if (!isAuthRoute) {
      checkSession();
    } else {
      setLoading(false);
    }
  }, [isAuthRoute, checkSession]);

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
      router.replace("/admin/login");
    }
  }, [router]);

  // Auth routes (like /admin/login and /admin/sso/callback) render directly
  if (isAuthRoute) {
    return (
      <AdminAuthContext.Provider
        value={{
          user,
          loading: false,
          isAuthenticated,
          logout,
          refresh: checkSession,
        }}
      >
        {children}
      </AdminAuthContext.Provider>
    );
  }

  // Loading spinner while verifying authentication or transitioning
  if (loading || !isAuthenticated) {
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
        <div style={{ display: "none" }} aria-hidden="true">
          {children}
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
