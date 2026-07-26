"use client";

import { FormEvent, useState } from "react";

const providers = [
  { name: "Provider A", badge: "Best Value", fee: "$2.99", rate: "132.40 HTG", delivery: "Minutes", receives: "26,085 HTG", accent: "emerald" },
  { name: "Provider B", badge: "Lowest Fee", fee: "$0.00", rate: "130.10 HTG", delivery: "1–2 days", receives: "26,020 HTG", accent: "blue" },
  { name: "Provider C", badge: "Fastest", fee: "$4.99", rate: "131.25 HTG", delivery: "Minutes", receives: "25,595 HTG", accent: "amber" },
  { name: "Provider D", badge: "Wallet Delivery", fee: "$3.50", rate: "130.80 HTG", delivery: "Same day", receives: "25,703 HTG", accent: "violet" },
];

const countries = ["United States", "Canada", "France", "Dominican Republic", "Haiti"];

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function TransferComparison() {
  const [fromCountry, setFromCountry] = useState("United States");
  const [toCountry, setToCountry] = useState("Haiti");
  const [amountInput, setAmountInput] = useState("200");
  const [comparison, setComparison] = useState({
    fromCountry: "United States",
    toCountry: "Haiti",
    amount: 200,
  });
  const [amountError, setAmountError] = useState("");

  function handleCompare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(amountInput.trim());

    if (!Number.isFinite(amount) || amount <= 0) {
      setAmountError("Enter an amount greater than zero.");
      return;
    }

    setAmountError("");
    setComparison({ fromCountry, toCountry, amount });
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-5 rounded-[2rem] bg-blue-500/10 blur-2xl" aria-hidden="true" />
      <div className="relative mb-4 rounded-3xl border border-white/15 bg-white p-5 shadow-2xl shadow-slate-950/25 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-600">Find your options</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">Compare a transfer</h2>
        </div>
        <form onSubmit={handleCompare} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="from-country" className="block text-xs font-bold text-slate-700">From Country</label>
              <select id="from-country" value={fromCountry} onChange={(event) => setFromCountry(event.target.value)} className="comparison-control mt-2">
                {countries.map((country) => <option key={country}>{country}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="to-country" className="block text-xs font-bold text-slate-700">To Country</label>
              <select id="to-country" value={toCountry} onChange={(event) => setToCountry(event.target.value)} className="comparison-control mt-2">
                {countries.map((country) => <option key={country}>{country}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="transfer-amount" className="block text-xs font-bold text-slate-700">Amount to Send</label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-bold text-slate-500" aria-hidden="true">$</span>
                <input id="transfer-amount" type="number" inputMode="decimal" min="0.01" step="0.01" value={amountInput} onChange={(event) => setAmountInput(event.target.value)} aria-invalid={Boolean(amountError)} aria-describedby={amountError ? "transfer-amount-error" : undefined} className="comparison-control comparison-amount" />
              </div>
              {amountError && <p id="transfer-amount-error" className="mt-2 text-xs font-semibold text-red-700">{amountError}</p>}
            </div>
            <button type="submit" className="min-h-12 self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">Compare Transfer Options</button>
          </div>
        </form>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-slate-950/30" aria-live="polite">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400"><span className="h-2 w-2 rounded-full bg-emerald-500"/>Comparison preview</div><h2 className="mt-2 text-lg font-bold text-slate-900">{comparison.fromCountry} <span className="mx-1 text-slate-300">→</span> {comparison.toCountry}</h2></div><div className="rounded-xl bg-slate-50 px-4 py-2.5 text-left sm:text-right"><p className="text-xs text-slate-500">You send</p><p className="text-xl font-bold text-slate-950">{formatAmount(comparison.amount)} <span className="text-xs font-semibold text-slate-400">USD</span></p></div></div>
        <div className="border-b border-amber-100 bg-amber-50 px-5 py-2.5 text-center text-[11px] font-semibold leading-5 text-amber-800">ILLUSTRATIVE DATA ONLY · NOT LIVE QUOTES OR PROVIDER ENDORSEMENTS</div>
        <div className="hidden grid-cols-[1.3fr_.65fr_.9fr_.8fr_1fr] gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:grid"><span>Provider</span><span>Fee</span><span>Rate</span><span>Delivery</span><span className="text-right">Recipient gets</span></div>
        <div className="divide-y divide-slate-100">{providers.map((provider) => <div key={provider.name} className="grid gap-4 p-5 sm:grid-cols-[1.3fr_.65fr_.9fr_.8fr_1fr] sm:items-center sm:px-6 sm:py-4"><div className="flex items-center gap-3"><span className={`provider-dot provider-dot-${provider.accent}`}>{provider.name.at(-1)}</span><span><strong className="block text-sm text-slate-900">{provider.name}</strong><span className={`badge badge-${provider.accent}`}>{provider.badge}</span></span></div><Data label="Fee" value={provider.fee}/><Data label="Rate" value={provider.rate}/><Data label="Delivery" value={provider.delivery}/><div className="sm:text-right"><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">Recipient gets</span><strong className="text-sm text-slate-950">{provider.receives}</strong></div></div>)}</div>
        <div className="flex items-center justify-between bg-slate-50 px-5 py-4 text-xs text-slate-500 sm:px-6"><span>Sample results for product preview</span><span className="font-semibold text-blue-600">Updated: illustrative</span></div>
      </div>
    </div>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return <div><span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:hidden">{label}</span><span className="text-sm font-semibold text-slate-700">{value}</span></div>;
}
