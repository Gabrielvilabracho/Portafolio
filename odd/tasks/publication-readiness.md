# Publication readiness

## Objective
Publish the accumulated portfolio work without changing its current design or editorial content.

## Scope and constraints
- Preserve all pre-existing work; no resets, force pushes, or secret publication.
- Repair stale verification contracts without removing behavioral safeguards.
- Correct base-path navigation and accessible language metadata only where confirmed.
- Existing changes exceed the approximate 400-line planning heuristic; publication slice strategy remains pending before commits.
- Delivery strategy: exception-ok, single publication batch explicitly approved by the user. User authorized publishing all accumulated changes together to `master` of `Gabrielvilabracho/Portafolio` using the configured GitHub session. No force push or PR creation.

## Tasks
- [x] P1: Inspect local publication configuration and reproduce blockers. Delegated exploration and verification; 31 tests and Pages-output validation fail, while Astro check and build pass.
- [x] P2: Repair verification contracts and confirmed metadata/navigation defects. Preserved current content and appearance; added configurable connection language and base-safe project CTA rendering.
- [ ] P3: Run full checks and native review as applicable; record observed results.
- [ ] P4: Prepare reviewable commits and publish through the confirmed GitHub deployment path after resolving delivery strategy and credential authorization.

## Acceptance and checks
- `npm run check`
- `npm test`
- `npm run build`
- `npm run test:pages-output`
- `git diff --check`
- Existing Pages deployment triggers on pushes to `master`; feature-branch pushes alone do not publish.

## Progress
- Initial verification: 119 tests pass, 31 fail; Pages validation expects obsolete section/diagram structure.
- RDD effective mode is on (global). Initial risk assessment is unassessable due to undeclared untracked files; treat as high, not passive.
- Engram mirror pending: multiple active runtime sessions prevent session-bound writes.
- Writer evidence: reproduced 31 failures in the six focused files (26 passed). Added and observed RED for Spanish language metadata in both the component and actual MDX, and the non-root project-page CTA. All 62 focused tests now pass, including English-default metadata, root-base navigation, absent-CTA handling, accessibility references, export restrictions, evidence controls, and current Spanish inventory/connections.
- Pages-output validation now checks the current closed disclosures, five lifecycle stages, fourteen table rows, four main and nine branch connections, three queues, and the base-safe linked PNG instead of an obsolete iframe contract. Global localization, favicon, contact, and base-path safeguards remain.
- Full verification is delegated next; the writer handoff records observed command results. P3 review disposition and P4 publication remain parent-owned; no commit or publication authorization is implied.

## Independent verification
- Independent verifier confirmed `npm run check` (87 files, zero errors/warnings/hints), `npm test` (155 tests, 27 files), `npm run build`, and `npm run test:pages-output` pass.
- Parent repeated `npm run test:pages-output` and `git diff --check`; both passed.
- Build retains non-blocking font-resolution and bundle-size warnings; browser visual comparison not performed.
- Native preflight requests intended-untracked selection; no transaction has been started and no review approval is claimed.
- No commits, uploads, remote authenticated operations, or deployment have occurred.
- Single-batch publication strategy and configured GitHub-session authorization obtained explicitly. GitHub confirms default branch `master`; origin fetched successfully.
- Next step: commit the verified candidate, complete applicable native review, then publish and confirm deployment.

## Publication CI runtime correction
- Reported GitHub run `42401980378` failed `npm run check` because Node `22.12.0` is below Astro's supported minimum.
- Installed and locked Astro `7.4.4` both declare `engines.node: >=22.23.4`. Both workflows and the root package/lock engine metadata now match that minimum; dependencies, action references, permissions, design, and content are unchanged.
- Version evidence: Context7 `/withastro/docs` documents minimum Node `22.23.4`; [Astro's GitHub Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/) supports an explicit build runtime. [Official Node release notes](https://nodejs.org/en/blog/release/v22.23.4) confirm `22.23.4` LTS was released on 2026-10-21. No newer major or speculative patch is required.
- Deterministic RED before edits: a read-only Node assertion parsed workflows with the installed `yaml` package, verified installed/locked Astro metadata, then failed on CI's `22.12.0` versus required `22.23.4` (`ERR_ASSERTION`). Local verification runtime is Node `v24.14.1`, not the pinned CI runtime.
- GREEN: the same read-only Node assertion passes for parsed YAML, both exact workflow pins (`22.23.4`), installed/locked Astro metadata, and root package/lock engines (`>=22.23.4`).
- Local verification: `npm run check` passes (87 files, no errors/warnings/hints); `npm test` passes (155 tests in 27 files); `npm run build` passes; `npm run test:pages-output` passes for `/Portafolio`. Existing non-blocking npm `allow-scripts`, font-resolution, and large-chunk warnings remain.
- Final structural verification also checks that workflow objects differ from HEAD only in their Node version and that package/lock metadata differ only in the root Node engine. `git diff --check` is required at handoff.
- Remote CI/deployment confirmation, review, and publication remain parent-owned; this correction performs no remote mutations or Git staging/commits. P3/P4 checkboxes and prior publication history are deliberately left unchanged.
