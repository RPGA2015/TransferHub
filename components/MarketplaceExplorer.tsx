"use client";

import { useMemo, useState } from "react";
import CorridorCard from "@/components/CorridorCard";
import { useMarketplaceWorkspace } from "@/hooks/useMarketplaceWorkspace";
import { filterCorridorsByRegion, getCorridorsByIds, getFeaturedCorridors, getMarketplaceCorridors, getMarketplaceRegions, getRecentlyAddedCorridors, searchCorridors } from "@/lib/services/marketplaceService";
import type { Corridor, CorridorId, Region } from "@/lib/types/transfer";

const corridors = getMarketplaceCorridors();
const regions = getMarketplaceRegions(corridors);

export default function MarketplaceExplorer() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [workspaceStatus, setWorkspaceStatus] = useState("");
  const workspace = useMarketplaceWorkspace();
  const visibleCorridors = useMemo(() => filterCorridorsByRegion(searchCorridors(corridors, query), region), [query, region]);
  const featuredCorridors = getFeaturedCorridors(corridors);
  const recentlyAddedCorridors = getRecentlyAddedCorridors(corridors);
  const pinnedCorridors = getCorridorsByIds(workspace.pinnedCorridorIds, corridors);
  const pinnedIds = new Set(workspace.pinnedCorridorIds);
  const favoriteCorridors = getCorridorsByIds(workspace.favoriteCorridorIds.filter((id) => !pinnedIds.has(id)), corridors);
  const recentCorridors = getCorridorsByIds(workspace.recentCorridorIds, corridors);

  function clearFilters() {
    setQuery("");
    setRegion("all");
  }

  function toggleFavorite(corridor: Corridor) {
    const removing = workspace.isFavorite(corridor.id);
    const wasPinned = workspace.isPinned(corridor.id);
    workspace.toggleFavorite(corridor.id);
    setWorkspaceStatus(removing
      ? `${corridor.fromCountry} to ${corridor.toCountry} removed from favorites${wasPinned ? " and unpinned" : ""}.`
      : `${corridor.fromCountry} to ${corridor.toCountry} added to favorites.`);
  }

  function togglePin(corridor: Corridor) {
    const removing = workspace.isPinned(corridor.id);
    workspace.togglePin(corridor.id);
    setWorkspaceStatus(`${corridor.fromCountry} to ${corridor.toCountry} ${removing ? "unpinned" : "pinned"}.`);
  }

  function recordRecent(corridorId: CorridorId) {
    workspace.recordRecent(corridorId);
  }

  function workspaceProps(corridor: Corridor) {
    return {
      isHydrated: workspace.isHydrated,
      isFavorite: workspace.isFavorite(corridor.id),
      isPinned: workspace.isPinned(corridor.id),
      onToggleFavorite: () => toggleFavorite(corridor),
      onTogglePin: () => togglePin(corridor),
      onCompare: recordRecent,
    };
  }

  function renderCards(items: readonly Corridor[], gridClass: string) {
    return <div className={gridClass}>{items.map((corridor) => <CorridorCard key={corridor.id} corridor={corridor} workspace={workspaceProps(corridor)} />)}</div>;
  }

  return (
    <>
      <section aria-labelledby="workspace-heading" className="rounded-3xl border border-blue-100 bg-blue-50/50 p-5 sm:p-7">
        <h2 id="workspace-heading" className="text-2xl font-bold text-slate-950">Personal workspace</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Favorites, pinned routes, and recent corridors are saved only in this browser for this development prototype. Clearing browser storage removes them, and they are not synchronized across devices.</p>
        {!workspace.isHydrated ? <p className="mt-5 text-sm text-slate-500">Loading browser-local workspace…</p> : <>
          {workspace.favoriteCorridorIds.length === 0 && <p className="mt-5 rounded-xl bg-white px-4 py-3 text-sm text-slate-600">Add a corridor to favorites to build your browser-local workspace.</p>}
          {pinnedCorridors.length > 0 && <div className="mt-7"><h3 className="text-lg font-bold text-slate-950">Pinned corridors</h3><p className="mt-1 text-xs text-slate-500">Your browser-local pinned favorites, shown in saved order.</p>{renderCards(pinnedCorridors, "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3")}</div>}
          {favoriteCorridors.length > 0 && <div className="mt-7"><h3 className="text-lg font-bold text-slate-950">Favorite corridors</h3><p className="mt-1 text-xs text-slate-500">Favorites not already shown under Pinned corridors.</p>{renderCards(favoriteCorridors, "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3")}</div>}
          {recentCorridors.length > 0 && <div className="mt-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-bold text-slate-950">Recently viewed corridors</h3><p className="mt-1 text-xs text-slate-500">Up to six corridors selected for comparison in this browser.</p></div><button type="button" onClick={() => { workspace.clearRecents(); setWorkspaceStatus("Recent corridors cleared."); }} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Clear recent corridors</button></div>{renderCards(recentCorridors, "mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3")}</div>}
        </>}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{workspaceStatus}</p>
      </section>

      <section aria-labelledby="featured-corridors-heading" className="mt-12">
        <h2 id="featured-corridors-heading" className="text-2xl font-bold text-slate-950">Featured illustrative corridors</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">A restrained sample selected through explicit display metadata.</p>
        {renderCards(featuredCorridors, "mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3")}
      </section>

      <section aria-labelledby="recent-corridors-heading" className="mt-14">
        <h2 id="recent-corridors-heading" className="text-2xl font-bold text-slate-950">Recently added illustrative corridors</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Routes explicitly marked as recently added in the fictional data model.</p>
        {renderCards(recentlyAddedCorridors, "mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4")}
      </section>

      <section aria-labelledby="browse-corridors-heading" className="mt-16 border-t border-slate-200 pt-12">
        <div className="max-w-2xl"><h2 id="browse-corridors-heading" className="text-2xl font-bold text-slate-950">Browse all corridors</h2><p className="mt-2 text-sm leading-6 text-slate-600">Search countries or fictional provider names, then narrow results by represented region.</p></div>
        <form role="search" className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_auto] lg:items-end" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="corridor-search" className="grid gap-2 text-sm font-bold text-slate-700">Search illustrative corridors
            <input id="corridor-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Canada Haiti or Provider A" className="comparison-control" />
          </label>
          {query && <button type="button" onClick={() => setQuery("")} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Clear search</button>}
        </form>
        <fieldset className="mt-5"><legend className="text-sm font-bold text-slate-700">Browse by region</legend><div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setRegion("all")} aria-pressed={region === "all"} className={`min-h-11 rounded-xl px-4 py-2 text-sm font-bold transition ${region === "all" ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>All regions</button>
          {regions.map((item) => <button key={item} type="button" onClick={() => setRegion(item)} aria-pressed={region === item} className={`min-h-11 rounded-xl px-4 py-2 text-sm font-bold transition ${region === item ? "bg-blue-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}>{item}</button>)}
        </div></fieldset>
        <p className="mt-6 text-sm font-semibold text-slate-600" role="status" aria-live="polite" aria-atomic="true">{visibleCorridors.length} illustrative {visibleCorridors.length === 1 ? "corridor" : "corridors"}</p>
        {visibleCorridors.length > 0
          ? renderCards(visibleCorridors, "mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3")
          : <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center"><h3 className="font-bold text-slate-950">No illustrative corridors match your search.</h3><button type="button" onClick={clearFilters} className="mt-5 min-h-11 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Clear filters</button></div>}
      </section>
    </>
  );
}
