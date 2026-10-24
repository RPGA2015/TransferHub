
"use client";

import { useEffect, useRef, useState } from "react";

export default function UnsubscribePage() {
 const [status, setStatus] = useState("ready");
const [token, setToken] = useState<string | null>(null);

useEffect(() => {
  const urlToken = new URLSearchParams(
    window.location.search
  ).get("token");

  if (!urlToken || !/^[a-f0-9]{64}$/i.test(urlToken)) {
    setStatus("invalid");
    return;
  }

  setToken(urlToken);
}, []);

async function unsubscribe() {
  if (!token || status !== "ready") return;

  setStatus("processing");

  try {
    const response = await fetch(
      `/api/unsubscribe?token=${encodeURIComponent(token)}`,
      { method: "POST" }
    );

    const result = await response.json();

    setStatus(
      response.ok && result.success
        ? "success"
        : "error"
    );
  } catch {
    setStatus("error");
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        <p className="mb-4 text-sm font-bold tracking-widest text-blue-600">
          TRANSFERHUB
        </p>

        <h1 className="mb-4 text-2xl font-bold text-slate-900">
          Email Preferences
        </h1>
{status === "ready" && token && (
  <div>
    <p className="mb-6 text-slate-600">
      Are you sure you want to unsubscribe from TransferHub updates?
    </p>

    <button
      type="button"
      onClick={() => void unsubscribe()}
      className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
    >
      Confirm Unsubscribe
    </button>
  </div>
)}
        {status === "processing" && (
          <p>Processing your unsubscribe request...</p>
        )}

        {status === "success" && (
          <p className="text-green-700">
            You have successfully unsubscribed from
            TransferHub updates.
          </p>
        )}

        {status === "invalid" && (
          <p className="text-red-600">
            This unsubscribe link is invalid.
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600">
            We could not process your request.
            The link may be invalid or expired.
          </p>
        )}
      </div>
    </main>
  );
}
