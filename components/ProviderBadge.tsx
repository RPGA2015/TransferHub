import type { ProviderResult } from "@/lib/illustrativeComparisonData";

export default function ProviderBadge({ provider }: { provider: ProviderResult }) {
  return <span className={`badge badge-${provider.accent}`}>{provider.badge}</span>;
}
