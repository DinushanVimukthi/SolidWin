import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifySsoToken,
  createSessionToken,
  SSO_COOKIE_NAME,
  SUPERADMIN_COOKIE_NAME,
} from "@/lib/auth/sso";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sso_token } = body;

    if (!sso_token) {
      return NextResponse.json(
        { ok: false, error: "Missing sso_token parameter" },
        { status: 400 }
      );
    }

    const payload = verifySsoToken(sso_token);
    const sessionToken = createSessionToken(payload);

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    // Set Admin Portal Session Cookie (7 days)
    cookieStore.set(SSO_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    // Also authorize superadmin role if admin
    cookieStore.set(
      SUPERADMIN_COOKIE_NAME,
      Buffer.from(
        JSON.stringify({
          email: payload.email,
          name: payload.name,
          role: "superadmin",
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
        })
      ).toString("base64"),
      {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      }
    );

    return NextResponse.json({
      ok: true,
      message: "SSO authentication successful",
      user: {
        uid: payload.uid,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        tenantId: payload.tenantId,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "SSO Verification Failed";
    return NextResponse.json(
      { ok: false, error: errorMsg },
      { status: 401 }
    );
  }
}
