
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const resend = new Resend(process.env.RESEND_API_KEY);
const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({
          url: redisUrl,
          token: redisToken,
        }),
        limiter: Ratelimit.slidingWindow(5, "10 m"),
        prefix: "transferhub:waitlist",
      })
    : null;
    export async function POST(request: NextRequest) {
  try {
        if (!ratelimit) {
      return NextResponse.json(
        { error: "Registration is temporarily unavailable." },
        { status: 503 }
      );
    }
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
   const forwardedFor = request.headers.get("x-vercel-forwarded-for");

const ip =
  process.env.NODE_ENV === "development"
    ? "local-development"
    : forwardedFor?.split(",")[0]?.trim();

    if (!ip) {
      return NextResponse.json(
        { error: "Unable to verify request origin." },
        { status: 503 }
      );
    }
        let allowed: boolean;

    try {
      const result = await ratelimit.limit(ip);
      allowed = result.success;
    } catch (error) {
      console.error("Waitlist rate limiter unavailable:", error);
      return NextResponse.json(
        { error: "Registration is temporarily unavailable." },
        { status: 503 }
      );
    }

    if (!allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
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
        consented_at: new Date().toISOString(),
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

    try {
 
const displayName = firstName || "there";

const { error: emailError } = await resend.emails.send({
  from: "TransferHub <waitlist@transferhub.info>",
  to: [email],
  subject: "Welcome to the TransferHub Waitlist!",
  text: `Hello ${displayName}!

Thank you for joining the TransferHub waitlist.

We're building a simpler way to compare international money transfer services.

We'll keep you informed as TransferHub gets closer to launch.

The TransferHub Team
https://transferhub.info`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to TransferHub</title>
      </head>
      <body style="margin:0;padding:24px 12px;background-color:#f3f6fa;font-family:Arial,Helvetica,sans-serif;color:#14213d;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#0b1f44;padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:30px;">TransferHub</h1>
              <p style="margin:12px 0 0;color:#b9d7cc;font-size:15px;">
                One App. Every Transfer.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 28px;">
              <h2 style="margin:0 0 20px;color:#0b1f44;font-size:24px;">
                You're on the list!
              </h2>
              <p style="font-size:16px;line-height:1.7;">
                Hello,
              </p>
              <p style="font-size:16px;line-height:1.7;">
                Thank you for joining the TransferHub waitlist.
              </p>
              <p style="font-size:16px;line-height:1.7;">
                We're building a simpler way to compare international
                money transfer services.
              </p>
              <p style="font-size:16px;line-height:1.7;">
                We'll keep you informed as we get closer to launch.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
                <tr>
                  <td style="background-color:#008f68;border-radius:8px;">
                    <a href="https://transferhub.info"
                       style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">
                      Explore TransferHub
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size:15px;line-height:1.6;">
                The TransferHub Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#eef5f2;padding:20px 24px;text-align:center;">
              <p style="margin:0;color:#526277;font-size:12px;line-height:1.6;">
                TransferHub — Making international transfer comparisons simpler.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `,
});

  if (emailError) {
    console.error("Waitlist confirmation email failed:", emailError);
  }
} catch (emailError) {
  console.error("Waitlist email delivery error:", emailError);
}
return NextResponse.json(
  { result: "new" },
  { status: 201 }
);
  } catch (error) {
  console.error("Unexpected waitlist registration error:", error);
  return NextResponse.json(
    { error: "Unable to process registration." },
    { status: 500 }
  );
  }
    }