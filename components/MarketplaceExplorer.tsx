"use client";

import { useMemo, useState } from "react";
import CorridorCard from "@/components/CorridorCard";
import { useMarketplaceWorkspace } from "@/hooks/useMarketplaceWorkspace";
import type { Locale } from "@/lib/i18n/config";
import { translate } from "@/lib/i18n/dictionaries";
import { getCountryLabel, getRegionLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/types";
import { filterCorridorsByRegion, getCorridorsByIds, getFeaturedCorridors, getMarketplaceCorridors, getMarketplaceRegions, getRecentlyAddedCorridors, searchCorridors } from "@/lib/services/marketplaceService";
import type { Corridor, CorridorId, Region } from "@/lib/types/transfer";

const corridors = getMarketplaceCorridors();
const regions = getMarketplaceRegions(corridors);

export default function MarketplaceExplorer({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
 const [sortBy, setSortBy] = useState<"default" | "from" | "to" | "pinned" | "recent" | "favorites" | "newest">("default");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [workspaceStatus, setWorkspaceStatus] = useState("");
  const workspace = useMarketplaceWorkspace();
  const visibleCorridors = useMemo(() => {
  const filteredByRegion = filterCorridorsByRegion(
  searchCorridors(corridors, query, locale),
  region,
);

const filtered = favoritesOnly
  ? filteredByRegion.filter((corridor) => workspace.isFavorite(corridor.id))
  : filteredByRegion;

  if (sortBy === "pinned") {
  return [...filtered].sort((a, b) => {
    const aPinned = workspace.isPinned(a.id) ? 1 : 0;
    const bPinned = workspace.isPinned(b.id) ? 1 : 0;
    return bPinned - aPinned;
  });
}
if (sortBy === "favorites") {
  return [...filtered].sort((a, b) => {
    const aFavorite = workspace.isFavorite(a.id) ? 1 : 0;
    const bFavorite = workspace.isFavorite(b.id) ? 1 : 0;
    return bFavorite - aFavorite;
  });
}
if (sortBy === "newest") {
  return [...filtered].sort((a, b) => {
    const aNewest = a.recentlyAdded ? 1 : 0;
    const bNewest = b.recentlyAdded ? 1 : 0;
    return bNewest - aNewest;
  });
}
if (sortBy === "recent") {
  const recentIndex = new Map(
    workspace.recentCorridorIds.map((id, index) => [id, index]),
  );

  return [...filtered].sort((a, b) => {
    const aIndex = recentIndex.get(a.id);
    const bIndex = recentIndex.get(b.id);

    if (aIndex === undefined && bIndex === undefined) return 0;
    if (aIndex === undefined) return 1;
    if (bIndex === undefined) return -1;

    return aIndex - bIndex;
  });
}
if (sortBy === "from") {
    return [...filtered].sort((a, b) =>
      getCountryLabel(a.fromCountry, locale).localeCompare(
        getCountryLabel(b.fromCountry, locale),
      ),
    );
  }

  if (sortBy === "to") {
    return [...filtered].sort((a, b) =>
      getCountryLabel(a.toCountry, locale).localeCompare(
        getCountryLabel(b.toCountry, locale),
      ),
    );
  }

  return filtered;
}, [locale, query, region, sortBy, favoritesOnly, workspace]);
  const featuredCorridors = getFeaturedCorridors(corridors);
  const recentlyAddedCorridors = getRecentlyAddedCorridors(corridors);
  const favoriteIds = new Set(workspace.favoriteCorridorIds);
  const pinnedIds = new Set(workspace.pinnedCorridorIds);
  const pinnedCorridors = getCorridorsByIds(workspace.pinnedCorridorIds, corridors);
  const favoriteCorridors = getCorridorsByIds(workspace.favoriteCorridorIds.filter((id) => !pinnedIds.has(id)), corridors);
  const recentCorridors = getCorridorsByIds(workspace.recentCorridorIds, corridors);

  function clearFilters() {
    setQuery("");
    setRegion("all");
    setSortBy("default");
  setFavoritesOnly(false);
  }
  function toggleFavorite(corridor: Corridor) {
    const removing = workspace.isFavorite(corridor.id);
    const wasPinned = workspace.isPinned(corridor.id);
    workspace.toggleFavorite(corridor.id);
    setWorkspaceStatus(removing
      ? translate(dictionary.workspace.removedStatus, { corridor: `${getCountryLabel(corridor.fromCountry, locale)} → ${getCountryLabel(corridor.toCountry, locale)}`, unpinned: wasPinned ? ` ${dictionary.workspace.unpin}` : "" })
      : translate(dictionary.workspace.addedStatus, { corridor: `${getCountryLabel(corridor.fromCountry, locale)} → ${getCountryLabel(corridor.toCountry, locale)}` }));
  }

  function togglePin(corridor: Corridor) {
    const removing = workspace.isPinned(corridor.id);
    workspace.togglePin(corridor.id);
    setWorkspaceStatus(translate(removing ? dictionary.workspace.unpinnedStatus : dictionary.workspace.pinnedStatus, { corridor: `${getCountryLabel(corridor.fromCountry, locale)} → ${getCountryLabel(corridor.toCountry, locale)}` }));
  }

  function recordRecent(corridorId: CorridorId) {
    workspace.recordRecent(corridorId);
  }

  function workspaceProps(corridor: Corridor) {
    return {
      isHydrated: workspace.isHydrated,
      isFavorite: favoriteIds.has(corridor.id),
      isPinned: pinnedIds.has(corridor.id),
      onToggleFavorite: (corridorId: CorridorId) => {
        if (corridorId === corridor.id) toggleFavorite(corridor);
      },
      onTogglePin: (corridorId: CorridorId) => {
        if (corridorId === corridor.id) togglePin(corridor);
      },
      onCompare: recordRecent,
    };
  }

  function renderCards(items: readonly Corridor[], gridClass: string) {
    return <div className={gridClass}>{items.map((corridor) => <CorridorCard key={corridor.id} locale={locale} dictionary={dictionary} corridor={corridor} workspace={workspaceProps(corridor)} />)}</div>;
  }

  return (
    <>
      <section aria-labelledby="workspace-heading" className="rounded-3xl border border-blue-100 bg-blue-50/50 p-5 sm:p-7">
        <h2 id="workspace-heading" className="text-2xl font-bold text-slate-950">{dictionary.workspace.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{dictionary.workspace.disclosure}</p>
        {!workspace.isHydrated ? <p className="mt-5 text-sm text-slate-500">{dictionary.workspace.loading}</p> : <>
          {workspace.favoriteCorridorIds.length === 0 && <p className="mt-5 rounded-xl bg-white px-4 py-3 text-sm text-slate-600">{dictionary.workspace.empty}</p>}
          {pinnedCorridors.length > 0 && <div className="mt-7"><h3 className="text-lg font-bold text-slate-950">{dictionary.workspace.pinned}</h3><p className="mt-1 text-xs text-slate-500">{dictionary.workspace.pinnedDescription}</p>{renderCards(pinnedCorridors, "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3")}</div>}
          {favoriteCorridors.length > 0 && <div className="mt-7"><h3 className="text-lg font-bold text-slate-950">{dictionary.workspace.favorites}</h3><p className="mt-1 text-xs text-slate-500">{dictionary.workspace.favoritesDescription}</p>{renderCards(favoriteCorridors, "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3")}</div>}
          {recentCorridors.length > 0 && <div className="mt-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-bold text-slate-950">{dictionary.workspace.recents}</h3><p className="mt-1 text-xs text-slate-500">{dictionary.workspace.recentsDescription}</p></div><button type="button" onClick={() => { workspace.clearRecents(); setWorkspaceStatus(dictionary.workspace.recentCleared); }} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">{dictionary.workspace.clearRecents}</button></div>{renderCards(recentCorridors, "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3")}</div>}
        </>}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{workspaceStatus}</p>
      </section>

      <section aria-labelledby="featured-corridors-heading" className="mt-12">
        <h2 id="featured-corridors-heading" className="text-2xl font-bold text-slate-950">{dictionary.marketplace.featured}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.marketplace.featuredDescription}</p>
        {renderCards(featuredCorridors, "mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3")}
      </section>

      <section aria-labelledby="recent-corridors-heading" className="mt-14">
        <h2 id="recent-corridors-heading" className="text-2xl font-bold text-slate-950">{dictionary.marketplace.recentlyAdded}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{dictionary.marketplace.recentDescription}</p>
        {renderCards(recentlyAddedCorridors, "mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4")}
      </section>

      <section aria-labelledby="browse-corridors-heading" className="mt-16 border-t border-slate-200 pt-12">
  <div className="max-w-2xl">
  <h2 id="browse-corridors-heading" className="text-2xl font-bold text-slate-950">
    {dictionary.marketplace.browseAll}{" "}
    <span className="text-lg font-semibold text-slate-500">
      ({visibleCorridors.length})
    </span>
  </h2>
</div>
        <form role="search" className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-end" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="corridor-search" className="grid gap-2 text-sm font-bold text-slate-700">{dictionary.marketplace.search}
            <input id="corridor-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={dictionary.marketplace.searchPlaceholder} className="comparison-control" />
          </label>
          {query && <button type="button" onClick={() => setQuery("")} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">{dictionary.marketplace.clearSearch}</button>}
        </form>

<div className="mt-5 flex justify-end">
  <label htmlFor="corridor-sort" className="grid gap-2 text-sm font-bold text-slate-700">{dictionary.marketplace.sortLabel}
  <select
    id="corridor-sort"
    value={sortBy}
    onChange={(event) =>
  setSortBy(event.target.value as "default" | "from" | "to" | "pinned" | "recent" | "favorites" | "newest")
  }
    className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
  >
    <option value="default">{dictionary.marketplace.sortDefault}</option>
    <option value="from">{dictionary.marketplace.sortFrom}</option>
    <option value="to">{dictionary.marketplace.sortTo}</option>
<option value="pinned">{dictionary.marketplace.sortPinned}</option>
<option value="favorites">{dictionary.marketplace.sortFavorites}</option>
<option value="newest">{dictionary.marketplace.sortNewest}</option>
<option value="recent">{dictionary.marketplace.sortRecent}</option>
  </select>
</label>
</div>
     <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-700">
  <input
    type="checkbox"
    checked={favoritesOnly}
    onChange={(event) => setFavoritesOnly(event.target.checked)}
    className="h-4 w-4 rounded border-slate-300"
  />
  {dictionary.marketplace.favoritesOnly}
</label>   
        <fieldset className="mt-5"><legend className="text-sm font-bold text-slate-700">{dictionary.marketplace.browseRegion}</legend><div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setRegion("all")} aria-pressed={region === "all"} className={`min-h-11 rounded-xl px-4 py-2 text-sm font-bold transition ${region === "all" ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>{dictionary.marketplace.allRegions}</button>
          {regions.map((item) => <button key={item} type="button" onClick={() => setRegion(item)} aria-pressed={region === item} className={`min-h-11 rounded-xl px-4 py-2 text-sm font-bold transition ${region === item ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>{getRegionLabel(item, locale)}</button>)}
        </div></fieldset>
        <p className="mt-6 text-sm font-semibold text-slate-600" role="status" aria-live="polite" aria-atomic="true">{visibleCorridors.length === 1 ? dictionary.marketplace.resultSingle : translate(dictionary.marketplace.resultPlural, { count: visibleCorridors.length })}</p>
        {visibleCorridors.length > 0
          ? renderCards(visibleCorridors, "mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3")
          : <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center"><h3 className="font-bold text-slate-950">{dictionary.marketplace.empty}</h3><button type="button" onClick={clearFilters} className="mt-5 min-h-11 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">{dictionary.marketplace.clearFilters}</button></div>}
      </section>
    </>
  );
}
