# TransferHub

TransferHub is an early-stage money-transfer comparison prototype, initially focused on transfers to Haiti. Version 0.1.0 demonstrates how someone could compare fictional provider results and join a development-only waitlist. TransferHub does not currently initiate, process, or track transfers.

All provider names, fees, rates, payout methods, delivery estimates, badges, and recipient amounts are fictional illustrative sample data. They are not live quotes, recommendations, endorsements, or evidence of provider relationships.

## v0.1.0 scope

- Responsive marketing homepage and navigation
- Six illustrative sending and receiving corridors
- Amount validation, quick amounts, and fee-aware recipient calculations
- Best value, lowest fee, fastest, and highest-recipient-amount sorting
- Typed payout-method filtering and visible result counts
- Accessible fictional-provider detail panels
- Development-only waitlist with validation and browser-local duplicate detection
- Responsive layouts for mobile, tablet, and desktop

## Technology

- Next.js 16 App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- ESLint with Next.js Core Web Vitals and TypeScript rules

No backend, live provider API, analytics service, authentication system, or external database is connected.

## Local setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The waitlist is at [http://localhost:3000/waitlist](http://localhost:3000/waitlist).

Useful commands:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## Project structure

```text
app/          App Router pages, metadata, and global styles
components/   Comparison, provider-detail, and waitlist UI
lib/          Canonical illustrative data and shared domain types
public/       Static prototype assets
docs/         Project-health and release checklists
```

`Country`, `ProviderResult`, `PayoutMethod`, and the six corridors are defined in `lib/illustrativeComparisonData.ts`. Interactive state and calculations remain in client components; pages and layout remain server components where browser interactivity is unnecessary.

## Illustrative comparison model

Supported sample corridors:

- United States → Haiti
- United States → Dominican Republic
- Canada → Haiti
- Canada → Dominican Republic
- France → Haiti
- France → Dominican Republic

Recipient amounts are calculated locally as:

```text
max(send amount - numeric fee, 0) × numeric illustrative exchange rate
```

Numeric values remain numbers until display formatting. Filtering creates a filtered provider list, and sorting operates on a copied array, so the canonical corridor data is not mutated.

## Accessibility highlights

- Associated labels and accessible validation messages
- Keyboard-operable comparison, filter, sorting, detail, and waitlist controls
- Visible focus indicators
- Provider detail state exposed with `aria-expanded` and `aria-controls`
- Focus movement into provider details and return to the originating button
- Escape-to-close behavior and polite status announcements
- Semantic headings and decorative-icon hiding
- Reduced-motion support

## Waitlist storage

Waitlist entries use browser `localStorage` under `transferhub_waitlist_v1`. This is temporary development behavior:

- Data remains only in the browser and device where it was entered.
- Clearing browser storage removes the entry.
- Entries are not synchronized, backed up, or protected as production application data.
- Duplicate detection is limited to that browser.

Do not collect real public signups with this implementation.

## Sprint history

- Sprint 1A: responsive marketing homepage and illustrative comparison preview
- Sprint 1B: validated development-only waitlist and duplicate detection
- Sprint 2A: interactive transfer search controls
- Sprint 2B: six dynamic illustrative corridors and fee-aware calculations
- Sprint 2C: four result-sorting modes
- Sprint 3A: accessible contextual provider details
- Sprint 3B: payout filtering, responsive result cards, refined focus behavior, and component cleanup
- v0.1.0 stabilization: architecture, accessibility, language, documentation, and release-health review

See [CHANGELOG.md](CHANGELOG.md) and [RELEASE_NOTES_v0.1.0.md](RELEASE_NOTES_v0.1.0.md) for release detail.

## Production limitations

Before any public or transactional launch, TransferHub requires authorized and resilient provider-data integrations, quote freshness and attribution, server-side validation, a secure database, privacy and retention workflows, abuse protection, authentication and authorization where needed, monitoring, operational support, and appropriate legal and compliance review. Accessibility and cross-browser testing also require human verification on supported devices and assistive technologies.

The current prototype makes no claim of production security, regulatory approval, provider endorsement, guaranteed availability, or guaranteed results.

## Proposed next phase

Prioritize product and compliance requirements before adding transactional functionality. Replace the waitlist storage with an approved server-side workflow, define a provider-data contract with freshness and failure states, add automated tests for calculations and interactions, and conduct structured accessibility, privacy, security, and legal reviews.
