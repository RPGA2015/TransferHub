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

Milestones 2 and 3 separate transfer types, country definitions, fictional provider identities, corridor offers, pure comparison behavior, and currency formatting. Milestone 4 adds transparent derived metrics and deterministic ranking. Milestone 5 adds directional corridor support. Milestone 6A adds a data-driven Transfer Marketplace for discovering the ten current illustrative corridors. The visual design remains consistent. Every route and value is fictional and illustrative.

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

Open [http://localhost:3000](http://localhost:3000). The marketplace is at [http://localhost:3000/marketplace](http://localhost:3000/marketplace), and the waitlist is at [http://localhost:3000/waitlist](http://localhost:3000/waitlist).

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
- Haiti → United States
- Dominican Republic → United States
- Haiti → Canada
- Dominican Republic → Canada

### Directional corridors and country capabilities

Corridors are explicit one-way records with an origin, destination, send currency, receive currency, and fictional provider offers. A reverse corridor is never generated or assumed: Canada → Haiti and Haiti → Canada are separate data records. An unsupported direction returns a safe empty comparison with the neutral message “This illustrative transfer corridor is not available yet.”

Country metadata has canonical `Country` and `CountryCode` types plus `canSend` and `canReceive` capability flags. United States, Canada, Haiti, and Dominican Republic currently support both capabilities; France currently supports sending only. Capabilities describe intended direction support, but the form uses actual corridor records as its source of truth.

The From Country list contains only origins with at least one outgoing corridor. The To Country list contains only destinations explicitly available from the selected origin. Changing origins selects the first valid destination only when the prior destination is unavailable. This edits form selections without replacing the submitted comparison. Country swapping follows the same rule: it is enabled only when the exact reverse corridor exists and does not run a comparison automatically.

Recipient amounts are calculated locally as:

```text
max(send amount - numeric fee, 0) × numeric illustrative exchange rate
```

Numeric values remain numbers until display formatting. Filtering creates a filtered provider list, and sorting operates on a copied array, so the canonical corridor data is not mutated.

The comparison flow is data-driven: a `ComparisonRequest` identifies a corridor, amount, sort mode, and payout filter; `compareTransfers` looks up the corridor, enriches its raw offers with fictional provider identity and calculated recipient amounts, filters, copies and sorts the results, and returns a `ComparisonResult` with a visible count. Unsupported corridors safely return an empty result.

### Smart Comparison Engine

Every visible `ProviderResult` contains numeric derived metrics. Formatting occurs only in the UI:

```text
recipientAmount = max(normalized amount - normalized fee, 0) × normalized exchange rate
totalCost = normalized amount + normalized fee
feePercentage = normalized amount > 0 ? normalized fee / normalized amount × 100 : 0
deliveryScore = existing numeric delivery rank (lower is faster)
valueScore = recipientAmount
rankPosition = one-based position after filtering and deterministic sorting
```

`valueScore` deliberately contains no weighted blend or hidden preference. Recipient amount determines value order; fee and delivery are visible tie-breakers. Invalid, negative, or non-finite numeric inputs are normalized to safe non-negative metrics, and a fee that consumes the effective send amount produces a zero recipient amount.

Sort rules are deterministic:

- Best value: highest recipient amount, then lower fee, faster delivery, and provider name.
- Lowest fee: lower fee, then highest recipient amount, faster delivery, and provider name.
- Fastest: faster delivery rank, then highest recipient amount, lower fee, and provider name.
- Highest recipient amount: highest recipient amount, then lower fee, faster delivery, and provider name.

Provider names are used only as the final stable tie-break. Descriptive badges do not affect sorting. Rankings compare the currently visible fictional results under the selected sort mode; they are not recommendations, endorsements, live quotes, or claims about provider quality.

### Rich Illustrative Provider Profiles

Provider identity and profile metadata live once in `lib/data/providers.ts`; corridor offers reference stable `ProviderId` values and retain only corridor-specific fees, rates, delivery estimates, and payout methods. The comparison engine safely enriches each offer with its reusable profile and leaves source data unchanged.

Each fictional `ProviderProfile` may contain:

- Stable ID, fictional name, optional short name, initials, and neutral color accent
- Concise description and service summary
- Supported illustrative payout methods
- Illustrative support-channel and digital-access labels
- Neutral availability note
- Required `profileStatus: "illustrative"` marker

These fields are presentation metadata only. They do not contain or imply licensing, regulatory approval, security certification, longevity, customer ratings, review counts, reliability, partnership, endorsement, guaranteed availability, or real contact details.

Badges are calculated from the current visible illustrative results after payout filtering. Best Value uses the documented recipient/fee/delivery tie-break order, Lowest Fee and Fastest use their deterministic comparison orders, and Wallet Delivery describes a visible mobile-wallet offer. Profiles never assign or override comparison badges, and badges do not change sorting.

If a corridor offer has no matching profile, the engine keeps its numeric comparison usable and displays “Illustrative provider information unavailable” instead of crashing or rendering empty labels.

## Transfer Marketplace

`/marketplace` is a responsive discovery page generated from canonical country, corridor, provider-offer, and marketplace metadata. It does not maintain a duplicate corridor list or calculate transfer values.

- Search is immediate, case-insensitive, whitespace- and separator-normalized, and matches origin names, destination names, combined corridor text, and fictional provider names resolved from canonical profiles.
- Region filters are generated from the regions represented by current corridor endpoints: Caribbean, Europe, and North America.
- `featured`, `recentlyAdded`, and `displayPriority` are optional typed corridor metadata. Featured routes are explicitly selected rather than described as genuinely popular or trending. Recently added routes are never inferred from array order.
- Result counts are announced politely, and empty results provide a neutral Clear filters action.
- Each semantic corridor card shows direction, currencies, fictional offer count, deduplicated payout methods, and explicit metadata labels.

“Compare this corridor” links use the stable corridor ID in `/?corridor=<id>#compare`. The homepage validates the ID against corridor data on the server, ignores malformed or unsupported values, and initializes both the editable form and its illustrative preview to the same valid direction. The amount remains editable and no comparison submission or loading sequence is triggered. With no valid query, the existing United States → Haiti default remains unchanged. Fragment scrolling follows the site’s reduced-motion CSS preference.

Marketplace discovery remains local prototype behavior: there are no accounts, cross-device synchronization, live availability, or external storage.

## Multilingual foundation

TransferHub supports English (`en`), Haitian Creole (`ht`), French (`fr`), and Spanish (`es`), with English as the default locale. Application pages use locale-prefixed App Router paths: `/<lang>`, `/<lang>/marketplace`, and `/<lang>/waitlist`. The legacy `/`, `/marketplace`, and `/waitlist` entry points redirect to their English equivalents and preserve query strings; comparison links include the active locale.

Typed first-party dictionaries live under `lib/i18n/dictionaries/`, while `lib/i18n/types.ts` defines the shared shape and `lib/i18n/config.ts` owns locale validation, display names, and formatting-locale mappings. To add a translation key, add it to `Dictionary`, provide the English canonical copy, then supply reviewed copy for every locale. To add a locale, extend `locales`, `localeFormats`, and `localeNames`, create a matching dictionary, and register it in `lib/i18n/dictionaries.ts`.

Country, region, and payout labels are localized presentation mappings. Canonical country names, corridor IDs, provider IDs, query keys, currency codes, and storage values never change. Marketplace search includes canonical and active-locale country labels while retaining case-insensitive separator normalization and provider-name matching.

The language switcher uses language names rather than flags, marks the active language accessibly, keeps the equivalent route, and carries the current search string and hash fragment during activation. Favorites, pins, recent corridors, and waitlist entries retain their locale-independent `localStorage` keys, so switching languages neither duplicates nor erases stored data.

Number and currency output uses `en-US`, `ht-HT`, `fr-FR`, or `es` conventions when supported. If `ht-HT` is unavailable, formatting safely falls back to `en-US`; currency codes remain visible and calculations are unchanged.

Translations are maintained locally without an external service. Haitian Creole, French, and Spanish copy requires native-speaker and legal review before public use, particularly disclosures and remittance terminology. The next planned milestone is automated locale-route, dictionary-completeness, interaction, and visual-regression coverage.

### Personal Workspace

The marketplace now supports browser-local favorites, pinned favorites, and recently selected corridors. Workspace data stores only canonical corridor IDs under the versioned key `transferhub_marketplace_workspace_v1`; it never stores provider offers, fees, rates, amounts, recipients, names, emails, or payment information.

- Favorite controls add or remove a corridor from the saved workspace. Removing a favorite also removes its pin.
- Pinning is available only after a corridor is a favorite. Pins and favorites remain separate ordered ID lists, and pinned cards appear before other favorites.
- Activating “Compare this corridor” records that valid corridor as recent without replacing semantic link navigation. Direct valid corridor-query visits are also recorded, while malformed IDs are ignored.
- Recent corridors are deduplicated, most-recent-first, and limited to six. Selecting an existing recent route moves it to the front. Recents can be cleared with one browser-local action.
- Personal workspace summaries remain visible when discovery search or region filters change; only Browse all corridors follows those filters.

The storage service validates version and shape, removes obsolete corridor IDs, handles malformed JSON and unavailable storage without crashing, and never synchronizes data. Clearing this browser’s storage removes the workspace. Saved state is not backed up, encrypted by TransferHub, associated with an account, or available on another browser or device.

To test locally, favorite and pin several marketplace cards, activate more than six distinct comparison links, return to `/marketplace`, and reload. Verify saved ordering, the six-item recent limit, favorite removal unpinning, and Clear recent corridors. Then remove `transferhub_marketplace_workspace_v1` in browser developer tools to verify the workspace returns to its empty state.

### Extending illustrative data

- Add or update one canonical country definition in `lib/data/countries.ts`, including its code, label, currency, and directional capability flags.
- Add one fictional provider profile to `lib/data/providers.ts`, extend `ProviderId` and other narrow unions only as needed, and keep every profile field neutral and explicitly illustrative.
- Associate an offer by its stable `providerId` in `lib/data/corridors.ts`. Keep corridor-varying fee, rate, delivery, and payout values in the offer rather than the profile.
- Add each supported direction as its own corridor in `lib/data/corridors.ts`, with `fromCountry`, `toCountry`, `sendCurrency`, `receiveCurrency`, and fictional offers. Add the reverse direction separately only when it is actually supported.
- Add optional `featured`, `recentlyAdded`, or `displayPriority` metadata only when the route should appear in those marketplace sections. Add or reuse endpoint region metadata in `lib/data/countries.ts`.
- Dropdowns and swap availability derive automatically from corridor data; UI logic does not need editing when a valid directional corridor is added.
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

The next planned v0.2.0 milestone is automated locale, profile, comparison-engine, interaction, and visual-regression coverage. Product and compliance requirements remain prerequisites to any transactional functionality. A future live-data design would also require an authorized provider-data contract with freshness and failure states; none is connected in this prototype.
