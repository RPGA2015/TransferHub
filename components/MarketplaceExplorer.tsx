"use client";

import { useMemo, useState } from "react";
import CorridorCard from "@/components/CorridorCard";
import { filterCorridorsByRegion, getFeaturedCorridors, getMarketplaceCorridors, getMarketplaceRegions, getRecentlyAddedCorridors, searchCorridors } from "@/lib/services/marketplaceService";
import type { Region } from "@/lib/types/transfer";

const corridors = getMarketplaceCorridors();
const regions = getMarketplaceRegions(corridors);

export default function MarketplaceExplorer() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const visibleCorridors = useMemo(() => filterCorridorsByRegion(searchCorridors(corridors, query), region), [query, region]);
  const featuredCorridors = getFeaturedCorridors(corridors);
  const recentlyAddedCorridors = getRecentlyAddedCorridors(corridors);

  function clearFilters() {
    setQuery("");
    setRegion("all");
  }

  return (
    <>
      <section aria-labelledby="featured-corridors-heading" className="mt-12">
        <h2 id="featured-corridors-heading" className="text-2xl font-bold text-slate-950">Featured illustrative corridors</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">A restrained sample selected through explicit display metadata.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{featuredCorridors.map((corridor) => <CorridorCard key={corridor.id} corridor={corridor} />)}</div>
      </section>

      <section aria-labelledby="recent-corridors-heading" className="mt-14">
        <h2 id="recent-corridors-heading" className="text-2xl font-bold text-slate-950">Recently added illustrative corridors</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Routes explicitly marked as recently added in the fictional data model.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{recentlyAddedCorridors.map((corridor) => <CorridorCard key={corridor.id} corridor={corridor} />)}</div>
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
          ? <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visibleCorridors.map((corridor) => <CorridorCard key={corridor.id} corridor={corridor} />)}</div>
          : <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center"><h3 className="font-bold text-slate-950">No illustrative corridors match your search.</h3><button type="button" onClick={clearFilters} className="mt-5 min-h-11 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">Clear filters</button></div>}
      </section>
    </>
  );
}
