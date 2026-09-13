import { NextResponse } from "next/server";

const COOKIE_NAME = "transferhub_access";

async function getAccessToken(secret: string) {
  const data = new TextEncoder().encode(`transferhub:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const expectedCode = process.env.TRANSFERHUB_ACCESS_CODE;

  if (!expectedCode) {
    return NextResponse.json(
      { error: "Private access is not configured." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const submittedCode =
    typeof body?.code === "string" ? body.code.trim() : "";

  if (submittedCode !== expectedCode) {
    return NextResponse.json(
      { error: "Incorrect access code." },
      { status: 401 },
    );
  }

  const accessToken = await getAccessToken(expectedCode);
  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}