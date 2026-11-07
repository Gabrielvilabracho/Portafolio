# Monochrome Document Lifecycle

## Objective and rationale
Add a readable, monochromatic five-stage overview immediately below `The Document Lifecycle (Step by Step)` in the Document Intelligence case study. Keep the existing detailed sections intact.

## Authorized scope and constraints
- Add one native Astro component and its focused rendering/integration test.
- Import and render it in the existing, pre-existing untracked `src/content/case-studies/document-intelligence.mdx`.
- Preserve all unrelated worktree changes, including the rest of that MDX file.
- Inherit the article's 42rem reading column, surface, typography and neutral theme tokens. No accent colors, cards, shadows, icons, animation, Mermaid, iframe or new dependencies.
- Use semantic ordered content, short English descriptions, subtle decorative connectors, and a vertical responsive layout.
- Human review remains required; do not claim full ERP integration.

## Delivery and route
- Strategy: ask-on-risk. Forecast: approximately 160 authored changed lines; one coherent work unit.
- Route: delegated direct. Trigger: component, MDX integration and focused test require writing multiple non-trivial files.
- Existing branch: `feat/document-intelligence-theme`.
- Do not stage or commit existing human changes. The target MDX is already untracked and contains substantial prior work; any commit including its full contents would exceed the requested delta. Commit boundary remains pending safe isolation.
- RDD: on (global). Initial assessment unassessable because untracked inventory requires explicit declaration; this is not a low-risk result. Native review must not silently include unrelated edits.

## Checklist
- [ ] T1: Implement the monochromatic lifecycle overview, integrate it beneath the lifecycle H2, and verify rendering and placement. Implementation and functional checks complete; isolated commit/review closure remains pending.

## Acceptance criteria
- Five ordered stages: Intake, Extraction, Validation, Review & Approval, Export.
- Numbers are not duplicated in accessible text; connectors are decorative.
- Uses neutral existing theme tokens, without orange or status colors.
- Fits the article width on desktop and mobile without fixed height or horizontal scrolling.
- Existing detailed article content remains unchanged apart from the import and component insertion.

## Verification
- Test-first mode: default ODD test-first policy, no explicit repository strict mode established. Runner: Vitest.
- Observe RED for a focused test using the existing Astro rendering pattern, then implement GREEN.
- `npm test -- src/presentation/components/sections/DocumentLifecycle.test.ts`
- `npm run check`
- `npm run build`
- Parent reruns the focused test and inspects the exact task delta. If risk is high/unassessable or native review is unavailable, use independent technical verification.
- No mutating formatter after checks or review freeze.

## Progress and evidence
- Exploration complete: insertion is before `### Intake` in the case-study MDX; neutral tokens verified in `caseStudyThemes.ts`.
- Added `src/presentation/components/sections/DocumentLifecycle.astro` (74 lines), its test (79 lines), and exactly three MDX integration lines. Total task delta: 156 additions, zero removals.
- Writer observed functional RED (4 failures, 2 passes) before GREEN (6 passes); earlier harness failures were corrected before functional RED. No separate refactor was necessary.
- `npm test -- src/presentation/components/sections/DocumentLifecycle.test.ts`: six tests passed in the writer, parent spot check, and independent verifier.
- `npm run check`: writer observed 82 files, zero errors, warnings or hints.
- `npm run build`: passed; writer reported 12 pages. Build emitted six unresolved font references and a large-chunk warning; npm emitted an unknown `allow-scripts` configuration warning. No unrelated fixes attempted.
- Article preservation: removing only the new import and invocation restores the original 557 lines and SHA-256 `0376b3c6120365d26f475d576dc892594e837096d4ea7160a1d09b346932c630`, independently confirmed.
- Independent inspection found no component-specific defects. Scoped list selectors override article-wide list rules; native numbering avoids duplicated numeric text.
- Browser verification unavailable: the installed Playwright expected Chromium build 1208, but the available cache was build 1228. No installation or retry; the verifier's temporary loopback server was closed. Viewports 375x812, 768x1024 and 1440x900 remain unverified visually.
- Verifier reported blocked because required Vitest execution wrote its ordinary ignored `node_modules/.vite/.../results.json` cache. Source targets remained unchanged; no cache cleanup was attempted. Treat source/test evidence separately from unavailable browser proof.
- Native selectorless STATUS returned `intended_untracked_selection_required` with a partial forecast (step 1, collect). Its candidate includes unrelated tracked changes; no START, consent, review or acknowledgement ran. Native review remains unavailable for an isolated task candidate, not approved or declined.
- Commit: pending safe isolation; no user changes staged.
- Engram mirror: pending; write failed because multiple active runtime sessions match this project. No session identity was invented.
- Next: visually confirm the component when a compatible browser is available; isolate only this task's delta before any work-unit commit or native review. Preserve all concurrent user changes.
