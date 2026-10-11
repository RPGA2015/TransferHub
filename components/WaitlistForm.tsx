"use client";

import { FormEvent, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { translate } from "@/lib/i18n/dictionaries";
import { getCountryLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/types";
import type { Country } from "@/lib/types/transfer";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type FieldErrors = Partial<Record<"email" | "consent" | "form", string>>;
export default function WaitlistForm({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const copy = dictionary.waitlist;
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<"new" | "duplicate" | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const firstName = String(data.get("firstName") ?? "").trim();
    const country = String(data.get("country") ?? "").trim();
    const consent = data.get("consent") === "on";
    const nextErrors: FieldErrors = {};

    if (!email) nextErrors.email = copy.emailRequired;
    else if (!EMAIL_PATTERN.test(email)) nextErrors.email = copy.emailInvalid;
    if (!consent) nextErrors.consent = copy.consentRequired;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        if (nextErrors.email) emailRef.current?.focus();
        else consentRef.current?.focus();
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
     
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          country,
          locale,
          consent,
        }),
      });

      if (!response.ok) {
        throw new Error("Waitlist registration failed.");
      }

      const data: unknown = await response.json();

      if (
        !data ||
        typeof data !== "object" ||
        !("result" in data) ||
        (data.result !== "new" && data.result !== "duplicate")
      ) {
        throw new Error("Unexpected registration response.");
      }

      setSubmittedEmail(email);
      setResult(data.result);

    } catch {
      setErrors({ form: copy.storageError });
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setResult(null);
    setSubmittedEmail("");
    setErrors({});
    window.requestAnimationFrame(() => emailRef.current?.focus());
  }

  if (result) {
    return (
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-7 shadow-xl shadow-slate-950/5 sm:p-9" aria-labelledby="waitlist-result-title">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
        </div>
        <p className="mt-6 text-xs font-extrabold tracking-[0.16em] text-emerald-700">{result === "new" ? copy.newEyebrow : copy.duplicateEyebrow}</p>
        <h2 id="waitlist-result-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {result === "new" ? copy.thanks : copy.already}
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          {result === "new"
            ? translate(copy.saved, { email: submittedEmail })
            : translate(copy.registered, { email: submittedEmail })}
        </p>
        <button type="button" onClick={resetForm} className="mt-7 rounded-xl border border-emerald-700/20 bg-white px-5 py-3 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-100">
          {copy.anotherEmail}
        </button>
        <p className="sr-only" role="status" aria-live="polite">{result === "new" ? copy.successStatus : copy.duplicateStatus}</p>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 sm:p-9" aria-busy={isSubmitting}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="waitlist-email" className="block text-sm font-bold text-slate-800">{copy.email} <span className="text-red-600" aria-hidden="true">*</span></label>
          <input ref={emailRef} id="waitlist-email" name="email" type="email" autoComplete="email" inputMode="email" aria-required="true" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "waitlist-email-error" : "waitlist-email-hint"} className="form-control mt-2" placeholder="name@example.com" />
          {errors.email ? <p id="waitlist-email-error" className="mt-2 text-sm font-semibold text-red-700">{errors.email}</p> : <p id="waitlist-email-hint" className="mt-2 text-xs text-slate-500">{copy.emailHint}</p>}
        </div>

        <div>
          <label htmlFor="waitlist-first-name" className="block text-sm font-bold text-slate-800">{copy.firstName} <span className="font-normal text-slate-500">({copy.optional})</span></label>
          <input id="waitlist-first-name" name="firstName" type="text" autoComplete="given-name" className="form-control mt-2" placeholder={copy.firstNamePlaceholder} />
        </div>

        <div>
          <label htmlFor="waitlist-country" className="block text-sm font-bold text-slate-800">{copy.country} <span className="font-normal text-slate-500">({copy.optional})</span></label>
          <select id="waitlist-country" name="country" autoComplete="country-name" className="form-control mt-2">
            <option value="">{copy.selectCountry}</option>
            {(['United States', 'Canada', 'France', 'Dominican Republic', 'Haiti'] as Country[]).map((country) => <option key={country} value={country}>{getCountryLabel(country, locale)}</option>)}
            <option value="Other">{copy.other}</option>
          </select>
        </div>
      </div>

      <div className={`mt-6 rounded-2xl border p-4 ${errors.consent ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
        <div className="flex items-start gap-3">
          <input ref={consentRef} id="waitlist-consent" name="consent" type="checkbox" aria-required="true" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "waitlist-consent-error" : undefined} className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 accent-blue-600" />
          <label htmlFor="waitlist-consent" className="text-sm leading-6 text-slate-700">{copy.consent} <span className="font-bold text-red-600" aria-hidden="true">*</span></label>
        </div>
        {errors.consent && <p id="waitlist-consent-error" className="ml-8 mt-2 text-sm font-semibold text-red-700">{errors.consent}</p>}
      </div>

      {errors.form && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">{errors.form}</div>}

      <button type="submit" disabled={isSubmitting} className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">
        {isSubmitting && <span className="loading-spinner h-4 w-4 rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
        {isSubmitting ? copy.submitting : copy.submit}
      </button>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{isSubmitting ? copy.submittingStatus : errors.form ?? ""}</div>
      <p className="mt-4 text-center text-xs leading-5 text-slate-500">{copy.noPayment}</p>
    </form>
  );
}
