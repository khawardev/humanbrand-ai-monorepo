# Brand OS vNext: Compilation Logic
## Rules for Aggregating Extractions into Bedrocks

**Version:** 2.0  
**Date:** December 22, 2025  
**Status:** Engineering Handoff Document

---

# Overview

Compilation is the critical bridge between **extraction** (per-URL, per-post, per-image) and **synthesis** (brand strategy interpretation). 

The compiler agents take hundreds of partial extractions and produce unified channel-level bedrocks that synthesis agents can interpret.

```
[Scraper Output]
     ↓
[Per-URL/Post/Image Extraction] → url_extraction_001.json, url_extraction_002.json, ...
     ↓
[COMPILATION] → website_verbal_bedrock.json, linkedin_bedrock.json, ...
     ↓
[Synthesis] → brand_platform.json, emergent_brand_report.md
```

---

# Compilation Principles

## 1. Aggregate, Don't Interpret

Compilers **combine data** but do not **interpret meaning**. Interpretation is the synthesis agents' job.

**Compiler does:**
- Sum frequencies
- Union claim sets
- Calculate distributions
- Surface conflicts as tensions

**Compiler does NOT:**
- Decide which claims are "true"
- Resolve contradictions
- Synthesize brand attributes
- Make strategic recommendations

## 2. Preserve Evidence Chains

Every aggregated data point must maintain its connection to source evidence.

```json
// WRONG - loses evidence chain
{
  "top_nouns": [
    {"word": "innovation", "count": 156}
  ]
}

// RIGHT - preserves evidence chain
{
  "top_nouns": [
    {
      "word": "innovation", 
      "count": 156,
      "source_urls": ["URL-001", "URL-015", "URL-089"],
      "sample_evidence_ids": ["E00023", "E00145", "E00892"]
    }
  ]
}
```

## 3. Surface Tensions, Don't Resolve Them

When extractions contain contradictory information, the compiler surfaces both sides as a **tension**—it does not pick a winner.

```json
{
  "discovered_tensions": [
    {
      "tension_id": "T001",
      "tension_name": "Leadership Claim Inconsistency",
      "side_a": {
        "claim": "global leader in mobility",
        "evidence_ids": ["E00100", "E00101"],
        "source_count": 12
      },
      "side_b": {
        "claim": "regional manufacturing specialist",
        "evidence_ids": ["E00200"],
        "source_count": 3
      },
      "resolution_observed": false
    }
  ]
}
```

## 4. Deduplicate Semantically

The same claim stated different ways should be merged, not counted separately.

**Semantic similarity threshold:** 0.85

```
"We are a global leader in automotive technology"
"As the global leader in automotive innovation..."
"Leading the world in automotive solutions"
→ All merge into ONE claim with frequency = 3
```

## 5. Weight by Source Quality

Not all sources are equal. Weight by:
- **Page type:** Homepage/About > Product pages > News
- **Position:** Hero content > Body content > Footer
- **Recency:** Newer content > Older content (for social)

---

# Compilation Rules by Data Type

## Frequencies (Nouns, Verbs, Adjectives)

### Rule: Sum and Rank

```python
def compile_frequencies(extractions):
    """
    Aggregate word frequencies across all extractions.
    """
    aggregated = {}
    
    for extraction in extractions:
        for word_data in extraction.nouns:
            word = word_data.word.lower()
            
            if word not in aggregated:
                aggregated[word] = {
                    "word": word,
                    "count": 0,
                    "contexts": set(),
                    "source_urls": set(),
                    "evidence_ids": set()
                }
            
            aggregated[word]["count"] += word_data.count
            aggregated[word]["contexts"].update(word_data.contexts[:3])
            aggregated[word]["source_urls"].add(extraction.source.url_id)
            aggregated[word]["evidence_ids"].add(extraction.evidence_id)
    
    # Rank by count, keep top 100
    ranked = sorted(aggregated.values(), key=lambda x: x["count"], reverse=True)[:100]
    
    # Calculate percentages
    total_words = sum(item["count"] for item in ranked)
    for item in ranked:
        item["percent"] = round(item["count"] / total_words * 100, 2)
        item["rank"] = ranked.index(item) + 1
        item["contexts"] = list(item["contexts"])[:5]  # Keep max 5 unique contexts
        item["source_urls"] = list(item["source_urls"])
        item["evidence_ids"] = list(item["evidence_ids"])[:10]  # Keep max 10 evidence IDs
    
    return ranked
```

### Output Structure

```json
{
  "top_nouns": [
    {
      "word": "solutions",
      "count": 456,
      "percent": 0.19,
      "rank": 1,
      "contexts": ["complete solutions", "mobility solutions", "integrated solutions"],
      "source_urls": ["URL-001", "URL-015", "URL-089"],
      "evidence_ids": ["E00023", "E00145", "E00892"]
    }
  ]
}
```

---

## Claims

### Rule: Union with Semantic Deduplication

```python
def compile_claims(extractions, similarity_threshold=0.85):
    """
    Union all claims with semantic deduplication.
    Claims with >85% semantic similarity are merged.
    """
    all_claims = []
    
    # Collect all claims
    for extraction in extractions:
        for claim in extraction.claims:
            all_claims.append({
                "text": claim.text,
                "claim_type": claim.claim_type,
                "verbatim_quote": claim.verbatim_quote,
                "source_url": extraction.source.url,
                "evidence_id": claim.evidence_id
            })
    
    # Cluster by semantic similarity
    clusters = semantic_cluster(all_claims, threshold=similarity_threshold)
    
    # Merge clusters
    merged_claims = []
    for cluster in clusters:
        representative = cluster[0]  # Use first as canonical
        merged_claims.append({
            "claim_id": generate_claim_id(),
            "text": representative["text"],
            "claim_type": representative["claim_type"],
            "frequency": len(cluster),
            "source_pages": len(set(c["source_url"] for c in cluster)),
            "variations": [c["verbatim_quote"] for c in cluster][:5],
            "evidence_ids": [c["evidence_id"] for c in cluster]
        })
    
    # Sort by frequency
    merged_claims.sort(key=lambda x: x["frequency"], reverse=True)
    
    return merged_claims
```

### Claim Type Aggregation

```json
{
  "claim_inventory": {
    "total_claims": 234,
    "claims_by_type": {
      "leadership": 45,
      "capability": 89,
      "uniqueness": 23,
      "quality": 34,
      "innovation": 43
    },
    "top_claims": [
      {
        "claim_id": "CL-AGG-001",
        "text": "global leader in mobility technology",
        "claim_type": "leadership",
        "frequency": 12,
        "source_pages": 12,
        "variations": [
          "We are a global leader in mobility technology",
          "As the global leader in automotive innovation",
          "Leading the world in mobility solutions"
        ],
        "evidence_ids": ["E00012", "E00045", "E00089", "E00123"]
      }
    ]
  }
}
```

---

## Facts

### Rule: Union with Exact Match Deduplication

Facts require **exact match** deduplication (unlike claims which use semantic similarity). The same fact from multiple sources increases credibility.

```python
def compile_facts(extractions):
    """
    Union all facts with exact match deduplication.
    Track source count for credibility weighting.
    """
    fact_map = {}
    
    for extraction in extractions:
        for fact in extraction.facts:
            # Normalize for matching
            normalized = normalize_fact(fact.text)
            
            if normalized not in fact_map:
                fact_map[normalized] = {
                    "fact_id": generate_fact_id(),
                    "text": fact.text,
                    "fact_type": fact.fact_type,
                    "verbatim_quotes": [],
                    "source_urls": [],
                    "evidence_ids": [],
                    "verification_status": fact.verification_status,
                    "source_count": 0
                }
            
            fact_map[normalized]["verbatim_quotes"].append(fact.verbatim_quote)
            fact_map[normalized]["source_urls"].append(extraction.source.url)
            fact_map[normalized]["evidence_ids"].append(fact.evidence_id)
            fact_map[normalized]["source_count"] += 1
            
            # Upgrade verification status if any source is verified
            if fact.verification_status == "verified":
                fact_map[normalized]["verification_status"] = "verified"
    
    facts = list(fact_map.values())
    
    # Sort by source_count (facts appearing more often are more reliable)
    facts.sort(key=lambda x: x["source_count"], reverse=True)
    
    return facts
```

### Verification Status Rules

| Status | Meaning | Upgrade Rules |
|--------|---------|---------------|
| `verified` | Confirmed from external source | Cannot be downgraded |
| `stated` | Company claims, no external verification | Upgrades to `verified` if any source verified |
| `unverifiable` | Cannot be confirmed | Upgrades to `stated` if stated elsewhere |

---

## Value Driver Signals

### Rule: Sum Signals Per Driver

```python
def compile_value_driver_signals(extractions, value_drivers):
    """
    Aggregate value driver signals across all extractions.
    """
    driver_signals = {driver.driver_id: {
        "driver_id": driver.driver_id,
        "driver_name": driver.name,
        "pages_mentioning": set(),
        "total_signal_count": 0,
        "keywords_found": set(),
        "evidence_ids": []
    } for driver in value_drivers}
    
    total_pages = len(extractions)
    
    for extraction in extractions:
        for signal in extraction.value_driver_signals:
            driver_id = signal.driver_id
            
            if signal.signal_count > 0:
                driver_signals[driver_id]["pages_mentioning"].add(extraction.source.url_id)
                driver_signals[driver_id]["total_signal_count"] += signal.signal_count
                driver_signals[driver_id]["keywords_found"].update(signal.signal_keywords_found)
                driver_signals[driver_id]["evidence_ids"].extend(signal.evidence_ids[:3])
    
    # Convert to output format
    output = []
    for driver_id, data in driver_signals.items():
        pages_count = len(data["pages_mentioning"])
        output.append({
            "driver_id": driver_id,
            "driver_name": data["driver_name"],
            "pages_mentioning": pages_count,
            "coverage_percent": round(pages_count / total_pages * 100, 1),
            "signal_density": categorize_density(data["total_signal_count"], pages_count),
            "top_keywords": list(data["keywords_found"])[:10],
            "evidence_ids": data["evidence_ids"][:10]
        })
    
    # Sort by coverage
    output.sort(key=lambda x: x["coverage_percent"], reverse=True)
    
    return output

def categorize_density(signal_count, page_count):
    if page_count == 0:
        return "none"
    ratio = signal_count / page_count
    if ratio > 3:
        return "high"
    elif ratio > 1:
        return "medium"
    else:
        return "low"
```

---

## Audience Cues

### Rule: Sum and Calculate Prominence

```python
def compile_audience_cues(extractions, total_word_count):
    """
    Aggregate audience cues and calculate prominence.
    """
    cue_map = {}
    
    for extraction in extractions:
        for cue in extraction.audience_cues:
            normalized = cue.cue.lower()
            
            if normalized not in cue_map:
                cue_map[normalized] = {
                    "cue": cue.cue,
                    "count": 0,
                    "contexts": []
                }
            
            cue_map[normalized]["count"] += cue.count
            cue_map[normalized]["contexts"].append(cue.context)
    
    # Calculate prominence and categorize
    cues = []
    for normalized, data in cue_map.items():
        prominence_ratio = data["count"] / total_word_count * 10000  # Per 10K words
        
        cues.append({
            "cue": data["cue"],
            "count": data["count"],
            "prominence": categorize_prominence(prominence_ratio),
            "contexts": list(set(data["contexts"]))[:5]
        })
    
    cues.sort(key=lambda x: x["count"], reverse=True)
    
    return cues

def categorize_prominence(ratio):
    if ratio > 5:
        return "high"
    elif ratio > 1:
        return "medium"
    else:
        return "low"
```

---

## Tensions

### Rule: Detect and Surface Contradictions

Tensions are detected when:
1. **Contradictory claims** exist (opposite assertions)
2. **Inconsistent emphasis** exists (one page emphasizes X, another emphasizes Y)
3. **Language conflicts** exist (different terminology for same concept)

```python
def detect_tensions(compiled_claims, compiled_frequencies, extractions):
    """
    Detect tensions from contradictions and inconsistencies.
    """
    tensions = []
    
    # 1. Detect contradictory claims
    for i, claim_a in enumerate(compiled_claims):
        for claim_b in compiled_claims[i+1:]:
            if is_contradictory(claim_a["text"], claim_b["text"]):
                tensions.append({
                    "tension_id": generate_tension_id(),
                    "tension_name": f"{claim_a['claim_type']} Contradiction",
                    "description": f"Content makes contradictory claims about {claim_a['claim_type']}",
                    "side_a": {
                        "theme": claim_a["text"],
                        "signal_count": claim_a["frequency"],
                        "keywords": extract_keywords(claim_a["text"]),
                        "evidence_ids": claim_a["evidence_ids"][:5]
                    },
                    "side_b": {
                        "theme": claim_b["text"],
                        "signal_count": claim_b["frequency"],
                        "keywords": extract_keywords(claim_b["text"]),
                        "evidence_ids": claim_b["evidence_ids"][:5]
                    },
                    "ratio": claim_b["frequency"] / claim_a["frequency"],
                    "resolution_observed": False
                })
    
    # 2. Detect theme emphasis tensions (e.g., legacy vs. future)
    theme_pairs = [
        ("legacy", "future"),
        ("global", "regional"),
        ("innovation", "tradition"),
        ("technology", "people")
    ]
    
    for theme_a, theme_b in theme_pairs:
        count_a = count_theme_signals(compiled_frequencies, theme_a)
        count_b = count_theme_signals(compiled_frequencies, theme_b)
        
        if count_a > 50 and count_b > 50:  # Both themes present significantly
            ratio = min(count_a, count_b) / max(count_a, count_b)
            if ratio > 0.3:  # Significant presence of both
                tensions.append({
                    "tension_id": generate_tension_id(),
                    "tension_name": f"{theme_a.title()} vs. {theme_b.title()}",
                    "description": f"Content oscillates between {theme_a} and {theme_b} emphasis",
                    "side_a": {
                        "theme": theme_a,
                        "signal_count": count_a,
                        "keywords": get_theme_keywords(compiled_frequencies, theme_a),
                        "evidence_ids": get_theme_evidence(extractions, theme_a)[:5]
                    },
                    "side_b": {
                        "theme": theme_b,
                        "signal_count": count_b,
                        "keywords": get_theme_keywords(compiled_frequencies, theme_b),
                        "evidence_ids": get_theme_evidence(extractions, theme_b)[:5]
                    },
                    "ratio": ratio,
                    "resolution_observed": False
                })
    
    return tensions
```

---

## Images (Visual Compilation)

### Rule: Aggregate Visual Signals with Distribution Calculation

```python
def compile_visual_signals(image_extractions):
    """
    Compile visual analysis from individual images into bedrock.
    """
    total_images = len(image_extractions)
    
    # 1. Aggregate colors
    color_counts = {}
    for img in image_extractions:
        for color in img.color_analysis.dominant_colors:
            hex_code = color.hex.lower()
            if hex_code not in color_counts:
                color_counts[hex_code] = {
                    "hex": hex_code,
                    "name": color.name,
                    "total_percent": 0,
                    "occurrence_count": 0
                }
            color_counts[hex_code]["total_percent"] += color.percent
            color_counts[hex_code]["occurrence_count"] += 1
    
    # Calculate average usage and rank
    dominant_palette = []
    for hex_code, data in color_counts.items():
        avg_percent = data["total_percent"] / data["occurrence_count"]
        usage_percent = data["occurrence_count"] / total_images * 100
        dominant_palette.append({
            "hex": data["hex"],
            "name": data["name"],
            "usage_percent": round(usage_percent, 1),
            "avg_dominance": round(avg_percent, 1)
        })
    
    dominant_palette.sort(key=lambda x: x["usage_percent"], reverse=True)
    
    # 2. Aggregate subject matter
    subject_counts = {
        "people": 0,
        "product": 0,
        "facility": 0,
        "equipment": 0,
        "abstract_graphic": 0,
        "other": 0
    }
    
    for img in image_extractions:
        subject = img.subject_classification.primary_subject
        if subject in subject_counts:
            subject_counts[subject] += 1
        else:
            subject_counts["other"] += 1
    
    subject_distribution = {
        subject: round(count / total_images * 100, 1)
        for subject, count in subject_counts.items()
    }
    
    # 3. Aggregate photography style
    style_counts = {}
    for img in image_extractions:
        style = img.photography_analysis.style
        style_counts[style] = style_counts.get(style, 0) + 1
    
    primary_style = max(style_counts, key=style_counts.get)
    primary_style_percent = style_counts[primary_style] / total_images * 100
    
    # 4. Detect templates (recurring visual patterns)
    templates = detect_visual_templates(image_extractions)
    
    # 5. Aggregate people representation
    people_images = [img for img in image_extractions if img.subject_details.people.present]
    people_analysis = compile_people_representation(people_images)
    
    return {
        "corpus_summary": {
            "total_images_analyzed": total_images,
            "images_by_type": subject_counts
        },
        "color_analysis": {
            "dominant_palette": dominant_palette[:5],
            "color_temperature": calculate_overall_temperature(image_extractions),
            "color_consistency": calculate_color_consistency(image_extractions)
        },
        "subject_matter_distribution": subject_distribution,
        "photography_style": {
            "primary_style": primary_style,
            "primary_style_percent": round(primary_style_percent, 1)
        },
        "template_detection": templates,
        "people_representation": people_analysis
    }
```

---

## Social Posts

### Sentiment Aggregation (from `post_extraction.classification.sentiment`)

**Goal:** capture the brand's expressed emotional signature on this channel (not audience reaction).

**What Python should precompute (Map aggregation):**
- `polarity_distribution`: counts/shares of polarity labels (`very_negative`, `negative`, `neutral`, `positive`, `very_positive`)
- `avg_polarity_score` and `std_polarity_score`
- `emotional_tone_distribution`: counts/shares of `primary` emotional tones
- `intensity_distribution`: counts/shares of `low` / `medium` / `high`
- Optional: sentiment by `format`, sentiment by `purpose`, sentiment by theme cluster (after reduce)

**What the LLM should do (Reduce semantics):**
- Identify the dominant emotional tones and where they appear (themes/formats).
- Call out meaningful shifts (e.g., announcements skew confident/urgent; recruiting skews professional/enthusiastic).
- Provide representative `evidence_ids` for each pattern.

**In the channel bedrock output:**
- Store distributions under `sentiment_summary` (see `social_channel_bedrock.json`).
- Store brief qualitative interpretation under `sentiment_insights` with evidence links.

### Channel-Specific Metrics Aggregation (Platform Adaptations)

The compiler should summarize `post_extraction.channel_specific` fields into a `channel_characteristics` block.

**LinkedIn**
- Content type split (thought leadership, product update, hiring, doc carousel, etc.)
- Engagement quality: comment depth and share rate (if available)
- Professional context signals: role/industry keywords, authority markers, data/stat usage

**YouTube**
- Long-form vs Shorts split; average duration
- Hook timing signals (if available), chapters presence, CTA placement patterns
- Topic and format clusters (tutorial, demo, webinar, interview, etc.)

**Instagram**
- Reels vs carousels vs single-image split
- Visual style motifs and caption length patterns
- Hashtag/mention norms; save/share proxies if available

**X (Twitter)**
- Thread vs single-post split; thread length distribution
- Newsjacking / topicality markers (when present)
- CTA patterns (link-outs, quote tweets, replies)

**Facebook**
- Link vs video vs image mix
- Community/event signals (when present)
- Reaction mix (if available)

**TikTok**
- Short-form video patterns (hook type, pacing, on-screen text frequency)
- CTA patterns (follow, link-in-bio, comment prompts) (Channel Compilation)

### Rule: Aggregate with Engagement Weighting

Social compilation includes engagement metrics and temporal patterns.

```python
def compile_social_channel(post_extractions, profile_data):
    """
    Compile social post extractions into channel bedrock.
    """
    total_posts = len(post_extractions)
    
    # 1. Activity metrics
    posts_by_date = group_by_date(post_extractions)
    posting_cadence = calculate_cadence(posts_by_date)
    
    # 2. Engagement metrics
    total_engagement = sum(p.engagement.total for p in post_extractions)
    engagement_values = [p.engagement.total for p in post_extractions]
    
    engagement_metrics = {
        "total_engagement": total_engagement,
        "avg_engagement_per_post": round(total_engagement / total_posts, 1),
        "median_engagement_per_post": calculate_median(engagement_values),
        "engagement_rate": calculate_engagement_rate(total_engagement, total_posts, profile_data.follower_count)
    }
    
    # 3. Content mix
    format_counts = {}
    purpose_counts = {}
    
    for post in post_extractions:
        fmt = post.classification.format
        purpose = post.classification.purpose
        
        if fmt not in format_counts:
            format_counts[fmt] = {"count": 0, "total_engagement": 0}
        format_counts[fmt]["count"] += 1
        format_counts[fmt]["total_engagement"] += post.engagement.total
        
        if purpose not in purpose_counts:
            purpose_counts[purpose] = {"count": 0, "total_engagement": 0}
        purpose_counts[purpose]["count"] += 1
        purpose_counts[purpose]["total_engagement"] += post.engagement.total
    
    content_mix = {
        "by_format": {
            fmt: {
                "count": data["count"],
                "percent": round(data["count"] / total_posts * 100, 1),
                "avg_engagement": round(data["total_engagement"] / data["count"], 1)
            }
            for fmt, data in format_counts.items()
        },
        "by_purpose": {
            purpose: {
                "count": data["count"],
                "percent": round(data["count"] / total_posts * 100, 1),
                "avg_engagement": round(data["total_engagement"] / data["count"], 1)
            }
            for purpose, data in purpose_counts.items()
        }
    }
    
    # 4. Top performing posts
    sorted_posts = sorted(post_extractions, key=lambda p: p.engagement.total, reverse=True)
    median_engagement = engagement_metrics["median_engagement_per_post"]
    
    top_posts = []
    for post in sorted_posts[:10]:
        lift = round((post.engagement.total - median_engagement) / median_engagement * 100, 1)
        top_posts.append({
            "post_id": post.source.post_id,
            "posted_at": post.source.posted_at,
            "content_excerpt": post.content.text[:150] + "...",
            "format": post.classification.format,
            "purpose": post.classification.purpose,
            "engagement": {
                "likes": post.engagement.likes,
                "comments": post.engagement.comments,
                "shares": post.engagement.shares,
                "total": post.engagement.total
            },
            "lift_vs_median": lift,
            "evidence_id": post.evidence_id
        })
    
    # 5. Engagement drivers
    engagement_drivers = identify_engagement_drivers(post_extractions, median_engagement)
    
    # 6. Theme extraction
    themes = extract_themes_from_posts(post_extractions)
    
    # 7. Hashtag analysis
    hashtag_analysis = compile_hashtags(post_extractions)
    
    return {
        "profile_snapshot": {
            "handle": profile_data.handle,
            "follower_count": profile_data.follower_count,
            "follower_snapshot_date": profile_data.snapshot_date
        },
        "activity_metrics": {
            "total_posts": total_posts,
            "posting_cadence": posting_cadence
        },
        "engagement_metrics": engagement_metrics,
        "content_mix": content_mix,
        "top_performing_posts": top_posts,
        "engagement_drivers": engagement_drivers,
        "theme_extraction": themes,
        "hashtag_analysis": hashtag_analysis
    }
```

---

# Compilation Pipelines

## Pipeline 1: Website Verbal Compilation

```
Input:
  - url_extraction_001.json
  - url_extraction_002.json
  - ... (all URL extractions for entity)

Processing:
  1. Load all URL extractions
  2. Compile frequencies (nouns, verbs, adjectives)
  3. Compile claims (with semantic deduplication)
  4. Compile facts (with exact match deduplication)
  5. Compile audience cues
  6. Compile value driver signals
  7. Extract positioning signals
  8. Detect tensions
  9. Calculate corpus metrics

Output:
  - website_verbal_bedrock.json
```

## Pipeline 2: Website Visual Compilation

```
Input:
  - image_extraction_001.json
  - image_extraction_002.json
  - ... (all image extractions from website)

Processing:
  1. Load all image extractions
  2. Aggregate color analysis
  3. Aggregate subject classification
  4. Aggregate photography style
  5. Detect template patterns
  6. Compile people representation
  7. Identify distinctive assets
  8. Calculate consistency scores

Output:
  - website_visual_bedrock.json
```

## Pipeline 3: Social Channel Compilation

```
Input:
  - post_extraction_001.json
  - post_extraction_002.json
  - ... (all post extractions for channel)
  - profile_data.json

Processing:
  1. Load all post extractions
  2. Load profile data
  3. Calculate activity metrics
  4. Calculate engagement metrics
  5. Compile content mix
  6. Identify top posts
  7. Identify engagement drivers
  8. Extract themes
  9. Compile hashtag analysis
  10. Compile value driver coverage

Output:
  - {channel}_bedrock.json
```

## Pipeline 4: Social Visual Compilation

```
Input:
  - image_extraction_001.json (from social posts)
  - ... (all image extractions from channel)

Processing:
  1. Load all image extractions
  2. Aggregate color analysis
  3. Aggregate subject classification
  4. Detect template patterns
  5. Calculate consistency with website visuals

Output:
  - {channel}_visual_bedrock.json
```

---

# Quality Checks

Before outputting a bedrock, the compiler must verify:

## Completeness Checks

| Check | Rule | Action if Failed |
|-------|------|------------------|
| Evidence coverage | Every claim has ≥1 evidence_id | Flag missing evidence |
| Frequency totals | Sum of percentages = 100% (±0.5%) | Recalculate percentages |
| No orphan references | All evidence_ids exist in ledger | Remove orphan references |
| Minimum data | ≥50 pages (website) or ≥50 posts (social) | Flag as "limited corpus" |

## Consistency Checks

| Check | Rule | Action if Failed |
|-------|------|------------------|
| Claim deduplication | No claims >85% similar | Re-run deduplication |
| Tension detection | Both sides of tension have evidence | Remove single-sided tensions |
| Count validation | Aggregated counts ≥ sum of parts | Recalculate |

## Schema Validation

All outputs must validate against the defined JSON schema before being written.

---

# Error Handling

## Missing Extractions

If expected extractions are missing:

```python
def handle_missing_extractions(expected_urls, actual_extractions):
    missing = set(expected_urls) - set(e.source.url_id for e in actual_extractions)
    
    if len(missing) > 0:
        return {
            "status": "partial",
            "missing_count": len(missing),
            "missing_urls": list(missing)[:10],  # First 10
            "coverage_percent": (len(actual_extractions) / len(expected_urls)) * 100
        }
    
    return {"status": "complete"}
```

## Extraction Errors

If individual extractions contain errors:

```python
def handle_extraction_errors(extractions):
    valid = []
    errors = []
    
    for extraction in extractions:
        if extraction.error:
            errors.append({
                "url_id": extraction.source.url_id,
                "error": extraction.error
            })
        else:
            valid.append(extraction)
    
    return valid, {
        "error_count": len(errors),
        "error_rate": len(errors) / len(extractions),
        "errors": errors[:20]  # First 20 errors
    }
```

## Low Confidence Data

Flag data that may be unreliable:

```python
def flag_low_confidence(compiled_data):
    flags = []
    
    # Low claim evidence
    for claim in compiled_data.claims:
        if len(claim.evidence_ids) < 2:
            flags.append({
                "type": "low_evidence",
                "item": claim.claim_id,
                "issue": "Claim supported by only 1 source"
            })
    
    # Thin corpus sections
    for section, count in compiled_data.content_distribution.items():
        if count.pages < 5:
            flags.append({
                "type": "thin_corpus",
                "item": section,
                "issue": f"Only {count.pages} pages in section"
            })
    
    return flags
```

---

# Performance Considerations

## Batch Processing

For large corpora (>500 extractions), process in batches:

```python
BATCH_SIZE = 100

def compile_in_batches(extractions):
    partial_results = []
    
    for i in range(0, len(extractions), BATCH_SIZE):
        batch = extractions[i:i + BATCH_SIZE]
        partial = compile_batch(batch)
        partial_results.append(partial)
    
    return merge_partial_results(partial_results)
```

## Caching

Cache intermediate results for re-runs:

```python
def get_or_compute(cache_key, compute_fn, *args):
    cached = cache.get(cache_key)
    if cached:
        return cached
    
    result = compute_fn(*args)
    cache.set(cache_key, result, ttl=3600)  # 1 hour
    return result
```

## Memory Management

For very large image sets, stream processing:

```python
def compile_images_streaming(image_paths):
    aggregator = ImageAggregator()
    
    for path in image_paths:
        extraction = load_extraction(path)
        aggregator.add(extraction)
        del extraction  # Free memory
    
    return aggregator.finalize()
```

---

# Testing

## Unit Test Cases

### Frequency Compilation

```python
def test_frequency_compilation():
    extractions = [
        make_extraction(nouns=[("innovation", 5), ("solution", 3)]),
        make_extraction(nouns=[("innovation", 10), ("technology", 7)])
    ]
    
    result = compile_frequencies(extractions)
    
    assert result[0]["word"] == "innovation"
    assert result[0]["count"] == 15
    assert result[1]["word"] == "technology"
    assert result[1]["count"] == 7
```

### Claim Deduplication

```python
def test_claim_deduplication():
    extractions = [
        make_extraction(claims=[
            ("We are a global leader in mobility", "leadership"),
            ("Global leader in automotive technology", "leadership")
        ]),
        make_extraction(claims=[
            ("We deliver complete vehicle solutions", "capability")
        ])
    ]
    
    result = compile_claims(extractions)
    
    # Two semantically similar claims should merge
    leadership_claims = [c for c in result if c["claim_type"] == "leadership"]
    assert len(leadership_claims) == 1
    assert leadership_claims[0]["frequency"] == 2
```

### Tension Detection

```python
def test_tension_detection():
    claims = [
        {"text": "global leader in technology", "claim_type": "leadership", "frequency": 10},
        {"text": "regional manufacturing specialist", "claim_type": "positioning", "frequency": 5}
    ]
    
    tensions = detect_tensions(claims, [], [])
    
    # Should detect global vs regional tension
    assert len(tensions) >= 1
    assert any("global" in t["side_a"]["theme"].lower() for t in tensions)
```

---

# End of Compilation Logic Document


---

