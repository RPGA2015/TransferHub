import type { ProviderProfile } from "@/lib/types/transfer";

export const fictionalProviderProfiles: readonly ProviderProfile[] = [
  {
    id: "provider-a",
    name: "Provider A",
    shortName: "A",
    initials: "PA",
    description: "Fictional provider profile used to demonstrate comparison features.",
    serviceSummary: "Illustrative cash and bank payout options across supported sample corridors.",
    supportedPayoutMethods: ["Cash or bank"],
    supportChannels: ["Email", "Help center"],
    digitalAccess: ["Web", "Mobile app"],
    availabilityNote: "Illustrative availability varies by sample corridor and is not a live service claim.",
    profileStatus: "illustrative",
    accent: "emerald",
  },
  {
    id: "provider-b",
    name: "Provider B",
    shortName: "B",
    initials: "PB",
    description: "Fictional provider profile used to demonstrate comparison features.",
    serviceSummary: "Illustrative bank-deposit option with corridor-specific sample values.",
    supportedPayoutMethods: ["Bank deposit"],
    supportChannels: ["Email", "Phone"],
    digitalAccess: ["Web"],
    availabilityNote: "Shown only where a fictional bank-deposit offer exists in the prototype.",
    profileStatus: "illustrative",
    accent: "blue",
  },
  {
    id: "provider-c",
    name: "Provider C",
    shortName: "C",
    initials: "PC",
    description: "Fictional provider profile used to demonstrate comparison features.",
    serviceSummary: "Illustrative cash-pickup option emphasizing short sample delivery estimates.",
    supportedPayoutMethods: ["Cash pickup"],
    supportChannels: ["Phone", "Help center"],
    digitalAccess: ["Web", "Mobile app"],
    availabilityNote: "Cash-pickup coverage shown here is fictional and corridor-specific.",
    profileStatus: "illustrative",
    accent: "amber",
  },
  {
    id: "provider-d",
    name: "Provider D",
    shortName: "D",
    initials: "PD",
    description: "Fictional provider profile used to demonstrate comparison features.",
    serviceSummary: "Illustrative mobile-wallet option for supported sample corridors.",
    supportedPayoutMethods: ["Mobile wallet"],
    supportChannels: ["In-app help", "Help center"],
    digitalAccess: ["Mobile app"],
    availabilityNote: "Wallet availability and delivery timing are fictional prototype metadata.",
    profileStatus: "illustrative",
    accent: "violet",
  },
  {
    id: "provider-e",
    name: "Provider E",
    shortName: "E",
    initials: "PE",
    description: "Fictional provider profile used to demonstrate comparison features.",
    serviceSummary: "Illustrative bank-deposit option currently used in one sample corridor.",
    supportedPayoutMethods: ["Bank deposit"],
    supportChannels: ["Email"],
    digitalAccess: ["Web"],
    availabilityNote: "This fictional profile appears only where an explicit sample offer is defined.",
    profileStatus: "illustrative",
    accent: "blue",
  },
];

export function getProviderProfile(providerId: string): ProviderProfile | undefined {
  return fictionalProviderProfiles.find((profile) => profile.id === providerId);
}

export function getProviderProfiles(): ProviderProfile[] {
  return [...fictionalProviderProfiles];
}

export function getProviderPayoutMethods(providerId: string) {
  return [...(getProviderProfile(providerId)?.supportedPayoutMethods ?? [])];
}
