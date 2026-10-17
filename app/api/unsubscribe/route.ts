
import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
    return NextResponse.json(
      { error: "Invalid unsubscribe link." },
      { status: 400 }
    );
  }

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    return NextResponse.json(
      { error: "Unsubscribe service is unavailable." },
      { status: 503 }
    );
  }

  const tokenHash = createHash("sha256")
    .update(token, "utf8")
    .digest("hex");

  const supabase = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.rpc(
    "process_waitlist_unsubscribe",
    { p_token_hash: tokenHash }
  );

  if (error) {
    console.error("Unsubscribe processing failed:", error.code);

    return NextResponse.json(
      { error: "Unable to process unsubscribe request." },
      { status: 500 }
    );
  }

  if (data !== true) {
    return NextResponse.json(
      { error: "This unsubscribe link is invalid or expired." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "You have successfully unsubscribed from TransferHub updates.",
  });
}
