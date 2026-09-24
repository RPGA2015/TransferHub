export type ProductionCountryCode = "US" | "CA" | "FR" | "HT" | "DO";

export type ProductionCurrencyCode = "USD" | "CAD" | "EUR" | "HTG" | "DOP";

export type DataSourceType =
  | "illustrative"
  | "authorized-provider";

export type DataFreshnessStatus =
  | "fresh"
  | "stale"
  | "unavailable";

  export type ProductionCorridor = {
  id: string;
  sendCountry: ProductionCountryCode;
  receiveCountry: ProductionCountryCode;
  sendCurrency: ProductionCurrencyCode;
  receiveCurrency: ProductionCurrencyCode;
  supported: boolean;
};

export type ProductionProvider = {
  id: string;
  name: string;
  supportedCorridorIds: readonly string[];
  supportedPayoutMethods: readonly string[];
  active: boolean;
};

export type ProductionQuote = {
  id: string;
  providerId: string;
  corridorId: string;
  sendCurrency: ProductionCurrencyCode;
  receiveCurrency: ProductionCurrencyCode;
  sendAmount: number;
  fee: number;
  exchangeRate: number;
  recipientAmount: number;
  payoutMethod: string;
  deliveryEstimate: string;
  quotedAt: string;
  expiresAt: string | null;
};

export type ProductionDataStatus = {
  sourceType: DataSourceType;
  freshness: DataFreshnessStatus;
  sourceName: string;
  lastUpdatedAt: string;
  checkedAt: string;
};