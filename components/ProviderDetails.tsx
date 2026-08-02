"use client";

import { useEffect, useRef } from "react";
import ProviderBadge from "@/components/ProviderBadge";
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

export default function ProviderDetails({
  provider,
  fromCountry,
  toCountry,
  sendAmount,
  sendCurrency,
  receiveCurrency,
  visibleResultCount,
  firstVisibleRecipientAmount,
  onClose,
}: ProviderDetailsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const recipientDifference = firstVisibleRecipientAmount - provider.recipientAmount;
  const comparisonDifference = recipientDifference === 0
    ? "The same recipient amount as the first visible option."
    : recipientDifference > 0
      ? `${formatRecipientAmount(recipientDifference, receiveCurrency)} less than the first visible option.`
      : `${formatRecipientAmount(Math.abs(recipientDifference), receiveCurrency)} more than the first visible option.`;

  useEffect(() => {
    headingRef.current?.focus();
  }, [provider.providerName]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <section
      id="provider-details-panel"
      className="details-panel border-t border-blue-100 bg-white p-5 shadow-inner sm:p-8"
      aria-labelledby="provider-details-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Provider details
          </p>

          <h3
            ref={headingRef}
            id="provider-details-heading"
            tabIndex={-1}
            className="mt-2 text-3xl font-bold text-slate-900 outline-none"
          >
            {provider.providerName}
          </h3>

          <div className="mt-3"><ProviderBadge provider={provider} /></div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Close details
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Transfer corridor</p>
          <p className="text-lg font-semibold text-slate-900">
            {fromCountry} → {toCountry}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Amount sent</p>
          <p className="text-lg font-semibold text-slate-900">
            {sendAmount.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            {sendCurrency}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Transfer fee</p>
          <p className="text-xl font-semibold text-slate-900">
            {formatCurrency(provider.fee, sendCurrency)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Illustrative exchange rate
          </p>
          <p className="text-xl font-semibold text-slate-900">
            {formatExchangeRate(provider.exchangeRate, sendCurrency, receiveCurrency)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Delivery estimate</p>
          <p className="text-xl font-semibold text-slate-900">
            {provider.deliveryLabel}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Payout method</p>
          <p className="text-xl font-semibold text-slate-900">
            {provider.payoutMethod}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-sm text-slate-500">Recipient receives</p>
          <p className="text-2xl font-bold text-emerald-600">
            {formatRecipientAmount(provider.recipientAmount, receiveCurrency)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Displayed in {receiveCurrency}.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
        <h4 className="font-semibold text-slate-900">How this option compares</h4>
        <p className="mt-1 text-xs leading-5 text-slate-600">Current visible illustrative results only; position is not a recommendation.</p>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Position</dt><dd className="mt-1 font-semibold text-slate-900">{visibleResultCount === 1 ? "1 of 1 visible illustrative options." : `${provider.rankPosition} of ${visibleResultCount} visible illustrative options.`}</dd></div>
          <div><dt className="text-slate-500">Fee percentage</dt><dd className="mt-1 font-semibold text-slate-900">{provider.feePercentage.toLocaleString("en-US", { maximumFractionDigits: 2 })}% of the send amount</dd></div>
          <div><dt className="text-slate-500">Recipient amount difference</dt><dd className="mt-1 font-semibold text-slate-900">{comparisonDifference}</dd></div>
          <div><dt className="text-slate-500">Delivery and payout</dt><dd className="mt-1 font-semibold text-slate-900">{provider.deliveryLabel}; {provider.payoutMethod}</dd></div>
        </dl>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5">
          <h4 className="font-semibold text-slate-900">Fee breakdown</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The illustrative provider fee is deducted from the send amount
            before the sample exchange rate is applied.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <h4 className="font-semibold text-slate-900">
            Exchange-rate explanation
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This sample rate is fictional and is included only to demonstrate
            how comparisons may work.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <h4 className="font-semibold text-slate-900">
            Delivery and payout
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The sample result shows {provider.deliveryLabel.toLowerCase()}{" "}
            delivery using {provider.payoutMethod.toLowerCase()}.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <h4 className="font-semibold text-slate-900">
            Why this result appears here
          </h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The “{provider.badge}” label is descriptive metadata for this
            fictional scenario. It does not control the calculated result order.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h4 className="font-semibold text-slate-900">
          Important disclosure
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          These results are illustrative sample data—not live quotes.
          TransferHub does not currently initiate transfers, and no provider
          partnership or endorsement is claimed.
        </p>
      </div>
    </section>
  );
}
