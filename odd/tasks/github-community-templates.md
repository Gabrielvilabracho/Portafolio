# GitHub Community Templates

## Objective

Add reusable GitHub Issue Forms and a default pull request template so contribution requests carry consistent scope, evidence, verification, and traceability.

## Problem

The repository has no `.github/ISSUE_TEMPLATE` directory or pull request template. The intended issue-first workflow therefore cannot create structured issues, and pull requests receive no repository-specific guidance.

## Why

Reusable templates reduce incomplete reports, prevent false issue linkage, and align pull request evidence with the checks the Astro project actually runs.

## Authorized scope

- `.github/ISSUE_TEMPLATE/maintenance.yml`
- `.github/ISSUE_TEMPLATE/feature.yml`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/pull_request_template.md`
- This tracker and its Engram mirror
- No workflow enforcement, label provisioning, product changes, push, merge, or deployment

## Constraints

- Use GitHub's YAML Issue Form schema.
- Keep sensitive vulnerability details out of public issues.
- Disable blank issues for contributors.
- Base pull request checks on the repository's real npm scripts and CI workflow.
- Do not claim that templates enforce policy; enforcement requires a separate workflow.
- Keep this one-time community-template bootstrap separate from the dependency-remediation branch.
- TDD mode: not applicable to passive repository documentation; use structural validation and readback.

## Delivery

- Branch: `chore/github-community-templates`
- Strategy: `ask-on-risk`
- Forecast: approximately 220 authored changed lines, below the 400-line delivery budget.
- Bootstrap constraint: templates activate only after reaching `master`; no unrelated issue may be reused to satisfy linkage.

## Tasks

- [x] **GCT-01** Add a reusable maintenance Issue Form for bugs, dependency updates, and non-sensitive security maintenance.
- [x] **GCT-02** Add a reusable feature-request Issue Form and configure the chooser to disable blank contributor issues.
- [x] **GCT-03** Add a default pull request template aligned with the repository's actual verification commands and contribution policy.
- [x] **GCT-04** Validate YAML syntax and perform structural readback of all templates.
- [x] **GCT-05** Commit the work unit and assess the candidate under native review mode.

## Acceptance criteria

- GitHub can parse both Issue Forms as YAML.
- Required controls collect scope, evidence, expected outcomes, and verification criteria.
- Public forms warn against disclosing secrets or exploitable vulnerability details.
- Blank contributor issues are disabled.
- The PR template requests an issue link, exactly one PR type, scope, changes, applicable checks, visual evidence, and contributor confirmations.
- No application code, CI workflow, dependency, deployment, or product behavior changes.

## Applicable checks

- Parse all `.github/ISSUE_TEMPLATE/*.yml` files with an available YAML parser.
- Read back all generated files.
- `git diff --check`.

## Progress

- Confirmed `.github/` currently contains only `workflows/`.
- Confirmed current CI runs `npm ci`, `npm run check`, `npm test`, `npm run build`, and `npm run test:pages-output`.
- Confirmed GitHub only activates repository templates after they reach the default branch.
- Added two YAML Issue Forms, disabled blank contributor issues, and added one default PR template.
- Kept public security guidance explicit without adding an unverified private-reporting URL.
- Verified the declared `enhancement` label exists on `Gabrielvilabracho/Portafolio`.
- Final authored size is 240 lines, below the 400-line delivery budget.
- Created work-unit commit `404941e chore(github): add community templates`.
- Native reliability review approved the frozen candidate with no findings.

## Verification evidence

- Local YAML parsing: passed for `config.yml`, `feature.yml`, and `maintenance.yml`.
- Issue Form structural validation: passed for metadata, unique IDs, supported controls, required dropdown options, and individually required confirmations.
- PR template command comparison: passed against `package.json` and `.github/workflows/ci.yml`.
- Structural readback: passed for all four community-template files.
- `git diff --check` and no-index checks for untracked files: passed with no whitespace diagnostics.
- Native review: approved with no findings under lineage `review-ff0fde7559ac7a09`; exact acknowledgement consumed revision `sha256:94183c727f663e5f319b30f7d502384990cff07b8bd52d4bcce2052b3568c92d` and burned its authority.
- Limitation: final GitHub rendering and chooser activation can only be confirmed after the templates reach `master`.

## Next step

Resolve the one-time bootstrap delivery path without linking an unrelated issue, then activate and verify the templates on `master`.
