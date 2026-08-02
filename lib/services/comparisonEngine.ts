import { illustrativeCorridors } from "@/lib/data/corridors";
import { getProviderIdentity } from "@/lib/data/providers";
import type { ComparisonRequest, ComparisonResult, Corridor, Country, PayoutFilter, ProviderOffer, ProviderResult, SortOption } from "@/lib/types/transfer";

export const unavailableCorridorMessage = "This illustrative transfer corridor is not available yet.";

export function getIllustrativeCorridor(fromCountry: Country, toCountry: Country): Corridor | undefined {
  return illustrativeCorridors.find((corridor) => corridor.fromCountry === fromCountry && corridor.toCountry === toCountry);
}

export function getCorridorById(corridorId: string): Corridor | undefined {
  return illustrativeCorridors.find(({ id }) => id === corridorId);
}

export function getAvailableSendingCountries(): Country[] {
  return [...new Set(illustrativeCorridors.map(({ fromCountry }) => fromCountry))];
}

export function getAvailableReceivingCountries(fromCountry: Country): Country[] {
  return illustrativeCorridors
    .filter((corridor) => corridor.fromCountry === fromCountry)
    .map(({ toCountry }) => toCountry);
}

export function isCorridorAvailable(fromCountry: Country, toCountry: Country): boolean {
  return getIllustrativeCorridor(fromCountry, toCountry) !== undefined;
}

export function normalizeAmount(amount: number): number {
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function normalizeNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function finiteMetric(value: number): number {
  return Number.isFinite(value) ? Math.max(value, 0) : Number.MAX_VALUE;
}

export function calculateRecipientAmount(amount: number, offer: Pick<ProviderOffer, "fee" | "exchangeRate">): number {
  const safeFee = normalizeNonNegative(offer.fee);
  const safeRate = normalizeNonNegative(offer.exchangeRate);
  return finiteMetric(Math.max(normalizeAmount(amount) - safeFee, 0) * safeRate);
}

export function enrichProviderResult(amount: number, offer: ProviderOffer): ProviderResult {
  const safeAmount = normalizeAmount(amount);
  const fee = normalizeNonNegative(offer.fee);
  const exchangeRate = normalizeNonNegative(offer.exchangeRate);
  const deliveryScore = Number.isFinite(offer.deliveryRank) && offer.deliveryRank > 0
    ? offer.deliveryRank
    : Number.MAX_SAFE_INTEGER;
  const recipientAmount = calculateRecipientAmount(safeAmount, { fee, exchangeRate });

  return {
    ...offer,
    ...getProviderIdentity(offer.providerName),
    fee,
    exchangeRate,
    deliveryRank: deliveryScore,
    recipientAmount,
    totalCost: finiteMetric(safeAmount + fee),
    feePercentage: safeAmount > 0 ? finiteMetric((fee / safeAmount) * 100) : 0,
    deliveryScore,
    // Recipient amount is the full value score; fee and delivery are explicit tie-breakers.
    valueScore: recipientAmount,
    rankPosition: 0,
  };
}

export function filterProviderResults(providers: readonly ProviderResult[], payoutFilter: PayoutFilter): ProviderResult[] {
  return providers.filter((provider) => payoutFilter === "all" || provider.payoutMethod === payoutFilter);
}

export function sortProviderResults(providers: readonly ProviderResult[], sortBy: SortOption): ProviderResult[] {
  const byRecipient = (a: ProviderResult, b: ProviderResult) => b.recipientAmount - a.recipientAmount;
  const byFee = (a: ProviderResult, b: ProviderResult) => a.fee - b.fee;
  const byDelivery = (a: ProviderResult, b: ProviderResult) => a.deliveryScore - b.deliveryScore;
  const byName = (a: ProviderResult, b: ProviderResult) => a.providerName.localeCompare(b.providerName, "en-US");
  const compare = (a: ProviderResult, b: ProviderResult) => {
    const checks = sortBy === "fee"
      ? [byFee, byRecipient, byDelivery, byName]
      : sortBy === "fastest"
        ? [byDelivery, byRecipient, byFee, byName]
        : [byRecipient, byFee, byDelivery, byName];

    for (const check of checks) {
      const result = check(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };

  return [...providers]
    .sort(compare)
    .map((provider, index) => ({ ...provider, rankPosition: index + 1 }));
}

export function compareTransfers(request: ComparisonRequest): ComparisonResult {
  const corridor = getIllustrativeCorridor(request.fromCountry, request.toCountry) ?? null;
  if (!corridor) return { request, corridor, providers: [], visibleResultCount: 0 };
  const enriched = corridor.offers.map((offer) => enrichProviderResult(request.amount, offer));
  const providers = sortProviderResults(filterProviderResults(enriched, request.payoutFilter), request.sortBy);
  return { request, corridor, providers, visibleResultCount: providers.length };
}
