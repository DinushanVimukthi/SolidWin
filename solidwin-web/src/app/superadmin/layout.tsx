"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { SuperadminSidebar } from "@/components/superadmin/SuperadminSidebar";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/superadmin/login";
  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    if (isLoginPage) return;

    let isMounted = true;
    fetch("/api/superadmin/auth")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated) {
          setUser(data.user);
          setCheckingAuth(false);
        } else {
          router.replace("/superadmin/login");
        }
      })
      .catch(() => {
        if (isMounted) router.replace("/superadmin/login");
      });

    return () => {
      isMounted = false;
    };
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#090d16",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: 14,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <ShieldCheck
            size={36}
            color="#f59e0b"
            style={{ margin: "0 auto 12px", animation: "pulse 1.5s infinite" }}
          />
          <p style={{ margin: 0 }}>Authenticating Superadmin Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }}>
      {/* Superadmin Sidebar (Admin Styles) */}
      <SuperadminSidebar user={user} />

      {/* Main Content Area without Top Navbar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflowY: "auto",
        }}
      >
        <main
          style={{
            flex: 1,
            padding: "28px 32px",
            maxWidth: 1400,
            width: "100%",
            margin: "0 auto",
          }}
        >
          {children}
        </main>

        <footer
          style={{
            padding: "8px 32px 14px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            fontSize: "11px",
            color: "#94a3b8",
            marginTop: "auto",
          }}
        >
          <span>Version v0.1.0</span>
        </footer>
      </div>
    </div>
  );
}
