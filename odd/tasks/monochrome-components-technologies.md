# Monochrome Components and Technologies

## Objective
Replace the case study's unformatted Spanish component inventory with a readable English two-column editorial table, preserving its surrounding disclosure and all other current content.

## Scope and constraints
- Add `src/presentation/components/sections/DocumentComponentsTable.astro` and `DocumentComponentsTable.test.ts`.
- Align the existing `DocumentLifecycle.test.ts` placement assertion with the user's current lifecycle heading; preserve the heading itself.
- Update only the import and the `COMPONENTS AND TECNOLOGIES` disclosure in the pre-existing untracked `src/content/case-studies/document-intelligence.mdx`.
- Use English copy, including the corrected disclosure title `Components & Technologies`.
- Preserve all 14 component entries and their technologies; explicitly distinguish current JSON/pilot SAF-T delivery from planned CSV/XML delivery, matching the existing export section.
- Inherit the article width, typography, surface and neutral case-study tokens. No accent colors, logos, badges, cards, vertical borders, shadows, new dependencies or runtime JavaScript.
- Desktop: approximately 35% component / 65% technology columns, thin horizontal separators. Mobile: each row stacks its component above the technologies without horizontal scrolling; preserve accessible table relationships.
- Preserve all unrelated and concurrent user edits, including the recently revised lifecycle heading and existing lifecycle component.

## Route and delivery
- T1 route: delegated direct, required by non-trivial component, MDX and test implementation.
- One coherent task; forecast approximately 220 additions/deletions, advisory only. Delivery strategy: ask-on-risk.
- Existing branch: `feat/document-intelligence-theme`.
- Do not stage or commit the existing untracked MDX or unrelated edits. Work-unit commit closure requires safe delta isolation first.
- RDD effective mode: on/global. Prior selectorless STATUS included unrelated tracked work and requested an explicit untracked inventory selection. Do not start a review over unrelated work; report isolated review unavailable rather than approved.

## Checklist
- [ ] T1: Implement, integrate and verify the English monochrome technology table. Implementation and functional/browser verification complete; work-unit commit/native review closure remains pending safe isolation.

## Acceptance and verification
- Default ODD test-first mode; no explicit strict mode established. Runner: Vitest.
- Observe a meaningful RED before implementation; GREEN afterwards.
- `npm test -- src/presentation/components/sections/DocumentComponentsTable.test.ts src/presentation/components/sections/DocumentLifecycle.test.ts`
- `npm run check`
- `npm run build`
- Verify 14 English rows, row/column header associations, optional AI status, export availability caveat, original disclosure placement and unchanged content outside the exact edit.
- Parent reruns focused tests. Independent source and responsive verification applies while native risk remains high/unassessable.
- Prior browser attempt was unavailable because Playwright expected Chromium 1208 while cache contained 1228; use only already installed compatible capabilities, no downloads or installations.
- Ordinary ignored test/build cache writes are expected verification outputs, not permission to change source.

## Progress
- Existing source verified: raw tab-separated Spanish inventory is inside a disclosure at MDX lines 383–401, separate from the lifecycle.
- Existing export section explicitly limits operational delivery to canonical JSON and a SAF-T-compatible pilot envelope; CSV/XML must not be presented as current delivery.
- Implemented static 14-row component, corrected English disclosure title and replaced only its Spanish inventory; eight new table tests pass.
- The required combined test initially reported 13 passes and one pre-existing failure: the lifecycle test still expected the older `(Step by Step)` heading. Parent made a one-line mechanical test update to match the current user-authored heading; no article-heading change.
- Writer `npm run check`: zero errors/warnings/hints. Writer build passed with existing font/chunk and npm configuration warnings.
- Preservation: original MDX SHA-256 `cf181d328aa365cb3017bd41529ef66b38080791ed7ca39889762fa85c75651b`. Reversing the intended integration restores original bytes except one final newline normalized by the patch tool; removing that newline in memory reproduces the original SHA. This harmless EOF normalization is accepted and recorded, not claimed byte-identical preservation.
- Parent and independent verifier observed 14/14 tests passing. Independent check: 84 files, zero errors/warnings/hints; build passed, 12 pages.
- Independent browser verification succeeded with existing Playwright and explicit cached Chromium 1228 executable, without installations. At 375/768/1440px, table fits article, no horizontal overflow, correct stacked/two-column presentation and native accessible table roles.
- Confirmed candidate-caused readability defect: nested em sizing yields table text 8.44px and caveat 6.33px at narrow viewports (12.25/9.19px at 1440px). Reopen T1 for one bounded typography correction inside the new component, not global styles.
- Typography acceptance: computed table text at least 14px and export caveat at least 12px at tested widths. Use root-relative sizing with explicit readable floors so disclosure nesting cannot compound it. Recheck layout, colors and disclosure semantics after correction.
- Applied one bounded correction: table `font-size: max(14px, 1rem)` and note `font-size: max(12px, 0.875rem)`; no other source changes during correction.
- Final parent rerun: two test files, 14 tests passed. Writer final check: 84 files with zero errors/warnings/hints; build passed, 12 pages. No source-mutating normalization after checks.
- Independent browser GREEN: at 375x812 and 768x1024 text/note are 14/12px; at 1440x900 they are 16/14px. Tables measure 304.84/436.83/635px respectively and remain inside article bounds, without document or component horizontal overflow at ordinary root sizes. Mobile stacks; desktop columns remain 35/65.
- At 375px with a 24px root, text/note grow to 24/21px and table remains within viewport. Existing page overflow is 470px with disclosure both closed and open, so not introduced by this table.
- Browser accessibility tree: one table, 15 rows, two column headers, 14 row headers and 14 cells. All four screenshots visually inspected; fixed navigation obscures the top strip in captures, but separate geometry and clipping assertions pass. Screen-reader announcements not tested.
- Screenshots: approved external temporary directory, `odd-components-typography-375x812.png`, `odd-components-typography-768x1024.png`, `odd-components-typography-1440x900.png`, and `odd-components-typography-375x812-root24.png`. Own isolated browser/server cleaned up.
- Commit/native review closure: pending isolated candidate; no human changes staged.
- Engram mirror: pending; prior writes failed due to ambiguous active runtime sessions.
- Next: isolate this task's delta before any work-unit commit/native review, without including pre-existing human work. Resynchronize Engram mirror when runtime identity ambiguity is resolved.
