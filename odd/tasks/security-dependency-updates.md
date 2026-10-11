# Security Dependency Updates

## Objective

Update the portfolio to the current minimum secure dependency versions without taking unrelated major-version upgrades or publishing to production.

## Problem

The synchronized `master` branch reports 11 vulnerable packages through `npm audit`, including one critical Astro vulnerability. Several open Dependabot pull requests target versions that are already below the latest secure patch level.

## Why

Merging stale dependency pull requests would leave known vulnerabilities unresolved and create repeated lockfile conflicts. A single controlled security update provides one coherent dependency tree and one verification boundary.

## Authorized scope

- `package.json`
- `package-lock.json`
- This tracker and its Engram mirror
- No source-feature changes, production deployment, PR merge, or major-version upgrade

## Constraints

- Keep Astro on major 7, Vitest on major 4, devalue on major 5, and js-yaml on major 4.
- Prefer minimum current secure versions over unrelated modernization.
- Preserve the existing Node.js engine and GitHub Pages configuration.
- Work from `fix/security-dependency-updates`.
- TDD mode: not enabled by project/session configuration; use ordinary dependency verification.
- Test runner: `npm test`.

## Tasks

- [x] **SEC-01** Update direct and transitive dependencies to versions that resolve the current advisories.
- [x] **SEC-02** Confirm `npm audit` has no remaining known vulnerabilities within the supported dependency graph.
- [x] **SEC-03** Run unit tests, Astro type/content checks, and a production build.
- [x] **SEC-04** Review the final dependency diff and create one Conventional Commit work unit.
- [x] **SEC-05** Assess the committed candidate under the repository's native review mode.

## Acceptance criteria

- `npm audit --json` reports zero vulnerabilities, or any unavoidable remainder is documented with its dependency path and mitigation.
- `npm test` passes.
- `npm run check` passes.
- `npm run build` passes.
- No major-version upgrades are introduced solely for freshness.
- No deployment or merge to `master` occurs.

## Applicable checks

- `npm audit --json`
- `npm audit --omit=dev --json`
- `npm test`
- `npm run check`
- `npm run build`

## Progress

- Branch created from synchronized `master`.
- Baseline audit: 11 vulnerable packages total (1 critical, 7 high, 3 moderate); 8 affect the production dependency graph.
- Existing Dependabot targets found insufficient for Astro, Sharp, and fast-uri.
- Updated Astro to 7.3.8 and Vitest to 4.1.11; compatible transitive resolution now includes devalue 5.9.4, fast-uri 3.1.8, http-cache-semantics 4.3.0, js-yaml 4.3.2, sharp 0.35.5, smol-toml 1.9.1, source-map-js 1.2.2, and SVGO 4.1.0.
- No overrides or unrelated major-version upgrades were introduced.
- Created work-unit commit `304615b fix(deps): resolve security advisories`.
- Native four-lens review completed with no findings and approved the frozen candidate.

## Verification evidence

- `npm audit --json`: passed, 0 vulnerabilities across 556 dependencies.
- `npm audit --omit=dev --json`: passed, 0 production vulnerabilities.
- `npm test`: passed, 18 files and 74 tests.
- `npm run check`: passed, 69 files with 0 errors, warnings, or hints.
- `npm run build`: passed, 11 pages built; retained the non-blocking existing large-chunk warning.
- Runtime harness: N/A — this work changes dependency resolution only; the static production build is the applicable runtime boundary.
- Rollback boundary: revert `package.json` and `package-lock.json` together.
- Native review: approved with no findings under lineage `review-3f65125731e37b54`; exact acknowledgement consumed revision `sha256:21e1e9edae1fed9b5df8a9b3aeae4c3dd610a9ec0dbe8d8ee22b2c50dedbadaf` and burned its authority.

## Next step

Await maintainer authorization before pushing the branch or opening, merging, or deploying a pull request.
