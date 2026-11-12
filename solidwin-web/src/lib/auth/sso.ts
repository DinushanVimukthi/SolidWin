import crypto from "crypto";

export const SSO_COOKIE_NAME = "solidwin_admin_session";
export const SUPERADMIN_COOKIE_NAME = "solidwin_superadmin_session";
const DEFAULT_SECRET = "exe_sso_shared_secret_2026_solidwin_central_auth";

export interface SsoPayload {
  uid: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  target: string;
  iat: number;
  exp: number;
  jti?: string;
}

export interface AdminSession {
  uid: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  ssoProvider: "exe";
  exp: number;
}

export function getSsoSecret(): string {
  return process.env.EXE_SSO_SECRET || DEFAULT_SECRET;
}

export function getExePortalUrl(): string {
  return process.env.NEXT_PUBLIC_EXE_PORTAL_URL || process.env.EXE_PORTAL_URL || "http://localhost:3001";
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

/**
 * Verifies an incoming SSO token from EXE Portal using HMAC-SHA256.
 */
export function verifySsoToken(token: string): SsoPayload {
  if (!token || typeof token !== "string") {
    throw new Error("Missing SSO token");
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Malformed SSO token format");
  }

  const [headerEncoded, payloadEncoded, signature] = parts;
  const unsignedToken = `${headerEncoded}.${payloadEncoded}`;
  const secret = getSsoSecret();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(unsignedToken)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (signature !== expectedSignature) {
    throw new Error("Invalid SSO token signature");
  }

  const payload: SsoPayload = JSON.parse(base64UrlDecode(payloadEncoded));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < now) {
    throw new Error("SSO token has expired. Please launch again from EXE Portal.");
  }

  return payload;
}

/**
 * Serializes an active admin session to a base64 string for cookie storage.
 * Sessions last 7 days by default.
 */
export function createSessionToken(payload: SsoPayload): string {
  const sessionData: AdminSession = {
    uid: payload.uid,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    role: payload.role || "admin",
    tenantId: payload.tenantId || "tenant_solidwin_prod",
    ssoProvider: "exe",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return Buffer.from(JSON.stringify(sessionData), "utf-8").toString("base64");
}

/**
 * Parses and verifies an admin session token from cookie.
 */
export function parseSessionToken(token: string): AdminSession | null {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const session: AdminSession = JSON.parse(raw);
    if (session.exp && session.exp > Date.now()) {
      return session;
    }
  } catch {
    // Malformed session
  }
  return null;
}

