# Brand OS vNext: Channel Adaptations Addendum
## Platform-Specific Extraction & Compilation Guidance

**Version:** 1.0  
**Date:** December 22, 2025  
**Status:** Supplementary to Core Engineering Handoff  
**Applies To:** OI-03 (Post Extractor), COMP-03 (Social Compiler), OI-02 (Visual Extractor)

---

# Overview

This addendum provides channel-specific instructions that layer on top of the core extraction and compilation agents. The base agents handle 80% of the work; these adaptations capture the remaining 20% that makes each channel unique.

## Implementation Approach

```python
def extract_post(post, channel):
    # 1. Run base extraction (OI-03 core prompt)
    base_extraction = run_base_extraction(post)
    
    # 2. Apply channel adaptation
    channel_adapter = get_adapter(channel)  # linkedin, youtube, instagram, x, facebook
    enhanced_extraction = channel_adapter.enhance(base_extraction, post)
    
    return enhanced_extraction
```

---

# LinkedIn Adaptations

## Platform Characteristics

| Attribute | LinkedIn Specifics |
|-----------|-------------------|
| Tone Baseline | Professional (formal baseline = 3.5/5, not 2.5) |
| Content Types | Posts, Articles, Documents, Polls, Newsletters, Events |
| Engagement | Likes, Comments, Reposts, Article reads |
| Unique Metrics | Impressions, Click-through rate (if available) |
| Visual Ratio | Lower than Instagram, higher than X |
| Character Limit | 3,000 (posts), unlimited (articles) |

## Extraction Adaptations

### Content Type Detection

```json
{
  "linkedin_content_type": {
    "type": "enum",
    "values": ["post", "article", "document", "poll", "newsletter", "event", "celebration"],
    "detection_rules": {
      "article": "Has headline + long-form body + read time",
      "document": "Has carousel/PDF attachment with multiple pages",
      "poll": "Contains poll options with vote counts",
      "newsletter": "Part of recurring newsletter series",
      "event": "Promotes specific date/time gathering",
      "celebration": "Work anniversary, new job, etc."
    }
  }
}
```

### Professional Context Signals

Extract additional signals unique to LinkedIn:

```json
{
  "professional_context": {
    "industry_mentions": ["automotive", "manufacturing", "technology"],
    "role_mentions": ["engineers", "executives", "partners"],
    "company_mentions": ["OEM names", "supplier names", "customer names"],
    "credential_signals": ["years of experience", "certifications", "awards"],
    "thought_leadership_markers": {
      "opinion_framing": true,
      "data_citation": true,
      "trend_commentary": true
    }
  }
}
```

### Engagement Quality Weighting

LinkedIn engagement carries different weight:

| Engagement Type | Weight | Rationale |
|-----------------|--------|-----------|
| Comment | 1.0 | Highest effort, professional context |
| Repost with commentary | 0.8 | Endorsement + amplification |
| Repost | 0.5 | Passive endorsement |
| Like | 0.3 | Low effort but professional stake |

### Article-Specific Extraction

For LinkedIn Articles (long-form):

```json
{
  "article_extraction": {
    "headline": "string",
    "subtitle": "string | null",
    "estimated_read_time": "integer (minutes)",
    "section_count": "integer",
    "has_embedded_media": "boolean",
    "cta_present": "boolean",
    "author_byline": "string",
    "publication_context": "original | newsletter | republished"
  }
}
```

### Tonal Recalibration

LinkedIn's professional baseline shifts interpretation:

| Tonal Dimension | LinkedIn Baseline | Interpretation |
|-----------------|-------------------|----------------|
| Formal ↔ Casual | 3.5/5 | Score of 3 = slightly casual FOR LinkedIn |
| Technical ↔ Accessible | 3.0/5 | Industry jargon expected |
| Confident ↔ Humble | 3.5/5 | Confidence is norm |
| Serious ↔ Playful | 4.0/5 | Playfulness stands out |

---

# YouTube Adaptations

## Platform Characteristics

| Attribute | YouTube Specifics |
|-----------|-------------------|
| Content Primary | Video (description is supplementary text) |
| Content Types | Long-form, Shorts, Live, Premieres, Community posts |
| Engagement | Views, Likes, Dislikes (hidden), Comments, Shares, Subscribers |
| Unique Metrics | Watch time, Retention, CTR (if available) |
| Visual Ratio | 100% (every post has video/thumbnail) |
| Description Limit | 5,000 characters |

## Extraction Adaptations

### Content Type Detection

```json
{
  "youtube_content_type": {
    "type": "enum",
    "values": ["long_form", "short", "live", "premiere", "community_post"],
    "detection_rules": {
      "short": "Duration ≤ 60 seconds, vertical format",
      "long_form": "Duration > 60 seconds",
      "live": "Was streamed live (may have replay)",
      "premiere": "Scheduled release with chat",
      "community_post": "Text/image post (no video)"
    }
  }
}
```

### Video Metadata Extraction

```json
{
  "video_metadata": {
    "duration_seconds": "integer",
    "duration_category": "short | medium | long | extended",
    "has_chapters": "boolean",
    "chapter_titles": ["string"],
    "has_captions": "boolean",
    "caption_type": "auto | manual | none",
    "has_end_screen": "boolean",
    "has_cards": "boolean",
    "premiere_date": "ISO8601 | null",
    "category": "YouTube category"
  }
}
```

**Duration Categories:**
- Short: ≤60s (YouTube Shorts)
- Medium: 1-10 minutes
- Long: 10-30 minutes
- Extended: >30 minutes

### Thumbnail Analysis

Thumbnails are critical brand assets on YouTube. Enhance OI-02 for thumbnails:

```json
{
  "thumbnail_analysis": {
    "has_text_overlay": "boolean",
    "text_content": "string | null",
    "has_face": "boolean",
    "face_expression": "excited | serious | surprised | neutral | none",
    "brand_elements_present": "boolean",
    "color_scheme_matches_brand": "boolean",
    "click_bait_score": "0-1 (based on sensationalism markers)",
    "template_detected": "boolean",
    "template_id": "string | null"
  }
}
```

### Description Structure Extraction

YouTube descriptions often follow patterns:

```json
{
  "description_structure": {
    "has_timestamps": "boolean",
    "timestamps": [
      {"time": "0:00", "label": "Intro"},
      {"time": "2:30", "label": "Main Topic"}
    ],
    "has_links": "boolean",
    "link_categories": ["social", "product", "affiliate", "related_video"],
    "has_cta": "boolean",
    "cta_type": "subscribe | like | comment | visit | buy",
    "has_hashtags": "boolean",
    "hashtags": ["string"],
    "has_social_links": "boolean",
    "description_length": "integer",
    "description_sections": ["intro", "content_summary", "links", "legal"]
  }
}
```

### Engagement Interpretation

YouTube engagement signals differ:

| Engagement Type | Signal Strength | Notes |
|-----------------|-----------------|-------|
| Views | Baseline reach | Compare to subscriber count |
| Likes | Positive signal | Like/View ratio matters |
| Comments | Strong engagement | Quality varies widely |
| Shares | High intent | Strongest endorsement |
| Subscribers gained | Conversion | If available |

**Engagement Ratio Calculations:**
```python
engagement_rate = (likes + comments) / views
like_ratio = likes / views  # Healthy: >3%
comment_ratio = comments / views  # Healthy: >0.5%
```

### Shorts-Specific Handling

YouTube Shorts need different treatment:

```json
{
  "shorts_specific": {
    "is_short": true,
    "vertical_format": true,
    "loop_optimized": "boolean (does ending connect to beginning)",
    "hook_in_first_second": "boolean",
    "text_overlay_present": "boolean",
    "music_track": "string | null",
    "trend_participation": "boolean (recognizable format/sound)"
  }
}
```

---

# Instagram Adaptations

## Platform Characteristics

| Attribute | Instagram Specifics |
|-----------|-------------------|
| Content Primary | Visual (image/video first, caption secondary) |
| Content Types | Posts (single/carousel), Reels, Stories (ephemeral), Guides |
| Engagement | Likes, Comments, Shares, Saves, Story replies |
| Unique Metrics | Saves (high-intent signal), Reach, Profile visits |
| Visual Ratio | 100% |
| Caption Limit | 2,200 characters |

## Extraction Adaptations

### Content Type Detection

```json
{
  "instagram_content_type": {
    "type": "enum",
    "values": ["single_image", "carousel", "reel", "story", "guide", "live"],
    "detection_rules": {
      "single_image": "One static image",
      "carousel": "Multiple images/videos (up to 10)",
      "reel": "Vertical video, up to 90 seconds",
      "story": "24-hour ephemeral content",
      "guide": "Curated collection of posts",
      "live": "Live broadcast"
    }
  }
}
```

### Visual-First Analysis

For Instagram, reverse the typical text→visual priority:

```json
{
  "visual_primary_extraction": {
    "image_drives_message": true,
    "caption_role": "context | cta | storytelling | minimal | hashtag_only",
    "visual_text_present": "boolean",
    "visual_text_content": "string | null",
    "visual_message_standalone": "boolean (understandable without caption)"
  }
}
```

### Carousel Analysis

Carousels need slide-by-slide extraction:

```json
{
  "carousel_analysis": {
    "slide_count": "integer (1-10)",
    "carousel_type": "educational | storytelling | product_showcase | before_after | listicle",
    "slides": [
      {
        "position": 1,
        "media_type": "image | video",
        "has_text_overlay": true,
        "text_content": "Slide 1 headline",
        "visual_evidence_id": "VE00123"
      }
    ],
    "narrative_flow": "sequential | independent | comparative",
    "swipe_cta_present": "boolean"
  }
}
```

### Engagement Quality Weighting

Instagram engagement hierarchy:

| Engagement Type | Weight | Rationale |
|-----------------|--------|-----------|
| Save | 1.0 | Highest intent — user wants to return |
| Share | 0.9 | Active recommendation |
| Comment | 0.7 | Public engagement |
| Like | 0.3 | Low-effort approval |

**Save Rate** is a critical Instagram metric:
```python
save_rate = saves / reach  # Healthy: >1%
# High save rate = high-value content worth revisiting
```

### Hashtag Strategy Analysis

Instagram hashtags are strategic:

```json
{
  "hashtag_analysis": {
    "total_hashtags": "integer",
    "hashtag_placement": "caption | first_comment | both",
    "hashtag_categories": {
      "branded": ["#BrandName", "#BrandCampaign"],
      "industry": ["#Manufacturing", "#Automotive"],
      "community": ["#EngineeringLife"],
      "trending": ["#Viral"],
      "location": ["#Detroit"]
    },
    "hashtag_strategy": "broad_reach | niche_targeted | mixed"
  }
}
```

### Reel-Specific Handling

```json
{
  "reel_specific": {
    "is_reel": true,
    "duration_seconds": "integer (max 90)",
    "has_audio": "boolean",
    "audio_type": "original | trending_sound | licensed_music",
    "audio_name": "string | null",
    "uses_template": "boolean",
    "text_overlays": ["string"],
    "has_voiceover": "boolean",
    "trend_participation": "boolean"
  }
}
```

### Story Considerations

If Stories are captured (ephemeral):

```json
{
  "story_specific": {
    "is_story": true,
    "story_type": "image | video | boomerang | text | poll | quiz | question | countdown",
    "has_sticker": "boolean",
    "sticker_types": ["mention", "hashtag", "location", "poll", "link"],
    "has_link": "boolean",
    "link_destination": "string | null",
    "is_highlight": "boolean (saved to profile)",
    "highlight_name": "string | null"
  }
}
```

---

# X (Twitter) Adaptations

## Platform Characteristics

| Attribute | X Specifics |
|-----------|-------------|
| Content Primary | Text (with optional media) |
| Content Types | Tweets, Threads, Quotes, Replies, Spaces |
| Engagement | Likes, Retweets, Quotes, Replies, Bookmarks, Views |
| Unique Metrics | Impressions, Profile clicks, Link clicks |
| Visual Ratio | ~30% (optional) |
| Character Limit | 280 (standard), 25,000 (premium) |

## Extraction Adaptations

### Content Type Detection

```json
{
  "x_content_type": {
    "type": "enum",
    "values": ["tweet", "thread", "quote_tweet", "reply", "space"],
    "detection_rules": {
      "tweet": "Standalone post",
      "thread": "Connected posts by same author (numbered or linked)",
      "quote_tweet": "Retweet with added commentary",
      "reply": "Response to another tweet",
      "space": "Audio conversation"
    }
  }
}
```

### Thread Reconstruction

Threads are critical — extract as unified content:

```json
{
  "thread_extraction": {
    "is_thread": true,
    "thread_length": "integer",
    "thread_posts": [
      {
        "position": 1,
        "text": "1/ Here's what we learned about...",
        "has_media": false,
        "evidence_id": "E00500"
      },
      {
        "position": 2,
        "text": "2/ First, the key insight was...",
        "has_media": true,
        "media_type": "image",
        "evidence_id": "E00501"
      }
    ],
    "thread_complete": "boolean",
    "thread_topic": "synthesized from all posts",
    "combined_text": "full thread as single text block",
    "total_engagement": {
      "likes": "sum across thread",
      "retweets": "sum across thread",
      "replies": "sum across thread"
    }
  }
}
```

### Quote Tweet Analysis

Quote tweets reveal brand positioning vs. others:

```json
{
  "quote_tweet_analysis": {
    "is_quote": true,
    "quoted_account": "@handle",
    "quoted_account_type": "competitor | partner | customer | media | other",
    "quote_sentiment": "endorsing | critiquing | adding_context | neutral",
    "quote_text": "The added commentary",
    "original_text": "What they quoted",
    "relationship_signal": "positive | negative | neutral"
  }
}
```

### Character Constraint Impact

280-character limit shapes voice:

```json
{
  "brevity_analysis": {
    "character_count": "integer",
    "character_utilization": "percentage of 280",
    "uses_abbreviations": "boolean",
    "uses_symbols": "boolean (& instead of 'and', etc.)",
    "truncated_thought": "boolean (seems cut off)",
    "link_present": "boolean (offloads content)"
  }
}
```

### Engagement Interpretation

X engagement signals:

| Engagement Type | Signal | Notes |
|-----------------|--------|-------|
| Views | Reach | New metric, baseline |
| Likes | Approval | Broad signal |
| Retweets | Amplification | Endorsement without comment |
| Quote Tweets | Engaged amplification | Adds perspective |
| Replies | Conversation | Quality varies |
| Bookmarks | Private save | High intent, like Instagram saves |

### Real-Time Relevance

X content often references current events:

```json
{
  "temporal_context": {
    "references_current_event": "boolean",
    "event_type": "news | conference | holiday | trend | announcement",
    "event_name": "string | null",
    "time_sensitivity": "high | medium | low | evergreen"
  }
}
```

---

# Facebook Adaptations

## Platform Characteristics

| Attribute | Facebook Specifics |
|-----------|-------------------|
| Content Types | Posts, Videos, Stories, Reels, Events, Live |
| Engagement | Reactions (6 types), Comments, Shares |
| Unique Metrics | Reaction breakdown, Reach, Page followers |
| Visual Ratio | ~50% |
| Character Limit | 63,206 (rarely relevant) |

## Extraction Adaptations

### Reaction Type Breakdown

Facebook's 6 reactions carry sentiment:

```json
{
  "reaction_analysis": {
    "total_reactions": "integer",
    "reaction_breakdown": {
      "like": "integer",
      "love": "integer",
      "care": "integer",
      "haha": "integer",
      "wow": "integer",
      "sad": "integer",
      "angry": "integer"
    },
    "sentiment_score": "calculated from reaction mix",
    "dominant_reaction": "like | love | care | haha | wow | sad | angry",
    "emotional_resonance": "high (love/care dominant) | neutral (like dominant) | concerning (angry/sad significant)"
  }
}
```

**Sentiment Calculation:**
```python
positive = love + care + (like * 0.5) + (wow * 0.3)
negative = angry + sad
neutral = like * 0.5 + haha * 0.5
sentiment_score = (positive - negative) / total_reactions
```

### Content Format Detection

```json
{
  "facebook_content_type": {
    "type": "enum",
    "values": ["text_post", "photo_post", "video", "reel", "story", "live", "event", "link_share"],
    "detection_rules": {
      "link_share": "Post primarily shares external URL with preview",
      "event": "Promotes specific event with RSVP",
      "live": "Live broadcast or replay"
    }
  }
}
```

### Share Context

Facebook shares include context:

```json
{
  "share_analysis": {
    "share_count": "integer",
    "shareable_content": "boolean (some content restricted)",
    "share_type_estimate": {
      "public_share": "percentage",
      "private_message": "percentage (estimated)"
    }
  }
}
```

---

# Cross-Platform Compilation Adaptations

## COMP-03 Channel-Specific Aggregations

When compiling social bedrocks, apply channel-specific logic:

### LinkedIn Compilation Extras

```json
{
  "linkedin_bedrock_additions": {
    "content_type_distribution": {
      "posts": "percent",
      "articles": "percent",
      "documents": "percent",
      "polls": "percent"
    },
    "thought_leadership_score": "0-100 based on article frequency + engagement",
    "professional_network_signals": {
      "employee_advocacy_detected": "boolean",
      "partner_mentions": "count",
      "customer_mentions": "count"
    }
  }
}
```

### YouTube Compilation Extras

```json
{
  "youtube_bedrock_additions": {
    "content_format_distribution": {
      "long_form": "percent",
      "shorts": "percent",
      "live": "percent"
    },
    "average_video_length": "seconds",
    "thumbnail_template_consistency": "0-100",
    "series_detected": [
      {
        "series_name": "string",
        "video_count": "integer",
        "avg_performance": "views"
      }
    ],
    "publishing_cadence": {
      "long_form": "frequency",
      "shorts": "frequency"
    }
  }
}
```

### Instagram Compilation Extras

```json
{
  "instagram_bedrock_additions": {
    "content_format_distribution": {
      "single_image": "percent",
      "carousel": "percent",
      "reel": "percent"
    },
    "average_carousel_length": "slides",
    "save_rate_average": "percentage",
    "hashtag_strategy_summary": {
      "avg_hashtags_per_post": "number",
      "top_hashtags": ["string"],
      "branded_hashtag_usage": "percentage"
    },
    "visual_consistency_score": "0-100"
  }
}
```

### X Compilation Extras

```json
{
  "x_bedrock_additions": {
    "content_format_distribution": {
      "standalone_tweets": "percent",
      "threads": "percent",
      "quote_tweets": "percent",
      "replies": "percent"
    },
    "thread_analysis": {
      "total_threads": "count",
      "avg_thread_length": "posts",
      "thread_topics": ["string"]
    },
    "conversation_participation": {
      "reply_rate": "percentage of posts that are replies",
      "quote_vs_retweet_ratio": "number"
    },
    "real_time_relevance_score": "0-100 (how often content references current events)"
  }
}
```

### Facebook Compilation Extras

```json
{
  "facebook_bedrock_additions": {
    "reaction_sentiment_trend": {
      "overall_sentiment": "positive | neutral | mixed | negative",
      "love_rate": "percentage",
      "concern_rate": "percentage (sad + angry)"
    },
    "content_format_distribution": {
      "text": "percent",
      "photo": "percent",
      "video": "percent",
      "link_share": "percent"
    },
    "share_rate": "shares / reach"
  }
}
```

---

# Schema Extensions

## Post Extraction Schema Addition

Add to `post_extraction.json`:

```json
{
  "channel_specific": {
    "type": "object",
    "description": "Channel-specific extraction data",
    "oneOf": [
      {"$ref": "#/definitions/linkedin_specific"},
      {"$ref": "#/definitions/youtube_specific"},
      {"$ref": "#/definitions/instagram_specific"},
      {"$ref": "#/definitions/x_specific"},
      {"$ref": "#/definitions/facebook_specific"}
    ]
  }
}
```

## Channel Bedrock Schema Addition

Add to `{channel}_bedrock.json`:

```json
{
  "channel_characteristics": {
    "type": "object",
    "properties": {
      "channel": {"type": "string", "enum": ["linkedin", "youtube", "instagram", "x", "facebook"]},
      "channel_specific_metrics": {"type": "object"},
      "channel_specific_analysis": {"type": "object"}
    }
  }
}
```

---

# Implementation Priority

## Phase 1: Core Channels
1. **LinkedIn** — Most B2B value, professional context critical
2. **YouTube** — Video complexity requires most adaptation

## Phase 2: Visual Channels
3. **Instagram** — Visual-first logic, carousel handling

## Phase 3: Conversation Channels
4. **X** — Thread reconstruction, real-time context
5. **Facebook** — Reaction sentiment, share context

---

# Testing Checklist

For each channel, verify:

- [ ] Content type detection works for all format types
- [ ] Engagement metrics correctly weighted
- [ ] Channel-specific fields populated
- [ ] Compilation aggregates channel-specific data
- [ ] Tonal baselines adjusted per platform
- [ ] Thread/carousel/series reconstruction works
- [ ] Edge cases handled (empty fields, missing data)

---

# Integration Notes

This addendum **does not modify** existing documents. To implement:

1. **Agent Prompts:** Append channel-specific instruction block based on `channel` parameter
2. **Schemas:** Add optional `channel_specific` object to extraction and bedrock schemas
3. **Compilation Logic:** Add channel-specific aggregation functions
4. **Report Templates:** No changes needed (reports abstract channel details)
5. **Quality Gates:** Add channel-specific validation rules as optional checks

---

# End of Channel Adaptations Addendum


---

