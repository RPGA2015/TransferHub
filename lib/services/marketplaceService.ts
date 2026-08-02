import { getCountryDefinition } from "@/lib/data/countries";
import { illustrativeCorridors } from "@/lib/data/corridors";
import type { Corridor, PayoutMethod, Region } from "@/lib/types/transfer";

function byMarketplaceOrder(a: Corridor, b: Corridor): number {
  return (a.displayPriority ?? Number.MAX_SAFE_INTEGER) - (b.displayPriority ?? Number.MAX_SAFE_INTEGER)
    || a.id.localeCompare(b.id, "en-US");
}

export function getMarketplaceCorridors(): Corridor[] {
  return [...illustrativeCorridors].sort(byMarketplaceOrder);
}

export function searchCorridors(corridors: readonly Corridor[], query: string): Corridor[] {
  const normalizedQuery = query.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
  if (!normalizedQuery) return [...corridors];

  return corridors.filter((corridor) => {
    const providerNames = corridor.offers.map(({ providerName }) => providerName);
    const searchableText = [corridor.fromCountry, corridor.toCountry, `${corridor.fromCountry} ${corridor.toCountry}`, ...providerNames]
      .join(" ")
      .toLocaleLowerCase("en-US");
    return searchableText.includes(normalizedQuery);
  });
}

export function filterCorridorsByRegion(corridors: readonly Corridor[], region: Region | "all"): Corridor[] {
  if (region === "all") return [...corridors];
  return corridors.filter((corridor) =>
    getCountryDefinition(corridor.fromCountry).region === region
    || getCountryDefinition(corridor.toCountry).region === region,
  );
}

export function getCorridorPayoutMethods(corridor: Corridor): PayoutMethod[] {
  return [...new Set(corridor.offers.map(({ payoutMethod }) => payoutMethod))];
}

export function getFeaturedCorridors(corridors: readonly Corridor[] = illustrativeCorridors): Corridor[] {
  return corridors.filter(({ featured }) => featured).sort(byMarketplaceOrder);
}

export function getRecentlyAddedCorridors(corridors: readonly Corridor[] = illustrativeCorridors): Corridor[] {
  return corridors.filter(({ recentlyAdded }) => recentlyAdded).sort(byMarketplaceOrder);
}

export function getMarketplaceRegions(corridors: readonly Corridor[] = illustrativeCorridors): Region[] {
  const regions = new Set<Region>();
  corridors.forEach((corridor) => {
    regions.add(getCountryDefinition(corridor.fromCountry).region);
    regions.add(getCountryDefinition(corridor.toCountry).region);
  });
  return [...regions].sort((a, b) => a.localeCompare(b, "en-US"));
}
