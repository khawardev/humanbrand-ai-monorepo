# Brand OS Complete Machine Layer Output Specifications

**Version:** 2.1
**Date:** December 22, 2025
**Status:** Engineering Handoff Document (Complete)

This document contains the authoritative JSON Schemas for all machine-layer artifacts produced in Brand OS Phases 0–2.

## Key Remediations in v2.1

- Added **missing schemas** required by the agent inventory (bedrocks, content strategy, competitive outputs, bridge pack, quality gate outputs).
- Implemented **structured sentiment** (`classification.sentiment`) and report template updates.
- Implemented **channel-specific** post extraction and bedrock aggregation structures for LinkedIn / YouTube / Instagram / X / Facebook / TikTok.
- Standardized evidence references via `evidence_id` and `evidence_id_array` definitions across all schemas.

## Schema Index
- `./schema/engagement_config.json`
- `./schema/evidence_ledger.json`
- `./schema/corpus_manifest.json`
- `./schema/url_extraction.json`
- `./schema/image_extraction.json`
- `./schema/post_extraction.json`
- `./schema/fact_base.json`
- `./schema/website_verbal_bedrock.json`
- `./schema/website_visual_bedrock.json`
- `./schema/social_channel_bedrock.json`
- `./schema/social_visual_bedrock.json`
- `./schema/brand_platform.json`
- `./schema/brand_archetype.json`
- `./schema/brand_narrative.json`
- `./schema/brand_voice.json`
- `./schema/internal_consistency.json`
- `./schema/content_strategy.json`
- `./schema/voice_of_market.json`
- `./schema/positioning_landscape.json`
- `./schema/category_grammar.json`
- `./schema/topic_ownership.json`
- `./schema/competitor_playbooks.json`
- `./schema/whitespace_analysis.json`
- `./schema/visual_identity.json`
- `./schema/visual_competitive_analysis.json`
- `./schema/bam_input_pack.json`
- `./schema/gate_outputs.json`
