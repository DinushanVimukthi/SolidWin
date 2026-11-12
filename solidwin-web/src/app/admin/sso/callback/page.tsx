"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { getExePortalUrl } from "@/lib/auth/sso";

function SsoCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ssoToken = searchParams.get("sso_token");
  const redirectTarget = searchParams.get("redirect") || "/admin";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!ssoToken) {
      setStatus("error");
      setErrorMessage("No Single Sign-On (SSO) token was provided in the authorization request.");
      return;
    }

    let isMounted = true;

    async function verify() {
      try {
        const res = await fetch("/api/admin/sso/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sso_token: ssoToken }),
        });

        const data = await res.json();
        if (!isMounted) return;

        if (res.ok && data.ok) {
          setStatus("success");
          setUserName(data.user?.name || data.user?.email || "Administrator");
          setTimeout(() => {
            router.replace(redirectTarget);
          }, 1200);
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Failed to authenticate with EXE Central Portal.");
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Network error during SSO handshake. Check your connection."
        );
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [ssoToken, redirectTarget, router]);

  const exePortalUrl = getExePortalUrl();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #090d16 0%, #16122b 50%, #1f143d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.45)",
          padding: 36,
          textAlign: "center",
        }}
      >
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
          <div
            style={{
              padding: "6px 12px",
              background: "#1e1b4b",
              color: "#fbbf24",
              borderRadius: 8,
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: "-0.04em",
            }}
          >
            EXE.
          </div>
          <span style={{ color: "#94a3b8", fontSize: 18 }}>↔</span>
          <Image
            src="/logo-on-light.png"
            alt="Solidwin"
            width={120}
            height={30}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* State: Loading */}
        {status === "loading" && (
          <div>
            <Loader2
              size={48}
              color="#310e54"
              style={{ margin: "0 auto 16px", animation: "spin 1s linear infinite" }}
            />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
              Verifying EXE Central Login
            </h2>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              Handshaking single sign-on token and establishing authenticated admin session...
            </p>
          </div>
        )}

        {/* State: Success */}
        {status === "success" && (
          <div>
            <CheckCircle2
              size={52}
              color="#10b981"
              style={{ margin: "0 auto 16px" }}
            />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
              Authenticated Successfully!
            </h2>
            <p style={{ fontSize: 14, color: "#334155", margin: "0 0 16px" }}>
              Welcome back, <strong>{userName}</strong>. Redirecting you to Solidwin Admin...
            </p>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              If you are not redirected automatically,{" "}
              <Link href={redirectTarget} style={{ color: "#310e54", fontWeight: 700 }}>
                click here
              </Link>
              .
            </div>
          </div>
        )}

        {/* State: Error */}
        {status === "error" && (
          <div>
            <AlertCircle
              size={50}
              color="#ef4444"
              style={{ margin: "0 auto 16px" }}
            />
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
              SSO Authentication Error
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#b91c1c",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "10px 14px",
                margin: "0 0 20px",
                textAlign: "left",
                lineHeight: 1.5,
              }}
            >
              {errorMessage}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href={`${exePortalUrl}/admin/sign-in?sso_target=solidwin`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px 16px",
                  background: "#310e54",
                  color: "#ffffff",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                <span>Return to EXE Central Login</span>
                <ArrowRight size={16} />
              </a>
              <Link
                href="/"
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  textDecoration: "none",
                  padding: 6,
                }}
              >
                Back to Public Website
              </Link>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function SsoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#090d16",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
          }}
        >
          Loading SSO handshake...
        </div>
      }
    >
      <SsoCallbackInner />
    </Suspense>
  );
}

