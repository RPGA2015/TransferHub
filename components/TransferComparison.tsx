"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ComparisonControls from "@/components/ComparisonControls";
import ProviderBadge from "@/components/ProviderBadge";
import ProviderDetails from "@/components/ProviderDetails";
import { countryCurrencies } from "@/lib/data/countries";
import type { Locale } from "@/lib/i18n/config";
import { translate } from "@/lib/i18n/dictionaries";
import { getCountryLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/types";
import { compareTransfers, getAvailableReceivingCountries, getAvailableSendingCountries, isCorridorAvailable } from "@/lib/services/comparisonEngine";
import { recordRecentCorridorInStorage } from "@/lib/storage/marketplaceWorkspace";
import type { ComparisonRequest, CorridorId, Country, Corridor, PayoutFilter, ProviderResult, SortOption } from "@/lib/types/transfer";
import { formatCurrency, formatExchangeRate, formatRecipientAmount, getCurrencyDisplayPrefix } from "@/lib/utils/currency";

type Comparison = Pick<ComparisonRequest, "fromCountry" | "toCountry" | "amount">;
const quickAmounts = [100, 250, 500, 1000];
const detailsPanelId = "provider-details-panel";
const sendingCountries = getAvailableSendingCountries();

type InitialCorridor = Pick<Corridor, "fromCountry" | "toCountry">;

export default function TransferComparison({ locale, dictionary, initialCorridor = { fromCountry: "United States", toCountry: "Haiti" }, initialCorridorId }: { locale: Locale; dictionary: Dictionary; initialCorridor?: InitialCorridor; initialCorridorId?: CorridorId }) {
  const copy = dictionary.comparison;
  const [fromCountry, setFromCountry] = useState<Country>(initialCorridor.fromCountry);
  const [toCountry, setToCountry] = useState<Country>(initialCorridor.toCountry);
  const [amountInput, setAmountInput] = useState("200");
  const [comparison, setComparison] = useState<Comparison>({ ...initialCorridor, amount: 200 });
  const [sortBy, setSortBy] = useState<SortOption>("best");
  const [payoutFilter, setPayoutFilter] = useState<PayoutFilter>("all");
  const [amountError, setAmountError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [detailsStatus, setDetailsStatus] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<ProviderResult | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [detailButtons] = useState(() => new Map<ProviderResult["providerId"], HTMLButtonElement>());
  const initialRecentRecorded = useRef(false);

  useEffect(() => {
    if (!initialCorridorId || initialRecentRecorded.current) return;
    initialRecentRecorded.current = true;
    recordRecentCorridorInStorage(initialCorridorId);
  }, [initialCorridorId]);

  const selectedCurrency = countryCurrencies[fromCountry];
  const receivingCountries = getAvailableReceivingCountries(fromCountry);
  const reverseCorridorAvailable = isCorridorAvailable(toCountry, fromCountry);
  const comparisonResult = useMemo(() => compareTransfers({ ...comparison, sortBy, payoutFilter }), [comparison, payoutFilter, sortBy]);
  const { corridor, providers: visibleProviders, visibleResultCount } = comparisonResult;
  const currentSelectedProvider = selectedProvider
    ? visibleProviders.find((provider) => provider.providerId === selectedProvider.providerId) ?? null
    : null;

  const closeDetails = useCallback((returnFocus = true) => {
    const providerId = selectedProvider?.providerId;
    setSelectedProvider(null);
    setDetailsStatus(copy.detailsClosed);
    if (returnFocus && providerId) window.requestAnimationFrame(() => detailButtons.get(providerId)?.focus());
  }, [copy.detailsClosed, detailButtons, selectedProvider]);

  function handleFilterChange(value: PayoutFilter) {
    setPayoutFilter(value);
    if (selectedProvider && value !== "all" && selectedProvider.payoutMethod !== value) {
      setSelectedProvider(null);
      setDetailsStatus(translate(copy.filteredDetailsClosed, { provider: selectedProvider.providerName }));
    }
  }

  function handleFromCountryChange(nextFromCountry: Country) {
    const availableDestinations = getAvailableReceivingCountries(nextFromCountry);
    setFromCountry(nextFromCountry);
    if (!availableDestinations.includes(toCountry)) setToCountry(availableDestinations[0]);
    setAmountError("");
  }

  function handleSwapCountries() {
    if (!reverseCorridorAvailable) return;
    setFromCountry(toCountry);
    setToCountry(fromCountry);
    setAmountError("");
  }

  async function handleCompare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = amountInput.trim();
    const amount = Number(trimmed);
    let error = "";
    if (!trimmed) error = copy.enterAmount;
    else if (!/^\d+(\.\d{1,2})?$/.test(trimmed) || !Number.isFinite(amount)) error = copy.invalidAmount;
    else if (amount < 10) error = translate(copy.minimumAmount, { currency: selectedCurrency });
    else if (amount > 10000) error = translate(copy.maximumAmount, { currency: selectedCurrency });
    if (error) {
      setAmountError(error);
      setStatus(copy.notUpdated);
      amountRef.current?.focus();
      return;
    }
    setAmountError("");
    setSelectedProvider(null);
    setDetailsStatus("");
    setIsLoading(true);
    setStatus(copy.comparingStatus);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setComparison({ fromCountry, toCountry, amount });
    setIsLoading(false);
    setStatus(translate(copy.readyStatus, { amount: formatCurrency(amount, selectedCurrency, 2, locale), from: getCountryLabel(fromCountry, locale), to: getCountryLabel(toCountry, locale) }));
  }

  return (
    <div id="compare" className="relative mx-auto w-full max-w-2xl scroll-mt-24">
      <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-2xl" aria-hidden="true" />
      <div className="relative mb-4 rounded-3xl border border-white/15 bg-white p-5 shadow-2xl shadow-slate-950/25 sm:p-6">
        <div className="mb-5"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">{copy.findOptions}</p><h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">{copy.compareTransfer}</h2></div>
        <form onSubmit={handleCompare} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="from-country" className="block text-xs font-bold text-slate-700">{copy.fromCountry}</label><select id="from-country" value={fromCountry} onChange={(event) => handleFromCountryChange(event.target.value as Country)} className="comparison-control mt-2">{sendingCountries.map((country) => <option key={country} value={country}>{getCountryLabel(country, locale)}</option>)}</select></div>
            <div><label htmlFor="to-country" className="block text-xs font-bold text-slate-700">{copy.toCountry}</label><select id="to-country" value={toCountry} onChange={(event) => setToCountry(event.target.value as Country)} className="comparison-control mt-2">{receivingCountries.map((country) => <option key={country} value={country}>{getCountryLabel(country, locale)}</option>)}</select></div>
          </div>
          <div className="mt-3 text-center">
            <button type="button" onClick={handleSwapCountries} disabled={!reverseCorridorAvailable} aria-label={translate(copy.swapLabel, { from: getCountryLabel(fromCountry, locale), to: getCountryLabel(toCountry, locale) })} title={reverseCorridorAvailable ? copy.swapTitle : copy.reverseUnavailable} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-slate-50 disabled:hover:text-slate-700">{copy.swapCountries}</button>
            {!reverseCorridorAvailable && <p className="mt-1 text-xs text-slate-500">{copy.reverseUnavailable}</p>}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="transfer-amount" className="block text-xs font-bold text-slate-700">{copy.amountToSend} <span className="text-slate-400">({selectedCurrency})</span></label><div className="relative mt-2"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs font-bold text-slate-500" aria-hidden="true">{getCurrencyDisplayPrefix(selectedCurrency)}</span><input ref={amountRef} id="transfer-amount" type="text" inputMode="decimal" required value={amountInput} onChange={(event) => { setAmountInput(event.target.value); setAmountError(""); }} aria-invalid={Boolean(amountError)} aria-describedby={amountError ? "transfer-amount-error" : "transfer-amount-help"} className="comparison-control comparison-amount-code" /></div><p id="transfer-amount-help" className="sr-only">{translate(copy.amountHelp, { currency: selectedCurrency })}</p>{amountError && <p id="transfer-amount-error" className="mt-2 text-xs font-semibold text-red-700">{amountError}</p>}</div>
            <button type="submit" disabled={isLoading} className="min-h-12 self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{isLoading ? copy.comparing : copy.compareOptions}</button>
          </div>
          <fieldset className="mt-4"><legend className="text-xs font-bold text-slate-600">{translate(copy.quickAmounts, { currency: selectedCurrency })}</legend><div className="mt-2 flex flex-wrap gap-2">{quickAmounts.map((amount) => <button key={amount} type="button" onClick={() => { setAmountInput(String(amount)); setAmountError(""); }} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{amount.toLocaleString(locale)} {selectedCurrency}</button>)}</div></fieldset>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</p>
        </form>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-slate-950/30">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-500"/>{copy.preview}</div><h2 className="mt-2 text-lg font-bold text-slate-900">{getCountryLabel(comparison.fromCountry, locale)} <span className="mx-1 text-slate-300">→</span> {getCountryLabel(comparison.toCountry, locale)}</h2></div><div className="rounded-xl bg-slate-50 px-4 py-2.5 text-left sm:text-right"><p className="text-xs text-slate-500">{copy.youSend}</p><p className="text-xl font-bold text-slate-950">{corridor ? formatCurrency(comparison.amount, corridor.sendCurrency, 2, locale) : comparison.amount} <span className="text-xs font-semibold text-slate-400">{corridor?.sendCurrency}</span></p></div></div>
        <div className="border-b border-amber-100 bg-amber-50 px-5 py-2.5 text-center text-[11px] font-bold leading-5 text-amber-900">{copy.sampleBanner}</div>
        {isLoading ? <LoadingState dictionary={dictionary} /> : corridor ? <Results locale={locale} dictionary={dictionary} corridor={corridor} providers={visibleProviders} visibleResultCount={visibleResultCount} sortBy={sortBy} payoutFilter={payoutFilter} onSortChange={setSortBy} onFilterChange={handleFilterChange} onSelect={(provider) => { setSelectedProvider(provider); setDetailsStatus(translate(copy.detailsOpened, { provider: provider.providerName })); }} selectedProvider={selectedProvider} buttonRefs={detailButtons} /> : <EmptyState dictionary={dictionary} />}
        {corridor && currentSelectedProvider && <ProviderDetails locale={locale} dictionary={dictionary} provider={currentSelectedProvider} fromCountry={comparison.fromCountry} toCountry={comparison.toCountry} sendAmount={comparison.amount} sendCurrency={corridor.sendCurrency} receiveCurrency={corridor.receiveCurrency} visibleResultCount={visibleResultCount} firstVisibleRecipientAmount={visibleProviders[0]?.recipientAmount ?? currentSelectedProvider.recipientAmount} onClose={closeDetails} />}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{detailsStatus}</p>
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs leading-5 text-slate-600 sm:px-6"><div className="flex items-center justify-between gap-4"><span>{dictionary.common.sampleScenario}</span><span className="font-semibold text-blue-700">{dictionary.common.fictionalProviders}</span></div><p className="mt-3 border-t border-slate-200 pt-3">{dictionary.common.actualValuesMayDiffer}</p></div>
      </div>
    </div>
  );
}

type ResultsProps = { locale: Locale; dictionary: Dictionary; corridor: Corridor; providers: readonly ProviderResult[]; visibleResultCount: number; sortBy: SortOption; payoutFilter: PayoutFilter; onSortChange: (value: SortOption) => void; onFilterChange: (value: PayoutFilter) => void; onSelect: (provider: ProviderResult) => void; selectedProvider: ProviderResult | null; buttonRefs: Map<ProviderResult["providerId"], HTMLButtonElement> };

function Results({ locale, dictionary, corridor, providers, visibleResultCount, sortBy, payoutFilter, onSortChange, onFilterChange, onSelect, selectedProvider, buttonRefs }: ResultsProps) {
  const copy = dictionary.comparison;
  const recipientAmounts = providers.map((provider) => provider.recipientAmount);
  const summary = visibleResultCount > 0
    ? `${visibleResultCount === 1 ? copy.resultSingle : translate(copy.resultPlural, { count: visibleResultCount })} ${translate(copy.rangeFrom, { minimum: formatRecipientAmount(Math.min(...recipientAmounts), corridor.receiveCurrency, locale), maximum: formatRecipientAmount(Math.max(...recipientAmounts), corridor.receiveCurrency, locale) })}`
    : copy.zeroResults;
  return <><div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
<p className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold leading-5 text-slate-600" aria-live="polite">{summary}</p>
    <ComparisonControls dictionary={dictionary} sortBy={sortBy} payoutFilter={payoutFilter} onSortChange={onSortChange} onFilterChange={onFilterChange} /></div>{providers.length === 0 ? <FilterEmptyState dictionary={dictionary} onClear={() => onFilterChange("all")} /> : <><div className="hidden grid-cols-[1.15fr_.55fr_.8fr_.75fr_.8fr_.9fr_auto] gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-600 sm:grid"><span>{copy.provider}</span><span>{copy.fee}</span><span>{copy.rate}</span><span>{copy.delivery}</span><span>{copy.payout}</span><span className="text-right">{copy.recipientGets}</span><span className="sr-only">{copy.actions}</span></div><div className="grid gap-3 bg-slate-50/60 p-3 sm:block sm:divide-y sm:divide-slate-100 sm:bg-white sm:p-0">{providers.map((provider) => { const isSelected = selectedProvider?.providerId === provider.providerId; return <article key={provider.providerId} className={`grid gap-4 rounded-2xl border p-4 transition sm:grid-cols-[1.15fr_.55fr_.8fr_.75fr_.8fr_.9fr_auto] sm:items-center sm:rounded-none sm:border-x-0 sm:border-b-0 sm:px-5 sm:py-4 ${isSelected ? "border-blue-300 bg-blue-50 shadow-sm sm:border-l-4 sm:border-l-blue-600" : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm sm:border-transparent sm:hover:bg-slate-50"}`}><div className="flex min-w-0 items-center gap-3"><span className={`provider-dot provider-dot-${provider.accent}`} aria-hidden="true">{provider.initials}</span><span className="min-w-0"><strong className="block text-sm text-slate-900">{provider.providerName}</strong><span className="mt-0.5 hidden text-[10px] leading-4 text-slate-500 sm:block">{provider.serviceSummary ?? dictionary.common.illustrativeUnavailable}</span><ProviderBadge provider={provider} /></span></div><ProviderStat label={copy.fee} value={formatCurrency(provider.fee, corridor.sendCurrency, 2, locale)} /><ProviderStat label={copy.rate} value={formatExchangeRate(provider.exchangeRate, corridor.sendCurrency, corridor.receiveCurrency, locale)} /><ProviderStat label={copy.delivery} value={provider.deliveryLabel} /><ProviderStat label={copy.payout} value={dictionary.payoutMethods[provider.payoutMethod]} /><div className="sm:text-right"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-600 sm:hidden">{copy.recipientGets}</span><strong className="text-sm text-slate-950">{formatRecipientAmount(provider.recipientAmount, corridor.receiveCurrency, locale)}</strong></div><button ref={(element) => { if (element) buttonRefs.set(provider.providerId, element); else buttonRefs.delete(provider.providerId); }} type="button" onClick={() => onSelect(provider)} aria-label={`${copy.viewDetails}: ${provider.providerName}`} aria-expanded={isSelected} data-selected={isSelected} aria-controls={detailsPanelId} className="w-full min-h-11 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 transition sm:w-auto hover:border-blue-400 hover:bg-blue-50 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-50 data-[selected=true]:text-blue-800">{isSelected ? copy.detailsOpen : copy.viewDetails}</button></article>; })}</div></>}</>;
}

function ProviderStat({ label, value }: { label: string; value: string }) { return <div><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">{label}</span><span className="text-xs font-semibold leading-5 text-slate-700">{value}</span></div>; }
function FilterEmptyState({ dictionary, onClear }: { dictionary: Dictionary; onClear: () => void }) { return <div className="grid min-h-64 place-items-center p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600" aria-hidden="true">⌁</span><h3 className="mt-4 font-bold text-slate-900">{dictionary.comparison.noFilterResults}</h3><button type="button" onClick={onClear} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">{dictionary.comparison.clearFilter}</button></div></div>; }
function LoadingState({ dictionary }: { dictionary: Dictionary }) { return <div className="grid min-h-64 place-items-center p-8" role="status"><div className="text-center"><span className="loading-spinner mx-auto block h-8 w-8 rounded-full border-2 border-blue-100 border-t-blue-600" aria-hidden="true"/><p className="mt-4 text-sm font-bold text-slate-700">{dictionary.comparison.loading}</p></div></div>; }
function EmptyState({ dictionary }: { dictionary: Dictionary }) { return <div className="grid min-h-64 place-items-center p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500" aria-hidden="true">—</span><h3 className="mt-4 font-bold text-slate-900">{dictionary.comparison.unavailable}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{dictionary.comparison.unavailableMessage}</p></div></div>; }
