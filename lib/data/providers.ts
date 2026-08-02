import type { ProviderIdentity, ProviderName } from "@/lib/types/transfer";

export const fictionalProviders = {
  "Provider A": { name: "Provider A", badge: "Best Value", accent: "emerald" },
  "Provider B": { name: "Provider B", badge: "Lowest Fee", accent: "blue" },
  "Provider C": { name: "Provider C", badge: "Fastest", accent: "amber" },
  "Provider D": { name: "Provider D", badge: "Wallet Delivery", accent: "violet" },
  "Provider E": { name: "Provider E", badge: "Bank Deposit", accent: "blue" },
} as const satisfies Record<ProviderName, ProviderIdentity>;

export function getProviderIdentity(providerName: ProviderName): ProviderIdentity {
  return fictionalProviders[providerName];
}
