import type { PayoutFilter, SortOption } from "@/lib/types/transfer";

type ComparisonControlsProps = {
  sortBy: SortOption;
  payoutFilter: PayoutFilter;
  onSortChange: (value: SortOption) => void;
  onFilterChange: (value: PayoutFilter) => void;
};

const sortExplanations: Record<SortOption, string> = {
  best: "Highest illustrative recipient amount, with fee and speed used as tie-breakers.",
  fee: "Lowest illustrative provider fee.",
  fastest: "Shortest illustrative delivery estimate.",
  recipient: "Largest calculated illustrative recipient amount.",
};

export default function ComparisonControls({ sortBy, payoutFilter, onSortChange, onFilterChange }: ComparisonControlsProps) {
  return (
    <div className="w-full sm:w-auto">
      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="payout-filter" className="grid gap-1 text-xs font-bold text-slate-700">
        Payout method
        <select id="payout-filter" value={payoutFilter} onChange={(event) => onFilterChange(event.target.value as PayoutFilter)} className="comparison-control min-w-40 py-2 text-xs">
          <option value="all">All payout methods</option>
          <option value="Bank deposit">Bank deposit</option>
          <option value="Cash pickup">Cash pickup</option>
          <option value="Mobile wallet">Mobile wallet</option>
          <option value="Cash or bank">Cash or bank</option>
        </select>
        </label>
        <label htmlFor="sort-results" className="grid gap-1 text-xs font-bold text-slate-700">
        Sort by
        <select id="sort-results" value={sortBy} onChange={(event) => onSortChange(event.target.value as SortOption)} className="comparison-control min-w-40 py-2 text-xs">
          <option value="best">Best value</option>
          <option value="fee">Lowest fee</option>
          <option value="fastest">Fastest</option>
          <option value="recipient">Highest recipient amount</option>
        </select>
        </label>
      </div>
      <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500" aria-live="polite" aria-atomic="true">
        {sortExplanations[sortBy]}
      </p>
    </div>
  );
}
