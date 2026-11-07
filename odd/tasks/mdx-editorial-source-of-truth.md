# MDX Editorial Source of Truth

## Objective and rationale
Restore the Document Intelligence MDX article as the single editorial source for its lifecycle, technology inventory and connection diagram. Components own presentation, not hardcoded article copy. Harmonize the three section headings and content insets without changing their initial visibility or technical claims.

## Allowed scope
- `src/content/case-studies/document-intelligence.mdx`
- `src/presentation/components/sections/DocumentLifecycle.astro`
- `src/presentation/components/sections/DocumentLifecycle.test.ts`
- `src/presentation/components/sections/DocumentComponentsTable.astro`
- `src/presentation/components/sections/DocumentComponentsTable.test.ts`
- `src/presentation/components/sections/DocumentConnections.astro`
- `src/presentation/components/sections/DocumentConnections.test.ts`
- `src/presentation/components/ui/Disclosure.astro` (additive opt-in readable typography only; existing defaults unchanged)
- `src/presentation/components/ui/Disclosure.test.ts` (opt-in/default behavior coverage)

## Contract and constraints
- MDX exports the editorial objects and passes them explicitly through typed, required component props. Include stages, descriptions, table rows/headers/notes, diagram group titles, node names, mechanisms, queues and accessible labels. No duplicate runtime defaults or separate content files. Stable semantic group/source identifiers may remain with data; root IDs and ARIA wiring remain renderer-owned.
- Preserve five lifecycle stages, 14 technology rows, 13 connections, three queue categories, review/export limitations and all code evidence. Structural IDs and CSS stay in renderers.
- Put the three section H2 headings outside their common Disclosure containers. Preserve lifecycle/table initially closed; connections gains a matching Disclosure with `defaultOpen` to remain initially visible. Keep nested evidence disclosures intact.
- Remove the empty heading preceding technologies and replace the additional article H1 with a non-H1 text treatment, preserving the CONTAVIA wording; layout already supplies the page H1.
- Give the existing boundaries and threshold tail real English section headings. English translations may preserve the Spanish boundary bullet meanings; do not invent or strengthen behavior. Preserve every numeric threshold, including the questionable `5%`, and disclose it as unresolved. Do not silently reconcile contradictory review-policy wording.
- Preserve monochrome tokens, responsive proportions/connectors and root-relative readability floors. Confirmed browser failure authorizes one bounded correction: local lifecycle font floor and an optional readable Disclosure variant used only by these three outer wrappers. Default shared-disclosure typography and unrelated uses remain unchanged. No global CSS/layout/schema/config/dependency changes.
- Preserve all existing/concurrent edits outside these surfaces and untouched article content. Read current bytes before writing.

## Route and delivery
- T1 route: delegated direct. Seven related non-trivial files and MDX-to-component contract migration require one bounded writer.
- Forecast approximately 550 authored added/deleted lines, mostly content moves and tests. This exceeds the 400-line planning heuristic naturally; do not minify, omit tests or split artificially. Strategy ask-on-risk; chain choice is deferred until any next commit/PR is actually proposed.
- Existing branch `feat/document-intelligence-theme`; no staging/commits of pre-existing human work. Safe isolated work-unit commit boundary remains pending.
- RDD on/global; the worktree contains extensive unrelated tracked/untracked changes. Native review must not include those implicitly; unassessable risk stays high and requires independent verification, never fabricated approval.

## Checklist
- [ ] T1: Migrate all editorial copy to MDX props, normalize section structure, and verify configurable renderers plus the actual article integration. Prior candidate was verified; current MDX integration is invalidated by the fresh state described in R1. Preserve historical evidence below, but do not apply its PASS claims to current bytes.
- [ ] R1: Repair only the current MDX: close System Limits, restore required editorial data/component bindings, and verify the current page while preserving current authored content. Build/data/render repair complete; overall verification remains partial (29 failing tests and disclosed visual/accessibility follow-ups), with no isolated commit/native approval.

## R1 authorized repair boundary
- User explicitly approved repairing only `src/content/case-studies/document-intelligence.mdx`, preserving its current text. The broader historical T1 edit surface is not renewed; all components, tests, styles, configuration and other articles are read-only for R1.
- Route: delegated direct, because diagnosis/preparation and the MDX repair are coupled. Forecast approximately 250 authored added/deleted lines; one coherent repair, no forced size slicing. No staging or commits of pre-existing human work.
- Fresh diagnosis: System Limits opens without a closing tag; lifecycle is invoked without required label/stages; inventory and protocols are current plain text without renderer data/bindings. No merge-conflict markers found. Do not attribute the divergence to an actor or restore an old snapshot over current text.
- Capture current bytes before editing; preserve current prose, code examples, thresholds, terminology/language and system-boundary claims. Convert current inventory/connection facts into renderer data rather than silently replacing them with an older article. Close System Limits after its boundary bullets, leaving thresholds and lessons outside.
- Restore named `lifecycle`, `componentInventory`, and `connections` exports plus required bindings using the unchanged renderer contracts. Labels/accessibility copy may use current section titles; no editorial defaults in component code and no duplicate visible raw inventories/maps.
- Preserve existing collapse choices and evidence nesting unless syntax/integration repair requires moving the exact section boundary. Remove only genuinely empty headings around repaired sections; no wider redesign or translation.
- Observe a fresh failing build before the fix. Then run the four-file focused test command, Astro check and build listed below. If an existing test conflicts with preserved current editorial wording, report it honestly; do not edit tests or rewrite user content merely to satisfy an obsolete snapshot.
- Independent verification must inspect fresh built page, not stale dist. A remaining visual overflow is separate from fixing this build/data-contract break; no CSS edits are authorized in R1.

## Verification
- Default ODD test-first policy, no explicit strict mode established. Observe meaningful RED for required-prop rendering and MDX binding, then GREEN.
- `npm test -- src/presentation/components/sections/DocumentLifecycle.test.ts src/presentation/components/sections/DocumentComponentsTable.test.ts src/presentation/components/sections/DocumentConnections.test.ts src/presentation/components/ui/Disclosure.test.ts`
- `npm run check`
- `npm run build`
- Prefer real rendered MDX and exported-data integration checks over brittle adjacent source-string snapshots. Test alternate editorial props so renderers cannot silently ignore article data.
- Parent reruns the focused tests. Independent source/browser verification checks the whole article, not isolated blocks only: one H1, no empty headings, valid hierarchy/disclosures, common title/content alignment, preserved initial visibility, five stages/14 rows/13 edges, and nested evidence controls.
- Browser widths 375, 768, 1440px plus enlarged root text; no component-induced horizontal overflow. Existing Playwright 1.58.2 works with explicit cached Chromium 1228 and an isolated loopback static server, no installations or user-session reuse.
- Source-mutating normalization precedes verification. Known unrelated warnings: npm allow-scripts, font URLs, large chunks, favicon 404 and enlarged-root page overflow; do not repair them.

## Progress and next step
- Read-only mapping complete: current content is hardcoded in three components, with mixed wrappers and an empty heading in the MDX.
- Initial seven-file refactor complete. Three MDX named exports now supply required readonly renderer props, including accessible labels; no production editorial defaults remain in renderers. Direct real MDX import/render with registered `@astrojs/mdx/server.js` works inside Astro Container.
- Writer observed five functional RED failures and 31 passes, then 45 tests GREEN. Parent and independent verifier reran 45/45 passing. Independent Astro check: 86 files, zero errors/warnings/hints; build passed with known warnings.
- Whole-article browser checks confirm one H1, no empty headings/skipped levels, common H2/disclosure alignment, preserved closed/closed/open visibility and keyboard/click controls, 11 nested evidence disclosures and 13 examples. Production five stages/14 rows/13 edges/three queues preserved.
- Confirmed readability failure: 375/768px root 11.02px plus relative Disclosure sizing yields lifecycle 10.85px and outer summaries 9.64px. One bounded typography correction is authorized on the two exact UI paths above, MDX outer-wrapper uses and lifecycle local font; no unrelated disclosure defaults change.
- Stable semantic group/source IDs in MDX are an accepted data identity, as explicitly allowed in the worker contract; root IDs and rendering ARIA wiring remain in components. No duplicate IDs or broken references observed.
- Numeric `5%` and conditional-vs-mandatory review wording remain factual follow-ups, not authorization to change claims.
- One bounded readability correction complete: `Disclosure` has default-off `readable` prop/class with root-relative floors on its own direct-child trigger/content; only three MDX outer wrappers opt in. Default/evidence/governance controls are not directly targeted. Lifecycle uses a local root-relative 14px minimum.
- Correction test-first proof: three functional failures and 48 passes before implementation; final 51/51 tests across four files passed in writer and parent rerun. Final Astro check: 86 files, zero errors/warnings/hints; build passed with known warnings. No source edits after final checks.
- Final independent browser verification confirms one H1, no empty/skipped headings, identical H2/wrapper alignment, common content inset, closed/closed/open initial visibility, keyboard/click controls, 11 nested evidence controls and 13 examples. Three named exports and explicit content bindings remain verified.
- At 375/768px, lifecycle/table/diagram main text and three outer summaries/content are at least 14px; notes/protocols at least 12px. At 1440px, main text 16px and notes/protocols 14px; at root24, main 24px and notes/protocols 21px. No painted renderer text escapes its bounds.
- Whole-page limitation remains: current 375px document widths are 375 initial, 384 with three outer wrappers open and 497 with all disclosures open. At root24 they are 470/667/913px. Hiding all three renderer bodies does not change open-state widths, but this is current attribution only, not historical base equivalence. Expanded detailed content/layout still overflows; do not claim the entire article is overflow-free. No further out-of-scope wrapping repair performed.
- Sixteen final screenshots under the approved external temporary directory, `mdx-final-{initial,lifecycle,inventory,connections}-{375x812,768x1024,1440x900,375x812-root24}.png`, were visually inspected. Renderer presentation/alignment/readability passes; expanded-page overflow is disclosed separately. Own browser and server cleaned up, no installations/session reuse.
- Commit/native review closure pending safe isolation. Engram mirror pending due to repeated runtime-session ambiguity.
- R1 initial diagnosis superseded prior GREEN: fresh `npm run build` failed on an unclosed System Limits Disclosure; the article had lost the verified data exports/bindings while renderer contracts remained required. User authorized MDX-only repair, not rollback or component changes. R1 results follow below.
- R1 writer changed only application MDX (467 to 536 lines, +69 net), closed System Limits after eight bullets, restored three named exports/imports/required bindings, transformed raw inventory/map without duplicate visible sections and removed three empty headings. All 17 current disclosures remain initially closed; no readability/defaultOpen opt-ins or translation imposed.
- R1 preservation proof: all 14 original name/technology pairs unchanged; 13 fenced examples retain SHA-256 `94030843ef58b0ffc4b8d1d9c6d64be36c69f3b3e7dfa9ee92d2390da0bb22d7`; 10 code-evidence and one database-evidence control retained. In-memory reversal (excluding added final LF) reproduces original SHA `e6a81aaae92c709eef56109d3e21d1c979995d3af188016df3167444e7868b90`. Final MDX SHA `616204a68becaa264d3ab59f1b7e0c291fca9ccc3501d37535d50161128469c7`. Original bytes were writer-held; independent verification does not claim historical byte reproduction.
- R1 RED: fresh build observed the unmatched Disclosure at line 444. Final writer Astro check passed (86 files, zero diagnostics), build passed; parent reran build successfully and read the closing boundary at line 523. Known npm/font/chunk warnings unchanged.
- R1 focused tests remain RED: writer and independent verifier observed 22 passed / 29 failed across four files. Independent classification: 20 current-vs-old editorial value mismatches, eight older structural/visibility expectations, and one opaque-origin JSDOM `SecurityError`. Do not claim all failures are harmless or fixed. No unauthorized test edits made.
- R1 independent fresh-browser check: HTTP 200 and zero page errors at 375x812 and 1440x900; 17 initially closed controls, five stages, 14 current Spanish rows, 13 mechanisms, three queues, separate Layout/OCR-to-GLM-OCR path, unique valid ARIA references and proper table headers. Thresholds/lessons outside System Limits. No undefined data, serialized objects, duplicate IDs or extra raw map. Own browser/server cleaned up; no installs/session reuse.
- R1 remaining visual issue localized: with all disclosures open at 375px, page width 420px; inline code path `db/migrations/tenant_template/0037_document_type_candidate.up.sql` has width 371.4px and right edge around 418px with normal wrapping. Initial and three repaired sections/System Limits open remain 375px; desktop remains 1440px. No CSS counterfactual/fix authorized in R1.
- R1 other remaining issues: current mobile summaries 9.64px and surrounding disclosure prose 10.85px versus renderer 14px; Spanish connection data sits inside the unchanged renderer's `lang="en"`. These are not repaired by restoring syntax and bindings. Tests need current editorial-contract reconciliation and the JSDOM diagnostic needs isolation, not source overwriting.
- R1 four screenshots captured/read in approved external temporary directory: `mdx-repair-verify-initial-375.png`, `mdx-repair-verify-initial-1440.png`, `mdx-repair-verify-opened-375.png`, `mdx-repair-verify-opened-1440.png`. They prove current page/sections render, not an all-page layout PASS.
- Next: report partial verification plainly. Broader test, inline-code wrapping, language metadata and typography changes require separate authorization outside the MDX-only repair. Keep factual 5%/review-policy questions separate. Isolate exact deltas before any commit/native review, preserving human work; synchronize Engram when session ambiguity is resolved.
