import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "transferhub_access";

async function getAccessToken() {
  const secret = process.env.TRANSFERHUB_ACCESS_CODE;

  if (!secret) {
    return null;
  }

  const data = new TextEncoder().encode(`transferhub:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/access" ||
    pathname === "/api/access"
  ) {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get(COOKIE_NAME)?.value;
  const expectedToken = await getAccessToken();

  if (expectedToken && accessCookie === expectedToken) {
    return NextResponse.next();
  }

  const accessUrl = request.nextUrl.clone();
  accessUrl.pathname = "/access";

  return NextResponse.redirect(accessUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};