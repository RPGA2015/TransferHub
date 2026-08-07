import { getCountryDefinition } from "@/lib/data/countries";
import { illustrativeCorridors } from "@/lib/data/corridors";
import { getProviderProfile } from "@/lib/data/providers";
import type { Locale } from "@/lib/i18n/config";
import { getCountryLabel } from "@/lib/i18n/labels";
import type { Corridor, CorridorId, PayoutMethod, Region } from "@/lib/types/transfer";

function byMarketplaceOrder(a: Corridor, b: Corridor): number {
  return (a.displayPriority ?? Number.MAX_SAFE_INTEGER) - (b.displayPriority ?? Number.MAX_SAFE_INTEGER)
    || a.id.localeCompare(b.id, "en-US");
}

export function getMarketplaceCorridors(): Corridor[] {
  return [...illustrativeCorridors].sort(byMarketplaceOrder);
}

export function normalizeMarketplaceSearchText(value: string): string {
  return value
    .replace(/[-\u2013\u2014\u2192/,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("en-US");
}

export function searchCorridors(corridors: readonly Corridor[], query: string, locale: Locale = "en"): Corridor[] {
  const normalizedQuery = normalizeMarketplaceSearchText(query);
  if (!normalizedQuery) return [...corridors];

  return corridors.filter((corridor) => {
    const providerNames = corridor.offers.map(({ providerId }) => getProviderProfile(providerId)?.name ?? "");
    const searchableText = normalizeMarketplaceSearchText(
      [corridor.fromCountry, corridor.toCountry, getCountryLabel(corridor.fromCountry, locale), getCountryLabel(corridor.toCountry, locale), ...providerNames].join(" "),
    );
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

export function getCorridorsByIds(corridorIds: readonly CorridorId[], corridors: readonly Corridor[] = illustrativeCorridors): Corridor[] {
  const corridorsById = new Map(corridors.map((corridor) => [corridor.id, corridor]));
  return corridorIds.flatMap((id) => {
    const corridor = corridorsById.get(id);
    return corridor ? [corridor] : [];
  });
}
