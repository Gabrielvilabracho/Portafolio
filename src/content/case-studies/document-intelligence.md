---
title: "Document Intelligence Platform: Case Study"
slug: document-intelligence
summary: How AI-assisted extraction, deterministic validation, human review, and audit evidence create trusted operational data.
---

<section class="case-study-intro-callout" aria-labelledby="document-intelligence-intro-title">
  <h2 class="case-study-intro-callout__title" id="document-intelligence-intro-title">TURNING PROBABILISTIC EXTRACTION INTO GOVERNED ACCOUNTING DATA</h2>
  <p class="case-study-intro-callout__body">In accounting automation, Artificial Intelligence models can extract vendor identifiers or tax amounts that appear syntactically correct, but are mathematically or fiscally incorrect. The engineering challenge is not simply to extract text, but to design an architecture that strictly controls when an AI "guess" can become official accounting data suitable for an ERP.</p>
</section>

## Executive summary

inv-platform turns supplier documents into governed accounting data through a controlled sequence: tenant-aware intake, OCR and AI-assisted extraction, canonicalization, deterministic validation, human review, and approved-only ERP export.

The platform follows one hard rule: model output is a proposal, not accounting truth. OCR and extraction services may produce candidate values, but only complete, valid, and explicitly approved canonical data can cross the export boundary. The product supports ERP consumption. It does not perform official fiscal filing (`README.md:1-7`).

This boundary shapes the architecture. Temporal coordinates fallible processing, while the Go API retains lifecycle authority and all tenant-data write authority. Python workers normalize source-specific evidence into a bounded schema. Deterministic validators return explicit blocking reasons. Human decisions outrank automated evidence.

This case study describes repository evidence reviewed on 2026-10-11. It is not a production success story. The repository does not provide verified customer, adoption, revenue, production accuracy, latency, or savings data.

## 1. Problem: extraction is probabilistic, accounting controls are not

A model can return a plausible supplier identifier, invoice date, tax amount, or total that is syntactically correct and still wrong. The engineering challenge is therefore not limited to extracting fields. The platform must control when uncertain evidence can become durable canonical data and when that data may leave the system.

The target context is a Portugal-first accounting-firm pilot. Reviewers need traceable supplier-invoice data for downstream ERP workflows, but the repository does not identify a deployed customer or demonstrate production use.

The design operates under five constraints:

1. **Uncertain evidence remains provisional.** Canonical persistence uses allowlisted, schema-defined, and versioned fields (`openspec/specs/audit-compliance-retention/spec.md:38-63`).
2. **Tenant authority stays outside model code.** Protected document, review, export, audit, and evaluation access requires tenant context and role checks (`openspec/specs/tenant-access-control/spec.md:23-60`).
3. **Workflow history is not a document store.** Credentials, OCR text, fiscal identifiers, and monetary values must not enter Temporal payloads or operational evidence (`docs/adr/ADR-019-worker-service-auth.md:6-13`).
4. **Human approval is a control, not a confidence score.** Failed validation or incomplete export fields block approval, and automated reruns must not replace reviewer evidence (`openspec/specs/human-review/spec.md:9-26,121-135`).
5. **Compliance claims remain bounded.** The Portugal profile describes control design, not legal or accounting certification (`openspec/specs/portugal-profile/spec.md:20-30,43-53`).

## 2. Workflow: from document evidence to approved export

```text
Document intake
      |
      v
OCR and AI-assisted extraction
      |
      v
Canonicalization and deterministic validation
      |
      v
Human review and approval
      |
      v
Approved-only ERP export
```

### Intake establishes identity and provenance

The Go API associates each accepted document with a tenant, source, receipt time, retention-policy version, and initial lifecycle state. Manual intake can include an explicit client selection. Automatically sourced documents remain visibly unassigned instead of receiving an inferred default (`openspec/specs/ingestion/spec.md:7-24,32-51,85-106`).

### Temporal coordinates processing without owning authoritative writes

The Python workflow resolves the source, detects the document type, collects early QR evidence, and routes the document before extraction. Header, line-item, and total specialists run as separate activities with independent retry and timeout behavior (`workers/temporal-python/workflows/document_processing_workflow.py:213-263,436-467,550-571`).

After candidate evidence is persisted, validation reconciles the candidate set. A failed verdict sends the document to review rather than hiding it as a workflow failure. The worker may request a lifecycle transition, but Go remains the sole authority that can write it (`workers/temporal-python/workflows/document_processing_workflow.py:607-625,688-707`).

### Canonicalization narrows evidence into governed fields

Normalization maps known source aliases to canonical field names and preserves source location and confidence as evidence. Unknown fields move to a skipped-evidence collection instead of being promoted to canonical data. Canonical invoice assembly accepts only bounded field keys and creates a versioned payload (`workers/temporal-python/activities/normalization.py:122-169,215-226`).

This creates four distinct evidence levels:

- **Source evidence:** what the extractor observed.
- **Canonical candidates:** which governed fields the evidence may support.
- **Validated canonical data:** which values satisfy deterministic rules.
- **Reviewer decisions:** which evidence is authoritative for the document.

### Deterministic validation converts uncertainty into explicit reasons

The validator requires seller tax identity, document number, date, currency, and header totals. It checks value shape, Portuguese NIF checksum when applicable, decimal-string amounts, tax breakdowns, duplicate tax bands, and exact subtotal-plus-tax reconciliation (`workers/temporal-python/activities/validator.py:18-43,129-175,206-259`).

Its output is inspectable and versioned: `validationPassed`, `requiresReview`, `exportComplete`, and a list of blocking reasons. These are engineering verdicts, not legal certifications.

### Human review owns the decision boundary

The Go service records corrections with reviewer identity, rationale, and timestamp. Approval refuses documents that failed validation or still contain unresolved export fields. The store rechecks these conditions under its write lock to close the check-to-write race (`services/api/internal/review/review_service.go:172-227`).

Automation cannot overwrite reviewer evidence or silently replace a human verdict (`openspec/specs/human-review/spec.md:9-41,121-135`).

### Export is controlled delivery, not fiscal filing

The export service blocks delivery unless the lifecycle is approved, validation passed, review is approved or unnecessary, and required canonical data is complete. Delivery, lifecycle transition, and audit evidence are persisted together (`services/api/internal/export/export_service.go:218-342,359-406`).

Exports target ERP consumption. SAF-T generation, signing, validation, and submission remain outside the current product boundary (`openspec/specs/export-delivery/spec.md:9-27`; `docs/saft-planning.md:1-26`).

## 3. Components, technologies, and responsibilities

| Component | Technologies | Responsibility |
|---|---|---|
| Web portal and BFF | Next.js 15, React 19, TypeScript, Clerk | Provides the interface for uploading documents, reviewing results, approving invoices, and requesting exports. It also authenticates users and routes requests to the API. |
| API and central control | Go, chi, pgx, Temporal SDK | Controls tenants, documents, lifecycle states, auditing, human review, and exports. It is the system's primary authority. |
| Orchestration | Temporal | Runs durable workflows, retries, timeouts, and error recovery. It separates processing through distinct queues. |
| Document workers | Python, Temporal SDK, ONNX Runtime, httpx | Process documents, generate embeddings, and perform classification, validation, and specialized extraction. |
| AI gateway | FastAPI, LiteLLM | Receives extraction requests and selects the appropriate AI backend while enforcing limits, timeouts, and idempotency. |
| Primary AI backend | Amazon Bedrock | Runs the managed models used by the gateway. |
| Optional AI backend | vLLM, OpenAI-compatible API, Qwen VLM | Enables self-hosted models for visual and textual extraction. It is disabled by default. |
| Layout and OCR | PP-DocLayoutV3, PaddleOCR, GLM-OCR | Detects document regions, crops pages, and extracts text. This is an optional capability. |
| Database | Amazon RDS, PostgreSQL, pgvector | Stores documents, lifecycle states, results, audit records, and embeddings. |
| Vector search | pgvector, cosine KNN, HNSW | Finds similar documents and supports classification. It uses exact search initially and switches to HNSW indexes as volume grows. |
| File storage | Amazon S3, S3-compatible adapter | Stores original documents, page images, and OCR results. Some code still uses “MinIO” naming, but the AWS backend is S3. |
| Human review | Next.js, Go API | Allows reviewers to correct fields, approve or reject documents, and block incomplete exports. |
| Export | Go, CSV, JSON, XML, SAF-T-compatible formats | Generates client- or ERP-specific files and records their delivery. |
| Observability | Sentry, CloudWatch, Prometheus, Grafana, OpenTelemetry, structured logs | Records errors, operational metrics, workflow activity, and infrastructure behavior. |

### System boundaries

- **Public boundary:** Only the Next.js portal and the Go API are exposed to users.
- **Internal boundary:** FastAPI, document workers, OCR, and inference services remain inside the private network.
- **Data authority:** Only the Go API writes directly to PostgreSQL and controls document lifecycle states.
- **Tenant isolation:** PostgreSQL separates tenant data through schemas, while Amazon S3 isolates files through object prefixes.
- **Orchestration:** Temporal coordinates processing and retries, but it is not the source of truth for documents.
- **External providers:** Clerk manages identity, while Amazon Bedrock provides managed inference.
- **Optional components:** vLLM with Qwen and the PP-DocLayoutV3/GLM-OCR pipeline require explicit activation.
- **Export boundary:** The system generates and records files intended for ERP consumption.

This is an authority decomposition, not only a service decomposition. The worker coordinates processing, but the lifecycle service reads the current state, validates the requested edge, derives privacy-safe metadata, and performs the write through the API store boundary (`README.md:27-38`; `services/api/internal/workflow/lifecycle.go:84-127,190-256`).

The SQL layer remains hand-written beside Go callers instead of being hidden behind an ORM. This keeps transaction and audit behavior visible (`docs/adr/ADR-003-sql-layer.md:22-58`).

## 4. Conexiones y protocolos

<figure class="case-study-diagram" aria-labelledby="connections-and-protocols-caption">
  <div class="case-study-diagram__viewport" tabindex="0" aria-label="Scrollable Connections and Protocols diagram">
    <iframe
      class="case-study-diagram__frame"
      src="/Portafolio/diagrams/document-intelligence/connections-and-protocols.html?embed=1&amp;theme=light"
      title="Connections and Protocols — Document Intelligence architecture diagram"
      loading="lazy"
    ></iframe>
  </div>
  <figcaption id="connections-and-protocols-caption">
    The request path, processing queues, authority boundaries, and model integrations shown as a static architecture overview.
    <a href="/Portafolio/diagrams/document-intelligence/connections-and-protocols.html?theme=light">Open the standalone diagram</a>
  </figcaption>
</figure>

## 5. Security, privacy, and audit controls

Workers do not receive human sessions or direct database authority. A deployment credential is exchanged inside an activity for a short-lived token scoped to one tenant, document, workflow run, and permission. Credentials and tokens remain outside workflow arguments and event history (`docs/adr/ADR-019-worker-service-auth.md:17-32`).

Audit and document history are tenant-scoped and append-only. Lifecycle state, attempt metadata, history, and audit evidence must commit or roll back together. Logs must omit raw document content, fiscal identifiers, monetary values, and unnecessary personal data (`openspec/specs/audit-compliance-retention/spec.md:65-110,147-163`).

The inference gateway records model, outcome, token count, and latency without storing prompts, completions, filenames, or fiscal values (`docs/adr/ADR-007-llm-gateway.md:95-110`).

## 6. Evaluation and verified technical outcomes

The repository includes a golden-dataset runner with default acceptance gates of 95% overall field accuracy, 90% per-field accuracy, no more than 2% nulls, and zero mathematical errors (`workers/temporal-python/evals/support/golden_dataset_runner.py:10-26`). It evaluates field values, source evidence, review routing, export readiness, validation failures, and total reconciliation (`workers/temporal-python/evals/support/golden_dataset_runner.py:64-112,142-180,228-237`).

These values are configured thresholds. They are not proof that the platform has achieved those results in production.

Archived verification reports provide dated evidence for specific revisions:

1. **Temporal foundation, 2026-08-26:** the declared multi-runtime command passed, including 1,269 worker tests with six skipped, 16 Playwright tests, and a Temporal-history proof showing only tenant and document identifiers in the start payload (`openspec/changes/archive/2026-08-26-temporal-ingestion-c0-ab-foundation/verify-report.md:36-61,74-98`).
2. **Human review, 2026-07-10:** Go, database, router, web typecheck, 111 web unit tests, and worker tests passed. Browser verification was blocked by a documented sandbox limitation (`openspec/changes/archive/2026-07-10-human-review-workspace/verify-report.md:44-60,74-82`).
3. **Approved export, 2026-07-10:** Go, race, database, typecheck, unit, and OpenSpec gates passed. Playwright was blocked by the same sandbox class and was not presented as passing (`openspec/changes/archive/2026-07-10-approved-export-delivery/verify-report.md:41-53,63-86`).

The evidence supports four technical outcomes:

- A guarded lifecycle controls every authoritative state transition.
- Extraction output is canonicalized and validated before approval.
- Human review and export fail closed when required data or validation is unresolved.
- Verification reports preserve both passing evidence and disclosed limitations.

The evidence does not support claims about production deployment, named customers, revenue, adoption, realized extraction accuracy, latency, or savings.

## 7. Limitations and blocked capabilities

- Portugal production-compliance claims require legal and accounting review, authoritative source validation, control tests, and evidence (`openspec/specs/portugal-profile/spec.md:20-30,243-252`).
- SAF-T support is planning-oriented and must not be represented as official tax filing or submission (`docs/saft-planning.md:10-26`).
- Production retention purge is not authorized. Future activation requires separate specification work and signed Legal and Operations approval (`docs/legal-approval-requirements.md:1-43`).
- The repository contains no verified production reliability, throughput, latency, cost, savings, adoption, or customer-outcome dataset.

## Transferable lessons

1. **Keep probabilistic processing away from authoritative writes.** Models and orchestration should propose evidence. A smaller trusted boundary should own state changes.
2. **Canonicalize before validating.** Deterministic rules need stable, versioned field definitions.
3. **Turn every refusal into a reason.** Explicit blocking reasons make uncertainty reviewable, testable, and auditable.
4. **Make human authority durable.** Reviewer decisions must survive automation reruns.
5. **Separate verification from business outcomes.** Passing tests demonstrate contract evidence for a revision, not production success.

## Compact evidence map

| Claim area | Primary repository evidence | Classification |
|---|---|---|
| Product purpose and runtime ownership | `README.md:1-7,27-38` | Current repository description |
| Intake and lifecycle | `openspec/specs/ingestion/spec.md:7-24`; `services/api/internal/workflow/lifecycle.go:84-127,209-256` | Current specification and source |
| Orchestration | `workers/temporal-python/workflows/document_processing_workflow.py:436-467,550-625,688-707` | Current source |
| Canonicalization and validation | `workers/temporal-python/activities/normalization.py:122-169`; `workers/temporal-python/activities/validator.py:129-175` | Current source |
| Review and export authority | `services/api/internal/review/review_service.go:172-253`; `services/api/internal/export/export_service.go:218-300,391-406` | Current source |
| Evaluation strategy | `workers/temporal-python/evals/support/golden_dataset_runner.py:20-26,64-112,228-237` | Thresholds in current source |
| Identity and privacy | `docs/adr/ADR-019-worker-service-auth.md:17-32`; `openspec/specs/audit-compliance-retention/spec.md:65-110` | Accepted ADR and current specification |
| Runtime verification | Three archived verification reports cited above | Historical evidence for specific revisions |
| Portugal and filing boundaries | `openspec/specs/portugal-profile/spec.md:20-30,243-252`; `docs/saft-planning.md:1-26` | Planned or legally blocked |
| Production and customer metrics | No supporting repository evidence found | Unavailable, no claim made |
