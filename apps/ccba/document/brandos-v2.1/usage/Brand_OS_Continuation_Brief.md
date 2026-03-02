# Brand OS vNext: Engineering Handoff Continuation Brief
## Use This Document to Resume Work in New Conversations

**Last Updated:** December 22, 2025
**Version:** 2.1
**Status:** Remediated (Sentiment + Channel-Specific + Missing Schemas Added)

---


## What This Pack Contains

This package is now internally consistent across:
- `Brand_OS_Agent_Inventory.md` (authoritative agent list and I/O)
- `Brand_OS_Agent_Prompts_v2.md` (full prompts for all agents, including COMP and RPT agents)
- `Brand_OS_Schemas_v2.md` (complete schema set; no missing artifacts)
- `Brand_OS_Quality_Gates.md` (updated to validate sentiment + channel-specific fields)
- `Brand_OS_Report_Templates_v2.md` (report templates updated for sentiment)
- `Brand_OS_Master_Deliverable_Specification_v1.md` (deliverables and naming)
- Supporting docs:
  - `Brand_OS_Evidence_System.md`
  - `Brand_OS_Channel_Adaptations.md`
  - `Brand_OS_Sentiment_Extraction.md`
  - `Brand_OS_Compilation_Logic.md`

---

## Implementation Checklist

### Phase 0
- Generate `evidence_ledger.json` + `corpus_manifest.json` (SA‑00)

### Phase 1 (Map)
- Run OI‑01 (Web Collector) on each webpage → `url_extraction_*.json`
- Run OI‑02 (Image Analyzer) on each image → `image_extraction_*.json`
- Run OI‑03 (Social Collector) on each social post → `post_extraction_*.json`

### Phase 1 (Reduce / COMP)
- Run:
  - COMP‑01 → `website_verbal_bedrock.json`
  - COMP‑02 → `website_visual_bedrock.json`
  - COMP‑03 → `{entity}_{channel}_bedrock.json`
  - COMP‑04 → `{entity}_{channel}_visual_bedrock.json`

### Phase 2 (Entity)
- OI‑10 → `fact_base.json`
- OI‑11 → brand_platform / brand_archetype / brand_narrative / brand_voice
- OI‑12 → content_strategy
- OI‑14 → internal_consistency
- OI‑15 → voice_of_market
- OI‑16 → visual_identity

### Phase 2 (Cross-Entity)
- OI‑13 → positioning_landscape / category_grammar / topic_ownership / whitespace_analysis / competitor_playbooks
- OI‑17 → visual_competitive_analysis

### Reports
- RPT‑01..07 using `Brand_OS_Report_Templates_v2.md`

### Bridge
- BRIDGE‑01 → `bam_input_pack.json`


---

## Notes for Engineers

- COMP agents should not do arithmetic. Compute aggregates in code and pass to the LLM.
- Evidence traceability is non‑negotiable: use `[e:ID]` in reports and `evidence_ids` in JSON outputs.
- Phase 0–2 is owned-channel only; do not add press/reviews unless the engagement explicitly expands scope.
