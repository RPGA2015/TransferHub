# TransferHub

TransferHub.info is an early-stage money-transfer comparison experience, initially focused on transfers to Haiti. The product is designed around the idea: **One App. Every Transfer.**

Provider and comparison information displayed in this project is illustrative. The project does not claim provider partnerships, endorsements, live integrations, live rates, regulatory approval, or transfer-processing capability.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dedicated waitlist is available at [http://localhost:3000/waitlist](http://localhost:3000/waitlist).

## Sprint status

- Sprint 1A: completed — responsive marketing homepage and illustrative comparison preview.
- Sprint 1B: completed — accessible waitlist form, validation, duplicate detection, success states, and homepage integration.
- Sprint 2A: completed — responsive transfer search controls and client-side comparison updates.
- Sprint 2B: completed — dynamic illustrative corridor results, fee calculations, validation, quick amounts, and responsive result cards.
- Sprint 2C: completed — sortable illustrative comparison results.
- Sprint 3A: completed — accessible provider selection, contextual explanations, disclosures, and provider details.
- Sprint 3B: implemented — payout-method filtering, refined focus and keyboard behavior, responsive result cards, and reusable comparison controls and badges.

## Illustrative comparison data

All rates and provider results are fictional sample data. They are not current market rates, quotes, endorsements, or evidence of provider integrations. Sprint 2B supports these sample corridors:

- United States → Haiti
- United States → Dominican Republic
- Canada → Haiti
- Canada → Dominican Republic
- France → Haiti
- France → Dominican Republic

For each fictional provider, the displayed recipient amount is calculated locally as `max(send amount - fee, 0) × illustrative exchange rate`. No transfer is initiated.

Filtering and sorting are performed locally against the same fictional provider data. They do not request live quotes or indicate real-world provider availability.

## Sprint 1B storage

Waitlist entries currently use browser `localStorage` under the key `transferhub_waitlist_v1`. This is strictly temporary development/testing storage:

- Data exists only in the browser and device where it was entered.
- Clearing browser storage removes it.
- It is not synchronized, backed up, encrypted as application data, or suitable for production collection.
- Duplicate detection is limited to that browser’s stored entries.

Do not collect real public signups with this implementation.

## Next production step

Replace `localStorage` with a secure server-side API and database. Add server-side validation, consent/audit records, abuse protection, encryption and retention controls, privacy workflows, and an approved transactional email provider for confirmation and unsubscribe handling before public launch. Comparison functionality also requires authorized, secure server-side provider-data integrations, freshness labeling, and resilient error handling before it can display real provider information.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```
