"use client";

import Link from "next/link";
import { useState } from "react";
import CorridorCard from "@/components/CorridorCard";
import FavoriteProviderCard from "@/components/FavoriteProviderCard";
import { useMarketplaceWorkspace } from "@/hooks/useMarketplaceWorkspace";
import { fictionalProviderProfiles } from "@/lib/data/providers";
import type { Locale } from "@/lib/i18n/config";
import { translate } from "@/lib/i18n/dictionaries";
import { getCountryLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/types";
import { getCorridorsByIds } from "@/lib/services/marketplaceService";
import type { Corridor, CorridorId, ProviderId } from "@/lib/types/transfer";

export default function WorkspaceDashboard({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const copy = dictionary.workspaceCenter;
  const workspace = useMarketplaceWorkspace();
  const [status, setStatus] = useState("");
  const pinnedIds = new Set(workspace.pinnedCorridorIds);
  const pinned = getCorridorsByIds(workspace.pinnedCorridorIds);
  const favorites = getCorridorsByIds(workspace.favoriteCorridorIds.filter((id) => !pinnedIds.has(id)));
  const recentCorridors = getCorridorsByIds(workspace.recentCorridorIds);
  const providersById = new Map(fictionalProviderProfiles.map((provider) => [provider.id, provider]));
  const favoriteProviders = workspace.favoriteProviderIds.flatMap((id) => providersById.get(id) ?? []);
  const recentProviders = workspace.recentProviderIds.flatMap((id) => providersById.get(id) ?? []);
  const recentCount = recentCorridors.length + recentProviders.length;
  const isEmpty = pinned.length + favorites.length + favoriteProviders.length + recentCount === 0;
  const countLabel = (count: number, one: string, many: string) => count === 1 ? one : translate(many, { count });
  const corridorName = (corridor: Corridor) => `${getCountryLabel(corridor.fromCountry, locale)} → ${getCountryLabel(corridor.toCountry, locale)}`;

  function cardWorkspace(corridor: Corridor) { return { isHydrated: true, isFavorite: workspace.isFavorite(corridor.id), isPinned: workspace.isPinned(corridor.id), onToggleFavorite: () => { const removing = workspace.isFavorite(corridor.id); workspace.toggleFavorite(corridor.id); if (removing) setStatus(translate(copy.corridorRemovedStatus, { corridor: corridorName(corridor) })); }, onTogglePin: () => { const unpinning = workspace.isPinned(corridor.id); workspace.togglePin(corridor.id); if (unpinning) setStatus(translate(copy.corridorUnpinnedStatus, { corridor: corridorName(corridor) })); }, onCompare: (id: CorridorId) => workspace.recordRecent(id) }; }
  function removeProvider(id: ProviderId) { const provider = providersById.get(id); workspace.toggleProviderFavorite(id); if (provider) setStatus(translate(copy.providerRemovedStatus, { provider: provider.name })); }
  const cards = (items: Corridor[]) => <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((corridor) => <CorridorCard key={corridor.id} locale={locale} dictionary={dictionary} corridor={corridor} workspace={cardWorkspace(corridor)} />)}</div>;

  if (!workspace.isHydrated) return <p className="py-20 text-center text-slate-600" role="status">{copy.loading}</p>;
  return <>
    <section aria-labelledby="workspace-summary-heading"><h2 id="workspace-summary-heading" className="sr-only">{copy.localSummary}</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[
      countLabel(pinned.length, copy.pinnedCountOne, copy.pinnedCountMany), countLabel(workspace.favoriteCorridorIds.length, copy.corridorFavoriteCountOne, copy.corridorFavoriteCountMany), countLabel(favoriteProviders.length, copy.providerFavoriteCountOne, copy.providerFavoriteCountMany), countLabel(recentCount, copy.recentCountOne, copy.recentCountMany),
    ].map((label) => <p key={label} className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-center text-sm font-bold text-blue-950">{label}</p>)}</div></section>
    {isEmpty && <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center"><h2 className="text-2xl font-bold">{copy.empty}</h2><p className="mx-auto mt-3 max-w-xl text-slate-600">{copy.emptyDescription}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href={`/${locale}/marketplace`} className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white">{copy.exploreMarketplace}</Link><Link href={`/${locale}#compare`} className="rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-700">{copy.compareOptions}</Link></div></section>}
    {pinned.length > 0 && <WorkspaceSection title={copy.pinned}>{cards(pinned)}</WorkspaceSection>}
    {favorites.length > 0 && <WorkspaceSection title={copy.favoriteCorridors}>{cards(favorites)}</WorkspaceSection>}
    {favoriteProviders.length > 0 && <WorkspaceSection title={copy.favoriteProviders}><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{favoriteProviders.map((provider) => <FavoriteProviderCard key={provider.id} locale={locale} dictionary={dictionary} provider={provider} showRemove onRemove={() => removeProvider(provider.id)} />)}</div></WorkspaceSection>}
    {recentCorridors.length > 0 && <WorkspaceSection title={copy.recentCorridors} action={<button type="button" onClick={() => { workspace.clearRecents(); setStatus(copy.recentCorridorsCleared); }} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700">{copy.clearRecentCorridors}</button>}>{cards(recentCorridors)}</WorkspaceSection>}
    {recentProviders.length > 0 && <WorkspaceSection title={copy.recentProviders} action={<button type="button" onClick={() => { workspace.clearRecentProviders(); setStatus(copy.recentProvidersCleared); }} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700">{copy.clearRecentProviders}</button>}><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{recentProviders.map((provider) => <FavoriteProviderCard key={provider.id} locale={locale} dictionary={dictionary} provider={provider} showRemove={workspace.isProviderFavorite(provider.id)} onRemove={() => removeProvider(provider.id)} />)}</div></WorkspaceSection>}
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{status}</p>
  </>;
}

function WorkspaceSection({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) { return <section className="mt-12 border-t border-slate-200 pt-10" aria-labelledby={`workspace-${title.replace(/\s+/g, "-").toLowerCase()}`}><div className="flex flex-wrap items-center justify-between gap-3"><h2 id={`workspace-${title.replace(/\s+/g, "-").toLowerCase()}`} className="text-2xl font-bold text-slate-950">{title}</h2>{action}</div>{children}</section>; }
