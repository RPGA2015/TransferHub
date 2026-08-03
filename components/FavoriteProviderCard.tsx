import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getPayoutMethodLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/types";
import { getLocalizedProviderContent } from "@/lib/i18n/providerContent";
import type { ProviderProfile } from "@/lib/types/transfer";

export default function FavoriteProviderCard({ locale, dictionary, provider, showRemove, onRemove }: { locale: Locale; dictionary: Dictionary; provider: ProviderProfile; showRemove: boolean; onRemove?: () => void }) {
  const content = getLocalizedProviderContent(provider.id, locale);
  return <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3"><span className={`provider-dot provider-dot-${provider.accent}`} aria-hidden="true">{provider.initials}</span><h3 className="text-lg font-bold text-slate-950">{provider.name}</h3></div>
    <p className="mt-4 text-sm leading-6 text-slate-600">{content.description}</p><p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{content.serviceSummary}</p>
    <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="font-semibold text-slate-900">{dictionary.workspaceCenter.payoutCapabilities}</dt><dd className="mt-2 flex flex-wrap gap-2">{provider.supportedPayoutMethods.map((method) => <span key={method} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{getPayoutMethodLabel(method, locale)}</span>)}</dd></div><div><dt className="font-semibold text-slate-900">{dictionary.workspaceCenter.digitalAccess}</dt><dd className="mt-2 text-slate-600">{provider.digitalAccess.join(", ")}</dd></div></dl>
    <div className="mt-auto flex flex-wrap gap-2 border-t border-slate-100 pt-5"><Link href={`/${locale}/marketplace`} className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">{dictionary.workspaceCenter.viewCorridors}</Link>{showRemove && <button type="button" onClick={onRemove} aria-label={`${dictionary.workspaceCenter.removeProviderFavorite}: ${provider.name}`} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">{dictionary.workspaceCenter.removeProviderFavorite}</button>}</div>
  </article>;
}
