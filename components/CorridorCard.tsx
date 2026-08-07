import Link from "next/link";
import { getCorridorPayoutMethods } from "@/lib/services/marketplaceService";
import type { Locale } from "@/lib/i18n/config";
import { getCountryLabel, getPayoutMethodLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/types";
import type { Corridor, CorridorId } from "@/lib/types/transfer";

type CorridorCardProps = {
  locale: Locale;
  dictionary: Dictionary;
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

export default function CorridorCard({ locale, dictionary, corridor, workspace }: CorridorCardProps) {
  const payoutMethods = getCorridorPayoutMethods(corridor);
  const compareHref = `/${locale}?corridor=${encodeURIComponent(corridor.id)}#compare`;
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-wrap gap-2">
        {corridor.featured && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{dictionary.navigation.features}</span>}
        {corridor.recentlyAdded && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{dictionary.marketplace.recentlyAdded}</span>}
      </div>
      <h3 className="mt-4 flex min-w-0 items-center gap-2 text-lg font-bold text-slate-950"><span>{getCountryLabel(corridor.fromCountry, locale)}</span><span className="shrink-0 text-blue-500" aria-hidden="true">→</span><span>{getCountryLabel(corridor.toCountry, locale)}</span></h3>
      <p className="mt-2 text-sm font-semibold text-slate-500">{corridor.sendCurrency} → {corridor.receiveCurrency}</p>
      <dl className="mt-5 grid gap-4 text-sm">
        <div><dt className="text-slate-500">{dictionary.marketplace.providerOffers}</dt><dd className="mt-1 font-semibold text-slate-900">{corridor.offers.length}</dd></div>
        <div><dt className="text-slate-500">{dictionary.marketplace.payoutMethods}</dt><dd className="mt-2 flex flex-wrap gap-2">{payoutMethods.map((method) => <span key={method} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{getPayoutMethodLabel(method, locale)}</span>)}</dd></div>
      </dl>
      {workspace && <div className="mt-5 border-t border-slate-100 pt-4">
        {workspace.isHydrated ? <>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={workspace.isFavorite} onClick={() => workspace.onToggleFavorite(corridor.id)} aria-label={`${workspace.isFavorite ? dictionary.workspace.removeFavorite : dictionary.workspace.addFavorite}: ${getCountryLabel(corridor.fromCountry, locale)} → ${getCountryLabel(corridor.toCountry, locale)}`} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition ${workspace.isFavorite ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>{workspace.isFavorite ? dictionary.workspace.favorited : dictionary.workspace.addFavorite}</button>
            <button type="button" aria-pressed={workspace.isPinned} disabled={!workspace.isFavorite} onClick={() => workspace.onTogglePin(corridor.id)} aria-label={`${workspace.isPinned ? dictionary.workspace.unpin : dictionary.workspace.pin}: ${getCountryLabel(corridor.fromCountry, locale)} → ${getCountryLabel(corridor.toCountry, locale)}`} title={workspace.isFavorite ? (workspace.isPinned ? dictionary.workspace.unpin : dictionary.workspace.pin) : dictionary.workspace.favoriteFirst} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-bold transition ${workspace.isPinned ? "border-blue-300 bg-blue-50 text-blue-800" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"}`}>{workspace.isPinned ? dictionary.workspace.pinnedButton : dictionary.workspace.pin}</button>
          </div>
          {!workspace.isFavorite && <p className="mt-2 text-xs leading-5 text-slate-500">{dictionary.workspace.favoriteFirst}</p>}
        </> : <p className="text-xs text-slate-500">{dictionary.workspace.loadingState}</p>}
      </div>}
      <Link href={compareHref} onClick={() => workspace?.onCompare(corridor.id)} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700" aria-label={`${dictionary.marketplace.compare}: ${getCountryLabel(corridor.fromCountry, locale)} → ${getCountryLabel(corridor.toCountry, locale)}`}>{dictionary.marketplace.compare}</Link>
    </article>
  );
}
