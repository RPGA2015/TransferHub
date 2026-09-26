import { illustrativeCorridors } from "@/lib/data/corridors";
import { fictionalProviderProfiles } from "@/lib/data/providers";

import type {
  ProductionCorridor,
  ProductionProvider,
  ProductionQuote,
} from "@/lib/types/production";
const productionCountryCodes = {
  "United States": "US",
  Canada: "CA",
  France: "FR",
  Haiti: "HT",
  "Dominican Republic": "DO",
} as const;
export const productionCorridors: readonly ProductionCorridor[] =
  illustrativeCorridors.map((corridor) => ({
    id: corridor.id,
    sendCountry: productionCountryCodes[corridor.fromCountry],
    receiveCountry: productionCountryCodes[corridor.toCountry],
    sendCurrency: corridor.sendCurrency,
    receiveCurrency: corridor.receiveCurrency,
    supported: true,
  }));
  export const productionProviders: readonly ProductionProvider[] =
  fictionalProviderProfiles.map((provider) => ({
    id: provider.id,
    name: provider.name,
    supportedCorridorIds: illustrativeCorridors
      .filter((corridor) =>
        corridor.offers.some((offer) => offer.providerId === provider.id),
      )
      .map((corridor) => corridor.id),
    supportedPayoutMethods: provider.supportedPayoutMethods,
    active: true,
  }));

  export const productionQuotes: readonly ProductionQuote[] =
  illustrativeCorridors.flatMap((corridor) =>
    corridor.offers.map((offer, offerIndex) => ({
      id: `${corridor.id}-${offer.providerId}-${offerIndex + 1}`,
      providerId: offer.providerId,
      corridorId: corridor.id,
      sendCurrency: corridor.sendCurrency,
      receiveCurrency: corridor.receiveCurrency,
      sendAmount: 100,
      fee: offer.fee,
      exchangeRate: offer.exchangeRate,
      recipientAmount: (100 - offer.fee) * offer.exchangeRate,
      payoutMethod: offer.payoutMethod,
      deliveryEstimate: offer.deliveryLabel,
      quotedAt: "illustrative",
      expiresAt: null,
    })),
  );