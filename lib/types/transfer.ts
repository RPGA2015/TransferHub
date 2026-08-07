export type Country =
  | "United States"
  | "Canada"
  | "France"
  | "Haiti"
  | "Dominican Republic";
export type CountryCode = "US" | "CA" | "FR" | "HT" | "DO";
export type Region = "North America" | "Caribbean" | "Europe";
export type CorridorId = `${Country}-${Country}`;
export type WorkspaceStorageVersion = 2;

export type CurrencyCode = "USD" | "CAD" | "EUR" | "HTG" | "DOP";
export type PayoutMethod = "Cash pickup" | "Bank deposit" | "Mobile wallet" | "Cash or bank";
export type DeliveryMethod = "Near instant" | "Within an hour" | "Same day" | "1–2 business days";
export type ProviderId = "provider-a" | "provider-b" | "provider-c" | "provider-d" | "provider-e";
export type ProviderName = "Provider A" | "Provider B" | "Provider C" | "Provider D" | "Provider E";
export type ProviderBadge = "Best Value" | "Lowest Fee" | "Fastest" | "Wallet Delivery";
export type ProviderAccent = "emerald" | "blue" | "amber" | "violet";
export type SupportChannel = "Email" | "Phone" | "In-app help" | "Help center";
export type DigitalAccess = "Web" | "Mobile app";
export type SupportAvailability = "Business hours" | "Extended hours" | "Always available";
export type RegulatoryStatus = "Demo registration shown" | "Demo review pending" | "Not assessed in prototype";
export type SortOption = "best" | "fee" | "recipient" | "fastest";
export type PayoutFilter = "all" | PayoutMethod;

export type ProviderProfile = {
  id: ProviderId;
  name: ProviderName;
  shortName?: string;
  initials: string;
  description: string;
  serviceSummary: string;
  supportedPayoutMethods: readonly PayoutMethod[];
  supportChannels: readonly SupportChannel[];
  digitalAccess: readonly DigitalAccess[];
  availabilityNote: string;
  verified: boolean;
  yearsInOperation: number;
  countriesServed: number;
  supportAvailability: SupportAvailability;
  regulatoryStatus: RegulatoryStatus;
  lastProfileUpdate: string;
  profileStatus: "illustrative";
  accent: ProviderAccent;
};

export type ProviderOffer = {
  providerId: ProviderId;
  fee: number;
  exchangeRate: number;
  deliveryLabel: DeliveryMethod;
  deliveryRank: number;
  payoutMethod: PayoutMethod;
};

export type ProviderResult = ProviderOffer & {
  providerName: string;
  initials: string;
  serviceSummary?: string;
  accent: ProviderAccent;
  badge: ProviderBadge | null;
  recipientAmount: number;
  totalCost: number;
  feePercentage: number;
  deliveryScore: number;
  valueScore: number;
  rankPosition: number;
};

export type Corridor = {
  id: CorridorId;
  fromCountry: Country;
  toCountry: Country;
  sendCurrency: CurrencyCode;
  receiveCurrency: CurrencyCode;
  offers: readonly ProviderOffer[];
  featured?: boolean;
  recentlyAdded?: boolean;
  displayPriority?: number;
};

export type WorkspaceState = {
  favoriteCorridorIds: CorridorId[];
  pinnedCorridorIds: CorridorId[];
  recentCorridorIds: CorridorId[];
  favoriteProviderIds: ProviderId[];
  recentProviderIds: ProviderId[];
};

export type StoredWorkspaceState = WorkspaceState & {
  version: WorkspaceStorageVersion;
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
