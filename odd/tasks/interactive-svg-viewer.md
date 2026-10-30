# Interactive SVG Viewer

## Objective
Make the Document Intelligence SVG diagram navigable inside its existing panel with zoom, pan, and a reset action.

## Problem
`Frame 9-2.svg` is rendered as a static image, so viewers cannot inspect its detailed components at a useful scale.

## Scope
- Add a client-side, accessible SVG viewer for the Document Intelligence workflow panel.
- Support wheel/pinch zoom, drag pan, visible zoom/reset controls, and keyboard-accessible controls.
- Preserve the existing artwork source, alternative text, and dark visual system.

## Constraints
- Do not modify unrelated page routes or the standalone case-study iframe.
- Respect reduced-motion preferences and prevent page scroll while actively zooming the focused viewer.
- Do not add a dependency when native pointer and wheel events are sufficient.

## Delivery Strategy
- Strategy: ask-on-risk
- Delivered: one native React viewer, its Astro island integration, focused behavior and integration tests, and this verification record.

## Rationale
- A client-loaded React island keeps the surrounding workflow section static while enabling native wheel, pointer, and touch interactions for the diagram.
- Native pointer and wheel APIs provide bounded zoom and pan behavior without adding a dependency or changing the existing SVG asset.
- The viewer retains the original alternative text, dark palette, and object-contain presentation while exposing labelled native buttons for keyboard operation.

## Tasks
- [x] ISV-1 — Implement the interactive viewer and mount it in the Document Intelligence workflow panel.
  - Route: delegated direct.
  - Trigger: multi-file React implementation plus tests; preparation delegated with the writer.
  - Acceptance: users can zoom with controls/wheel or pinch, pan with drag, reset the view, and retain access to the full diagram.
  - Checks: focused Vitest component test; `npm run check`.
  - Evidence: `InteractiveSvgViewer` mounts with `client:load`, uses a 1× complete-view reset state, supports labelled controls, non-passive wheel zoom, two-pointer pinch, and constrained pointer panning.
- [x] ISV-2 — Verify interaction contracts and record the work-unit evidence.
  - Route: delegated direct.
  - Trigger: functional verification requires the writer's source context.
  - Acceptance: controls are keyboard reachable, bounded, and labelled; static layout tests remain valid.
  - Checks: focused Vitest component test; `npm run check`.
  - Evidence: focused tests cover controls/reset, wheel consumption only when scale changes, pinch zoom, pan bounds, reduced motion, and Astro-mounted viewer markup; both declared checks pass.

## Progress
- 2026-10-30 — Implemented and verified. The initial RED run failed as expected because `InteractiveSvgViewer` did not exist. After implementation, focused Vitest passed 6 tests across 2 files and `astro check` reported 0 errors, warnings, and hints.

## Next Step
Parent review and work-unit delivery can proceed from the scoped diff and recorded verification evidence.
