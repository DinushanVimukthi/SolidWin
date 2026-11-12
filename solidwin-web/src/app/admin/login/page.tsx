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
          <div className={styles.cardGlow} />
          <div className={styles.loadingBox}>
            <Loader2 size={44} className={styles.spinner} />
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Checking Central Session...
            </div>
            <div style={{ fontSize: 13, color: "#64748b" }}>
              Verifying EXE Central Single Sign-On status
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.guardOverlay}>
      <div className={styles.guardCard}>
        <div className={styles.cardGlow} />

        {/* Unified Brand Header */}
        <div className={styles.brandRow}>
          <div className={styles.exeBadge}>EXE.</div>
          <div className={styles.exchangeIcon}>
            <ArrowRight size={18} />
          </div>
          <Image
            src="/logo-on-light.png"
            alt="Solidwin"
            width={125}
            height={32}
            className={styles.solidwinLogo}
            priority
          />
        </div>

        <div className={styles.ssoTag}>
          <ShieldCheck size={14} />
          <span>Central Single Sign-On (SSO)</span>
        </div>

        <h1 className={styles.title}>Solidwin Workspace Gate</h1>
        <p className={styles.description}>
          Solidwin administration is centrally authenticated via EXE Portal IAM.
          Sign in with your EXE Central Administrator account to access this
          workspace without a second login.
        </p>

        <div className={styles.actionSection}>
          <a href={ssoSignInUrl} className={styles.ssoButton}>
            <span>Sign In with EXE Central Portal</span>
            <ArrowRight size={16} />
          </a>

          <Link href="/" className={styles.returnLink}>
            <ArrowLeft size={14} />
            <span>Return to Public Website</span>
          </Link>
        </div>

        <div className={styles.securityFooter}>
          <Lock size={13} className={styles.securityIcon} />
          <span>End-to-End Cryptographic HMAC Token Exchange</span>
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
              <Loader2 size={44} className={styles.spinner} />
            </div>
          </div>
        </div>
      }
    >
      <AdminLoginInner />
    </Suspense>
  );
}

