import Link from "next/link";
import { getCorridorPayoutMethods } from "@/lib/services/marketplaceService";
import type { Corridor } from "@/lib/types/transfer";

export default function CorridorCard({ corridor }: { corridor: Corridor }) {
  const payoutMethods = getCorridorPayoutMethods(corridor);
  const compareHref = `/?corridor=${encodeURIComponent(corridor.id)}#compare`;
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-wrap gap-2">
        {corridor.featured && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">Featured</span>}
        {corridor.recentlyAdded && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Recently added</span>}
      </div>
      <h3 className="mt-4 flex min-w-0 items-center gap-2 text-lg font-bold text-slate-950"><span>{corridor.fromCountry}</span><span className="shrink-0 text-blue-500" aria-hidden="true">→</span><span>{corridor.toCountry}</span></h3>
      <p className="mt-2 text-sm font-semibold text-slate-500">{corridor.sendCurrency} → {corridor.receiveCurrency}</p>
      <dl className="mt-5 grid gap-4 text-sm">
        <div><dt className="text-slate-500">Fictional provider offers</dt><dd className="mt-1 font-semibold text-slate-900">{corridor.offers.length}</dd></div>
        <div><dt className="text-slate-500">Illustrative payout methods</dt><dd className="mt-2 flex flex-wrap gap-2">{payoutMethods.map((method) => <span key={method} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{method}</span>)}</dd></div>
      </dl>
      <Link href={compareHref} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700" aria-label={`Compare fictional illustrative options for ${corridor.fromCountry} to ${corridor.toCountry}`}>Compare this corridor</Link>
    </article>
  );
}
