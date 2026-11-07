# Monochrome Connections and Protocols

## Objective
Replace the raw Spanish ASCII connections section with a native, English, monochromatic three-part architecture diagram that remains readable within the case-study article.

## Scope and acceptance
- Add `src/presentation/components/sections/DocumentConnections.astro` and `DocumentConnections.test.ts`.
- Align one existing `DocumentComponentsTable.test.ts` placement assertion with the authorized English replacement of the following section, without weakening inventory coverage.
- In existing untracked `src/content/case-studies/document-intelligence.mdx`, add one import and replace only the empty heading immediately before `Conexiones y protocolos`, the ASCII map and its three queue bullets with `## Connections & Protocols` plus the component.
- Preserve the adjacent Components & Technologies disclosure, lifecycle, and following `3. Límites del sistema` block verbatim. English applies to the requested connections section, not unrelated article content.
- Three ordered visual groups: Main Request Flow, Supporting Connections, Model Access. Inherit the existing 42rem reading column and neutral surface/text/border tokens.
- Static semantic HTML and CSS; no runtime scripts, images, logos, cards, colored status markers, iframe, Mermaid, new dependencies or external diagram artifact.
- Component text at least 14px, protocol labels at least 12px, root-relative sizing without compounded em shrinking. Reflow rather than shrinking on mobile; no component horizontal overflow.
- Preserve every connection: User → Next.js/BFF (HTTPS, Clerk session); BFF → Go API (HTTP REST, JWT); Go API → Temporal (gRPC, mTLS); Temporal → Python Workers (Task Queues). Queue types: general, GPU, layout/OCR processing.
- Go API dependencies: PostgreSQL via pgx, S3 via S3 API, Clerk via HTTPS/JWKS.
- Python Workers dependencies: internal Go API via HTTP/service token, FastAPI Gateway via HTTP, S3 via S3 API.
- Model paths: FastAPI Gateway → Amazon Bedrock via LiteLLM; FastAPI Gateway → vLLM/Qwen via OpenAI-compatible API; Layout/OCR Worker → GLM-OCR via OpenAI-compatible API. Do not invent Worker → PostgreSQL or GLM-OCR through the general gateway. Do not mislabel SDKs/adapters as network protocols.

## Route and delivery
- T1: delegated direct; component, content integration and behavioral tests require multiple non-trivial files.
- Forecast approximately 330 authored added/deleted lines, advisory only. Strategy ask-on-risk. Existing branch `feat/document-intelligence-theme`.
- Preserve all pre-existing/concurrent work. No staging or commits that include existing human changes; work-unit closure pending safe isolation.
- RDD on/global; existing native preflight includes unrelated tracked work and asks untracked selection. Assessment failures remain high/unassessable, not low risk. Never claim native approval or review unrelated work.

## Checklist
- [ ] T1: Implement the three English connection groups and verify all edges, integration and responsive presentation. Implementation and functional/browser verification complete; commit/native review closure remains pending safe isolation.

## Verification
- Default ODD test-first policy; Vitest runner, no explicit strict mode established. Observe meaningful RED then GREEN for topology/content integration.
- `npm test -- src/presentation/components/sections/DocumentConnections.test.ts src/presentation/components/sections/DocumentComponentsTable.test.ts src/presentation/components/sections/DocumentLifecycle.test.ts`
- `npm run check`
- `npm run build`
- Parent focused-test spot check; independent source and browser verification while task cannot be isolated for native assessment.
- Existing installed Playwright 1.58.2 works with explicit cached Chromium 1228 executable. Use isolated loopback static server over dist, clean it up, no installs/session reuse.
- Check 375x812, 768x1024, 1440x900 plus enlarged root font: no diagram-induced overflow or clipping; measured minimum text sizes, thin neutral connectors, readable screenshots, decorative arrows excluded from accessible text. Long article may scroll vertically.
- Known unrelated warnings: npm `allow-scripts`, six unresolved font paths, large chunk; missing favicon and enlarged-root page overflow predate this task. Do not fix them.

## Progress
- Verified source target at MDX lines 392–423; following system-boundaries section starts at line 424.
- Implementation complete: static three-part diagram preserves all 13 edges and three queues. Writer observed functional RED (16 intended failures) followed by 17 new tests passing.
- Initial combined run: 30 passed, one stale table-integration assertion failed because it required the removed Spanish ASCII section. Parent updated that one assertion to the new English H2/component; the table coverage remains intact.
- Writer Astro check: 86 files, zero errors/warnings/hints. Build passed with the known npm/font/chunk warnings.
- MDX preservation: reversing only import and replacement restores all original 16,487 bytes and SHA-256 `16851060a94d5bf57787ebf71240a80cbd38aa57ecba87ab575e3c0db3972169`, including final LF. No scratch file or unrelated article change.
- Latest native assessment remains high/unassessable because untracked selection is required; no unrelated native review or commit started.
- Parent focused rerun and independent verification: three test files, 31/31 tests passed. Independent Astro check: 86 files, zero errors/warnings/hints. Independent static build passed; known warnings unchanged.
- Independent source and browser inspection found no scoped implementation defects. Browser accessibility snapshots confirmed three named regions, ordered main flow and four source-associated branch lists; arrows remain decorative.
- Browser checks used installed Playwright 1.58.2 with explicit cached Chromium 1228, fresh isolated contexts and own loopback static server; all owned browser/server instances cleaned up. No installs or user-session access.
- At 375x812, 768x1024 and 1440x900, component widths are 330.94px, 462.92px and 672px; text/protocol minimums 14/12px, 14/12px and 16/14px. All 13 mechanisms and three queues visible, no component/text horizontal overflow or clipping.
- At 375px with a 24px root, component width 279px and text/protocols 24/21px. Pre-existing page width 470px is unchanged with component shown/hidden; no diagram-induced overflow.
- All four final unobscured screenshots visually inspected: `odd-connections-unobscured-375x812.png`, `odd-connections-unobscured-768x1024.png`, `odd-connections-unobscured-1440x900.png`, `odd-connections-unobscured-375x812-root24.png` under the approved external temporary directory. Visual inspection passed. Screen-reader announcements were not tested.
- Final verification involved no source-mutating normalization. Native review/commit closure still pending isolated candidate; no native approval claimed.
- Engram mirror pending: previous writes fail due to multiple matching runtime sessions; do not invent identity.
- Next: isolate only this task's changes before any commit/native review, preserving all pre-existing work; resynchronize Engram when runtime session ambiguity is resolved.
