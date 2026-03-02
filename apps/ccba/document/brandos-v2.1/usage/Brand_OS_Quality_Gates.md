# Brand OS vNext: Quality Gates
## Validation Thresholds, Checkpoints, and Adequacy Tests

**Version:** 2.1
**Date:** December 22, 2025
**Status:** Engineering Handoff Document

---

# Overview

Quality Gates are checkpoints that validate outputs before they proceed to the next phase. They ensure:

1. **Data adequacy** — Sufficient corpus for reliable synthesis
2. **Extraction quality** — Agents captured what they should
3. **Compilation integrity** — Aggregations are accurate
4. **Synthesis credibility** — Conclusions are evidence-grounded

```
[Phase 0] → GATE 0 → [Phase 1 Extraction] → GATE 1 → [Phase 1 Compilation] → GATE 2 → [Phase 2 Synthesis] → GATE 3 → [Output]
```

**Gate Outcomes:**
- ✅ **PASS** — Proceed to next phase
- ⚠️ **WARN** — Proceed with flagged limitations
- ❌ **FAIL** — Stop and remediate

---

# Gate 0: Corpus Adequacy

**When:** After data collection, before extraction
**Purpose:** Ensure sufficient raw material for analysis

## Website Corpus Thresholds

| Metric | Minimum | Target | Ideal | Action if Below Minimum |
|--------|---------|--------|-------|------------------------|
| Pages crawled | 50 | 150 | 300+ | WARN: "Limited website corpus" |
| Total words | 25,000 | 75,000 | 150,000+ | WARN: "Thin content corpus" |
| About/Company pages | 1 | 3 | 5+ | FAIL if 0: "No brand positioning content" |
| Product/Solution pages | 5 | 20 | 50+ | WARN: "Limited product content" |
| Images captured | 25 | 100 | 250+ | WARN: "Limited visual corpus" |

## Social Corpus Thresholds (Per Channel)

| Metric | Minimum | Target | Ideal | Action if Below Minimum |
|--------|---------|--------|-------|------------------------|
| Posts collected | 50 | 150 | 365+ | WARN: "Limited posting history" |
| Posts with engagement | 40 | 120 | 300+ | WARN: "Low engagement corpus" |
| Comments collected | 100 | 500 | 2000+ | WARN: "Limited audience signal" |
| Date range (days) | 90 | 180 | 365+ | WARN: "Short analysis window" |

## Channel Presence Validation

| Scenario | Action |
|----------|--------|
| Channel in scope but no presence found | Flag: "No {channel} presence detected" |
| Channel private or inaccessible | Flag: "Unable to access {channel}" |
| Channel exists but <10 posts | WARN: "Minimal {channel} activity" |

## Cross-Entity Balance

For competitive analysis:

| Metric | Threshold | Action if Failed |
|--------|-----------|------------------|
| Client corpus vs. smallest competitor | Client ≥ 80% of smallest | WARN: "Competitor corpus imbalance" |
| All entities have website | 100% | FAIL: "Missing website for {entity}" |
| All entities have ≥1 social channel | 100% | WARN: "No social for {entity}" |

## Gate 0 Output

```json
{
  "gate": "corpus_adequacy",
  "status": "pass|warn|fail",
  "timestamp": "ISO8601",
  "entities_evaluated": ["Client", "Comp1", "Comp2"],
  "summary": {
    "total_pages": 450,
    "total_posts": 890,
    "total_images": 340,
    "total_comments": 2100
  },
  "warnings": [
    {
      "entity": "Comp2",
      "issue": "Limited LinkedIn corpus",
      "detail": "Only 34 posts collected (minimum: 50)",
      "impact": "LinkedIn analysis for Comp2 will have reduced confidence"
    }
  ],
  "failures": [],
  "recommendation": "Proceed with noted limitations"
}
```

---

# Gate 1: Extraction Quality

**When:** After extraction agents complete, before compilation
**Purpose:** Validate extraction accuracy and completeness

## Per-URL Extraction Validation

| Check | Rule | Severity |
|-------|------|----------|
| Word count plausibility | Extracted words within 50-150% of page content | WARN if outside range |
| Claims extracted | At least 1 claim per 500 words (on brand pages) | WARN if below |
| Evidence IDs assigned | Every claim/fact has evidence_id | FAIL if missing |
| No null fields | Required fields have values or explicit "not_found" | FAIL if null |
| Page type classified | page_type is valid enum value | WARN if "other" >30% |

## Per-Image Extraction Validation

| Check | Rule | Severity |
|-------|------|----------|
| Color analysis complete | At least 3 dominant colors identified | WARN if <3 |
| Subject classified | primary_subject is valid enum | FAIL if missing |
| Evidence ID assigned | image has evidence_id | FAIL if missing |
| Dimensions captured | width and height > 0 | WARN if missing |

## Per-Post Extraction Validation

| Check | Rule | Severity |
|-------|------|----------|
| Engagement captured | likes, comments, shares are integers ≥0 | FAIL if missing |
| Posted date parsed | posted_at is valid ISO8601 | WARN if unparseable |
| Content captured | text is non-empty OR has_media is true | FAIL if both empty |
| Classification complete | format, purpose, and sentiment are valid | WARN if missing |
| Sentiment polarity valid | `classification.sentiment.polarity.score` ∈ [-1, 1] | FAIL if out of range |
| Emotional tone valid | `classification.sentiment.emotional_tone.primary` in allowed enum; `intensity` in {low, medium, high} | WARN if invalid |
| Subjectivity valid (if present) | `classification.sentiment.subjectivity.score` ∈ [0, 1]; label in {objective, mixed, subjective} | WARN if invalid |
| Channel-specific valid (if present) | `channel_specific` matches the platform schema for the post's source channel | WARN if invalid |


## Aggregate Extraction Quality Metrics

| Metric | Target | Action |
|--------|--------|--------|
| Extraction success rate | ≥95% | WARN if 90-95%, FAIL if <90% |
| Average extraction time | <30s per URL | WARN if >60s |
| Claim extraction rate | ≥0.5 claims per page | WARN if <0.3 |
| Fact extraction rate | ≥0.2 facts per page | WARN if <0.1 |

## Gate 1 Output

```json
{
  "gate": "extraction_quality",
  "status": "pass|warn|fail",
  "timestamp": "ISO8601",
  "extractions_evaluated": {
    "url_extractions": 156,
    "image_extractions": 234,
    "post_extractions": 445
  },
  "success_rates": {
    "url": 0.98,
    "image": 0.96,
    "post": 0.99
  },
  "quality_scores": {
    "claim_density": 0.67,
    "fact_density": 0.23,
    "evidence_coverage": 1.0
  },
  "warnings": [],
  "failures": [],
  "recommendation": "Proceed to compilation"
}
```

---

# Gate 2: Compilation Integrity

**When:** After compilation agents complete, before synthesis
**Purpose:** Validate bedrock accuracy and completeness

## Website Verbal Bedrock Validation

| Check | Rule | Severity |
|-------|------|----------|
| Pages counted correctly | pages_analyzed = count of URL extractions | FAIL if mismatch |
| Word count plausible | total_words within 10% of sum of URL word counts | WARN if outside |
| Top nouns ranked | Rank 1 has highest count | FAIL if misordered |
| Claims deduplicated | No two claims >85% similar | WARN if duplicates |
| Tensions have both sides | Every tension has side_a and side_b with evidence | WARN if one-sided |
| Value drivers covered | All configured drivers have coverage data | FAIL if missing |

## Social Bedrock Validation

| Check | Rule | Severity |
|-------|------|----------|
| Post count matches | total_posts = count of post extractions | FAIL if mismatch |
| Engagement math correct | total_engagement = sum of all posts | FAIL if mismatch >1% |
| Top posts sorted | Posts ordered by engagement descending | FAIL if misordered |
| Content mix sums to 100% | by_format percentages sum to 100% (±1%) | WARN if outside |
| Sentiment distribution present | polarity and emotional tone distributions exist | WARN if absent |
| Sentiment distribution sums | polarity shares sum to ~1.0; tone shares sum to ~1.0 | WARN if invalid |
| Channel characteristics present (when applicable) | `channel_characteristics` exists when channel-specific fields are present in inputs | WARN if absent |


## Visual Bedrock Validation

| Check | Rule | Severity |
|-------|------|----------|
| Image count matches | total_images = count of image extractions | FAIL if mismatch |
| Color palette valid | All hex codes are valid format | FAIL if invalid |
| Subject percentages sum | Subject distribution sums to 100% (±1%) | WARN if outside |

## Gate 2 Output

```json
{
  "gate": "compilation_integrity",
  "status": "pass|warn|fail",
  "timestamp": "ISO8601",
  "bedrocks_validated": [
    "client_website_verbal_bedrock",
    "client_linkedin_bedrock"
  ],
  "validation_results": {
    "client_website_verbal_bedrock": {
      "status": "pass",
      "checks_passed": 12,
      "checks_warned": 0,
      "checks_failed": 0
    }
  },
  "warnings": [],
  "failures": [],
  "recommendation": "Proceed to synthesis"
}
```

---

# Gate 3: Synthesis Credibility

**When:** After synthesis agents complete, before report generation
**Purpose:** Validate synthesis quality and evidence grounding

## Brand Platform Validation

| Element | Confidence Threshold | Evidence Threshold | Action if Below |
|---------|---------------------|-------------------|-----------------|
| Mission | ≥0.60 | ≥3 evidence_ids | WARN: "Low confidence mission" |
| Vision | ≥0.50 | ≥2 evidence_ids | WARN: "Low confidence vision" |
| Purpose | ≥0.50 | ≥2 evidence_ids | WARN: "Low confidence purpose" |
| Values (each) | ≥0.60 | ≥2 evidence_ids | Omit value if <0.40 |
| Positioning | ≥0.70 | ≥5 evidence_ids | WARN: "Weak positioning signal" |
| Promise | ≥0.60 | ≥3 evidence_ids | WARN: "Low confidence promise" |
| Key Themes (each) | ≥0.50 | ≥3 evidence_ids | Omit theme if <0.30 |

## Brand Archetype Validation

| Check | Rule | Severity |
|-------|------|----------|
| Primary archetype confidence | ≥0.65 | WARN if <0.65 |
| Primary ≠ Secondary | Different archetypes selected | WARN if same |
| Supporting patterns exist | ≥3 patterns with examples | WARN if <3 |

## Brand Narrative Validation

| Check | Rule | Severity |
|-------|------|----------|
| Hero identified | Non-empty description | WARN if empty |
| Antagonist identified | Non-empty description | WARN if empty |
| Core tension stated | Non-empty description | FAIL if empty |
| Narrative arcs found | ≥2 arcs identified | WARN if <2 |

## Brand Voice Validation

| Check | Rule | Severity |
|-------|------|----------|
| Personality described | ≥50 words | WARN if <50 |
| Primary attributes | ≥3 attributes | FAIL if <2 |
| Tonal range complete | All 4 dimensions scored | FAIL if incomplete |
| Lexicon populated | ≥5 signature terms | WARN if <5 |

## Evidence Density Scoring

| Score | Rating | Meaning |
|-------|--------|---------|
| ≥0.95 | Excellent | Nearly all claims evidenced |
| 0.85-0.94 | Good | Strong evidence grounding |
| 0.70-0.84 | Adequate | Acceptable evidence density |
| <0.70 | Insufficient | Too many unevidenced claims |

## Gate 3 Output

```json
{
  "gate": "synthesis_credibility",
  "status": "pass|warn|fail",
  "timestamp": "ISO8601",
  "syntheses_validated": [
    "client_brand_platform",
    "client_brand_archetype",
    "client_brand_narrative",
    "client_brand_voice"
  ],
  "confidence_summary": {
    "avg_confidence": 0.78,
    "min_confidence": 0.52,
    "max_confidence": 0.94
  },
  "evidence_density": {
    "overall": 0.92,
    "rating": "good"
  },
  "low_confidence_elements": [
    {
      "entity": "Client",
      "element": "vision",
      "confidence": 0.52,
      "reason": "Limited future-oriented content in corpus"
    }
  ],
  "warnings": [],
  "failures": [],
  "recommendation": "Proceed to report generation with noted limitations"
}
```

---

# Gate 4: Report Quality

**When:** After report generation, before delivery
**Purpose:** Validate report completeness and quality

## Structural Completeness

| Section | Required | Check |
|---------|----------|-------|
| Executive Summary | Yes | 100-500 words, no bullet points |
| All synthesis sections | Yes | Non-empty content |
| Tensions section | Yes | ≥1 tension surfaced |
| Recommendations | Yes | ≥3 recommendations with priority |
| Methodology note | Yes | Present and complete |

## Evidence Citation

| Check | Rule | Severity |
|-------|------|----------|
| Citation density | ≥1 citation per 200 words | WARN if below |
| Valid citations | All (EXXXXX) references exist | FAIL if invalid |
| Citation distribution | Citations in all major sections | WARN if clustered |

## Writing Quality

| Check | Rule | Severity |
|-------|------|----------|
| No bullet points in prose | Narrative sections use paragraphs | WARN if bullets |
| Confidence stated | Confidence scores for key claims | WARN if missing |
| Numbers match JSON | Report numbers match machine layer | FAIL if mismatch |

---

# Thresholds Reference

## Confidence Score Interpretation

| Score Range | Label | Meaning |
|-------------|-------|---------|
| 0.90 - 1.00 | Very High | Strong, consistent evidence across multiple sources |
| 0.80 - 0.89 | High | Good evidence from multiple sources |
| 0.70 - 0.79 | Medium-High | Solid evidence, some gaps |
| 0.60 - 0.69 | Medium | Adequate evidence, notable gaps |
| 0.50 - 0.59 | Medium-Low | Limited evidence, interpret with caution |
| 0.40 - 0.49 | Low | Thin evidence, may be unreliable |
| 0.00 - 0.39 | Insufficient | Not enough evidence to synthesize |

## Corpus Adequacy Tiers

| Tier | Website Pages | Social Posts/Channel | Analysis Quality |
|------|---------------|---------------------|------------------|
| Ideal | 300+ | 365+ | Full confidence |
| Target | 150-299 | 150-364 | High confidence |
| Adequate | 50-149 | 50-149 | Moderate confidence |
| Marginal | 25-49 | 25-49 | Low confidence, flagged |
| Insufficient | <25 | <25 | Analysis not recommended |

## Consistency Score Interpretation

| Score | Label | Meaning |
|-------|-------|---------|
| 90-100 | Exceptional | Unified brand across all channels |
| 80-89 | Strong | Minor variations, cohesive brand |
| 70-79 | Good | Some gaps, generally consistent |
| 60-69 | Moderate | Noticeable inconsistencies |
| 50-59 | Weak | Significant fragmentation |
| <50 | Fragmented | Brand appears as multiple identities |

---

# Remediation Workflows

## Corpus Inadequacy (Gate 0 FAIL)

```
1. Identify which entities/channels are below threshold
2. Options:
   a. Expand crawl scope (more pages/posts)
   b. Extend lookback period (more historical posts)
   c. Accept limitation with documented caveats
   d. Remove entity from competitive set
3. Re-run Gate 0
```

## Extraction Failure (Gate 1 FAIL)

```
1. Identify failed extractions
2. Check for:
   a. Malformed source content
   b. Agent timeout
   c. Schema validation errors
3. Options:
   a. Re-run failed extractions
   b. Skip problematic URLs with flag
   c. Manual extraction for critical content
4. Re-run Gate 1
```

## Low Confidence Synthesis (Gate 3 WARN/FAIL)

```
1. Identify low-confidence elements
2. Check for:
   a. Thin corpus for that element
   b. Contradictory evidence
   c. Ambiguous source content
3. Options:
   a. Accept with documented limitation
   b. Supplement with additional sources
   c. Omit element from report
4. Re-run Gate 3
```

---

# Quality Summary Output

```json
{
  "run_id": "uuid",
  "completed_at": "ISO8601",
  "overall_quality": "good|acceptable|flagged|failed",
  "gates": {
    "gate_0": {"status": "pass", "warnings": 0, "failures": 0},
    "gate_1": {"status": "pass", "warnings": 2, "failures": 0},
    "gate_2": {"status": "pass", "warnings": 0, "failures": 0},
    "gate_3": {"status": "warn", "warnings": 3, "failures": 0},
    "gate_4": {"status": "pass", "warnings": 1, "failures": 0}
  },
  "key_limitations": [
    "Comp2 LinkedIn corpus below target (34 posts)",
    "Client vision synthesis at 0.52 confidence"
  ],
  "recommendations": [
    "Note vision confidence limitation in report"
  ]
}
```

---

# End of Quality Gates Document
