"use client";

import { FormEvent, useState } from "react";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        setError("Incorrect access code.");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Unable to verify the access code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          TransferHub
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Private development access
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
  Enter the private access code to continue. Access remains unlocked for up to
  8 hours, and you can lock TransferHub again anytime from the site header.
</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="access-code"
              className="text-sm font-semibold text-slate-800"
            >
              Access code
            </label>

            <input
              id="access-code"
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-blue-500"
              required
            />
          </div>

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Checking..." : "Unlock TransferHub"}
          </button>
        </form>
      </section>
    </main>
  );
}