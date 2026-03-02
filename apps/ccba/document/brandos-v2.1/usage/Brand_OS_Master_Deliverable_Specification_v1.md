# Brand OS Master Deliverable Specification
## Phases 0–2: Outside‑In Audit & Competitive Intelligence

**Version:** 2.1
**Date:** December 22, 2025
**Status:** Engineering Handoff Document (Remediated)

---

## 1) Purpose

This document defines the authoritative **outputs, file names, and required artifacts** for Brand OS Phases 0–2.

It is the implementation companion to:
- `Brand_OS_Agent_Inventory.md` (who produces what)
- `Brand_OS_Schemas_v2.md` (what every output must look like)
- `Brand_OS_Quality_Gates.md` (how outputs are validated)
- `Brand_OS_Report_Templates_v2.md` (report formatting)

---

## 2) Scope

### In scope (Phase 0–2)
- Owned channels: **website + provided social channels** (LinkedIn, YouTube, Instagram, X, Facebook, TikTok)
- Structured extraction (webpages, social posts, images, audience comments)
- Bedrock compilation (verbal + visual)
- Entity‑level synthesis (platform, archetype, narrative, voice, content strategy, visual identity)
- Cross‑entity synthesis (positioning landscape, category grammar, topic ownership, whitespace, competitor playbooks, visual competitive analysis)
- Report generation (Markdown)

### Out of scope (Phase 0–2)
- Earned media: press, reviews, analyst reports, third‑party coverage
- Paid media performance, ad creative libraries, conversion analytics (unless provided as first‑party inputs)
- Sales collateral not included in provided corpus

---

## 3) Output Directory & Naming Conventions

Recommended structure:

```
/engagements/{engagement_id}/
  /raw/                      # raw corpus inputs (optional storage)
  /evidence/
    evidence_ledger.json
    corpus_manifest.json
  /extractions/
    /website/
      url_extraction_{source_id}.json
      image_extraction_{source_id}.json
    /social/{channel}/
      post_extraction_{source_id}.json
      image_extraction_{source_id}.json
    /comments/
      comment_chunk_{chunk_id}.json   # optional intermediate (implementation detail)
  /bedrocks/
    {entity}_website_verbal_bedrock.json
    {entity}_website_visual_bedrock.json
    {entity}_{channel}_bedrock.json
    {entity}_{channel}_visual_bedrock.json
  /strategy/
    {entity}_fact_base.json
    {entity}_brand_platform.json
    {entity}_brand_archetype.json
    {entity}_brand_narrative.json
    {entity}_brand_voice.json
    {entity}_content_strategy.json
    {entity}_visual_identity.json
    {entity}_voice_of_market.json
    {entity}_internal_consistency.json
  /competitive/
    positioning_landscape.json
    category_grammar.json
    topic_ownership.json
    whitespace_analysis.json
    competitor_playbooks.json
    visual_competitive_analysis.json
  /reports/
    {entity}_emergent_brand_report.md
    {entity}_{channel}_audit_report.md
    competitive_landscape_report.md
    consistency_report.md
    voice_of_market_report.md
    visual_identity_report.md
    visual_competitive_report.md
  bam_input_pack.json
  gate_outputs.json
```

---

## 4) Phase Deliverables

### Phase 0: Setup

| Artifact | Filename | Schema | Owner |
|---|---|---|---|
| Engagement config | `engagement_config.json` | `engagement_config.json` | Client / Orchestrator |
| Evidence ledger | `evidence_ledger.json` | `evidence_ledger.json` | SA‑00 |
| Corpus manifest | `corpus_manifest.json` | `corpus_manifest.json` | SA‑00 |

---

### Phase 1A: Extraction Outputs (atomic, per‑item)

| Artifact | Filename | Schema | Owner |
|---|---|---|---|
| Webpage extraction | `url_extraction_{source_id}.json` | `url_extraction.json` | OI‑01 |
| Image extraction | `image_extraction_{source_id}.json` | `image_extraction.json` | OI‑02 |
| Social post extraction | `post_extraction_{source_id}.json` | `post_extraction.json` | OI‑03 |

**Notes**
- `post_extraction.json` includes:
  - Structured **sentiment** (`classification.sentiment`)
  - Optional **channel_specific** block for platform‑specific metadata

---

### Phase 1B: Compilation Outputs (bedrocks)

| Artifact | Filename | Schema | Owner |
|---|---|---|---|
| Website verbal bedrock | `{entity}_website_verbal_bedrock.json` | `website_verbal_bedrock.json` | COMP‑01 |
| Website visual bedrock | `{entity}_website_visual_bedrock.json` | `website_visual_bedrock.json` | COMP‑02 |
| Social channel bedrock | `{entity}_{channel}_bedrock.json` | `social_channel_bedrock.json` | COMP‑03 |
| Social visual bedrock | `{entity}_{channel}_visual_bedrock.json` | `social_visual_bedrock.json` | COMP‑04 |

---

### Phase 2A: Entity Strategy Outputs

| Artifact | Filename | Schema | Owner |
|---|---|---|---|
| Fact base | `{entity}_fact_base.json` | `fact_base.json` | OI‑10 |
| Brand platform | `{entity}_brand_platform.json` | `brand_platform.json` | OI‑11 |
| Brand archetype | `{entity}_brand_archetype.json` | `brand_archetype.json` | OI‑11 |
| Brand narrative | `{entity}_brand_narrative.json` | `brand_narrative.json` | OI‑11 |
| Brand voice | `{entity}_brand_voice.json` | `brand_voice.json` | OI‑11 |
| Content strategy | `{entity}_content_strategy.json` | `content_strategy.json` | OI‑12 |
| Internal consistency | `{entity}_internal_consistency.json` | `internal_consistency.json` | OI‑14 |
| Voice of market | `{entity}_voice_of_market.json` | `voice_of_market.json` | OI‑15 |
| Visual identity | `{entity}_visual_identity.json` | `visual_identity.json` | OI‑16 |

---

### Phase 2B: Cross‑Entity Competitive Outputs

| Artifact | Filename | Schema | Owner |
|---|---|---|---|
| Positioning landscape | `positioning_landscape.json` | `positioning_landscape.json` | OI‑13 |
| Category grammar | `category_grammar.json` | `category_grammar.json` | OI‑13 |
| Topic ownership | `topic_ownership.json` | `topic_ownership.json` | OI‑13 |
| Whitespace analysis | `whitespace_analysis.json` | `whitespace_analysis.json` | OI‑13 |
| Competitor playbooks | `competitor_playbooks.json` | `competitor_playbooks.json` | OI‑13 |
| Visual competitive analysis | `visual_competitive_analysis.json` | `visual_competitive_analysis.json` | OI‑17 |

---

### Bridge Output

| Artifact | Filename | Schema | Owner |
|---|---|---|---|
| BAM input pack | `bam_input_pack.json` | `bam_input_pack.json` | BRIDGE‑01 |
| Gate outputs | `gate_outputs.json` | `gate_outputs.json` | Orchestrator / QA |

---

## 5) Report Deliverables (Markdown)

All reports MUST be generated from templates in `Brand_OS_Report_Templates_v2.md`:

| Report | Output file | Generator |
|---|---|---|
| Emergent Brand Report | `{entity}_emergent_brand_report.md` | RPT‑01 |
| Social Channel Audit | `{entity}_{channel}_audit_report.md` | RPT‑02 |
| Competitive Landscape Report | `competitive_landscape_report.md` | RPT‑03 |
| Consistency Report | `consistency_report.md` | RPT‑04 |
| Voice of Market Report | `voice_of_market_report.md` | RPT‑05 |
| Visual Identity Report | `visual_identity_report.md` | RPT‑06 |
| Visual Competitive Report | `visual_competitive_report.md` | RPT‑07 |

---

## 6) Validation Requirements

- Every JSON output must validate against its corresponding schema in `Brand_OS_Schemas_v2.md`.
- Quality checks are defined in `Brand_OS_Quality_Gates.md`.
- Evidence IDs are mandatory for:
  - synthesized claims
  - clustered themes
  - competitive assertions
  - any statement likely to be challenged

---
