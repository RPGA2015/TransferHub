import Link from "next/link";
import { getCorridorPayoutMethods } from "@/lib/services/marketplaceService";
import type { Corridor, CorridorId } from "@/lib/types/transfer";

type CorridorCardProps = {
  corridor: Corridor;
  workspace?: {
    isHydrated: boolean;
    isFavorite: boolean;
    isPinned: boolean;
    onToggleFavorite: (corridorId: CorridorId) => void;
    onTogglePin: (corridorId: CorridorId) => void;
    onCompare: (corridorId: CorridorId) => void;
  };
};

export default function CorridorCard({ corridor, workspace }: CorridorCardProps) {
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
      {workspace && <div className="mt-5 border-t border-slate-100 pt-4">
        {workspace.isHydrated ? <>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={workspace.isFavorite} onClick={() => workspace.onToggleFavorite(corridor.id)} aria-label={`${workspace.isFavorite ? "Remove" : "Add"} ${corridor.fromCountry} to ${corridor.toCountry} ${workspace.isFavorite ? "from" : "to"} favorites`} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition ${workspace.isFavorite ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>{workspace.isFavorite ? "Favorited" : "Add favorite"}</button>
            <button type="button" aria-pressed={workspace.isPinned} disabled={!workspace.isFavorite} onClick={() => workspace.onTogglePin(corridor.id)} aria-label={`${workspace.isPinned ? "Unpin" : "Pin"} ${corridor.fromCountry} to ${corridor.toCountry} corridor`} title={workspace.isFavorite ? (workspace.isPinned ? "Unpin corridor" : "Pin corridor") : "Add this corridor to favorites before pinning."} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition ${workspace.isPinned ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"}`}>{workspace.isPinned ? "Pinned" : "Pin corridor"}</button>
          </div>
          {!workspace.isFavorite && <p className="mt-2 text-xs leading-5 text-slate-500">Add this corridor to favorites before pinning.</p>}
        </> : <p className="text-xs text-slate-500">Loading saved state…</p>}
      </div>}
      <Link href={compareHref} onClick={() => workspace?.onCompare(corridor.id)} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700" aria-label={`Compare fictional illustrative options for ${corridor.fromCountry} to ${corridor.toCountry}`}>Compare this corridor</Link>
    </article>
  );
}
