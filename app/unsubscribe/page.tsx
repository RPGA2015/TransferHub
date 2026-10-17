
"use client";

import { useEffect, useRef, useState } from "react";

export default function UnsubscribePage() {
  const [status, setStatus] = useState("processing");
  const requestStarted = useRef(false);
  useEffect(() => {
  if (requestStarted.current) return;
  requestStarted.current = true;

  const token = new URLSearchParams(
      window.location.search
    ).get("token");

    if (!token) {
      setStatus("invalid");
      return;
    }

    async function unsubscribe() {
      try {
        const response = await fetch(
          `/api/unsubscribe?token=${encodeURIComponent(token!)}`,
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

    void unsubscribe();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        <p className="mb-4 text-sm font-bold tracking-widest text-blue-600">
          TRANSFERHUB
        </p>

        <h1 className="mb-4 text-2xl font-bold text-slate-900">
          Email Preferences
        </h1>

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
