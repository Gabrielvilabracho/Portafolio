# Architecture Blueprint Palette — ODD Task Record

## Objective

Replace the Document Intelligence workflow JPEG with the supplied `architecture_3d_invoice_system_dark-blueprint.svg` and translate the SVG's blue/green blueprint palette into the portfolio's established dark, grey, white, and orange system.

## Problem and rationale

The workflow currently references a raster illustration whose desktop `object-cover` treatment can crop meaningful diagram content. The supplied SVG is scalable and can preserve diagram detail, but its inherited blue/green palette does not match the portfolio's editorial visual system.

## Authorized scope

- `public/imagenes/architecture_3d_invoice_system_dark-blueprint.svg`
- `src/presentation/components/sections/DocumentIntelligenceWorkflow.astro`
- `src/presentation/components/sections/DocumentIntelligenceWorkflow.test.ts` (only if a focused asset-reference assertion is practical)
- `odd/tasks/architecture-blueprint-palette.md`

Do not edit or normalize unrelated in-progress files.

## Constraints

- Preserve the supplied SVG's geometry and semantic layer structure.
- Use the existing portfolio colors only: dark greys (`#0c0c0c`, `#141415`, `#18191b`, `#2f3032`), light greys/white, and restrained orange (`#fe5b2a`).
- Do not introduce a blue, green, or unrelated secondary palette.
- Keep image behavior responsive and avoid browser-side rasterization.

## Delivery strategy

- Strategy: `ask-on-risk`.
- Forecast: under 400 authored changed lines in the component and tracking record; the supplied SVG itself is pre-existing and will be color-normalized only as needed.

## Tasks

- [x] **ABP-1 — Rebind the workflow image and normalize the SVG palette.**
  - Route: delegated direct.
  - Trigger: two non-trivial implementation artifacts, plus source reading required before the asset/color change.
  - Acceptance: the workflow references the supplied SVG; the SVG has no visible blueprint-blue or status-green colors; the illustration retains its geometry and its dark/grey/orange hierarchy.
  - Checks: focused workflow test (if applicable), `npm run check`, `npm run build`.
  - Result: the workflow resolves the supplied SVG with `withBase`; its desktop image remains centered and `object-contain`, so the full diagram is visible rather than cropped. The SVG canvas now uses `viewBox="0 0 2400 1600"` with `preserveAspectRatio="xMidYMid meet"`, exposing the lower tier without changing diagram geometry, IDs, groups, labels, or semantics.
  - Palette: direct SVG attributes, gradient stops, and rgba values now map blueprint darks to `#0c0c0c`, `#141415`, `#18191b`, `#2f3032`, and `#464749`; light surfaces to `#eff0f1`, `#e0e1e3`, `#c3c4c8`, and `#8b8c8d`; cyan, green, and indigo accents to `#fe5b2a` with `#fe7c55` for secondary indicators. The redundant selector-based palette override has been removed.
  - TDD: no meaningful deterministic RED phase applies to this visual asset translation. The existing focused component test was practical and now asserts the SVG asset reference plus the absence of desktop `object-cover`.
  - Verification: `npm test -- src/presentation/components/sections/DocumentIntelligenceWorkflow.test.ts` passed (1 file, 2 tests); `npm run check` passed (0 errors, 0 warnings, 0 hints); `npm run build` passed (12 pages built; non-blocking Vite chunk-size warning reported).

- [ ] **ABP-2 — Verify and close the work unit.**
  - Route: delegated verification plus parent-owned Git/review boundary.
  - Acceptance: applicable checks pass, the change has a dedicated Conventional Commit, and the required review outcome is recorded.
  - Checks: rerun one reported focused check, inspect the work-unit diff, native risk assessment/review as applicable.
  - Result: the supplied SVG source has now been normalized directly, removing the prior palette override layer while preserving its diagram structure.
  - Remaining owner: parent-controlled work-unit inspection, commit decision, and review lifecycle.

## TDD applicability

The palette conversion is a visual asset change with no meaningful deterministic RED case. The asset-reference behavior can be covered by an existing focused component test if its setup permits; source validation, static type checks, production build, and visual structural inspection provide proportional evidence.

## Progress

- Current task: ABP-2.
- Next step: inspect the normalized work unit, then apply the parent-owned commit and review lifecycle.
