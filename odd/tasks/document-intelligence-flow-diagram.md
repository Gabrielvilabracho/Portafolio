# Document Intelligence Flow Diagram — Implementation Plan

Add a reusable, themed flow-diagram component to the Document Intelligence case study without changing the portfolio's global visual identity.

## Goal

Render the document-processing flow as an accessible, responsive, optionally animated visual block inside the reusable case-study template.

## Scope

- Keep the global design tokens in `src/styles/globals.css` as the brand source of truth.
- Add a theme scoped to an individual case study.
- Define the diagram flow as reusable data.
- Render the flow with a reusable Astro component.
- Respect mobile layouts and reduced-motion preferences.

## Out of scope

- Replacing the global portfolio palette or typography.
- Adding diagrams to every case study.
- Adding animation that does not explain a process.

## Phase 1 — Define the case-study theme

- [x] Choose the visual direction for Document Intelligence: surface, border, text and accent roles.
- [x] Decide whether the case study needs a secondary font or should keep the global font.
- [x] Add scoped semantic tokens such as `--case-surface`, `--case-border`, `--case-text` and `--case-accent`.
- [x] Ensure the scoped theme does not affect other pages.

**Expected result:** The Document Intelligence page can have its own visual atmosphere while preserving the portfolio brand.

### Phase 1 tracking

- **Status:** Complete; implementation and required verification passed.
- **Execution route:** `delegated`.
- **Trigger evidence:** Three non-trivial implementation/test files are required: `src/pages/case-studies/[slug].astro`, `src/presentation/layouts/CaseStudyLayout.astro` and `src/presentation/layouts/CaseStudyLayout.test.ts`.
- **Accepted palette:** local surface `#ABBAB9`; body text `#1E1E1E`; H1/H2 `#3D3D3D`; H3/H4/H5 `#1E1E1E`; restrained transparent border derived from `#3D3D3D`; accent `var(--brand-orange-500)`.
- **Font decision:** Keep `ABC Monument Grotesk` through `var(--brand-font-family)`; do not add a secondary font or change global typography.
- **TDD evidence:** RED — `npm test -- src/presentation/layouts/CaseStudyLayout.test.ts` failed only the new opt-in theme test because the rendered layout omitted `data-case-theme="document-intelligence"` (2 passed, 1 failed). GREEN — the same command passed all 3 tests after implementation. REFACTOR — color rules were narrowed to the opt-in theme ancestor so default selectors retain their original behavior; the final focused verification rerun remained green with 3 passing tests.
- **Verification:** `npm test -- src/presentation/layouts/CaseStudyLayout.test.ts` passed (1 file, 3 tests); `npm run check` passed (73 files, 0 errors, 0 warnings, 0 hints); `npm run build` passed (12 pages built) with a non-failing Vite chunk-size warning.
- **Work-unit commit:** `f8dc1bd` (`feat(case-study): add document intelligence theme`).
- **RDD assessment:** `medium` because the case-study route changed; `review_due: false` with `review_due_reason: under_budget` for the committed range from `74d4cba`.
- **Engram mirror:** Pending. `mem_save` rejected the verified decision because multiple active runtime sessions matched the project and directory; no session identity was invented.

### Phase 1 navbar extension tracking

- **Status:** Complete after structural correction; every case-study route now receives the navbar mode, and registered themes override the generic fallback.
- **Execution route:** `delegated` implementation on `feat/document-intelligence-theme`; the parent retains review and Git boundaries.
- **Trigger evidence:** The case-study surface currently begins below `BaseLayout`'s separately rendered navbar, so layout-scoped variables cannot provide the navbar's first-paint canvas. The change spans the case-study route, shared layouts, the React navbar, a typed presentation theme registry and deterministic component tests.
- **Desired behavior:** Every case-study route resolves a semantic presentation theme for both `CaseStudyLayout` and `Navbar`; specifically registered themes override a generic light fallback. All case studies render the mode from first paint with separate square-edged `#FEFEFE` GV and Contact controls, while non-case-study pages remain unchanged and dark observed sections retain higher-priority contrast behavior.
- **TDD evidence:** Initial RED — `npm test -- src/presentation/components/ui/Navbar.test.tsx src/presentation/layouts/CaseStudyLayout.test.ts` failed both suites before implementation because the new shared `caseStudyThemes` module did not exist. Initial GREEN — the same command passed 2 files and 5 tests after the registry, route/layout propagation and navbar presentation were implemented. Initial REFACTOR — navbar color resolution was extracted into a deterministic helper and triangulated with a dark-section case; the focused command then passed 2 files and 6 tests. Structural-correction RED — the same focused command ran 9 tests and failed the 3 new generic resolver/navbar cases because `resolveCaseStudyTheme` and the generic theme did not exist. Structural-correction GREEN — it passed 2 files and 9 tests after adding the fallback resolver and generic controls. REFACTOR — a shared-layout generic-theme case triangulated the contract, and the final focused run passed 2 files and 10 tests.
- **Verification:** `npm test -- src/presentation/components/ui/Navbar.test.tsx src/presentation/layouts/CaseStudyLayout.test.ts` passed (2 files, 10 tests); `npm run check` passed (75 files, 0 errors, 0 warnings, 0 hints); `npm run build` passed (12 pages built) with the existing non-failing Vite chunk-size warning; `curl -s -o /dev/null -w '%{http_code}' http://localhost:4321/case-studies/document-intelligence` returned `200`; `git diff --check` passed with no output.
- **Runtime HTML evidence:** The registered Document Intelligence response contains matching navbar/layout markers with `data-case-theme="document-intelligence"` and surface `#ABBAB9`. The unregistered AI Support Agent response contains matching `data-case-theme="generic"` markers, light surface `#ffffff`, and separate boxed GV/Contact controls using `#FEFEFE` with `var(--brand-grey-200)` borders.
- **Engram mirror:** Rejected. `mem_save` reported: `multiple active runtime sessions match the current project and directory; provide session_id, end other active matching sessions, or save independently with engram save`; no session identity was invented.

## Phase 2 — Extend case-study content data

- [ ] Extend `caseStudySchema` in `src/content.config.ts` with an optional case-study theme field.
- [ ] Add an optional diagram identifier, for example `flowDiagram: document-processing`.
- [ ] Add the selected theme and diagram identifier to the Document Intelligence case-study frontmatter.

**Expected result:** A case study can declare which local theme and diagram it uses.

## Phase 3 — Define the diagram data

- [ ] Create `src/data/diagrams/document-processing-flow.ts`.
- [ ] Define each process node: identifier, label, description and semantic state.
- [ ] Define the connections between nodes.
- [ ] Define optional animation settings: enabled state and speed.

**Expected result:** The diagram content is separate from presentation code and can be updated without editing the component.

## Phase 4 — Build the reusable renderer

- [ ] Create `src/presentation/components/case-studies/FlowDiagram.astro`.
- [ ] Render nodes, labels and connectors from the diagram data.
- [ ] Use the active case-study semantic tokens instead of hard-coded colors.
- [ ] Add a desktop horizontal layout and a mobile vertical layout.
- [ ] Add meaningful labels and semantic HTML for screen readers.

**Expected result:** Any supported flow data can render consistently inside a case study.

## Phase 5 — Add purposeful motion

- [ ] Animate only the connectors or particles that communicate the direction of data flow.
- [ ] Keep motion subtle and slow enough to avoid distracting from the written case study.
- [ ] Disable animation with `prefers-reduced-motion: reduce`.
- [ ] Confirm the diagram remains understandable when animation is disabled.

**Expected result:** Motion explains the process but is never required to understand it.

## Phase 6 — Integrate and validate

- [ ] Render the selected diagram from `src/pages/case-studies/[slug].astro`.
- [ ] Confirm the chosen placement in the case-study template.
- [ ] Verify light and dark mode contrast.
- [ ] Verify desktop and mobile layouts.
- [ ] Run the project build and address any errors.

**Expected result:** The Document Intelligence case study displays a themed, responsive and accessible flow diagram.

## Implementation decision

Use the existing Markdown-based case-study structure and render one diagram from the page template through frontmatter. Move to MDX only if future case studies need to insert several interactive components at arbitrary positions between paragraphs.

## Verification checklist

- [x] Global palette and typography remain unchanged outside the selected case study.
- [x] The case-study theme is scoped to its own layout.
- [ ] Diagram data contains no hard-coded presentation styles.
- [ ] The diagram uses semantic color tokens from the active theme.
- [ ] The diagram is readable without animation.
- [ ] Reduced-motion users receive a static diagram.
- [x] The project build passes.

## Next step

Proceed with Phase 2's data-driven theme and diagram fields, then define the reusable diagram data in Phase 3 before building the renderer.
