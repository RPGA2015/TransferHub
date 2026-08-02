import type { Corridor, DeliveryMethod, PayoutMethod, ProviderName } from "@/lib/types/transfer";

const offerDefaults = {
  A: { providerName: "Provider A", deliveryLabel: "Same day", deliveryRank: 3, payoutMethod: "Cash or bank" },
  B: { providerName: "Provider B", deliveryLabel: "1–2 business days", deliveryRank: 4, payoutMethod: "Bank deposit" },
  C: { providerName: "Provider C", deliveryLabel: "Near instant", deliveryRank: 1, payoutMethod: "Cash pickup" },
  D: { providerName: "Provider D", deliveryLabel: "Within an hour", deliveryRank: 2, payoutMethod: "Mobile wallet" },
  E: { providerName: "Provider E", deliveryLabel: "Same day", deliveryRank: 3, payoutMethod: "Bank deposit" },
} as const satisfies Record<string, { providerName: ProviderName; deliveryLabel: DeliveryMethod; deliveryRank: number; payoutMethod: PayoutMethod }>;

export const illustrativeCorridors: readonly Corridor[] = [
  { id: "United States-Haiti", fromCountry: "United States", toCountry: "Haiti", sendCurrency: "USD", receiveCurrency: "HTG", featured: true, displayPriority: 1, offers: [
    { ...offerDefaults.A, fee: 2.99, exchangeRate: 132.4 }, { ...offerDefaults.B, fee: 0, exchangeRate: 130.1 },
    { ...offerDefaults.C, fee: 4.99, exchangeRate: 131.25 }, { ...offerDefaults.D, fee: 3.5, exchangeRate: 130.8 },
    { ...offerDefaults.E, fee: 1.5, exchangeRate: 131.05 },
  ] },
  { id: "United States-Dominican Republic", fromCountry: "United States", toCountry: "Dominican Republic", sendCurrency: "USD", receiveCurrency: "DOP", offers: [
    { ...offerDefaults.A, fee: 3.25, exchangeRate: 59.15 }, { ...offerDefaults.B, fee: 0.99, exchangeRate: 58.35 },
    { ...offerDefaults.C, fee: 5.49, exchangeRate: 58.9 }, { ...offerDefaults.D, fee: 3.75, exchangeRate: 58.6 },
  ] },
  { id: "Canada-Haiti", fromCountry: "Canada", toCountry: "Haiti", sendCurrency: "CAD", receiveCurrency: "HTG", featured: true, displayPriority: 2, offers: [
    { ...offerDefaults.A, fee: 3.49, exchangeRate: 96.8 }, { ...offerDefaults.B, fee: 1, exchangeRate: 95.35 },
    { ...offerDefaults.C, fee: 5.75, exchangeRate: 96.1 }, { ...offerDefaults.D, fee: 4.1, exchangeRate: 95.75 },
  ] },
  { id: "Canada-Dominican Republic", fromCountry: "Canada", toCountry: "Dominican Republic", sendCurrency: "CAD", receiveCurrency: "DOP", offers: [
    { ...offerDefaults.A, fee: 3.75, exchangeRate: 43.25 }, { ...offerDefaults.B, fee: 1.25, exchangeRate: 42.65 },
    { ...offerDefaults.C, fee: 5.95, exchangeRate: 43.05 }, { ...offerDefaults.D, fee: 4.25, exchangeRate: 42.8 },
  ] },
  { id: "France-Haiti", fromCountry: "France", toCountry: "Haiti", sendCurrency: "EUR", receiveCurrency: "HTG", featured: true, displayPriority: 3, offers: [
    { ...offerDefaults.A, fee: 2.75, exchangeRate: 143.6 }, { ...offerDefaults.B, fee: 0.75, exchangeRate: 141.4 },
    { ...offerDefaults.C, fee: 4.95, exchangeRate: 142.85 }, { ...offerDefaults.D, fee: 3.35, exchangeRate: 142.2 },
  ] },
  { id: "France-Dominican Republic", fromCountry: "France", toCountry: "Dominican Republic", sendCurrency: "EUR", receiveCurrency: "DOP", offers: [
    { ...offerDefaults.A, fee: 3, exchangeRate: 64.15 }, { ...offerDefaults.B, fee: 0.8, exchangeRate: 63.2 },
    { ...offerDefaults.C, fee: 5.1, exchangeRate: 63.85 }, { ...offerDefaults.D, fee: 3.6, exchangeRate: 63.5 },
  ] },
  { id: "Haiti-United States", fromCountry: "Haiti", toCountry: "United States", sendCurrency: "HTG", receiveCurrency: "USD", recentlyAdded: true, displayPriority: 4, offers: [
    { ...offerDefaults.A, fee: 395, exchangeRate: 0.00748 }, { ...offerDefaults.B, fee: 125, exchangeRate: 0.00739 },
    { ...offerDefaults.C, fee: 650, exchangeRate: 0.00744 }, { ...offerDefaults.D, fee: 475, exchangeRate: 0.00741 },
  ] },
  { id: "Dominican Republic-United States", fromCountry: "Dominican Republic", toCountry: "United States", sendCurrency: "DOP", receiveCurrency: "USD", recentlyAdded: true, displayPriority: 5, offers: [
    { ...offerDefaults.A, fee: 185, exchangeRate: 0.01682 }, { ...offerDefaults.B, fee: 65, exchangeRate: 0.01658 },
    { ...offerDefaults.C, fee: 310, exchangeRate: 0.01674 }, { ...offerDefaults.D, fee: 240, exchangeRate: 0.01665 },
  ] },
  { id: "Haiti-Canada", fromCountry: "Haiti", toCountry: "Canada", sendCurrency: "HTG", receiveCurrency: "CAD", recentlyAdded: true, displayPriority: 6, offers: [
    { ...offerDefaults.A, fee: 420, exchangeRate: 0.01024 }, { ...offerDefaults.B, fee: 150, exchangeRate: 0.01008 },
    { ...offerDefaults.C, fee: 675, exchangeRate: 0.01018 }, { ...offerDefaults.D, fee: 510, exchangeRate: 0.01012 },
  ] },
  { id: "Dominican Republic-Canada", fromCountry: "Dominican Republic", toCountry: "Canada", sendCurrency: "DOP", receiveCurrency: "CAD", recentlyAdded: true, displayPriority: 7, offers: [
    { ...offerDefaults.A, fee: 205, exchangeRate: 0.02305 }, { ...offerDefaults.B, fee: 80, exchangeRate: 0.02272 },
    { ...offerDefaults.C, fee: 330, exchangeRate: 0.02294 }, { ...offerDefaults.D, fee: 255, exchangeRate: 0.02281 },
  ] },
];
