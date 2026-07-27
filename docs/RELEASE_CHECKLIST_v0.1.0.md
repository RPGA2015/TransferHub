# TransferHub v0.1.0 Release Checklist

## Repository and validation

- [ ] Git status is clean
- [x] Correct branch: `release-v0.1-stabilization`
- [x] ESLint passes
- [x] TypeScript checking passes
- [x] Production build passes
- [ ] No unexpected generated files are tracked

## Manual product verification

- [ ] Homepage navigation and anchors
- [ ] All six illustrative corridors
- [ ] All four sorting modes
- [ ] All payout filters, result counts, empty state, and Clear filter
- [ ] Provider details opening, replacement, closing, Escape behavior, and focus return
- [ ] Waitlist validation, success, duplicate detection, and Use another email
- [ ] Keyboard-only testing
- [ ] Mobile, tablet, and desktop testing
- [ ] Fictional-data, local-storage, and non-transactional disclosures

## Documentation

- [x] README updated
- [x] Changelog updated
- [x] Release notes added
- [x] Project-health review added

## Release operations — do not perform until review is approved

- [ ] Merge stabilization branch to `main`
- [ ] Create annotated Git tag `v0.1.0`
- [ ] Create GitHub release from the approved release notes
