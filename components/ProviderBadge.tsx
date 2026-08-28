import type { ProviderResult } from "@/lib/types/transfer";

export default function ProviderBadge({ provider }: { provider: ProviderResult }) {
  if (!provider.badge) return null;
  return <span className={`badge badge-${provider.accent} whitespace-nowrap`}>{provider.badge}<span className="sr-only"> in this illustrative comparison</span></span>;
}
