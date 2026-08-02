import { illustrativeCorridors } from "@/lib/data/corridors";
import { getProviderIdentity } from "@/lib/data/providers";
import type { ComparisonRequest, ComparisonResult, Corridor, Country, PayoutFilter, ProviderOffer, ProviderResult, SortOption } from "@/lib/types/transfer";

export function getIllustrativeCorridor(fromCountry: Country, toCountry: Country): Corridor | undefined {
  return illustrativeCorridors.find((corridor) => corridor.fromCountry === fromCountry && corridor.toCountry === toCountry);
}

export function normalizeAmount(amount: number): number {
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

export function calculateRecipientAmount(amount: number, offer: Pick<ProviderOffer, "fee" | "exchangeRate">): number {
  const safeFee = Number.isFinite(offer.fee) && offer.fee > 0 ? offer.fee : 0;
  const safeRate = Number.isFinite(offer.exchangeRate) && offer.exchangeRate > 0 ? offer.exchangeRate : 0;
  return Math.max(normalizeAmount(amount) - safeFee, 0) * safeRate;
}

export function enrichProviderResult(amount: number, offer: ProviderOffer): ProviderResult {
  return { ...offer, ...getProviderIdentity(offer.providerName), recipientAmount: calculateRecipientAmount(amount, offer) };
}

export function filterProviderResults(providers: readonly ProviderResult[], payoutFilter: PayoutFilter): ProviderResult[] {
  return providers.filter((provider) => payoutFilter === "all" || provider.payoutMethod === payoutFilter);
}

export function sortProviderResults(providers: readonly ProviderResult[], sortBy: SortOption): ProviderResult[] {
  return [...providers].sort((a, b) => {
    if (sortBy === "fee") return a.fee - b.fee;
    if (sortBy === "fastest") return a.deliveryRank - b.deliveryRank;
    return b.recipientAmount - a.recipientAmount;
  });
}

export function compareTransfers(request: ComparisonRequest): ComparisonResult {
  const corridor = getIllustrativeCorridor(request.fromCountry, request.toCountry) ?? null;
  if (!corridor) return { request, corridor, providers: [], visibleResultCount: 0 };
  const enriched = corridor.offers.map((offer) => enrichProviderResult(request.amount, offer));
  const providers = sortProviderResults(filterProviderResults(enriched, request.payoutFilter), request.sortBy);
  return { request, corridor, providers, visibleResultCount: providers.length };
}
