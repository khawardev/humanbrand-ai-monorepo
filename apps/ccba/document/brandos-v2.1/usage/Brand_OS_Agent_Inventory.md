# Brand OS vNext: Agent Inventory
## Complete Agent List with Input/Output Mapping

**Version:** 2.1
**Date:** December 22, 2025
**Status:** Engineering Handoff Document (Remediated)

---

# Agent Naming Convention

| Prefix | Meaning |
|--------|---------|
| SA- | System Agent (infrastructure) |
| OI- | Outside-In Agent (analysis) |
| COMP- | Compilation Agent (aggregation) |
| RPT- | Report Generator Agent |

---

# Phase 0: Configuration & Setup

## SA-00: Evidence Ledger Builder

**Purpose:** Catalogs all evidence with unique IDs for citation

| Attribute | Value |
|-----------|-------|
| Trigger | After all scrapers complete |
| Input | Raw scraper outputs (pages, posts, images, comments) |
| Output | `evidence_ledger.json`, `corpus_manifest.json` |
| Dependencies | None |
| Parallel | No |

**Input Schema:**
```
- website_crawl_{entity}.json
- social_posts_{entity}_{channel}.json
- social_comments_{entity}_{channel}.json
- images_{entity}_{channel}.json
```

**Output Schema:**
```
- evidence_ledger.json (master index)
- corpus_manifest.json (coverage summary)
```

---

# Phase 1: Extraction Agents

## OI-01: Website Verbal Extractor ("The Auditor")

**Purpose:** Forensic linguistic extraction from website pages

| Attribute | Value |
|-----------|-------|
| Trigger | After SA-00 completes |
| Input | Single webpage content + evidence_id |
| Output | `url_extraction_{id}.json` |
| Dependencies | SA-00 |
| Parallel | Yes (one instance per URL) |
| Batch Size | 50 URLs per batch |

**Input:**
```json
{
  "url_id": "URL-00001",
  "evidence_id": "E00001",
  "url": "https://example.com/about",
  "page_type": "about",
  "html_content": "...",
  "text_content": "..."
}
```

**Output:** `url_extraction_{url_id}.json`

---

## OI-02: Visual Extractor ("The Curator")

**Purpose:** Image-by-image visual analysis

| Attribute | Value |
|-----------|-------|
| Trigger | After SA-00 completes |
| Input | Single image + evidence_id |
| Output | `image_extraction_{id}.json` |
| Dependencies | SA-00 |
| Parallel | Yes (one instance per image) |
| Batch Size | 100 images per batch |

**Input:**
```json
{
  "image_id": "IMG-00001",
  "evidence_id": "VE00001",
  "source_url": "https://example.com/about",
  "image_uri": "s3://bucket/images/img001.jpg",
  "context": "Hero image on About page"
}
```

**Output:** `image_extraction_{image_id}.json`

---

## OI-03: Social Post Extractor

**Purpose:** Post-level social media extraction

| Attribute | Value |
|-----------|-------|
| Trigger | After SA-00 completes |
| Input | Single social post + evidence_id |
| Output | `post_extraction_{id}.json` |
| Dependencies | SA-00 |
| Parallel | Yes (one instance per post) |
| Batch Size | 100 posts per batch |

**Input:**
```json
{
  "post_id": "li-123456",
  "evidence_id": "E00500",
  "channel": "linkedin",
  "entity": "Client",
  "posted_at": "2024-06-15T10:30:00Z",
  "content": "...",
  "engagement": {"likes": 45, "comments": 12, "shares": 5}
}
```

**Output:** `post_extraction_{post_id}.json`

---

## OI-10: Fact Base Extractor

**Purpose:** Extract verifiable proof points

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-01 completes |
| Input | All url_extraction files for entity |
| Output | `fact_base_{entity}.json` |
| Dependencies | OI-01 |
| Parallel | Yes (one per entity) |

**Output:** Consolidated fact inventory with verification status

---

# Phase 1: Compilation Agents

## COMP-01: Website Verbal Compiler

**Purpose:** Aggregate URL extractions into website bedrock

| Attribute | Value |
|-----------|-------|
| Trigger | After all OI-01 for entity complete |
| Input | All `url_extraction_{id}.json` for entity |
| Output | `{entity}_website_verbal_bedrock.json` |
| Dependencies | OI-01 (all URLs) |
| Parallel | Yes (one per entity) |

**Aggregation Rules:**
- Frequencies: Sum across all URLs
- Claims: Union with semantic deduplication (85% threshold)
- Facts: Union with exact match deduplication
- Tensions: Detect contradictions

---

## COMP-02: Website Visual Compiler

**Purpose:** Aggregate image extractions into visual bedrock

| Attribute | Value |
|-----------|-------|
| Trigger | After all OI-02 for entity website complete |
| Input | All `image_extraction_{id}.json` from website |
| Output | `{entity}_website_visual_bedrock.json` |
| Dependencies | OI-02 (all website images) |
| Parallel | Yes (one per entity) |

**Aggregation Rules:**
- Colors: Weighted average by image prominence
- Subjects: Distribution percentages
- Templates: Pattern detection (≥3 occurrences)

---

## COMP-03: Social Channel Compiler

**Purpose:** Aggregate post extractions into channel bedrock

| Attribute | Value |
|-----------|-------|
| Trigger | After all OI-03 for entity/channel complete |
| Input | All `post_extraction_{id}.json` for entity/channel |
| Output | `{entity}_{channel}_bedrock.json` |
| Dependencies | OI-03 (all posts for channel) |
| Parallel | Yes (one per entity/channel) |

**Aggregation Rules:**
- Engagement: Sum, average, median, rate
- Content mix: Percentage by format and purpose
- Top posts: Ranked by engagement
- Themes: Clustered by keyword co-occurrence

---

## COMP-04: Social Visual Compiler

**Purpose:** Aggregate social image extractions

| Attribute | Value |
|-----------|-------|
| Trigger | After all OI-02 for entity/channel complete |
| Input | All `image_extraction_{id}.json` from channel |
| Output | `{entity}_{channel}_visual_bedrock.json` |
| Dependencies | OI-02 (all channel images) |
| Parallel | Yes (one per entity/channel) |

---

# Phase 2: Synthesis Agents

## OI-11: The Archaeologist

**Purpose:** Synthesize brand platform, archetype, narrative, voice

| Attribute | Value |
|-----------|-------|
| Trigger | After all COMP agents for entity complete |
| Input | All bedrocks for entity |
| Output | `brand_platform.json`, `brand_archetype.json`, `brand_narrative.json`, `brand_voice.json` |
| Dependencies | COMP-01, COMP-02, COMP-03, COMP-04 |
| Parallel | Yes (one per entity) |

**Input:**
```
- {entity}_website_verbal_bedrock.json
- {entity}_website_visual_bedrock.json
- {entity}_linkedin_bedrock.json
- {entity}_youtube_bedrock.json
- ... (all channel bedrocks)
```

**Outputs:**
```
- {entity}_brand_platform.json
- {entity}_brand_archetype.json
- {entity}_brand_narrative.json
- {entity}_brand_voice.json
```

---

## OI-12: Content Strategist

**Purpose:** Synthesize content strategy from channel data

| Attribute | Value |
|-----------|-------|
| Trigger | After all COMP-03/04 for entity complete |
| Input | All social bedrocks for entity |
| Output | `{entity}_content_strategy.json` |
| Dependencies | COMP-03, COMP-04 |
| Parallel | Yes (one per entity) |

---

## OI-13: The Strategist

**Purpose:** Competitive intelligence and whitespace analysis

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-11 completes for ALL entities |
| Input | All brand_platform.json files |
| Output | `positioning_landscape.json`, `category_grammar.json`, `topic_ownership.json`, `whitespace_analysis.json`, `competitor_playbooks.json` |
| Dependencies | OI-11 (all entities) |
| Parallel | No (requires all entities) |

---

## OI-14: The Cartographer

**Purpose:** Internal consistency analysis

| Attribute | Value |
|-----------|-------|
| Trigger | After all COMP agents for entity complete |
| Input | All bedrocks for single entity |
| Output | `{entity}_internal_consistency.json` |
| Dependencies | All COMP agents for entity |
| Parallel | Yes (one per entity) |

---

## OI-15: Comment Miner

**Purpose:** Voice of Market extraction from comments

| Attribute | Value |
|-----------|-------|
| Trigger | After comment data available |
| Input | Comment corpus for entity |
| Output | `{entity}_voice_of_market.json` |
| Dependencies | SA-00 (comment evidence) |
| Parallel | Yes (one per entity) |

---

## OI-16: Visual Identity Synthesizer

**Purpose:** Synthesize visual identity from visual bedrocks

| Attribute | Value |
|-----------|-------|
| Trigger | After COMP-02, COMP-04 complete |
| Input | All visual bedrocks for entity |
| Output | `{entity}_visual_identity.json` |
| Dependencies | COMP-02, COMP-04 |
| Parallel | Yes (one per entity) |

---

## OI-17: Visual Intelligence Analyst

**Purpose:** Cross-entity visual competitive analysis

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-16 completes for ALL entities |
| Input | All visual_identity.json files |
| Output | `visual_competitive_analysis.json` |
| Dependencies | OI-16 (all entities) |
| Parallel | No (requires all entities) |

---

# Phase 2: Report Generators

## RPT-01: Emergent Brand Report Generator

**Purpose:** Generate human layer brand report

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-11 completes for entity |
| Input | All OI-11 outputs for entity |
| Output | `{entity}_emergent_brand_report.md` |
| Dependencies | OI-11 |
| Parallel | Yes (one per entity) |

---

## RPT-02: Channel Audit Report Generator

**Purpose:** Generate per-channel social audit

| Attribute | Value |
|-----------|-------|
| Trigger | After COMP-03 completes |
| Input | Channel bedrock |
| Output | `{entity}_{channel}_audit_report.md` |
| Dependencies | COMP-03 |
| Parallel | Yes (one per entity/channel) |

---

## RPT-03: Competitive Landscape Report Generator

**Purpose:** Generate competitive intelligence report

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-13 completes |
| Input | All OI-13 outputs |
| Output | `competitive_landscape_report.md` |
| Dependencies | OI-13 |
| Parallel | No |

---

## RPT-04: Consistency Report Generator

**Purpose:** Generate internal consistency report

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-14 completes |
| Input | internal_consistency.json |
| Output | `{entity}_consistency_report.md` |
| Dependencies | OI-14 |
| Parallel | Yes (one per entity) |

---

## RPT-05: Voice of Market Report Generator

**Purpose:** Generate audience intelligence report

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-15 completes |
| Input | voice_of_market.json |
| Output | `{entity}_voice_of_market_report.md` |
| Dependencies | OI-15 |
| Parallel | Yes (one per entity) |

---

## RPT-06: Visual Identity Report Generator

**Purpose:** Generate visual identity report

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-16 completes |
| Input | visual_identity.json |
| Output | `{entity}_visual_identity_report.md` |
| Dependencies | OI-16 |
| Parallel | Yes (one per entity) |

---

## RPT-07: Visual Competitive Report Generator

**Purpose:** Generate visual competitive analysis

| Attribute | Value |
|-----------|-------|
| Trigger | After OI-17 completes |
| Input | visual_competitive_analysis.json |
| Output | `visual_competitive_report.md` |
| Dependencies | OI-17 |
| Parallel | No |

---

# Phase 2: Handoff

## BRIDGE-01: BAM Input Pack Generator

**Purpose:** Package synthesis for Brand Action Model input

| Attribute | Value |
|-----------|-------|
| Trigger | After all Phase 2 synthesis complete |
| Input | All synthesis outputs |
| Output | `bam_input_pack.json` |
| Dependencies | All OI agents |
| Parallel | No |

---

# Execution Order

```
PHASE 0
└── SA-00 (Evidence Ledger)

PHASE 1 EXTRACTION (Parallel)
├── OI-01 × N URLs (Website Verbal)
├── OI-02 × N Images (Visual)
├── OI-03 × N Posts (Social)
└── OI-10 (Fact Base)

PHASE 1 COMPILATION (Per Entity, Parallel)
├── COMP-01 (Website Verbal)
├── COMP-02 (Website Visual)
├── COMP-03 × N Channels (Social)
└── COMP-04 × N Channels (Social Visual)

PHASE 2 SYNTHESIS (Per Entity First, Then Cross-Entity)
├── Per Entity (Parallel):
│   ├── OI-11 (Archaeologist)
│   ├── OI-12 (Content Strategist)
│   ├── OI-14 (Cartographer)
│   ├── OI-15 (Comment Miner)
│   └── OI-16 (Visual Identity)
│
└── Cross-Entity (Sequential):
    ├── OI-13 (Strategist) — needs all OI-11
    └── OI-17 (Visual Intel) — needs all OI-16

PHASE 2 REPORTS (Parallel where possible)
├── RPT-01 × N Entities (Emergent Brand)
├── RPT-02 × N Entity/Channels (Channel Audit)
├── RPT-03 (Competitive Landscape)
├── RPT-04 × N Entities (Consistency)
├── RPT-05 × N Entities (Voice of Market)
├── RPT-06 × N Entities (Visual Identity)
└── RPT-07 (Visual Competitive)

HANDOFF
└── BRIDGE-01 (BAM Input Pack)
```

---

# Agent Count Summary

| Category | Count |
|----------|-------|
| System Agents | 1 |
| Extraction Agents | 4 |
| Compilation Agents | 4 |
| Synthesis Agents | 7 |
| Report Generators | 7 |
| Handoff Agents | 1 |
| **Total Unique Agents** | **24** |

**Instance Count (Example: 1 Client + 4 Competitors, 3 Channels Each):**

| Agent | Instances |
|-------|-----------|
| SA-00 | 1 |
| OI-01 | ~750 (150 pages × 5 entities) |
| OI-02 | ~1,250 (250 images × 5 entities) |
| OI-03 | ~2,250 (150 posts × 3 channels × 5 entities) |
| OI-10 | 5 |
| COMP-01 | 5 |
| COMP-02 | 5 |
| COMP-03 | 15 (3 channels × 5 entities) |
| COMP-04 | 15 |
| OI-11 | 5 |
| OI-12 | 5 |
| OI-13 | 1 |
| OI-14 | 5 |
| OI-15 | 5 |
| OI-16 | 5 |
| OI-17 | 1 |
| RPT-01 | 5 |
| RPT-02 | 15 |
| RPT-03 | 1 |
| RPT-04 | 5 |
| RPT-05 | 5 |
| RPT-06 | 5 |
| RPT-07 | 1 |
| BRIDGE-01 | 1 |

---

# End of Agent Inventory
