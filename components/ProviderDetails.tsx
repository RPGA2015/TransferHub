"use client";

import { useEffect, useRef } from "react";
import ProviderBadge from "@/components/ProviderBadge";
import { getProviderProfile } from "@/lib/data/providers";
import type { Locale } from "@/lib/i18n/config";
import { translate } from "@/lib/i18n/dictionaries";
import { getCountryLabel, getPayoutMethodLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/types";
import { getLocalizedProviderContent } from "@/lib/i18n/providerContent";
import type { Country, CurrencyCode, ProviderResult } from "@/lib/types/transfer";
import { formatCurrency, formatExchangeRate, formatRecipientAmount } from "@/lib/utils/currency";

type ProviderDetailsProps = {
  locale: Locale;
  dictionary: Dictionary;
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

export default function ProviderDetails({ locale, dictionary, provider, fromCountry, toCountry, sendAmount, sendCurrency, receiveCurrency, visibleResultCount, firstVisibleRecipientAmount, onClose }: ProviderDetailsProps) {
  const copy = dictionary.providerDetails;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const profile = getProviderProfile(provider.providerId);
  const localizedProfile = getLocalizedProviderContent(provider.providerId, locale);
  const recipientDifference = firstVisibleRecipientAmount - provider.recipientAmount;
  const comparisonDifference = recipientDifference === 0
    ? copy.sameAmount
    : recipientDifference > 0
      ? translate(copy.lessAmount, { amount: formatRecipientAmount(recipientDifference, receiveCurrency, locale) })
      : translate(copy.moreAmount, { amount: formatRecipientAmount(Math.abs(recipientDifference), receiveCurrency, locale) });

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
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">{copy.profile}</p>
          <h3 ref={headingRef} id="provider-details-heading" tabIndex={-1} className="mt-2 text-3xl font-bold text-slate-900 outline-none">{provider.providerName}</h3>
          {provider.badge && <div className="mt-3"><ProviderBadge provider={provider} /></div>}
        </div>
        <button type="button" onClick={onClose} className="shrink-0 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">{copy.close}</button>
      </div>

      <div className="mt-7 rounded-2xl bg-slate-50 p-5">
        <h4 className="font-semibold text-slate-900">{copy.overview}</h4>
        {profile ? <><p className="mt-2 text-sm leading-6 text-slate-600">{localizedProfile.description}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{localizedProfile.serviceSummary}</p></> : <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.common.illustrativeUnavailable}</p>}
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-bold text-slate-900">{copy.currentOffer}</h4>
        <dl className="mt-4 grid gap-5 sm:grid-cols-2">
          <div><dt className="text-sm text-slate-500">{dictionary.marketplace.title}</dt><dd className="mt-1 text-lg font-semibold text-slate-900">{getCountryLabel(fromCountry, locale)} → {getCountryLabel(toCountry, locale)}</dd></div>
          <div><dt className="text-sm text-slate-500">{copy.amountSent}</dt><dd className="mt-1 text-lg font-semibold text-slate-900">{sendAmount.toLocaleString(locale, { maximumFractionDigits: 2 })} {sendCurrency}</dd></div>
          <div><dt className="text-sm text-slate-500">{dictionary.comparison.fee}</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{formatCurrency(provider.fee, sendCurrency, 2, locale)}</dd></div>
          <div><dt className="text-sm text-slate-500">{copy.exchangeRate}</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{formatExchangeRate(provider.exchangeRate, sendCurrency, receiveCurrency, locale)}</dd></div>
          <div><dt className="text-sm text-slate-500">{copy.deliveryEstimate}</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{provider.deliveryLabel}</dd></div>
          <div><dt className="text-sm text-slate-500">{dictionary.comparison.payoutMethod}</dt><dd className="mt-1 text-xl font-semibold text-slate-900">{getPayoutMethodLabel(provider.payoutMethod, locale)}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm text-slate-500">{copy.recipientReceives}</dt><dd className="mt-1 text-2xl font-bold text-emerald-600">{formatRecipientAmount(provider.recipientAmount, receiveCurrency, locale)}</dd><p className="mt-1 text-xs text-slate-500">{translate(copy.displayedIn, { currency: receiveCurrency })}</p></div>
        </dl>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 p-5">
        <h4 className="text-lg font-bold text-slate-900">{copy.capabilities}</h4>
        {profile ? <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <ProfileList title={copy.payoutMethods} items={profile.supportedPayoutMethods} fallback={dictionary.common.illustrativeUnavailable} />
          <ProfileList title={copy.digitalAccess} items={profile.digitalAccess} fallback={dictionary.common.illustrativeUnavailable} />
          <ProfileList title={copy.supportChannels} items={profile.supportChannels} fallback={dictionary.common.illustrativeUnavailable} />
          <div className="sm:col-span-3"><p className="text-sm font-semibold text-slate-900">{copy.availabilityNote}</p><p className="mt-1 text-sm leading-6 text-slate-600">{profile.availabilityNote}</p></div>
        </div> : <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.common.illustrativeUnavailable}</p>}
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <h4 className="text-lg font-bold text-slate-900">{copy.comparison}</h4>
        <p className="mt-1 text-xs leading-5 text-slate-600">{copy.rankingNote}</p>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">{copy.position}</dt><dd className="mt-1 font-semibold text-slate-900">{translate(copy.positionOf, { position: provider.rankPosition, count: visibleResultCount })}</dd></div>
          <div><dt className="text-slate-500">{copy.feePercentage}</dt><dd className="mt-1 font-semibold text-slate-900">{provider.feePercentage.toLocaleString(locale, { maximumFractionDigits: 2 })}% {copy.ofSendAmount}</dd></div>
          <div><dt className="text-slate-500">{copy.recipientDifference}</dt><dd className="mt-1 font-semibold text-slate-900">{comparisonDifference}</dd></div>
          <div><dt className="text-slate-500">{copy.deliveryPayout}</dt><dd className="mt-1 font-semibold text-slate-900">{provider.deliveryLabel}; {getPayoutMethodLabel(provider.payoutMethod, locale)}</dd></div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-slate-600">{provider.badge ? `The “${provider.badge}” badge is calculated from the current visible fictional results.` : "No comparison badge is assigned to this option in the current visible results."}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h4 className="font-semibold text-slate-900">{copy.importantNotice}</h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">{copy.notice}</p>
      </div>
    </section>
  );
}

function ProfileList({ title, items, fallback }: { title: string; items: readonly string[]; fallback: string }) {
  return <div><p className="text-sm font-semibold text-slate-900">{title}</p>{items.length > 0 ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mt-2 text-sm text-slate-500">{fallback}</p>}</div>;
}
