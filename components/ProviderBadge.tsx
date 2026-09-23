import type { ProviderResult } from "@/lib/types/transfer";

type ProviderBadgeProps = {
  provider: ProviderResult;
  labels: {
    bestValue: string;
    lowestFee: string;
   walletDelivery: string;
    fastest: string;
  };
};

export default function ProviderBadge({ provider, labels }: ProviderBadgeProps) {
  if (!provider.badge) return null;

  const badgeLabel =
    provider.badge === "Best Value"
      ? labels.bestValue
      : provider.badge === "Lowest Fee"
        ? labels.lowestFee
: provider.badge === "Fastest"
    ? labels.fastest
    : provider.badge === "Wallet Delivery"
      ? labels.walletDelivery
      : provider.badge;

  return (
    <span className={`badge badge-${provider.accent} whitespace-nowrap`}>
      {badgeLabel}
      <span className="sr-only"> in this illustrative comparison</span>
    </span>
  );
}
