"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";

export default function SuperadminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("superadmin@solidwin.ae");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/superadmin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Authentication failed. Verify credentials.");
        setLoading(false);
        return;
      }

      router.push("/superadmin");
    } catch {
      setError("Network or server connection error. Please try again.");
      setLoading(false);
    }
  };

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
          maxWidth: 440,
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #180928 0%, #310e54 100%)",
            padding: "28px 28px 24px",
            color: "#ffffff",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            <ShieldCheck size={14} color="#f59e0b" />
            <span>EXE Superadmin Clearance</span>
          </div>

          <div style={{ margin: "0 auto 8px", width: 140, height: 35, position: "relative" }}>
            <Image
              src="/logo.png"
              alt="Solidwin"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <p style={{ margin: 0, fontSize: 13, color: "rgba(255, 255, 255, 0.75)" }}>
            Site Configuration &amp; Strategic Oversight
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: 28 }}>
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: 12.5,
                marginBottom: 18,
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Superadmin Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@solidwin.ae"
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 13.5,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Encrypted Master Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter superadmin password"
                  style={{
                    width: "100%",
                    padding: "9px 12px 9px 36px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 13.5,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Hint Box */}
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 6,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                fontSize: 11.5,
                color: "#64748b",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "#0f172a" }}>Default Workspace Credential:</strong>
              <br />
              Email: <code>superadmin@solidwin.ae</code>
              <br />
              Password: <code>SolidWin@SuperAdmin2026!</code>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "11px 18px",
                borderRadius: 8,
                background: "#310e54",
                color: "#ffffff",
                border: "none",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 2px 4px rgba(49, 14, 84, 0.2)",
                marginTop: 4,
              }}
            >
              <span>{loading ? "Verifying Credentials..." : "Access Superadmin Portal"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center", borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
            <Link
              href="/admin"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12.5,
                color: "#64748b",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} />
              <span>Return to Standard Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
