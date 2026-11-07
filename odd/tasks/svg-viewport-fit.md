# SVG Viewport Fit

## Objective

Remove unused vertical canvas space from `Frame 9-2.svg` and present the complete diagram naturally within its workflow grid cell without changing its proportions or removing its interactive controls.

## Scope

- `public/imagenes/Frame 9-2.svg`
- `src/presentation/components/sections/InteractiveSvgViewer.tsx`
- `src/presentation/components/sections/DocumentIntelligenceWorkflow.astro`

## Delivery Route

- Route: `delegated`
- Mapping evidence: `DocumentIntelligenceWorkflow.astro` passes `Frame 9-2.svg` to `InteractiveSvgViewer`; the viewer applies the diagram's contain sizing and interactive transform.
- Write-trigger evidence: the user explicitly authorized a visual correction and named the exact asset, renderer, controls to preserve, and allowed edit surfaces.

## Stable Checklist

- [x] Inspect the existing SVG root bounds and the viewer/container implementation.
- [x] Compute the rendered diagram bounds excluding the full-canvas background.
- [ ] Select the visual-bound policy for low-contrast filter halos.
- [ ] Correct the SVG viewport and intrinsic dimensions without distortion.
- [ ] Ensure the initial viewer state displays the full corrected drawing.
- [ ] Retain zoom, reset, drag, wheel, pinch, accessibility, and responsive behavior.
- [ ] Run the required validation and structural readback.
- [ ] Record observed result and verification evidence.

## Acceptance Criteria

- The SVG has no unused vertical canvas above or below its intended drawing.
- The full corrected drawing is visible at the viewer's default state without clipping.
- The diagram preserves its aspect ratio and uses proportional contain sizing inside the grid cell.
- Existing zoom, reset, drag, wheel, pinch, keyboard-accessible controls, and responsive behavior remain intact.

## Verification

- `npm run check`
- `npm run build` when available and practical
- Structural readback of the SVG root bounds and the viewer's proportional contain sizing

## Progress

Initial inspection found the SVG root attributes `width="2278"`, `height="1444"`, and `viewBox="180 120 1918 1204"`. The viewer currently uses `h-full w-full object-contain`, starts at the preserved local `MIN_SCALE = 0.9`, and keeps all required controls. Raster inspection of the currently clipped viewport shows non-background pixels at every viewport edge, so the final crop must be derived from the complete rendered artwork rather than the proposed values.

The full-canvas rendering contains a conflict that needs an explicit visual-bound policy: non-background core content reaches `0..1390` at a 5% contrast threshold, while low-contrast black filter halos remain detectable through `y=1435` at a zero threshold and the declared filter region reaches `y=1443.208`. Cropping to the core bound removes 54 vertical units but clips filter halos; retaining the filter region avoids clipping but leaves at most 0.792 units of bottom canvas. The working SVG and viewer have been restored to their pre-task state pending a choice.

## Work-Unit Commit

Blocked: this worktree contains unrelated user changes. Do not create a work-unit commit in this task.

## Engram Mirror

Pending: the project-scoped save under `odd/svg-viewport-fit/tasks` could not run because Engram reported multiple active runtime sessions and no authoritative session ID was supplied. The mirror must be retried once the runtime session ambiguity is resolved.
