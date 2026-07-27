export type Country =
  | "United States"
  | "Canada"
  | "France"
  | "Haiti"
  | "Dominican Republic";

export type Currency = "USD" | "CAD" | "EUR" | "HTG" | "DOP";
export type DeliveryMethod = "Near instant" | "Within an hour" | "Same day" | "1–2 business days";
export type PayoutMethod = "Cash pickup" | "Bank deposit" | "Mobile wallet" | "Cash or bank";
export type Accent = "emerald" | "blue" | "amber" | "violet";

export type ProviderResult = {
  providerName: "Provider A" | "Provider B" | "Provider C" | "Provider D";
  fee: number;
  exchangeRate: number;
  estimatedDelivery: DeliveryMethod;
  deliveryLabel: DeliveryMethod;
  deliveryRank: number;
  payoutMethod: PayoutMethod;
  badge: "Best Value" | "Lowest Fee" | "Fastest" | "Wallet Delivery";
  accent: Accent;
};

export type Corridor = {
  id: `${Country}-${Country}`;
  fromCountry: Country;
  toCountry: Country;
  sendingCurrency: Currency;
  receivingCurrency: Currency;
  providers: readonly ProviderResult[];
};

export const countryCurrencies: Record<Country, Currency> = {
  "United States": "USD",
  Canada: "CAD",
  France: "EUR",
  Haiti: "HTG",
  "Dominican Republic": "DOP",
};

export const sendingCountries = ["United States", "Canada", "France"] as const satisfies readonly Country[];
export const receivingCountries = ["Haiti", "Dominican Republic"] as const satisfies readonly Country[];

const common = {
  A: { providerName: "Provider A", estimatedDelivery: "Same day", deliveryLabel: "Same day", deliveryRank: 3, payoutMethod: "Cash or bank", badge: "Best Value", accent: "emerald" },
  B: { providerName: "Provider B", estimatedDelivery: "1–2 business days", deliveryLabel: "1–2 business days", deliveryRank: 4, payoutMethod: "Bank deposit", badge: "Lowest Fee", accent: "blue" },
  C: { providerName: "Provider C", estimatedDelivery: "Near instant", deliveryLabel: "Near instant", deliveryRank: 1, payoutMethod: "Cash pickup", badge: "Fastest", accent: "amber" },
  D: { providerName: "Provider D", estimatedDelivery: "Within an hour", deliveryLabel: "Within an hour", deliveryRank: 2, payoutMethod: "Mobile wallet", badge: "Wallet Delivery", accent: "violet" },
} as const;

export const illustrativeCorridors: readonly Corridor[] = [
  {
    id: "United States-Haiti", fromCountry: "United States", toCountry: "Haiti", sendingCurrency: "USD", receivingCurrency: "HTG",
    providers: [
      { ...common.A, fee: 2.99, exchangeRate: 132.4 }, { ...common.B, fee: 0, exchangeRate: 130.1 },
      { ...common.C, fee: 4.99, exchangeRate: 131.25 }, { ...common.D, fee: 3.5, exchangeRate: 130.8 },
    ],
  },
  {
    id: "United States-Dominican Republic", fromCountry: "United States", toCountry: "Dominican Republic", sendingCurrency: "USD", receivingCurrency: "DOP",
    providers: [
      { ...common.A, fee: 3.25, exchangeRate: 59.15 }, { ...common.B, fee: 0.99, exchangeRate: 58.35 },
      { ...common.C, fee: 5.49, exchangeRate: 58.9 }, { ...common.D, fee: 3.75, exchangeRate: 58.6 },
    ],
  },
  {
    id: "Canada-Haiti", fromCountry: "Canada", toCountry: "Haiti", sendingCurrency: "CAD", receivingCurrency: "HTG",
    providers: [
      { ...common.A, fee: 3.49, exchangeRate: 96.8 }, { ...common.B, fee: 1, exchangeRate: 95.35 },
      { ...common.C, fee: 5.75, exchangeRate: 96.1 }, { ...common.D, fee: 4.1, exchangeRate: 95.75 },
    ],
  },
  {
    id: "Canada-Dominican Republic", fromCountry: "Canada", toCountry: "Dominican Republic", sendingCurrency: "CAD", receivingCurrency: "DOP",
    providers: [
      { ...common.A, fee: 3.75, exchangeRate: 43.25 }, { ...common.B, fee: 1.25, exchangeRate: 42.65 },
      { ...common.C, fee: 5.95, exchangeRate: 43.05 }, { ...common.D, fee: 4.25, exchangeRate: 42.8 },
    ],
  },
  {
    id: "France-Haiti", fromCountry: "France", toCountry: "Haiti", sendingCurrency: "EUR", receivingCurrency: "HTG",
    providers: [
      { ...common.A, fee: 2.75, exchangeRate: 143.6 }, { ...common.B, fee: 0.75, exchangeRate: 141.4 },
      { ...common.C, fee: 4.95, exchangeRate: 142.85 }, { ...common.D, fee: 3.35, exchangeRate: 142.2 },
    ],
  },
  {
    id: "France-Dominican Republic", fromCountry: "France", toCountry: "Dominican Republic", sendingCurrency: "EUR", receivingCurrency: "DOP",
    providers: [
      { ...common.A, fee: 3, exchangeRate: 64.15 }, { ...common.B, fee: 0.8, exchangeRate: 63.2 },
      { ...common.C, fee: 5.1, exchangeRate: 63.85 }, { ...common.D, fee: 3.6, exchangeRate: 63.5 },
    ],
  },
];

export function getIllustrativeCorridor(fromCountry: Country, toCountry: Country) {
  return illustrativeCorridors.find((corridor) => corridor.fromCountry === fromCountry && corridor.toCountry === toCountry);
}
