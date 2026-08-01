# TransferHub v0.1.0 — Interactive Prototype

## Overview

TransferHub v0.1.0 is an interactive prototype for exploring how money-transfer comparison could work. It is a product demonstration, not a transactional financial service.

All providers and values are fictional illustrative sample data. TransferHub does not currently initiate transfers.

## User-facing features

- Responsive homepage and waitlist navigation
- Six illustrative transfer corridors
- Validated send amounts and quick-amount controls
- Fee-aware illustrative recipient calculations
- Four sorting modes and typed payout-method filtering
- Responsive result cards and accessible provider details
- Development-only waitlist with success and duplicate states

## Technical foundation

- Next.js App Router, React, strict TypeScript, and Tailwind CSS
- Canonical domain types and immutable derived filtering/sorting
- Static application output with client-side comparison and waitlist interactions
- No external runtime integrations or added packages

## Accessibility highlights

- Keyboard-operable controls and visible focus states
- Associated labels and accessible validation feedback
- Provider-detail announcements, heading focus, Escape-to-close, and focus return
- Responsive semantic content with reduced-motion support

## Validation performed

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`
- Source-level architecture, data-integrity, accessibility, privacy, language, and repository review

## Manual release checklist

- Exercise every corridor, sort, payout filter, and amount-validation path
- Verify provider detail opening, replacement, Escape closing, and focus return
- Test waitlist success, duplicate detection, consent, invalid email, and reset behavior
- Test homepage anchors and waitlist navigation
- Check representative mobile, tablet, and desktop widths
- Test keyboard-only navigation and reduced-motion mode
- Review final disclosures and repository diff before release operations

## Known limitations

- No live quotes, provider availability, or provider integrations
- No transfer initiation, tracking, account, authentication, or payment functionality
- No backend waitlist storage or production email workflow
- No automated unit, integration, or end-to-end test suite
- Human cross-browser and assistive-technology testing remains a release checklist item

## Security and privacy notes

No credentials or payment information are requested. Waitlist entries are stored in browser `localStorage` for development only and are not appropriate for real public collection. This review does not certify production security, privacy compliance, or regulatory readiness.

## Next-phase roadmap

1. Define product, legal, privacy, security, and compliance requirements.
2. Add automated calculation and interaction tests.
3. Replace local waitlist storage with an approved server-side workflow.
4. Design authorized provider-data ingestion with freshness, attribution, and failure handling.
5. Conduct structured accessibility and cross-browser testing.
