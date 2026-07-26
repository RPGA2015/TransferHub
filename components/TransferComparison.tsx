"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import {
  Country,
  countryCurrencies,
  getIllustrativeCorridor,
  ProviderResult,
  receivingCountries,
  sendingCountries,
} from "@/lib/illustrativeComparisonData";

type SortOption = "best" | "fee" | "recipient" | "fastest";
type Comparison = { fromCountry: Country; toCountry: Country; amount: number };

const quickAmounts = [100, 250, 500, 1000];

function formatMoney(value: number, currency: string, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits }).format(value);
}

function recipientAmount(amount: number, provider: ProviderResult) {
  return Math.max(amount - provider.fee, 0) * provider.exchangeRate;
}

export default function TransferComparison() {
  const [fromCountry, setFromCountry] = useState<Country>("United States");
  const [toCountry, setToCountry] = useState<Country>("Haiti");
  const [amountInput, setAmountInput] = useState("200");
  const [comparison, setComparison] = useState<Comparison>({ fromCountry: "United States", toCountry: "Haiti", amount: 200 });
  const [sortBy, setSortBy] = useState<SortOption>("best");
  const [amountError, setAmountError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);

  const corridor = getIllustrativeCorridor(comparison.fromCountry, comparison.toCountry);
  const selectedCurrency = countryCurrencies[fromCountry];

  const sortedProviders = useMemo(() => {
    if (!corridor) return [];
    const providers = [...corridor.providers];
    return providers.sort((a, b) => {
      if (sortBy === "fee") return a.fee - b.fee;
      if (sortBy === "recipient") return recipientAmount(comparison.amount, b) - recipientAmount(comparison.amount, a);
      if (sortBy === "fastest") return a.deliveryRank - b.deliveryRank;
      return Number(b.badge === "Best Value") - Number(a.badge === "Best Value") || recipientAmount(comparison.amount, b) - recipientAmount(comparison.amount, a);
    });
  }, [comparison.amount, corridor, sortBy]);

  async function handleCompare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = amountInput.trim();
    const amount = Number(trimmed);
    let error = "";

    if (!trimmed) error = "Enter an amount to send.";
    else if (!/^\d+(\.\d{1,2})?$/.test(trimmed) || !Number.isFinite(amount)) error = "Enter a valid amount with no more than two decimal places.";
    else if (amount < 10) error = `Enter at least 10 ${selectedCurrency}.`;
    else if (amount > 10000) error = `Enter no more than 10,000 ${selectedCurrency}.`;

    if (error) {
      setAmountError(error);
      setStatus("Comparison not updated. Correct the amount and try again.");
      amountRef.current?.focus();
      return;
    }

    setAmountError("");
    setIsLoading(true);
    setStatus("Comparing illustrative transfer options.");
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setComparison({ fromCountry, toCountry, amount });
    setIsLoading(false);
    setStatus(`Illustrative comparison ready for ${formatMoney(amount, selectedCurrency)} from ${fromCountry} to ${toCountry}.`);
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-2xl" aria-hidden="true" />
      <div className="relative mb-4 rounded-3xl border border-white/15 bg-white p-5 shadow-2xl shadow-slate-950/25 sm:p-6">
        <div className="mb-5"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">Find your options</p><h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Compare a transfer</h2></div>
        <form onSubmit={handleCompare} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="from-country" className="block text-xs font-bold text-slate-700">From Country</label><select id="from-country" value={fromCountry} onChange={(event) => { setFromCountry(event.target.value as Country); setAmountError(""); }} className="comparison-control mt-2">{sendingCountries.map((country) => <option key={country}>{country}</option>)}</select></div>
            <div><label htmlFor="to-country" className="block text-xs font-bold text-slate-700">To Country</label><select id="to-country" value={toCountry} onChange={(event) => setToCountry(event.target.value as Country)} className="comparison-control mt-2">{receivingCountries.map((country) => <option key={country}>{country}</option>)}</select></div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="transfer-amount" className="block text-xs font-bold text-slate-700">Amount to Send <span className="text-slate-400">({selectedCurrency})</span></label><div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs font-bold text-slate-500" aria-hidden="true">{selectedCurrency}</span><input ref={amountRef} id="transfer-amount" type="text" inputMode="decimal" required value={amountInput} onChange={(event) => { setAmountInput(event.target.value); setAmountError(""); }} aria-invalid={Boolean(amountError)} aria-describedby={amountError ? "transfer-amount-error" : "transfer-amount-help"} className="comparison-control comparison-amount-code" /></div><p id="transfer-amount-help" className="sr-only">Enter between 10 and 10,000 {selectedCurrency}, with up to two decimal places.</p>{amountError && <p id="transfer-amount-error" className="mt-2 text-xs font-semibold text-red-700">{amountError}</p>}</div>
            <button type="submit" disabled={isLoading} className="min-h-12 self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{isLoading ? "Comparing…" : "Compare Transfer Options"}</button>
          </div>
          <fieldset className="mt-4"><legend className="text-xs font-bold text-slate-600">Quick amounts in {selectedCurrency}</legend><div className="mt-2 flex flex-wrap gap-2">{quickAmounts.map((amount) => <button key={amount} type="button" onClick={() => { setAmountInput(String(amount)); setAmountError(""); }} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{amount.toLocaleString()} {selectedCurrency}</button>)}</div></fieldset>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</p>
        </form>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-slate-950/30">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-500"/>Comparison preview</div><h2 className="mt-2 text-lg font-bold text-slate-900">{comparison.fromCountry} <span className="mx-1 text-slate-300">→</span> {comparison.toCountry}</h2></div><div className="rounded-xl bg-slate-50 px-4 py-2.5 text-left sm:text-right"><p className="text-xs text-slate-500">You send</p><p className="text-xl font-bold text-slate-950">{corridor ? formatMoney(comparison.amount, corridor.sendingCurrency) : comparison.amount} <span className="text-xs font-semibold text-slate-400">{corridor?.sendingCurrency}</span></p></div></div>
        <div className="border-b border-amber-100 bg-amber-50 px-5 py-2.5 text-center text-[11px] font-bold leading-5 text-amber-900">ILLUSTRATIVE SAMPLE DATA — NOT LIVE QUOTES</div>
        {isLoading ? <LoadingState /> : corridor ? <Results corridor={corridor} providers={sortedProviders} amount={comparison.amount} sortBy={sortBy} setSortBy={setSortBy} /> : <EmptyState />}
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs leading-5 text-slate-600 sm:px-6"><div className="flex items-center justify-between gap-4"><span>Sample scenario.</span><span className="font-semibold text-blue-700">Fictional providers and values</span></div><p className="mt-3 border-t border-slate-200 pt-3">Actual fees, rates, availability, payout methods, and delivery times may differ. TransferHub does not currently initiate transfers.</p></div>
      </div>
    </div>
  );
}

function Results({ corridor, providers, amount, sortBy, setSortBy }: { corridor: NonNullable<ReturnType<typeof getIllustrativeCorridor>>; providers: ProviderResult[]; amount: number; sortBy: SortOption; setSortBy: (value: SortOption) => void }) {
  return <><div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 sm:px-6"><p className="text-xs font-semibold text-slate-500">4 illustrative options</p><label htmlFor="sort-results" className="flex items-center gap-2 text-xs font-bold text-slate-700">Sort by<select id="sort-results" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold outline-none focus:border-blue-600"><option value="best">Best value</option><option value="fee">Lowest fee</option><option value="recipient">Recipient gets most</option><option value="fastest">Fastest delivery</option></select></label></div><div className="hidden grid-cols-[1.2fr_.6fr_.85fr_.85fr_.9fr_1fr] gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:grid"><span>Provider</span><span>Fee</span><span>Rate</span><span>Delivery</span><span>Payout</span><span className="text-right">Recipient gets</span></div><div className="divide-y divide-slate-100">{providers.map((provider) => <div key={provider.providerName} className="grid gap-4 p-5 sm:grid-cols-[1.2fr_.6fr_.85fr_.85fr_.9fr_1fr] sm:items-center sm:px-5 sm:py-4"><div className="flex items-center gap-3"><span className={`provider-dot provider-dot-${provider.accent}`}>{provider.providerName.at(-1)}</span><span><strong className="block text-sm text-slate-900">{provider.providerName}</strong><span className={`badge badge-${provider.accent}`}>{provider.badge}</span></span></div><Data label="Fee" value={formatMoney(provider.fee, corridor.sendingCurrency)}/><Data label="Rate" value={`1 ${corridor.sendingCurrency} = ${provider.exchangeRate.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${corridor.receivingCurrency}`}/><Data label="Delivery" value={provider.estimatedDelivery}/><Data label="Payout" value={provider.payoutMethod}/><div className="sm:text-right"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">Recipient gets</span><strong className="text-sm text-slate-950">{formatMoney(recipientAmount(amount, provider), corridor.receivingCurrency, 2)}</strong></div></div>)}</div></>;
}

function Data({ label, value }: { label: string; value: string }) { return <div><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">{label}</span><span className="text-xs font-semibold leading-5 text-slate-700">{value}</span></div>; }
function LoadingState() { return <div className="grid min-h-64 place-items-center p-8" role="status"><div className="text-center"><span className="loading-spinner mx-auto block h-8 w-8 rounded-full border-2 border-blue-100 border-t-blue-600" aria-hidden="true"/><p className="mt-4 text-sm font-bold text-slate-700">Building your sample comparison…</p></div></div>; }
function EmptyState() { return <div className="grid min-h-64 place-items-center p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500" aria-hidden="true">—</span><h3 className="mt-4 font-bold text-slate-900">Illustrative comparison unavailable</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">This sample corridor does not have illustrative data yet. Choose another route and try again.</p></div></div>; }
