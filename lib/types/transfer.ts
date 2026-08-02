export type Country =
  | "United States"
  | "Canada"
  | "France"
  | "Haiti"
  | "Dominican Republic";

export type CurrencyCode = "USD" | "CAD" | "EUR" | "HTG" | "DOP";
export type PayoutMethod = "Cash pickup" | "Bank deposit" | "Mobile wallet" | "Cash or bank";
export type DeliveryMethod = "Near instant" | "Within an hour" | "Same day" | "1–2 business days";
export type ProviderName = "Provider A" | "Provider B" | "Provider C" | "Provider D" | "Provider E";
export type ProviderBadge = "Best Value" | "Lowest Fee" | "Fastest" | "Wallet Delivery" | "Bank Deposit";
export type ProviderAccent = "emerald" | "blue" | "amber" | "violet";
export type SortOption = "best" | "fee" | "recipient" | "fastest";
export type PayoutFilter = "all" | PayoutMethod;

export type ProviderIdentity = {
  name: ProviderName;
  badge: ProviderBadge;
  accent: ProviderAccent;
};

export type ProviderOffer = {
  providerName: ProviderName;
  fee: number;
  exchangeRate: number;
  deliveryLabel: DeliveryMethod;
  deliveryRank: number;
  payoutMethod: PayoutMethod;
};

export type ProviderResult = ProviderOffer & ProviderIdentity & {
  recipientAmount: number;
};

export type Corridor = {
  id: `${Country}-${Country}`;
  fromCountry: Country;
  toCountry: Country;
  sendingCurrency: CurrencyCode;
  receivingCurrency: CurrencyCode;
  offers: readonly ProviderOffer[];
};

export type ComparisonRequest = {
  fromCountry: Country;
  toCountry: Country;
  amount: number;
  sortBy: SortOption;
  payoutFilter: PayoutFilter;
};

export type ComparisonResult = {
  request: ComparisonRequest;
  corridor: Corridor | null;
  providers: readonly ProviderResult[];
  visibleResultCount: number;
};
