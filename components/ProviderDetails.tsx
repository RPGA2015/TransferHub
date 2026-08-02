"use client";

import { useEffect, useRef } from "react";
import ProviderBadge from "@/components/ProviderBadge";
import { getProviderProfile } from "@/lib/data/providers";
import type { Country, CurrencyCode, ProviderResult } from "@/lib/types/transfer";
import { formatCurrency, formatExchangeRate, formatRecipientAmount } from "@/lib/utils/currency";

type ProviderDetailsProps = {
  provider: ProviderResult;
  fromCountry: Country;
  toCountry: Country;
  sendAmount: number;
  sendCurrency: CurrencyCode;
  receiveCurrency: CurrencyCode;
  visibleResultCount: number;
  firstVisibleRecipientAmount: number;
  onClose: () => void;
};

export default function ProviderDetails({ provider, fromCountry, toCountry, sendAmount, sendCurrency, receiveCurrency, visibleResultCount, firstVisibleRecipientAmount, onClose }: ProviderDetailsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const profile = getProviderProfile(provider.providerId);
  const recipientDifference = firstVisibleRecipientAmount - provider.recipientAmount;
  const comparisonDifference = recipientDifference === 0
    ? "The same recipient amount as the first visible option."
    : recipientDifference > 0
      ? `${formatRecipientAmount(recipientDifference, receiveCurrency)} less than the first visible option.`
      : `${formatRecipientAmount(Math.abs(recipientDifference), receiveCurrency)} more than the first visible option.`;

  useEffect(() => { headingRef.current?.focus(); }, [provider.providerId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <section id="provider-details-panel" className="details-panel border-t border-blue-100 bg-white p-5 shadow-inner sm:p-8" aria-labelledby="provider-details-heading">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Illustrative provider profile</p>
          <h3 ref={headingRef} id="provider-details-heading" tabIndex={-1} className="mt-2 text-3xl font-bold text-slate-900 outline-none">{provider.providerName}</h3>
          {provider.badge && <div className="mt-3"><ProviderBadge provider={provider} /></div>}
        </div>
        <button type="button" onClick={onClose} className="shrink-0 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Close details</button>
      </div>

      <div className="mt-7 rounded-2xl bg-slate-50 p-5">
        <h4 className="font-semibold text-slate-900">Provider overview</h4>
        {profile ? <><p className="mt-2 text-sm leading-6 text-slate-600">{profile.description}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{profile.serviceSummary || "Illustrative provider information unavailable"}</p></> : <p className="mt-2 text-sm leading-6 text-slate-600">Illustrative provider information unavailable. The current sample offer remains available for comparison.</p>}
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-bold text-slate-900">Current illustrative offer</h4>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2">
          <div><dt className="text-sm text-slate-500">Transfer corridor</dt><dd className="mt-1 text-lg font-semibold text-slate-900">{fromCountry} → {toCountry}</dd></div>
          <div><dt className="text-sm text-slate-500">Amount sent</dt><dd className="mt-1 text-lg font-semibold text-slate-900">{sendAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })} {sendCurrency}</dd></div>
          <div><dt className="text-sm text-slate-500">Transfer fee</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{formatCurrency(provider.fee, sendCurrency)}</dd></div>
          <div><dt className="text-sm text-slate-500">Illustrative exchange rate</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{formatExchangeRate(provider.exchangeRate, sendCurrency, receiveCurrency)}</dd></div>
          <div><dt className="text-sm text-slate-500">Delivery estimate</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{provider.deliveryLabel}</dd></div>
          <div><dt className="text-sm text-slate-500">Payout method</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{provider.payoutMethod}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm text-slate-500">Recipient receives</dt><dd className="mt-1 text-2xl font-bold text-emerald-600">{formatRecipientAmount(provider.recipientAmount, receiveCurrency)}</dd><p className="mt-1 text-xs text-slate-500">Displayed in {receiveCurrency}.</p></div>
        </dl>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h4 className="text-lg font-bold text-slate-900">Service capabilities</h4>
        {profile ? <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <ProfileList title="Illustrative payout methods" items={profile.supportedPayoutMethods} />
          <ProfileList title="Digital access" items={profile.digitalAccess} />
          <ProfileList title="Support channels" items={profile.supportChannels} />
          <div className="sm:col-span-3"><p className="text-sm font-semibold text-slate-900">Availability note</p><p className="mt-1 text-sm leading-6 text-slate-600">{profile.availabilityNote}</p></div>
        </div> : <p className="mt-2 text-sm leading-6 text-slate-600">Illustrative provider information unavailable.</p>}
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <h4 className="text-lg font-bold text-slate-900">How this option compares</h4>
        <p className="mt-1 text-xs leading-5 text-slate-600">Current visible illustrative results only; position and badges are not recommendations.</p>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Position</dt><dd className="mt-1 font-semibold text-slate-900">{visibleResultCount === 1 ? "1 of 1 visible illustrative options." : `${provider.rankPosition} of ${visibleResultCount} visible illustrative options.`}</dd></div>
          <div><dt className="text-slate-500">Fee percentage</dt><dd className="mt-1 font-semibold text-slate-900">{provider.feePercentage.toLocaleString("en-US", { maximumFractionDigits: 2 })}% of the send amount</dd></div>
          <div><dt className="text-slate-500">Recipient amount difference</dt><dd className="mt-1 font-semibold text-slate-900">{comparisonDifference}</dd></div>
          <div><dt className="text-slate-500">Delivery and payout</dt><dd className="mt-1 font-semibold text-slate-900">{provider.deliveryLabel}; {provider.payoutMethod}</dd></div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-slate-600">{provider.badge ? `The “${provider.badge}” badge is calculated from the current visible fictional results.` : "No comparison badge is assigned to this option in the current visible results."}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h4 className="font-semibold text-slate-900">Important notice</h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">This provider profile and all offer values are fictional illustrative sample data—not live information. No partnership, integration, verification, licensing, rating, or endorsement is claimed. TransferHub does not currently initiate transfers.</p>
      </div>
    </section>
  );
}

function ProfileList({ title, items }: { title: string; items: readonly string[] }) {
  return <div><p className="text-sm font-semibold text-slate-900">{title}</p>{items.length > 0 ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-slate-500">Illustrative provider information unavailable</p>}</div>;
}
