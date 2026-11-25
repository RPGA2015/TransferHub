import type {
  Corridor,
  Country,
  CurrencyCode,
  DeliveryMethod,
  PayoutMethod,
  ProviderId,
} from "@/lib/types/transfer";

const offerDefaults = {
  A: { providerId: "provider-a", deliveryLabel: "Same day", deliveryRank: 3, payoutMethod: "Cash or bank" },
  B: { providerId: "provider-b", deliveryLabel: "1–2 business days", deliveryRank: 4, payoutMethod: "Bank deposit" },
  C: { providerId: "provider-c", deliveryLabel: "Near instant", deliveryRank: 1, payoutMethod: "Cash pickup" },
  D: { providerId: "provider-d", deliveryLabel: "Within an hour", deliveryRank: 2, payoutMethod: "Mobile wallet" },
  E: { providerId: "provider-e", deliveryLabel: "Same day", deliveryRank: 3, payoutMethod: "Bank deposit" },
} as const satisfies Record<string, { providerId: ProviderId; deliveryLabel: DeliveryMethod; deliveryRank: number; payoutMethod: PayoutMethod }>;
const countryCurrencies = {
  "United States": "USD",
  Canada: "CAD",
  France: "EUR",
  Haiti: "HTG",
  "Dominican Republic": "DOP",
} as const satisfies Record<Country, CurrencyCode>;
export function getCountryCurrency(country: Country): CurrencyCode {
  return countryCurrencies[country];
}
export function hasMatchingCorridorCurrencies(corridor: Corridor): boolean {
  return (
    corridor.sendCurrency === getCountryCurrency(corridor.fromCountry) &&
    corridor.receiveCurrency === getCountryCurrency(corridor.toCountry)
  );
}
export function getCorridorCurrencyValidationStatus(
  corridor: Corridor,
): "valid" | "invalid" {
  return hasMatchingCorridorCurrencies(corridor) ? "valid" : "invalid";
}
export const illustrativeCorridors: readonly Corridor[] = [
  { id: "United States-Haiti", fromCountry: "United States", toCountry: "Haiti", sendCurrency: getCountryCurrency("United States"),
receiveCurrency: getCountryCurrency("Haiti"), featured: true, displayPriority: 1, offers: [
    { ...offerDefaults.A, fee: 2.99, exchangeRate: 132.4 }, { ...offerDefaults.B, fee: 0, exchangeRate: 130.1 },
    { ...offerDefaults.C, fee: 4.99, exchangeRate: 131.25 }, { ...offerDefaults.D, fee: 3.5, exchangeRate: 130.8 },
    { ...offerDefaults.E, fee: 1.5, exchangeRate: 131.05 },
  ] },
  { id: "United States-Dominican Republic", fromCountry: "United States", toCountry: "Dominican Republic", 
    sendCurrency: getCountryCurrency("United States"),
receiveCurrency: getCountryCurrency("Dominican Republic"), offers: [
    { ...offerDefaults.A, fee: 3.25, exchangeRate: 59.15 }, { ...offerDefaults.B, fee: 0.99, exchangeRate: 58.35 },
    { ...offerDefaults.C, fee: 5.49, exchangeRate: 58.9 }, { ...offerDefaults.D, fee: 3.75, exchangeRate: 58.6 },
  ] },
  { id: "Canada-Haiti", fromCountry: "Canada", toCountry: "Haiti", sendCurrency: getCountryCurrency("Canada"),
receiveCurrency: getCountryCurrency("Haiti"), featured: true, displayPriority: 2, offers: [
    { ...offerDefaults.A, fee: 3.49, exchangeRate: 96.8 }, { ...offerDefaults.B, fee: 1, exchangeRate: 95.35 },
    { ...offerDefaults.C, fee: 5.75, exchangeRate: 96.1 }, { ...offerDefaults.D, fee: 4.1, exchangeRate: 95.75 },
  ] },
  { id: "Canada-Dominican Republic", fromCountry: "Canada", toCountry: "Dominican Republic", sendCurrency: getCountryCurrency("Canada"),
receiveCurrency: getCountryCurrency("Dominican Republic"), offers: [
    { ...offerDefaults.A, fee: 3.75, exchangeRate: 43.25 }, { ...offerDefaults.B, fee: 1.25, exchangeRate: 42.65 },
    { ...offerDefaults.C, fee: 5.95, exchangeRate: 43.05 }, { ...offerDefaults.D, fee: 4.25, exchangeRate: 42.8 },
  ] },
  { id: "France-Haiti", fromCountry: "France", toCountry: "Haiti", sendCurrency: getCountryCurrency("France"),
receiveCurrency: getCountryCurrency("Haiti"), featured: true, displayPriority: 3, offers: [
    { ...offerDefaults.A, fee: 2.75, exchangeRate: 143.6 }, { ...offerDefaults.B, fee: 0.75, exchangeRate: 141.4 },
    { ...offerDefaults.C, fee: 4.95, exchangeRate: 142.85 }, { ...offerDefaults.D, fee: 3.35, exchangeRate: 142.2 },
  ] },
  { id: "France-Dominican Republic", fromCountry: "France", toCountry: "Dominican Republic", sendCurrency: getCountryCurrency("France"),
receiveCurrency: getCountryCurrency("Dominican Republic"), offers: [
    { ...offerDefaults.A, fee: 3, exchangeRate: 64.15 }, { ...offerDefaults.B, fee: 0.8, exchangeRate: 63.2 },
    { ...offerDefaults.C, fee: 5.1, exchangeRate: 63.85 }, { ...offerDefaults.D, fee: 3.6, exchangeRate: 63.5 },
  ] },
  { id: "Haiti-United States", fromCountry: "Haiti", toCountry: "United States",sendCurrency: getCountryCurrency("Haiti"),
receiveCurrency: getCountryCurrency("United States"), recentlyAdded: true, displayPriority: 4, offers: [
    { ...offerDefaults.A, fee: 395, exchangeRate: 0.00748 }, { ...offerDefaults.B, fee: 125, exchangeRate: 0.00739 },
    { ...offerDefaults.C, fee: 650, exchangeRate: 0.00744 }, { ...offerDefaults.D, fee: 475, exchangeRate: 0.00741 },
  ] },
  {
  id: "Haiti-France",
  fromCountry: "Haiti",
  toCountry: "France",
  sendCurrency: getCountryCurrency("Haiti"),
receiveCurrency: getCountryCurrency("France"),
  offers: [
    { ...offerDefaults.A, fee: 395, exchangeRate: 0.00696 },
    { ...offerDefaults.B, fee: 125, exchangeRate: 0.00692 },
    { ...offerDefaults.C, fee: 650, exchangeRate: 0.00694 },
    { ...offerDefaults.D, fee: 475, exchangeRate: 0.00693 },
  ],
},
  { id: "Dominican Republic-United States", fromCountry: "Dominican Republic", toCountry: "United States", sendCurrency: getCountryCurrency("Dominican Republic"),
receiveCurrency: getCountryCurrency("United States"), recentlyAdded: true, displayPriority: 5, offers: [
    { ...offerDefaults.A, fee: 185, exchangeRate: 0.01682 }, { ...offerDefaults.B, fee: 65, exchangeRate: 0.01658 },
    { ...offerDefaults.C, fee: 310, exchangeRate: 0.01674 }, { ...offerDefaults.D, fee: 240, exchangeRate: 0.01665 },
  ] },
  { id: "Haiti-Canada", fromCountry: "Haiti", toCountry: "Canada", sendCurrency: getCountryCurrency("Haiti"),
receiveCurrency: getCountryCurrency("Canada"), recentlyAdded: true, displayPriority: 6, offers: [
    { ...offerDefaults.A, fee: 420, exchangeRate: 0.01024 }, { ...offerDefaults.B, fee: 150, exchangeRate: 0.01008 },
    { ...offerDefaults.C, fee: 675, exchangeRate: 0.01018 }, { ...offerDefaults.D, fee: 510, exchangeRate: 0.01012 },
  ] },
  { id: "Dominican Republic-Canada", fromCountry: "Dominican Republic", toCountry: "Canada", sendCurrency: getCountryCurrency("Dominican Republic"),
receiveCurrency: getCountryCurrency("Canada"), recentlyAdded: true, displayPriority: 7, offers: [
    { ...offerDefaults.A, fee: 205, exchangeRate: 0.02305 }, { ...offerDefaults.B, fee: 80, exchangeRate: 0.02272 },
    { ...offerDefaults.C, fee: 330, exchangeRate: 0.02294 }, { ...offerDefaults.D, fee: 255, exchangeRate: 0.02281 },
  ] },
{
  id: "Dominican Republic-France",
  fromCountry: "Dominican Republic",
  toCountry: "France",
  sendCurrency: getCountryCurrency("Dominican Republic"),
receiveCurrency: getCountryCurrency("France"),
  offers: [
    { ...offerDefaults.A, fee: 185, exchangeRate: 0.0156 },
    { ...offerDefaults.B, fee: 65, exchangeRate: 0.0154 },
    { ...offerDefaults.C, fee: 310, exchangeRate: 0.0155 },
    { ...offerDefaults.D, fee: 240, exchangeRate: 0.0153 },
  ],
},
  // Additional illustrative corridors — not live quotes.
  {
    id: "Haiti-Dominican Republic",
    fromCountry: "Haiti",
    toCountry: "Dominican Republic",
    sendCurrency: getCountryCurrency("Haiti"),
    receiveCurrency: getCountryCurrency("Dominican Republic"),
    offers: [
      { ...offerDefaults.A, fee: 395, exchangeRate: 0.447 },
      { ...offerDefaults.B, fee: 125, exchangeRate: 0.441 },
      { ...offerDefaults.C, fee: 650, exchangeRate: 0.445 },
      { ...offerDefaults.D, fee: 475, exchangeRate: 0.443 },
    ],
  },
  {
    id: "Dominican Republic-Haiti",
    fromCountry: "Dominican Republic",
    toCountry: "Haiti",
    sendCurrency: getCountryCurrency("Dominican Republic"),
    receiveCurrency: getCountryCurrency("Haiti"),
    offers: [
      { ...offerDefaults.A, fee: 185, exchangeRate: 2.23 },
      { ...offerDefaults.B, fee: 65, exchangeRate: 2.19 },
      { ...offerDefaults.C, fee: 310, exchangeRate: 2.21 },
      { ...offerDefaults.D, fee: 240, exchangeRate: 2.20 },
    ],
  },
  {
    id: "United States-Canada",
    fromCountry: "United States",
    toCountry: "Canada",
    sendCurrency: getCountryCurrency("United States"),
    receiveCurrency: getCountryCurrency("Canada"),
    offers: [
      { ...offerDefaults.A, fee: 3.25, exchangeRate: 1.37 },
      { ...offerDefaults.B, fee: 0.99, exchangeRate: 1.35 },
      { ...offerDefaults.C, fee: 5.49, exchangeRate: 1.365 },
      { ...offerDefaults.D, fee: 3.75, exchangeRate: 1.36 },
    ],
  },
  {
    id: "Canada-United States",
    fromCountry: "Canada",
    toCountry: "United States",
    sendCurrency: getCountryCurrency("Canada"),
    receiveCurrency: getCountryCurrency("United States"),
    offers: [
      { ...offerDefaults.A, fee: 3.75, exchangeRate: 0.729 },
      { ...offerDefaults.B, fee: 1.25, exchangeRate: 0.718 },
      { ...offerDefaults.C, fee: 5.95, exchangeRate: 0.725 },
      { ...offerDefaults.D, fee: 4.25, exchangeRate: 0.722 },
    ],
  },
  {
    id: "United States-France",
    fromCountry: "United States",
    toCountry: "France",
    sendCurrency: getCountryCurrency("United States"),
    receiveCurrency: getCountryCurrency("France"),
    offers: [
      { ...offerDefaults.A, fee: 3.25, exchangeRate: 0.921 },
      { ...offerDefaults.B, fee: 0.99, exchangeRate: 0.908 },
      { ...offerDefaults.C, fee: 5.49, exchangeRate: 0.917 },
      { ...offerDefaults.D, fee: 3.75, exchangeRate: 0.913 },
    ],
  },
  {
    id: "France-United States",
    fromCountry: "France",
    toCountry: "United States",
    sendCurrency: getCountryCurrency("France"),
    receiveCurrency: getCountryCurrency("United States"),
    offers: [
      { ...offerDefaults.A, fee: 3, exchangeRate: 1.086 },
      { ...offerDefaults.B, fee: 0.8, exchangeRate: 1.071 },
      { ...offerDefaults.C, fee: 5.1, exchangeRate: 1.081 },
      { ...offerDefaults.D, fee: 3.6, exchangeRate: 1.077 },
    ],
  },
  {
    id: "Canada-France",
    fromCountry: "Canada",
    toCountry: "France",
    sendCurrency: getCountryCurrency("Canada"),
    receiveCurrency: getCountryCurrency("France"),
    offers: [
      { ...offerDefaults.A, fee: 3.75, exchangeRate: 0.672 },
      { ...offerDefaults.B, fee: 1.25, exchangeRate: 0.661 },
      { ...offerDefaults.C, fee: 5.95, exchangeRate: 0.668 },
      { ...offerDefaults.D, fee: 4.25, exchangeRate: 0.665 },
    ],
  },
  {
    id: "France-Canada",
    fromCountry: "France",
    toCountry: "Canada",
    sendCurrency: getCountryCurrency("France"),
    receiveCurrency: getCountryCurrency("Canada"),
    offers: [
      { ...offerDefaults.A, fee: 3, exchangeRate: 1.488 },
      { ...offerDefaults.B, fee: 0.8, exchangeRate: 1.465 },
      { ...offerDefaults.C, fee: 5.1, exchangeRate: 1.480 },
      { ...offerDefaults.D, fee: 3.6, exchangeRate: 1.474 },
    ],
  },
];
export function allCorridorCurrenciesMatch(): boolean {
  return illustrativeCorridors.every(hasMatchingCorridorCurrencies);
}
export function getAllCorridorCurrencyValidationStatus(): "valid" | "invalid" {
  return allCorridorCurrenciesMatch() ? "valid" : "invalid";
}