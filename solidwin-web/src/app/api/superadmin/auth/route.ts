import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { auditLogRepository } from "@/lib/dal/audit-repository";

const COOKIE_NAME = "solidwin_superadmin_session";
const DEFAULT_EMAIL = "superadmin@solidwin.ae";
const DEFAULT_HASH = "b0c45d181f7d2183958e0d7205d0811a14a100e570973a710886383cc19d65ad"; // SolidWin@SuperAdmin2026!

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME);

  if (!sessionToken || !sessionToken.value) {
    return NextResponse.json({ authenticated: false, role: null });
  }

  try {
    const payload = JSON.parse(Buffer.from(sessionToken.value, "base64").toString("utf-8"));
    if (payload.role === "superadmin" && payload.exp > Date.now()) {
      return NextResponse.json({
        authenticated: true,
        user: {
          email: payload.email,
          name: payload.name || "Super Administrator",
          role: "superadmin",
        },
      });
    }
  } catch {
    // Malformed cookie
  }

  return NextResponse.json({ authenticated: false, role: null });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();

    // Logout Action
    if (body.action === "logout") {
      cookieStore.delete(COOKIE_NAME);
      return NextResponse.json({ ok: true, message: "Logged out successfully" });
    }

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const targetEmail = process.env.SUPERADMIN_EMAIL || DEFAULT_EMAIL;
    const targetHash = process.env.SUPERADMIN_PASSWORD_HASH || DEFAULT_HASH;

    // Hash provided password using SHA-256
    const inputHash = crypto.createHash("sha256").update(password).digest("hex");

    const emailMatch = email.trim().toLowerCase() === targetEmail.trim().toLowerCase();
    const passwordMatch = inputHash === targetHash;

    if (!emailMatch || !passwordMatch) {
      await auditLogRepository.recordLog({
        actor: { name: email, email, role: "system" },
        action: "SUPERADMIN_LOGIN_FAILED",
        category: "security",
        details: `Failed superadmin login attempt from IP/client with email: ${email}`,
      });

      return NextResponse.json(
        { ok: false, error: "Invalid superadmin credentials. Verify your email and password." },
        { status: 401 }
      );
    }

    // Create session token (valid 24h)
    const sessionData = {
      email: targetEmail,
      name: "Marcus Vance (EXE Superadmin)",
      role: "superadmin",
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };
    const token = Buffer.from(JSON.stringify(sessionData)).toString("base64");

    // Set secure session cookie
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    // Record successful audit log
    await auditLogRepository.recordLog({
      actor: { name: sessionData.name, email: targetEmail, role: "superadmin" },
      action: "SUPERADMIN_LOGIN_SUCCESS",
      category: "security",
      details: "Superadmin authenticated successfully into EXE Portal management console.",
    });

    return NextResponse.json({
      ok: true,
      user: {
        email: sessionData.email,
        name: sessionData.name,
        role: "superadmin",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
