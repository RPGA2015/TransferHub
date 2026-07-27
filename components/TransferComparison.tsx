"use client";

import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import ComparisonControls, { type PayoutFilter, type SortOption } from "@/components/ComparisonControls";
import ProviderBadge from "@/components/ProviderBadge";
import ProviderDetails from "@/components/ProviderDetails";
import {
  Country,
  countryCurrencies,
  getIllustrativeCorridor,
  ProviderResult,
  receivingCountries,
  sendingCountries,
} from "@/lib/illustrativeComparisonData";

type Comparison = { fromCountry: Country; toCountry: Country; amount: number };
const quickAmounts = [100, 250, 500, 1000];
const detailsPanelId = "provider-details-panel";

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
  const [payoutFilter, setPayoutFilter] = useState<PayoutFilter>("all");
  const [amountError, setAmountError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [detailsStatus, setDetailsStatus] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<ProviderResult | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [detailButtons] = useState(() => new Map<ProviderResult["providerName"], HTMLButtonElement>());

  const corridor = getIllustrativeCorridor(comparison.fromCountry, comparison.toCountry);
  const selectedCurrency = countryCurrencies[fromCountry];
  const visibleProviders = useMemo(() => {
    if (!corridor) return [];
    const providers = corridor.providers.filter((provider) => payoutFilter === "all" || provider.payoutMethod === payoutFilter);
    return [...providers].sort((a, b) => {
      if (sortBy === "fee") return a.fee - b.fee;
      if (sortBy === "fastest") return a.deliveryRank - b.deliveryRank;
      return recipientAmount(comparison.amount, b) - recipientAmount(comparison.amount, a);
    });
  }, [comparison.amount, corridor, payoutFilter, sortBy]);

  const closeDetails = useCallback((returnFocus = true) => {
    const providerName = selectedProvider?.providerName;
    setSelectedProvider(null);
    setDetailsStatus("Provider details closed.");
    if (returnFocus && providerName) window.requestAnimationFrame(() => detailButtons.get(providerName)?.focus());
  }, [detailButtons, selectedProvider]);

  function handleFilterChange(value: PayoutFilter) {
    setPayoutFilter(value);
    if (selectedProvider && value !== "all" && selectedProvider.payoutMethod !== value) {
      setSelectedProvider(null);
      setDetailsStatus(`${selectedProvider.providerName} details closed because that provider does not match the selected payout filter.`);
    }
  }

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
    setSelectedProvider(null);
    setDetailsStatus("");
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
        {isLoading ? <LoadingState /> : corridor ? <Results corridor={corridor} providers={visibleProviders} amount={comparison.amount} sortBy={sortBy} payoutFilter={payoutFilter} onSortChange={setSortBy} onFilterChange={handleFilterChange} onSelect={(provider) => { setSelectedProvider(provider); setDetailsStatus(`${provider.providerName} details opened.`); }} selectedProvider={selectedProvider} buttonRefs={detailButtons} /> : <EmptyState />}
        {corridor && selectedProvider && <ProviderDetails provider={selectedProvider} fromCountry={comparison.fromCountry} toCountry={comparison.toCountry} sendAmount={comparison.amount} sendCurrency={corridor.sendingCurrency} receiveCurrency={corridor.receivingCurrency} formattedFee={formatMoney(selectedProvider.fee, corridor.sendingCurrency)} formattedRate={`1 ${corridor.sendingCurrency} = ${selectedProvider.exchangeRate.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${corridor.receivingCurrency}`} formattedRecipientAmount={formatMoney(recipientAmount(comparison.amount, selectedProvider), corridor.receivingCurrency)} onClose={closeDetails} />}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{detailsStatus}</p>
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs leading-5 text-slate-600 sm:px-6"><div className="flex items-center justify-between gap-4"><span>Sample scenario.</span><span className="font-semibold text-blue-700">Fictional providers and values</span></div><p className="mt-3 border-t border-slate-200 pt-3">Actual fees, rates, availability, payout methods, and delivery times may differ. TransferHub does not currently initiate transfers.</p></div>
      </div>
    </div>
  );
}

type ResultsProps = { corridor: NonNullable<ReturnType<typeof getIllustrativeCorridor>>; providers: ProviderResult[]; amount: number; sortBy: SortOption; payoutFilter: PayoutFilter; onSortChange: (value: SortOption) => void; onFilterChange: (value: PayoutFilter) => void; onSelect: (provider: ProviderResult) => void; selectedProvider: ProviderResult | null; buttonRefs: Map<ProviderResult["providerName"], HTMLButtonElement> };

function Results({ corridor, providers, amount, sortBy, payoutFilter, onSortChange, onFilterChange, onSelect, selectedProvider, buttonRefs }: ResultsProps) {
  return <><div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6"><p className="text-xs font-semibold text-slate-500" aria-live="polite">{providers.length} illustrative {providers.length === 1 ? "option" : "options"}</p><ComparisonControls sortBy={sortBy} payoutFilter={payoutFilter} onSortChange={onSortChange} onFilterChange={onFilterChange} /></div>{providers.length === 0 ? <FilterEmptyState onClear={() => onFilterChange("all")} /> : <><div className="hidden grid-cols-[1.15fr_.55fr_.8fr_.75fr_.8fr_.9fr_auto] gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:grid"><span>Provider</span><span>Fee</span><span>Rate</span><span>Delivery</span><span>Payout</span><span className="text-right">Recipient gets</span><span className="sr-only">Actions</span></div><div className="grid gap-3 bg-slate-50/60 p-3 sm:block sm:divide-y sm:divide-slate-100 sm:bg-white sm:p-0">{providers.map((provider) => { const isSelected = selectedProvider?.providerName === provider.providerName; return <article key={provider.providerName} className={`grid gap-4 rounded-2xl border p-4 transition sm:grid-cols-[1.15fr_.55fr_.8fr_.75fr_.8fr_.9fr_auto] sm:items-center sm:rounded-none sm:border-x-0 sm:border-b-0 sm:px-5 sm:py-4 ${isSelected ? "border-blue-300 bg-blue-50 shadow-sm sm:border-l-4 sm:border-l-blue-600" : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm sm:border-transparent sm:hover:bg-slate-50"}`} aria-label={`${provider.providerName}, fictional illustrative result${isSelected ? ", details open" : ""}`}><div className="flex items-center gap-3"><span className={`provider-dot provider-dot-${provider.accent}`} aria-hidden="true">{provider.providerName.at(-1)}</span><span><strong className="block text-sm text-slate-900">{provider.providerName}</strong><ProviderBadge provider={provider} /></span></div><ProviderStat label="Fee" value={formatMoney(provider.fee, corridor.sendingCurrency)} /><ProviderStat label="Rate" value={`1 ${corridor.sendingCurrency} = ${provider.exchangeRate.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${corridor.receivingCurrency}`} /><ProviderStat label="Delivery" value={provider.deliveryLabel} /><ProviderStat label="Payout" value={provider.payoutMethod} /><div className="sm:text-right"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">Recipient gets</span><strong className="text-sm text-slate-950">{formatMoney(recipientAmount(amount, provider), corridor.receivingCurrency)}</strong></div><button ref={(element) => { if (element) buttonRefs.set(provider.providerName, element); else buttonRefs.delete(provider.providerName); }} type="button" onClick={() => onSelect(provider)} aria-label={`View details for fictional provider ${provider.providerName}`} aria-expanded={isSelected} aria-controls={detailsPanelId} className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-50">{isSelected ? "Details open" : "View details"}</button></article>; })}</div></>}</>;
}

function ProviderStat({ label, value }: { label: string; value: string }) { return <div><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">{label}</span><span className="text-xs font-semibold leading-5 text-slate-700">{value}</span></div>; }
function FilterEmptyState({ onClear }: { onClear: () => void }) { return <div className="grid min-h-64 place-items-center p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600" aria-hidden="true">⌁</span><h3 className="mt-4 font-bold text-slate-900">No illustrative options match this payout filter.</h3><button type="button" onClick={onClear} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">Clear filter</button></div></div>; }
function LoadingState() { return <div className="grid min-h-64 place-items-center p-8" role="status"><div className="text-center"><span className="loading-spinner mx-auto block h-8 w-8 rounded-full border-2 border-blue-100 border-t-blue-600" aria-hidden="true"/><p className="mt-4 text-sm font-bold text-slate-700">Building your sample comparison…</p></div></div>; }
function EmptyState() { return <div className="grid min-h-64 place-items-center p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500" aria-hidden="true">—</span><h3 className="mt-4 font-bold text-slate-900">Illustrative comparison unavailable</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">This sample corridor does not have illustrative data yet. Choose another route and try again.</p></div></div>; }
