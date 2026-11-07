# Document Intelligence infrastructure row

## Objective
Add two secondary technology rows below the existing Document Intelligence stack, with six technologies per desktop row.

## Scope
- Keep the existing twelve-item editorial grid unchanged.
- Add a secondary twelve-item grid with six columns on desktop.
- Use the twelve user-provided local SVG logos.
- Preserve the current responsive behavior and verify the content contract and component rendering.

## Tasks
- [x] T1 — Extend the project technology model and content schema with a secondary technology list. Route: delegated, multi-file model/content/UI change.
- [x] T2 — Render the secondary list below the editorial grid as six desktop columns and add its six Document Intelligence entries. Route: delegated, multi-file behavior and content change. Reopened and corrected after the user clarified the intended one-row layout.
- [x] T3 — Add regression coverage and run focused verification. Route: delegated, component/content tests plus Astro check.
- [x] T4 — Add Amazon RDS, vLLM, Sentry, LangSmith, Grafana, and Amazon Bedrock as a second six-column row, then update regression coverage. Route: inline, established content-and-test pattern with mechanical edits.

## Acceptance criteria
- The twelve supplied secondary technologies render below the existing grid.
- The secondary grid forms two rows of six equal desktop columns, uses three tablet columns and one mobile column, and keeps the appropriate local logo paths.
- Existing twelve-item technology layout stays unchanged.
- Focused tests and `npm run check` pass, or failures are documented as pre-existing.

## Verification
- `npm test -- src/content/projects/document-intelligence.test.ts src/presentation/components/sections/TechnicalFoundation.test.ts`
- `npm run check`

## Delivery strategy
ask-on-risk; forecast: under 400 authored changed lines.

## Progress
Completed. Observed verification:
- `npm test -- src/content/projects/document-intelligence.test.ts src/presentation/components/sections/TechnicalFoundation.test.ts` — passed: 2 test files and 13 tests.
- `npm run check` — passed: 0 errors, 0 warnings, 0 hints.
- Live server verification — passed: 12 secondary technology cells and all six newly added technologies are present.

No work-unit commit has been created because the repository has pre-existing uncommitted work.
