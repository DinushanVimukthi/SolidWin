import { describe, it, expect } from "vitest";
import {
  verifySsoToken,
  createSessionToken,
  parseSessionToken,
  getSsoSecret,
} from "./sso";
import crypto from "crypto";

function createMockExeToken(payload: Record<string, unknown>, secret = getSsoSecret()) {
  const header = { alg: "HS256", typ: "JWT" };
  const b64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const unsigned = `${b64Header}.${b64Payload}`;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(unsigned)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${unsigned}.${sig}`;
}

describe("EXE Central SSO Authentication", () => {
  it("verifies a valid token minted by EXE Portal", () => {
    const now = Math.floor(Date.now() / 1000);
    const mockToken = createMockExeToken({
      uid: "exe_admin_test_123",
      email: "ahmed@exegroup.ae",
      name: "Ahmed Mansoor",
      role: "admin",
      tenantId: "tenant_solidwin_prod",
      target: "solidwin",
      iat: now,
      exp: now + 300,
    });

    const verified = verifySsoToken(mockToken);
    expect(verified.uid).toBe("exe_admin_test_123");
    expect(verified.email).toBe("ahmed@exegroup.ae");
    expect(verified.name).toBe("Ahmed Mansoor");
  });

  it("rejects token with invalid secret or tampered payload", () => {
    const now = Math.floor(Date.now() / 1000);
    const fakeToken = createMockExeToken(
      {
        uid: "hacker",
        email: "evil@attacker.com",
        name: "Attacker",
        role: "admin",
        iat: now,
        exp: now + 300,
      },
      "wrong_secret_tampered"
    );

    expect(() => verifySsoToken(fakeToken)).toThrow("Invalid SSO token signature");
  });

  it("rejects expired tokens", () => {
    const past = Math.floor(Date.now() / 1000) - 600;
    const expiredToken = createMockExeToken({
      uid: "user_expired",
      email: "old@solidwin.ae",
      name: "Old Session",
      role: "admin",
      iat: past - 300,
      exp: past,
    });

    expect(() => verifySsoToken(expiredToken)).toThrow(/expired/);
  });

  it("creates and parses a valid admin session cookie", () => {
    const ssoPayload = {
      uid: "exe_user_001",
      email: "admin@exe.ae",
      name: "Executive Admin",
      role: "superadmin",
      tenantId: "tenant_solidwin_prod",
      target: "solidwin",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 300,
    };

    const sessionCookieValue = createSessionToken(ssoPayload);
    expect(typeof sessionCookieValue).toBe("string");

    const session = parseSessionToken(sessionCookieValue);
    expect(session).not.toBeNull();
    expect(session?.email).toBe("admin@exe.ae");
    expect(session?.name).toBe("Executive Admin");
    expect(session?.ssoProvider).toBe("exe");
    expect(session?.exp).toBeGreaterThan(Date.now());
  });
});

