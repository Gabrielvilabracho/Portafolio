# Repair relocated public image references

## Objective and problem
Restore website images after the user reorganized public assets into subdirectories. Existing runtime URLs still point at old locations.

## Authorized scope and constraints
- Update references to existing files only. Do not delete, move, restore, or replace any assets.
- Preserve all pre-existing tracked and untracked work, including case-study copy, spacing, logo, and diagram.
- Keep layouts, styling, image contents, and external links unchanged.
- Use the existing BASE_URL-aware helpers.
- The old SVG favicon no longer exists; reference the existing favicon.ico with the matching MIME type.
- No staging, commits, pushes, or remote operations are authorized by this request.

## Plan and routing
Delivery strategy: ask-on-risk. Forecast: approximately 150–250 authored changed lines, generated files excluded. One coherent path-repair work unit. Existing feature branch is retained. Commit identity: not applicable, local edits only.

- [x] T1: Add a regression check, observe failure for stale image references, then repair confirmed runtime paths and affected test expectations. Route: delegated direct, because 12 runtime files plus tests need coordinated changes.
- [ ] T2: Verify focused tests, all tests, production build, and output/base-path checks. Confirm public inventory and content are unchanged, record every failure, and independently spot-check the architecture asset with its whitespace-containing filename. Route: writer self-verification plus proportional independent checking.

## Acceptance criteria
- Confirmed moved-image references resolve to the correct existing destinations.
- Runtime favicon points to a real asset with the correct MIME type.
- New regression test checks real source image paths without treating remote URLs, fragments, data URIs, or synthetic fixtures as public files.
- No public files are deleted or changed, and unrelated work is preserved.

## Applicable checks
Default test-first policy: deterministic asset existence regression should observe RED before runtime changes and GREEN afterward. Runner: `npm test -- src/utils/publicAssetReferences.test.ts`.

Required verification:
1. `npm test -- src/utils/publicAssetReferences.test.ts src/content/projects/document-intelligence.test.ts src/presentation/components/sections/DocumentIntelligenceWorkflow.test.ts src/presentation/components/sections/InteractiveSvgViewer.test.tsx src/utils/withBase.test.ts src/content/case-studies/case-study-links.test.ts`
2. `npm test`
3. `npm run build`
4. `npm run test:pages-output`

Known pre-existing check mismatch: scripts/assert-pages-build.mjs expects an earlier standalone iframe-based case-study article rather than its current linked PNG. Establish exact failure before changing sources. Repair its favicon assertion only; do not undo the article or broaden into unrelated assertion rewrites.

## Progress and evidence
- Read-only audit: 22 stale runtime occurrences, 14 distinct moved URLs across 12 files; six related test expectations; missing old favicon.svg with existing favicon.ico available.
- Parent spot check confirmed old Frame 9-2.svg reference and its new web_pices directory location.
- RDD mode: on (global). Assessment returned high/unassessable because untracked files require explicit selection. Selectorless native STATUS returned a partial forecast: step 1, kind collect, reason intended_untracked_selection_required, description intended untracked selection required. No START, reviewer, approval, or acknowledgement ran; preflight includes unrelated human changes and the schema-bound external selection is not available through this runtime's tools. Native review remains unavailable/pending, not approved. Independent high-tier verification was performed instead without changing the review preference.
- T1 RED: `npm test -- src/utils/publicAssetReferences.test.ts` exited 1: the real-source existence check found 22 unique missing file/path pairs (including the favicon; duplicate literals within one file are deduplicated). Three extraction/normalization tests passed.
- T1 GREEN: the same exact command passed all four tests after repairing 22 moved-image runtime occurrences, one adjacent portrait comment, the favicon URL/MIME, six real test expectations, and only the Pages favicon assertion.
- Destinations: all 14 mapped image destinations plus `public/favicon.ico` confirmed present before edits. Existing helper calls and all unrelated human edits retained.
- Base output: `npm run test:pages-output` exited 1 before runtime edits: `case-studies/document-intelligence/index.html: missing components section before the connections and protocols section.` This reproduces the known article mismatch at `scripts/assert-pages-build.mjs:138`.
- Baseline snapshot: `/var/folders/x2/r6ds_znd1z98lk8m8vczdddr0000gn/T/opencode/relocated-public-images-baseline.json` records allowed-file hashes, reversible reference substitutions, and public/nonallowed path-and-content manifest hashes.
- T2 writer verification: all four commands ran in the foreground, in the required order. Required checks are not all green; T2 remains unchecked. Independent verification and the parent spot check subsequently completed, as recorded below.
- `npm test -- src/utils/publicAssetReferences.test.ts src/content/projects/document-intelligence.test.ts src/presentation/components/sections/DocumentIntelligenceWorkflow.test.ts src/presentation/components/sections/InteractiveSvgViewer.test.tsx src/utils/withBase.test.ts src/content/case-studies/case-study-links.test.ts`: exit 1; 18 passed, one failed across six files. Failure: supporting technology names (`Bedrock`, `RDS`, `Smith` versus expected `Amazon Bedrock`, `Amazon RDS`, `LangSmith`); no image assertion failed.
- `npm test`: exit 1; 119 passed, 31 failed across 27 files (five failed files). Exact failing test names are recorded below. These additional failures are not covered by the parent's known-failure allowance; handoff status is partial. No unrelated content or tests were repaired.
- `npm run build`: exit 0; production static build completed. Nonfatal warnings: six existing MonumentGrotesk font URLs unresolved at build time; client chunk exceeds 500 kB; npm unknown user config `allow-scripts`.
- `npm run test:pages-output`: exit 1; same exact pre-edit article-heading failure at line 138. The updated ICO favicon assertions and earlier base-path scans passed before reaching that failure.
- Preservation: before/after path-and-SHA256 manifest matched for all 65 public files (`697db2a82b4d3079b5cc7874e4453ad5d3b3c8d476c23c62bde09dfc0a995cc8`) and all 160 nonallowed files under `src`, `public`, `scripts`, and `odd` (`3d703bb3e30da1d81d512b01769449dced0f25769f35d85f4c807e95667a15e6`). Build output/caches excluded.
- Allowed-surface proof: reversing only this task's exact path/favicon substitutions in memory reproduced all 16 pre-edit source/test/script hashes, including the four human-modified files. Nothing was restored or rewritten for this check.
- Stale-reference check: all 14 old mapped URLs absent from 65 real non-test source files. Built project HTML contains `/Portafolio/imagenes/web_pices/Frame 9-2.svg`; the destination with ordinary spaces exists. Encoded-space/base/query/fragment handling passed the regression's alternate-case test.
- Authored diff forecast at handoff: approximately 230–270 changed lines, generated lines and existing human changes excluded; measured code/test/script contribution is 64 changed lines plus the 108-line new regression, with the remainder in this evidence log. No normalization/formatter needed or run. Commit identity: none, not authorized.
- Scoped `git diff --check` passed; favicon diff readback confirms the output-script edit is limited to lines 94–99. Final preservation manifests still match the baseline. No check was skipped or left running.
- Independent read-only verifier confirmed matching manifests for all 65 public files and 160 nonallowed files; in-memory substitution reversal reproduced all 16 edited existing-file hashes. All public files were also present byte-identically in dist.
- Independent compiled-output audit parsed 49 HTML files and three linked CSS files: 448 image-reference occurrences, 40 distinct targets, zero missing targets, and zero image URLs outside the expected /Portafolio base. Remote/data URLs and the non-live generated visual-check gallery were excluded.
- Independent architecture spot check passed for the actual web_pices/Frame 9-2.svg, matching test expectation, and all four localized project pages. All 48 built favicon links resolve to the existing ICO with image/x-icon MIME.
- Parent reran `npm test -- src/utils/publicAssetReferences.test.ts`: all four tests passed. No browser/hydration/network check was performed.
- Engram full-document mirror: pending due to multiple active runtime sessions; local document is authoritative until synchronization succeeds. Recovery summary saved successfully through the documented independent project CLI as observation #7473, topic bugfix/relocated-public-images.

## Next step
The requested image-reference repair is implemented and independently verified, with no remaining missing live static image targets found. T2 remains partial only because required unrelated content/rendering checks are not green and native review is pending. Do not change those unrelated tests/content without separate authorization. Recovery summary is persisted independently as Engram observation #7473; full task-document mirror can be synchronized when MCP session ambiguity is resolved.

## Required-check failure ledger
Exact test names from `npm test` (31 total); not repaired by this image-reference task:

### src/content/projects/document-intelligence.test.ts (1)
- `keeps the supporting technology narrative, fields, and complete name set` — shortened technology labels do not match the expected names.

### src/presentation/components/sections/ProjectOverview.test.ts (1)
- `maps every overview navigation anchor to a rendered section` — `NoMatchingRenderer: Unable to render InteractiveSvgViewer`; no valid `.tsx` renderer.

### src/presentation/components/sections/DocumentComponentsTable.test.ts (5)
- `renders exactly fourteen English component and technology pairs in order`
- `retains table and header relationships when the mobile layout stacks rows`
- `labels the alternative backend as optional rather than primary`
- `distinguishes operational export from planned CSV/XML delivery`
- `binds all exported inventory data in the actual MDX between lifecycle and connections`
Observed symptoms: Spanish/current labels versus English expectations, absent matching rows, and changed article headings.

### src/presentation/components/sections/DocumentConnections.test.ts (17)
- `names the diagram and presents three English groups beneath the article H2`
- `connects User to Next.js / BFF using exactly HTTPS · Clerk session in the ordered spine`
- `connects Next.js / BFF to Go API using exactly HTTP REST · JWT in the ordered spine`
- `connects Go API to Temporal using exactly gRPC · mTLS in the ordered spine`
- `connects Temporal to Python Workers using exactly Task Queues in the ordered spine`
- `associates Supporting Connections: Go API to PostgreSQL with exactly pgx`
- `associates Supporting Connections: Go API to Amazon S3 with exactly S3 API`
- `associates Supporting Connections: Go API to Clerk with exactly HTTPS / JWKS`
- `associates Supporting Connections: Python Workers to Internal Go API with exactly HTTP · Service token`
- `associates Supporting Connections: Python Workers to FastAPI Gateway with exactly HTTP`
- `associates Supporting Connections: Python Workers to Amazon S3 with exactly S3 API`
- `associates Model Access: FastAPI Gateway to Amazon Bedrock with exactly via LiteLLM`
- `associates Model Access: FastAPI Gateway to vLLM / Qwen with exactly OpenAI-compatible API`
- `associates Model Access: Layout / OCR Worker to GLM-OCR with exactly OpenAI-compatible API`
- `contains only the thirteen supplied routes and keeps queue categories adjacent to Temporal`
- `resolves every group and list accessible reference to its visible heading`
- `binds every exported connection inside an open disclosure before System Boundaries`
Observed symptoms: translated labels/group headings and queue text versus English expectations, missing matching routes, and a closed disclosure versus the expected open state.

### src/presentation/components/sections/DocumentLifecycle.test.ts (7)
- `renders the actual MDX without an extra H1, empty headings or runtime scripts`
- `keeps The Document Lifecycle outside a common disclosure with its original visibility` — `SecurityError: localStorage is not available for opaque origins`.
- `keeps Components & Technologies outside a common disclosure with its original visibility`
- `keeps Connections & Protocols outside a common disclosure with its original visibility`
- `opts in only the three outer editorial disclosures to readable typography`
- `preserves all eleven nested evidence controls and thirteen code examples`
- `gives the eight translated boundaries and unchanged thresholds real H2 sections`
Other observed symptoms: missing expected CONTAVIA text node, English headings/IDs and readable disclosure hooks, and nested-control counts differing from expectations.
