# Case Study Intro Callout

## Objective

Present the Document Intelligence opening statement as a clean, semantic dark callout without exposing Markdown fence markers or a language label.

## Problem

The case-study source currently starts with the invalid marker `'''text`, so the marker is rendered as content instead of producing an intentional visual treatment. The opening statement needs a bounded dark surface with readable spacing and small lateral margins.

## Why

The opening statement establishes the case study's central engineering argument. It should read as designed editorial content, not as an accidental code sample or malformed Markdown.

## Authorized Scope

- Add the approved product-design context document.
- Replace the malformed opening block with semantic HTML in the Document Intelligence case study.
- Add theme-scoped styling for the new callout.
- Run structural and build verification.

## Constraints

- Preserve all unrelated uncommitted work.
- Keep generated technical artifacts in English.
- Do not use a code block for non-code prose.
- Scope visual rules to the Document Intelligence case-study theme.
- Maintain semantic heading structure, readable line length, and responsive lateral spacing.
- Test-first exception: this is passive editorial presentation with no meaningful isolated behavioral RED; use structural source assertions and the Astro production build instead.

## Delivery

- Strategy: `ask-on-risk`
- Forecast: approximately 80 authored changed lines, below the 400-line chaining threshold.
- Branch: `feat/document-intelligence-theme`
- Reviewed boundary: pending
- Running authored line count: 122

## Tasks

- [x] **CSIC-1: Add the semantic intro callout**
  - Route: delegated direct
  - Trigger evidence: the implementation requires coordinated non-trivial edits across product context, Markdown content, and Astro layout styling.
  - Acceptance criteria:
    - `PRODUCT.md` records the user-approved portfolio design context.
    - The rendered opening does not expose `'''`, `text`, or a Markdown heading marker.
    - The opening uses a semantic labelled section.
    - The dark callout has responsive internal padding and small lateral margins.
    - Callout colors and spacing are scoped to the Document Intelligence case-study theme.
  - Checks:
    - Structural source assertions for the callout markup and scoped CSS.
    - `npm run build`
    - HTTP readback from the local case-study route when the dev server is available.
  - Evidence:
    - Structural assertions passed: malformed marker absent, labelled section present, and all callout selectors theme-scoped.
    - `npm run build` passed: Astro generated 12 pages in 1.05 seconds; existing font-reference and chunk-size warnings remain.
    - Local route readback passed with HTTP 200.
  - Commit: `79bc72af8576ec2f1e5940e672f454cbe36d267d`
  - RDD assessment: medium, `under_budget`; the work unit remains in the pending medium-risk review slice.

## Progress

- Current task: none; CSIC-1 is complete.
- Mirror: pending because Engram found multiple active project sessions.
- Next step: visually inspect the callout in the existing local Astro session; include this commit in the next medium-risk review slice.
