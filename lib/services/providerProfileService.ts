import { illustrativeCorridors } from "@/lib/data/corridors";
import type { Corridor } from "@/lib/types/transfer";

export function getProviderCorridors(providerId: string, corridors: readonly Corridor[] = illustrativeCorridors): Corridor[] {
  return corridors.filter((corridor) => corridor.offers.some((offer) => offer.providerId === providerId));
}

export function getProviderOfferCount(providerId: string, corridors: readonly Corridor[] = illustrativeCorridors): number {
  return corridors.reduce((count, corridor) => count + corridor.offers.filter((offer) => offer.providerId === providerId).length, 0);
}
