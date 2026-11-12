"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, ArrowLeft, Lock, Loader2 } from "lucide-react";
import styles from "@/components/admin/AdminAuthGuard.module.css";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/auth/session", {
      headers: { "Cache-Control": "no-store" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.authenticated) {
          router.replace(redirectTarget);
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        if (isMounted) setChecking(false);
      });

    return () => {
      isMounted = false;
    };
  }, [redirectTarget, router]);

  const portalBaseUrl =
    process.env.NEXT_PUBLIC_EXE_PORTAL_URL || "http://localhost:3001";
  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const redirectUri = `${currentOrigin}/admin/sso/callback?redirect=${encodeURIComponent(
    redirectTarget
  )}`;
  const ssoSignInUrl = `${portalBaseUrl}/admin/sign-in?sso_target=solidwin&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  if (checking) {
    return (
      <div className={styles.guardOverlay}>
        <div className={styles.guardCard}>
          <div className={styles.loadingBox}>
            <Loader2 size={36} className={styles.spinner} />
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>
              Verifying Session...
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Checking EXE Central Single Sign-On status
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.guardOverlay}>
      <div className={styles.guardCard}>
        {/* Brand Header */}
        <div className={styles.brandRow}>
          <Image
            src="/logo-on-light.png"
            alt="Solidwin"
            width={135}
            height={34}
            className={styles.solidwinLogo}
            priority
          />
        </div>

        <div className={styles.ssoTag}>
          <ShieldCheck size={13} />
          <span>EXE Central Single Sign-On</span>
        </div>

        <h1 className={styles.title}>Admin Portal Sign-In</h1>
        <p className={styles.description}>
          Solidwin administration is centrally managed through the EXE Client Portal.
          Sign in with your administrator account to access the dashboard.
        </p>

        <div className={styles.actionSection}>
          <a href={ssoSignInUrl} className={styles.ssoButton}>
            <span>Sign In with EXE Portal</span>
            <ArrowRight size={15} />
          </a>

          <Link href="/" className={styles.returnLink}>
            <ArrowLeft size={13} />
            <span>Return to Solidwin website</span>
          </Link>
        </div>

        <div className={styles.securityFooter}>
          <Lock size={12} className={styles.securityIcon} />
          <span>Encrypted token authentication via EXE Central IAM</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.guardOverlay}>
          <div className={styles.guardCard}>
            <div className={styles.loadingBox}>
              <Loader2 size={36} className={styles.spinner} />
            </div>
          </div>
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}
