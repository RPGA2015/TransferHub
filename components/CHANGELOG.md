# TransferHub Changelog

This document records meaningful product changes completed during each development sprint.

## Sprint 3B — Comparison UX Refinement

### Added

- Typed payout-method filtering for bank deposit, cash pickup, mobile wallet, and cash-or-bank results
- Visible-result counts and a clearable no-match state
- Reusable comparison controls and provider badge components

### Improved

- Sorting now operates on filtered results without mutating corridor data
- Mobile results use distinct stacked cards while desktop retains the comparison table
- Selected-result, hover, and details-panel entrance styling
- Sprint status and fictional-data documentation

### Accessibility

- Provider detail buttons expose `aria-expanded` and `aria-controls`
- Details receive heading focus when opened and close with Escape
- Closing returns focus to the originating View details button when it remains available
- Live announcements explain detail opening, closing, and filter-driven dismissal
- Existing focus visibility and reduced-motion support remain intact

### Verified

- All six illustrative corridors, four sorting modes, payout filters, calculations, validation, quick amounts, and loading state
- Provider selection is preserved by sorting and cleared by incompatible filters or successful new comparisons
- Homepage navigation and waitlist behavior remain unchanged
- ESLint, TypeScript checking, and the Next.js production build pass

### Limitations

- Provider names, rates, fees, delivery estimates, payout methods, and rankings remain fictional sample data
- Filtering reflects only the bundled sample and does not indicate current availability
- TransferHub does not initiate transfers and claims no provider partnership, endorsement, or integration

---

## Sprint 3A — Provider Details

### Added

- Accessible “View details” actions for illustrative provider results
- Reusable Provider Details component
- Transfer corridor and send-amount summary
- Provider fee and illustrative exchange-rate details
- Recipient amount, delivery estimate, and payout-method details
- Fee-breakdown explanation
- Exchange-rate explanation
- Delivery and payout summary
- Ranking and badge explanation
- Important sample-data disclosure
- Close-details action
- Accessible status announcements and keyboard support

### Improved

- Provider selection workflow
- TypeScript type safety using the shared `ProviderResult` type
- Responsive comparison experience
- Provider-result accessibility
- Separation of comparison and provider-detail components

### Verified

- Provider details open for each fictional provider
- Selecting another provider replaces the current details
- Closing the details panel works
- Sorting continues to work
- New comparisons clear outdated provider details
- Amount and corridor calculations remain correct
- Waitlist functionality remains intact
- ESLint passes
- TypeScript checking passes
- Next.js production build passes

### Limitations

- Provider names and comparison values are fictional
- Rates, fees, availability, payout methods, and delivery estimates are illustrative
- TransferHub does not currently initiate or process transfers
- No provider partnership, endorsement, or integration is claimed

---

## Sprint 2C — Provider Sorting

### Added

- Best-value sorting
- Lowest-fee sorting
- Fastest-delivery sorting
- Highest-recipient-amount sorting
- Immediate result reordering without rerunning a comparison

---

## Sprint 2B — Dynamic Illustrative Comparisons

### Added

- Six illustrative transfer corridors
- Dynamic sending and receiving currencies
- Fee-aware recipient calculations
- Quick amount buttons
- Amount validation
- Illustrative corridor-specific provider results

---

## Sprint 2A — Comparison Search

### Added

- Sending-country selector
- Receiving-country selector
- Amount input
- Interactive comparison preview

---

## Sprint 1B — Waitlist Experience

### Added

- Dedicated waitlist page
- Email and consent validation
- Duplicate-email detection
- Success and already-registered states
- Development-only browser storage

---

## Sprint 1A — Product Foundation

### Added

- TransferHub marketing homepage
- Responsive fintech design
- Comparison preview
- Features, roadmap, FAQ, and transparency sections
- Initial Git and GitHub project setup
