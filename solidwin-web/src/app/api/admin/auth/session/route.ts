import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  parseSessionToken,
  SSO_COOKIE_NAME,
  SUPERADMIN_COOKIE_NAME,
} from "@/lib/auth/sso";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SSO_COOKIE_NAME);

  if (sessionCookie?.value) {
    const session = parseSessionToken(sessionCookie.value);
    if (session) {
      return NextResponse.json({
        authenticated: true,
        user: {
          uid: session.uid,
          email: session.email,
          name: session.name,
          role: session.role,
          tenantId: session.tenantId,
          ssoProvider: "exe",
        },
      });
    }
  }

  // Fallback check for superadmin cookie
  const superadminCookie = cookieStore.get(SUPERADMIN_COOKIE_NAME);
  if (superadminCookie?.value) {
    try {
      const payload = JSON.parse(Buffer.from(superadminCookie.value, "base64").toString("utf-8"));
      if (payload.exp > Date.now()) {
        return NextResponse.json({
          authenticated: true,
          user: {
            uid: "superadmin_local",
            email: payload.email,
            name: payload.name || "Super Administrator",
            role: payload.role || "admin",
            tenantId: "tenant_solidwin_prod",
            ssoProvider: "exe",
          },
        });
      }
    } catch {}
  }

  return NextResponse.json({
    authenticated: false,
    user: null,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const cookieStore = await cookies();

  if (body.action === "logout") {
    cookieStore.delete(SSO_COOKIE_NAME);
    cookieStore.delete(SUPERADMIN_COOKIE_NAME);
    return NextResponse.json({ ok: true, message: "Logged out successfully" });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}

