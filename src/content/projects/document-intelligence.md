---
title: Document Intelligence Pipeline
type: project
year: 2026
discipline: AI Engineering
focus: LLMs + Automation
description: LLM-powered pipeline that extracts, classifies, and summarizes business documents at scale.

overview: |
  An end-to-end pipeline that ingests unstructured business documents — contracts, invoices, reports — and transforms them into structured, searchable data using large language models. Processes thousands of documents daily with 94% extraction accuracy.

context: |
  Finance and operations teams were spending 4–6 hours per day manually reviewing and extracting information from incoming documents. The process was error-prone, non-scalable, and created a bottleneck that delayed downstream decision-making by 24–48 hours.

approach: |
  Designed a three-stage pipeline: ingestion and OCR normalization, LLM-based extraction and classification using Claude API, and human-in-the-loop review for low-confidence results. Outputs are stored in PostgreSQL for full-text search and downstream analytics.

differentiator: |
  Instead of fine-tuning a model, we used structured prompting with confidence scoring. Each extraction returns a score — results below the threshold go to human review, the rest auto-commit. This hybrid approach achieves high accuracy without the cost and fragility of fine-tuning.

architecture:
  description: |
    Documents enter via S3 webhook → OCR normalization → LLM extraction (Claude API) → confidence router → PostgreSQL. Low-confidence results fork to a review queue served by a lightweight internal UI.

technologies:
  - name: TypeScript
    role: Core pipeline orchestration
    category: language
  - name: Claude API
    role: Document extraction and classification
    category: ai
  - name: PostgreSQL
    role: Structured output storage and search
    category: data
  - name: AWS S3
    role: Document ingestion
    category: infrastructure
  - name: Node.js
    role: API layer
    category: framework

metrics:
  - label: Documents processed daily
    value: "10,000+"
  - label: Manual hours saved per week
    value: "120h"
  - label: Extraction accuracy
    value: "94%"
  - label: Review queue reduction
    value: "78%"
    delta: vs. previous process

lessons: |
  The main challenge was handling document variance — the same invoice from different vendors has wildly different layouts. We solved this with adaptive prompting that describes the document structure before asking for extractions. The second big lesson: confidence thresholds need to be calibrated per document type, not globally.

future: |
  Next steps include expanding to multi-language documents, adding a real-time streaming mode for high-priority documents, and building an analytics layer on top of extracted data for trend detection.

links:
  - label: GitHub Repository
    url: https://github.com/gabrielvilabracho/document-intelligence
    type: github
---
