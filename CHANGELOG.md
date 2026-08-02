# TransferHub Changelog

## Unreleased — v0.2.0

### Added

- Added one fictional Provider E bank-deposit offer to the existing United States → Haiti corridor: 1.50 USD illustrative fee, 131.05 illustrative exchange rate, and same-day illustrative delivery
- Added reusable en-US currency, recipient-amount, exchange-rate, and display-prefix utilities
- Added numeric total-cost, fee-percentage, delivery-score, value-score, and visible-rank metrics to enriched provider results
- Added live sort explanations, visible recipient-amount range summaries, and neutral “How this option compares” details

### Changed

- Refactored comparison components to consume derived comparison results instead of calculating, filtering, sorting, or formatting corridor data locally
- Kept interactive form, loading, sorting, payout filtering, empty states, result counts, provider-detail focus behavior, disclosures, and responsive layouts intact
- Refined all four sort modes with explicit deterministic tie-break chains and stable provider-name ordering

### Comparison logic

- Defined value score as recipient amount without hidden weighting; fee and delivery are used only as documented tie-breakers
- Assigned one-based rank positions after payout filtering and sorting so positions describe the current visible results
- Normalized invalid, negative, overflowing, and boundary calculation inputs to prevent negative recipient amounts, `NaN`, or `Infinity`
- Kept source corridor and provider arrays immutable during enrichment, filtering, ranking, and sorting

### Accessibility

- Added polite live updates for the factual explanation associated with each selected sort mode
- Added a live visible-result count and recipient-range summary that updates after filtering and comparison changes
- Kept provider detail focus entry, Escape-to-close, focus return, and filtered-provider closure behavior intact

### Architecture

- Centralized transfer types in `lib/types/transfer.ts`
- Split country definitions, corridor offers, and fictional provider identity metadata across `lib/data/`
- Added a pure comparison service for corridor lookup, safe amount handling, recipient calculations, enrichment, filtering, immutable sorting, and visible-result counts
- Removed `lib/illustrativeComparisonData.ts` after migrating all consumers, leaving no duplicate active data source or dead compatibility exports

### Verified

- ESLint and strict TypeScript checking pass after the architecture refactor
- Production build and whitespace validation are included in the completion validation for this milestone
- Smart comparison formulas, deterministic tie-breakers, visible ranks, and detail derivation are covered by strict static checks and production-build validation

### Limitations

- Every provider identity, fee, rate, payout method, delivery estimate, badge, and recipient amount remains fictional and illustrative
- No live quotes, provider APIs, database, analytics, authentication, payment service, endorsement, or recommendation is present
- Automated engine and interaction tests remain planned for the next v0.2.0 milestone
- Rankings describe only the currently visible fictional sample results and must not be interpreted as provider recommendations

---

## v0.1.0 — Interactive Prototype

### Added

- Responsive marketing homepage, six illustrative corridors, comparison calculations, sorting, and payout filtering
- Fictional provider details with fee, rate, delivery, payout, ranking context, and disclosures
- Development-only waitlist validation and browser-local duplicate detection
- Release notes, project-health review, and release checklist

### Improved

- Canonical shared domain types and numeric-until-display calculations
- Mobile result cards, desktop comparison alignment, selected-result styling, and restrained motion
- Neutral prototype language that avoids unsupported trust or security claims
- Stable provider-details close callback and repository-level documentation organization

### Accessibility

- Associated field labels, validation focus, visible focus states, and polite status announcements
- Keyboard-accessible sorting, filtering, provider selection, closing, and waitlist controls
- Detail heading focus, Escape-to-close, focus return, `aria-expanded`, and `aria-controls`
- Reduced-motion support and decorative-icon treatment

### Documentation

- Expanded setup, architecture, data-model, accessibility, privacy, and production-limitation guidance
- Added release notes, project-health assessment, and an operational release checklist

### Verified

- ESLint, strict TypeScript checking, Next.js production build, and whitespace validation
- Static generation of `/`, `/_not-found`, and `/waitlist`
- Source review of all six corridors, sorting/filtering composition, provider details, and waitlist states

### Known limitations

- All providers and comparison values are fictional illustrative sample data
- TransferHub does not initiate transfers and has no live provider integrations
- Waitlist data is stored only in the current browser for development
- Automated interaction tests and formal cross-browser/assistive-technology testing are not yet present

---

## Sprint 3B — Comparison UX Refinement

- Added payout filtering, result counts, clearable empty state, responsive cards, and reusable controls
- Improved provider-detail focus, Escape behavior, focus return, live announcements, and selected-state styling

## Sprint 3A — Provider Details

- Added contextual fictional-provider details, disclosures, ranking explanations, and accessible selection

## Sprint 2C — Provider Sorting

- Added best-value, lowest-fee, fastest, and highest-recipient-amount sorting

## Sprint 2B — Dynamic Illustrative Comparisons

- Added six corridors, dynamic currencies, numeric calculations, quick amounts, and validation

## Sprint 2A — Comparison Search

- Added interactive corridor and amount controls

## Sprint 1B — Waitlist Experience

- Added validation, consent, browser-local storage, duplicate detection, and result states

## Sprint 1A — Product Foundation

- Added the responsive marketing homepage, navigation, roadmap, FAQ, and transparency sections
