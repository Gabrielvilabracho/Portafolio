# Case-Study Link Integrity

## Objective

Restore the Document Intelligence case-study content entry and establish generic automated integrity checks for declared project-to-case-study links.

## Authorized Scope

- Create and maintain this recovery task document.
- Rename and repair the Document Intelligence case-study Markdown entry.
- Replace the AI-Support-specific cross-link test with generic content, route, and localized-link coverage.
- Run the specified local verification commands only.

## Acceptance Criteria

- `document-intelligence.md` exists under `src/content/case-studies/` and has a valid leading YAML frontmatter block containing `title`, `slug`, and `summary`.
- The previous misspelled filename is removed.
- One generic test dynamically validates project and case-study entries, static routes, and declared localized links without requiring backlinks.
- The focused test, Document Intelligence project test, and `npm run check` pass.

## Checklist

- [x] Create task record before source changes.
- [!] Attempt to mirror this document through Engram (unavailable: multiple active runtime sessions).
- [x] Rename the case-study Markdown file.
- [x] Restore valid frontmatter placement.
- [x] Replace the specific test with generic link-integrity coverage.
- [x] Run required verification commands.
- [x] Record verification evidence and final status.

## Applicable Checks

- Focused case-study link-integrity test.
- `src/content/projects/document-intelligence.test.ts`.
- `npm run check`.

## Progress

Status: Complete.

Verification evidence:

- `npm exec vitest run src/content/case-studies/case-study-links.test.ts` — passed: 1 file, 1 test.
- `npm exec vitest run src/content/projects/document-intelligence.test.ts` — passed: 1 file, 3 tests.
- `npm run check` — passed: Astro checked 69 files with 0 errors, 0 warnings, and 0 hints.
- `git diff --check` — passed with no whitespace errors.

Engram mirror: attempted with topic key `odd/case-study-link-integrity/tasks`, but Engram rejected the write because multiple active runtime sessions match project `portafolio`. No session identity was available to safely select one.
