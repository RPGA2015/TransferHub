import type { Corridor, DeliveryMethod, PayoutMethod, ProviderName } from "@/lib/types/transfer";

const offerDefaults = {
  A: { providerName: "Provider A", deliveryLabel: "Same day", deliveryRank: 3, payoutMethod: "Cash or bank" },
  B: { providerName: "Provider B", deliveryLabel: "1–2 business days", deliveryRank: 4, payoutMethod: "Bank deposit" },
  C: { providerName: "Provider C", deliveryLabel: "Near instant", deliveryRank: 1, payoutMethod: "Cash pickup" },
  D: { providerName: "Provider D", deliveryLabel: "Within an hour", deliveryRank: 2, payoutMethod: "Mobile wallet" },
  E: { providerName: "Provider E", deliveryLabel: "Same day", deliveryRank: 3, payoutMethod: "Bank deposit" },
} as const satisfies Record<string, { providerName: ProviderName; deliveryLabel: DeliveryMethod; deliveryRank: number; payoutMethod: PayoutMethod }>;

export const illustrativeCorridors: readonly Corridor[] = [
  { id: "United States-Haiti", fromCountry: "United States", toCountry: "Haiti", sendingCurrency: "USD", receivingCurrency: "HTG", offers: [
    { ...offerDefaults.A, fee: 2.99, exchangeRate: 132.4 }, { ...offerDefaults.B, fee: 0, exchangeRate: 130.1 },
    { ...offerDefaults.C, fee: 4.99, exchangeRate: 131.25 }, { ...offerDefaults.D, fee: 3.5, exchangeRate: 130.8 },
    { ...offerDefaults.E, fee: 1.5, exchangeRate: 131.05 },
  ] },
  { id: "United States-Dominican Republic", fromCountry: "United States", toCountry: "Dominican Republic", sendingCurrency: "USD", receivingCurrency: "DOP", offers: [
    { ...offerDefaults.A, fee: 3.25, exchangeRate: 59.15 }, { ...offerDefaults.B, fee: 0.99, exchangeRate: 58.35 },
    { ...offerDefaults.C, fee: 5.49, exchangeRate: 58.9 }, { ...offerDefaults.D, fee: 3.75, exchangeRate: 58.6 },
  ] },
  { id: "Canada-Haiti", fromCountry: "Canada", toCountry: "Haiti", sendingCurrency: "CAD", receivingCurrency: "HTG", offers: [
    { ...offerDefaults.A, fee: 3.49, exchangeRate: 96.8 }, { ...offerDefaults.B, fee: 1, exchangeRate: 95.35 },
    { ...offerDefaults.C, fee: 5.75, exchangeRate: 96.1 }, { ...offerDefaults.D, fee: 4.1, exchangeRate: 95.75 },
  ] },
  { id: "Canada-Dominican Republic", fromCountry: "Canada", toCountry: "Dominican Republic", sendingCurrency: "CAD", receivingCurrency: "DOP", offers: [
    { ...offerDefaults.A, fee: 3.75, exchangeRate: 43.25 }, { ...offerDefaults.B, fee: 1.25, exchangeRate: 42.65 },
    { ...offerDefaults.C, fee: 5.95, exchangeRate: 43.05 }, { ...offerDefaults.D, fee: 4.25, exchangeRate: 42.8 },
  ] },
  { id: "France-Haiti", fromCountry: "France", toCountry: "Haiti", sendingCurrency: "EUR", receivingCurrency: "HTG", offers: [
    { ...offerDefaults.A, fee: 2.75, exchangeRate: 143.6 }, { ...offerDefaults.B, fee: 0.75, exchangeRate: 141.4 },
    { ...offerDefaults.C, fee: 4.95, exchangeRate: 142.85 }, { ...offerDefaults.D, fee: 3.35, exchangeRate: 142.2 },
  ] },
  { id: "France-Dominican Republic", fromCountry: "France", toCountry: "Dominican Republic", sendingCurrency: "EUR", receivingCurrency: "DOP", offers: [
    { ...offerDefaults.A, fee: 3, exchangeRate: 64.15 }, { ...offerDefaults.B, fee: 0.8, exchangeRate: 63.2 },
    { ...offerDefaults.C, fee: 5.1, exchangeRate: 63.85 }, { ...offerDefaults.D, fee: 3.6, exchangeRate: 63.5 },
  ] },
];
