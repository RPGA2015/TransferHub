# TransferHub

TransferHub is an early-stage money-transfer comparison prototype, initially focused on transfers to Haiti. Version 0.2.0 is in development and refines the illustrative comparison architecture introduced in v0.1.0. TransferHub does not currently initiate, process, or track transfers.

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

## v0.2.0 development status

Milestones 2 and 3 separate transfer types, country definitions, fictional provider identities, corridor offers, pure comparison behavior, and currency formatting. The homepage and comparison experience remain visually unchanged. As a small scalability demonstration, the United States → Haiti corridor now includes one additional fictional Provider E bank-deposit offer with a 1.50 USD fee, a 131.05 illustrative exchange rate, and same-day illustrative delivery.

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
app/                    App Router pages, metadata, and global styles
components/             Comparison, provider-detail, and waitlist UI
lib/types/transfer.ts   Canonical transfer-domain types
lib/data/               Country, corridor, and fictional-provider data
lib/services/           Pure comparison lookup, enrichment, filtering, and sorting
lib/utils/              Shared en-US currency and exchange-rate formatting
public/                 Static prototype assets
docs/                   Project-health and release checklists
```

The former `lib/illustrativeComparisonData.ts` module was removed after all imports moved to responsibility-specific modules, leaving one active source for each kind of data. Interactive state remains in client components; pure derivation lives in the comparison service; pages and layout remain server components where browser interactivity is unnecessary.

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

The comparison flow is data-driven: a `ComparisonRequest` identifies a corridor, amount, sort mode, and payout filter; `compareTransfers` looks up the corridor, enriches its raw offers with fictional provider identity and calculated recipient amounts, filters, copies and sorts the results, and returns a `ComparisonResult` with a visible count. Unsupported corridors safely return an empty result.

### Extending illustrative data

- Add a country definition and currency to `lib/data/countries.ts`, then include its name in the appropriate sending or receiving list.
- Add a fictional provider identity to `lib/data/providers.ts` and extend the narrow provider unions in `lib/types/transfer.ts` when a new identity, badge, or accent is required.
- Add a corridor or provider offer in `lib/data/corridors.ts`. Corridor offers contain only corridor-specific numeric fee/rate data plus delivery and payout values; UI logic does not need editing.
- Keep every identity and value explicitly fictional. Do not use real provider trademarks, imply a partnership or recommendation, or present values as live quotes.

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

The next planned v0.2.0 milestone is automated unit coverage for the pure comparison engine and focused interaction tests for validation, filtering, sorting, and provider-detail focus behavior. Product and compliance requirements remain prerequisites to any transactional functionality. A future live-data design would also require an authorized provider-data contract with freshness and failure states; none is connected in this prototype.
