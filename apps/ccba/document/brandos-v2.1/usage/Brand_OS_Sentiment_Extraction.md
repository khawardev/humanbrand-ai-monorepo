# Brand OS vNext: Sentiment Extraction
## Systematic Sentiment Analysis Across All Content Types

**Version:** 1.0  
**Date:** December 22, 2025  
**Status:** Supplementary to Core Engineering Handoff  
**Applies To:** OI-03, OI-15, COMP-03, OI-13

---

# Overview

Sentiment extraction captures emotional tone and polarity across:
1. **Brand's Own Content** — How the brand expresses itself
2. **Audience Reactions** — How people respond to the brand
3. **Competitor Context** — How competitors are discussed
4. **Market Perception** — Overall brand perception signals

---

# Sentiment Model

## Core Sentiment Dimensions

### 1. Polarity (Required)

```json
{
  "polarity": {
    "score": -1.0 to 1.0,
    "label": "very_negative | negative | neutral | positive | very_positive",
    "confidence": 0.0 to 1.0
  }
}
```

| Score Range | Label | Example |
|-------------|-------|---------|
| -1.0 to -0.6 | very_negative | "Complete disaster, avoid at all costs" |
| -0.6 to -0.2 | negative | "Disappointed with the quality" |
| -0.2 to 0.2 | neutral | "Received the product yesterday" |
| 0.2 to 0.6 | positive | "Really pleased with this" |
| 0.6 to 1.0 | very_positive | "Absolutely amazing, exceeded expectations" |

### 2. Emotional Tone (Required)

```json
{
  "emotional_tone": {
    "primary": "confident | enthusiastic | professional | empathetic | urgent | frustrated | skeptical | appreciative | neutral",
    "secondary": "same enum | null",
    "intensity": "low | medium | high"
  }
}
```

### 3. Subjectivity (Optional but Recommended)

```json
{
  "subjectivity": {
    "score": 0.0 to 1.0,
    "label": "objective | mixed | subjective"
  }
}
```

| Score | Label | Meaning |
|-------|-------|---------|
| 0.0-0.3 | objective | Factual, data-driven |
| 0.3-0.7 | mixed | Blend of facts and opinion |
| 0.7-1.0 | subjective | Opinion-driven, emotional |

---

# Sentiment by Content Type

## 1. Brand's Own Content (Posts, Pages)

**Agent:** OI-03 (Post Extractor), OI-01 (URL Extractor)

### Schema Addition

```json
{
  "sentiment": {
    "polarity": {
      "score": 0.45,
      "label": "positive",
      "confidence": 0.88
    },
    "emotional_tone": {
      "primary": "confident",
      "secondary": "enthusiastic",
      "intensity": "medium"
    },
    "subjectivity": {
      "score": 0.35,
      "label": "mixed"
    },
    "sentiment_markers": {
      "positive_terms": ["innovative", "leading", "proud"],
      "negative_terms": [],
      "hedging_terms": ["may", "potentially"],
      "certainty_terms": ["will", "committed", "proven"]
    }
  }
}
```

### Brand Voice Sentiment Profile

Compile into overall brand sentiment signature:

```json
{
  "brand_sentiment_profile": {
    "average_polarity": 0.52,
    "polarity_range": {"min": 0.15, "max": 0.85},
    "dominant_tone": "confident",
    "tone_distribution": {
      "confident": 0.45,
      "enthusiastic": 0.25,
      "professional": 0.20,
      "empathetic": 0.10
    },
    "sentiment_consistency": 0.78,
    "channel_variation": {
      "website": {"avg_polarity": 0.55, "dominant_tone": "professional"},
      "linkedin": {"avg_polarity": 0.60, "dominant_tone": "confident"},
      "instagram": {"avg_polarity": 0.70, "dominant_tone": "enthusiastic"}
    }
  }
}
```

---

## 2. Audience Comments

**Agent:** OI-15 (Comment Miner)

### Schema Addition

```json
{
  "comment_sentiment": {
    "polarity": {
      "score": 0.65,
      "label": "positive",
      "confidence": 0.82
    },
    "emotional_tone": {
      "primary": "appreciative",
      "secondary": null,
      "intensity": "medium"
    },
    "intent": "praise | question | complaint | suggestion | neutral",
    "requires_response": true,
    "urgency": "low | medium | high"
  }
}
```

### Comment Intent Categories

| Intent | Sentiment Signal | Brand Action |
|--------|-----------------|--------------|
| praise | Positive | Amplify, thank |
| question | Neutral (opportunity) | Respond with value |
| complaint | Negative | Address, resolve |
| suggestion | Neutral-positive | Consider, acknowledge |
| neutral | Neutral | Monitor |

### Aggregated Audience Sentiment

```json
{
  "audience_sentiment_summary": {
    "overall_sentiment": {
      "score": 0.42,
      "label": "positive",
      "trend": "stable | improving | declining"
    },
    "sentiment_distribution": {
      "very_positive": 0.15,
      "positive": 0.35,
      "neutral": 0.30,
      "negative": 0.15,
      "very_negative": 0.05
    },
    "intent_distribution": {
      "praise": 0.25,
      "question": 0.35,
      "complaint": 0.10,
      "suggestion": 0.08,
      "neutral": 0.22
    },
    "sentiment_by_topic": {
      "product_quality": {"score": 0.55, "volume": 45},
      "customer_service": {"score": 0.25, "volume": 30},
      "pricing": {"score": -0.15, "volume": 20}
    },
    "sentiment_by_channel": {
      "linkedin": {"score": 0.50, "volume": 200},
      "youtube": {"score": 0.35, "volume": 150},
      "instagram": {"score": 0.60, "volume": 100}
    },
    "red_flags": [
      {
        "topic": "delivery times",
        "sentiment": -0.45,
        "volume": 15,
        "trend": "increasing",
        "sample_evidence": ["EC00234", "EC00267"]
      }
    ]
  }
}
```

---

## 3. Competitor Mentions

**Agent:** OI-15 (Comment Miner), OI-13 (Strategist)

When competitors are mentioned in comments or content:

```json
{
  "competitor_mention_sentiment": {
    "competitor": "Competitor Name",
    "mention_count": 23,
    "sentiment": {
      "score": -0.15,
      "label": "slightly_negative"
    },
    "context_type": "comparison | recommendation | complaint | neutral",
    "context_distribution": {
      "favorable_to_client": 0.35,
      "favorable_to_competitor": 0.25,
      "neutral_comparison": 0.40
    },
    "key_comparison_points": [
      {
        "dimension": "price",
        "client_sentiment": 0.20,
        "competitor_sentiment": -0.30,
        "sample": "EC00345"
      }
    ]
  }
}
```

### Competitive Sentiment Matrix

```json
{
  "competitive_sentiment_matrix": {
    "client_mentions_in_competitor_content": {
      "count": 5,
      "sentiment": 0.10
    },
    "competitor_mentions_in_client_content": {
      "count": 2,
      "sentiment": 0.30
    },
    "head_to_head_in_comments": {
      "Comp1": {
        "mentions": 45,
        "client_wins": 0.55,
        "competitor_wins": 0.30,
        "neutral": 0.15
      },
      "Comp2": {
        "mentions": 23,
        "client_wins": 0.40,
        "competitor_wins": 0.45,
        "neutral": 0.15
      }
    }
  }
}
```

---

## 4. Brand Perception (Synthesized)

**Agent:** OI-11 (Archaeologist) — synthesis level

Combine all sentiment signals into overall brand perception:

```json
{
  "brand_perception": {
    "overall_sentiment": {
      "score": 0.48,
      "label": "positive",
      "confidence": 0.75
    },
    "perception_dimensions": {
      "trust": {"score": 0.55, "signals": ["proven", "reliable", "established"]},
      "innovation": {"score": 0.62, "signals": ["cutting-edge", "first", "new"]},
      "quality": {"score": 0.50, "signals": ["premium", "excellence", "best"]},
      "value": {"score": 0.35, "signals": ["affordable", "worth", "investment"]},
      "responsiveness": {"score": 0.40, "signals": ["fast", "helpful", "available"]}
    },
    "perception_gaps": [
      {
        "dimension": "value",
        "brand_claims": 0.60,
        "audience_perception": 0.35,
        "gap": -0.25,
        "implication": "Brand claims value but audience doesn't perceive it"
      }
    ],
    "sentiment_sources": {
      "brand_content": {"weight": 0.3, "score": 0.55},
      "audience_comments": {"weight": 0.5, "score": 0.42},
      "competitor_context": {"weight": 0.2, "score": 0.45}
    }
  }
}
```

---

# Sentiment Detection Methods

## Rule-Based Signals

Fast, interpretable, baseline:

```python
POSITIVE_MARKERS = [
    "excellent", "amazing", "love", "best", "great", "fantastic",
    "innovative", "leading", "proud", "excited", "thrilled",
    "impressed", "recommend", "outstanding", "exceptional"
]

NEGATIVE_MARKERS = [
    "terrible", "awful", "hate", "worst", "disappointed", 
    "frustrated", "annoyed", "poor", "failed", "broken",
    "avoid", "waste", "regret", "unacceptable", "misleading"
]

HEDGING_MARKERS = [
    "may", "might", "could", "potentially", "possibly",
    "sometimes", "often", "generally", "typically"
]

CERTAINTY_MARKERS = [
    "will", "always", "never", "definitely", "certainly",
    "proven", "guaranteed", "committed", "ensures"
]
```

## Contextual Adjustments

| Context | Adjustment |
|---------|------------|
| Negation ("not great") | Flip polarity |
| Intensifier ("very disappointed") | Increase magnitude |
| Diminisher ("somewhat good") | Decrease magnitude |
| Sarcasm indicators | Flag for review |
| Industry jargon | Neutral unless clear valence |

## Model-Based Enhancement

For production, layer LLM-based sentiment:

```python
def extract_sentiment(text, context):
    # 1. Rule-based baseline
    baseline = rule_based_sentiment(text)
    
    # 2. LLM enhancement for nuance
    llm_sentiment = llm_analyze_sentiment(text, context)
    
    # 3. Blend with confidence weighting
    if llm_sentiment.confidence > 0.8:
        return llm_sentiment
    else:
        return blend(baseline, llm_sentiment)
```

---

# Compilation: Sentiment Aggregation

## COMP-03 Sentiment Aggregation

Add to social bedrock compilation:

```python
def compile_channel_sentiment(post_extractions):
    sentiments = [p.sentiment for p in post_extractions]
    
    return {
        "sentiment_summary": {
            "average_polarity": mean([s.polarity.score for s in sentiments]),
            "polarity_std_dev": std([s.polarity.score for s in sentiments]),
            "dominant_tone": mode([s.emotional_tone.primary for s in sentiments]),
            "tone_consistency": calculate_tone_consistency(sentiments),
            "sentiment_trend": calculate_trend(post_extractions),  # by date
            "outliers": {
                "most_positive": get_top_n(sentiments, 3, "positive"),
                "most_negative": get_top_n(sentiments, 3, "negative")
            }
        }
    }
```

## Cross-Channel Sentiment Consistency

Add to OI-14 (Cartographer) internal consistency analysis:

```json
{
  "sentiment_consistency": {
    "overall_score": 0.72,
    "channel_comparison": {
      "website_vs_linkedin": {
        "polarity_gap": 0.05,
        "tone_alignment": 0.85,
        "assessment": "consistent"
      },
      "website_vs_instagram": {
        "polarity_gap": 0.15,
        "tone_alignment": 0.60,
        "assessment": "moderate_variation"
      }
    },
    "sentiment_fragmentation_risk": "low | medium | high"
  }
}
```

---

# Report Integration

## Emergent Brand Report Addition

Add to Voice & Tone section:

```markdown
### Emotional Signature

The brand consistently projects a **{{DOMINANT_TONE}}** emotional tone 
with **{{INTENSITY}}** intensity. Sentiment polarity averages 
**{{POLARITY_SCORE}}** ({{POLARITY_LABEL}}).

**Tonal Range:**
| Tone | Frequency | Contexts |
|------|-----------|----------|
| {{TONE_1}} | {{%}} | {{WHERE}} |
| {{TONE_2}} | {{%}} | {{WHERE}} |

**Sentiment by Channel:**
| Channel | Avg. Polarity | Dominant Tone | Consistency |
|---------|--------------|---------------|-------------|
| Website | {{SCORE}} | {{TONE}} | {{HIGH/MED/LOW}} |
| LinkedIn | {{SCORE}} | {{TONE}} | {{HIGH/MED/LOW}} |
```

## Voice of Market Report Addition

Add dedicated sentiment section:

```markdown
## Audience Sentiment Analysis

### Overall Perception

The audience sentiment toward {{ENTITY}} is **{{LABEL}}** 
(score: {{SCORE}}).

**Sentiment Distribution:**
- Very Positive: {{%}}
- Positive: {{%}}
- Neutral: {{%}}
- Negative: {{%}}
- Very Negative: {{%}}

### Sentiment by Topic

| Topic | Sentiment | Volume | Trend |
|-------|-----------|--------|-------|
| {{TOPIC}} | {{SCORE}} | {{N}} | {{↑/→/↓}} |

### Red Flags

{{TOPIC}} shows concerning negative sentiment ({{SCORE}}) 
with {{TREND}} trend. Key complaints include:

> "{{SAMPLE_QUOTE}}" ({{EVIDENCE_ID}})

### Competitive Sentiment

When competitors are mentioned alongside {{ENTITY}}:

| Competitor | Mentions | Client Favorability |
|------------|----------|---------------------|
| {{COMP}} | {{N}} | {{%}} |
```

---

# Quality Gates: Sentiment Validation

Add to Gate 1 (Extraction Quality):

| Check | Rule | Severity |
|-------|------|----------|
| Sentiment extracted | Every post/comment has sentiment | WARN if <95% |
| Polarity in range | Score between -1.0 and 1.0 | FAIL if outside |
| Confidence threshold | Avg confidence >0.7 | WARN if below |
| Tone valid | Tone is valid enum | FAIL if invalid |

Add to Gate 3 (Synthesis Credibility):

| Check | Rule | Severity |
|-------|------|----------|
| Sentiment aggregated | Bedrocks have sentiment summary | FAIL if missing |
| Perception gaps identified | At least 1 gap surfaced if data exists | WARN if none |
| Red flags surfaced | Negative clusters identified | WARN if missed |

---

# Implementation Notes

## Minimum Viable Sentiment

Start with:
1. Polarity (required) — positive/neutral/negative
2. Single emotional tone — most prominent
3. Comment intent — praise/question/complaint/neutral

## Full Sentiment

Add later:
1. Secondary tone
2. Subjectivity scoring
3. Trend analysis
4. Competitive sentiment matrix
5. Perception gap analysis

## Performance Considerations

- Rule-based: Fast, use for all content
- LLM-based: Use for ambiguous cases, validation
- Cache sentiment for repeated analysis
- Batch process comments (high volume)

---

# End of Sentiment Extraction Document


---

