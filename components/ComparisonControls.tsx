import type { PayoutFilter, SortOption } from "@/lib/types/transfer";
import type { Dictionary } from "@/lib/i18n/types";

type ComparisonControlsProps = {
  sortBy: SortOption;
  payoutFilter: PayoutFilter;
  onSortChange: (value: SortOption) => void;
  onFilterChange: (value: PayoutFilter) => void;
  dictionary: Dictionary;
};

export default function ComparisonControls({ sortBy, payoutFilter, onSortChange, onFilterChange, dictionary }: ComparisonControlsProps) {
  const copy = dictionary.comparison;
  const sortExplanations: Record<SortOption, string> = { best: copy.sortBestExplanation, fee: copy.sortFeeExplanation, fastest: copy.sortFastestExplanation, recipient: copy.sortRecipientExplanation };
  return (
    <div className="w-full sm:w-auto">
      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="payout-filter" className="grid gap-1 text-xs font-bold text-slate-700">
        {copy.payoutMethod}
        <select id="payout-filter" value={payoutFilter} onChange={(event) => onFilterChange(event.target.value as PayoutFilter)} className={
  payoutFilter === "all"
    ? "comparison-control min-w-40 py-2 text-xs"
    : "comparison-control min-w-40 border-blue-400 bg-blue-50 py-2 text-xs font-semibold text-blue-800"
}>
          <option value="all">{copy.allPayoutMethods}</option>
          <option value="Bank deposit">{copy.bankDeposit}</option>
          <option value="Cash pickup">{copy.cashPickup}</option>
          <option value="Mobile wallet">{copy.mobileWallet}</option>
          <option value="Cash or bank">{copy.cashOrBank}</option>
        </select>
        </label>
        <label htmlFor="sort-results" className="grid gap-1 text-xs font-bold text-slate-700">
        {copy.sortBy}
        <select id="sort-results" value={sortBy} onChange={(event) => onSortChange(event.target.value as SortOption)} className="comparison-control min-w-40 py-2 text-xs">
          <option value="best">{copy.bestValue}</option>
          <option value="fee">{copy.lowestFee}</option>
          <option value="fastest">{copy.fastest}</option>
          <option value="recipient">{copy.highestRecipient}</option>
        </select>
        </label>
      </div>
      <p className="mt-2 max-w-sm rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium leading-5 text-slate-600" aria-live="polite" aria-atomic="true">
        {sortExplanations[sortBy]}
      </p>
    </div>
  );
}
