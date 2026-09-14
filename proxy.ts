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
  const privateAccessEnabled =
  process.env.TRANSFERHUB_PRIVATE_ACCESS_ENABLED === "true";

if (!privateAccessEnabled) {
  return NextResponse.next();
}

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/api/access"
  ) {
    return NextResponse.next();
  }

  const accessCookie = request.cookies.get(COOKIE_NAME)?.value;
  const expectedToken = await getAccessToken();

  const hasValidAccess =
    expectedToken && accessCookie === expectedToken;

  if (pathname === "/access") {
    if (hasValidAccess) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = "/";

      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  if (hasValidAccess) {
    return NextResponse.next();
  }

  const accessUrl = request.nextUrl.clone();
  accessUrl.pathname = "/access";

  return NextResponse.redirect(accessUrl);
}
  export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};