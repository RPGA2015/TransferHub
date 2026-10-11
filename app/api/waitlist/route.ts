
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;
    const email =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "";
    const firstName =
      typeof data.firstName === "string"
        ? data.firstName.trim()
        : "";
    const country =
      typeof data.country === "string"
        ? data.country.trim()
        : "";
    const locale = data.locale;
    const consent = data.consent === true;

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      firstName.length > 100 ||
      country.length > 100 ||
      !["en", "fr", "ht", "es"].includes(String(locale)) ||
      !consent
    ) {
      return NextResponse.json(
        { error: "Invalid registration information." },
        { status: 400 }
      );
    }

    const url = process.env.SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secretKey) {
      return NextResponse.json(
        { error: "Registration is unavailable." },
        { status: 503 }
      );
    }

    const supabase = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase
      .from("waitlist_signups")
      .insert({
        email,
        first_name: firstName || null,
        country: country || null,
        locale,
        consent,
      });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { result: "duplicate" },
          { status: 200 }
        );
      }

      console.error("Waitlist database error:", {
  code: error.code,
  message: error.message,
  details: error.details,
  hint: error.hint,
});
      return NextResponse.json(
        { error: "Registration failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { result: "new" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to process registration." },
      { status: 400 }
    );
  }
}
