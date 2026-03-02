# Evidence Management API (Phase 0)

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The Evidence Management API (Phase 0) is the foundational analysis pipeline for BrandOS. It processes raw scraped data from batch jobs, assigns unique evidence IDs, and creates a comprehensive evidence ledger that serves as the single source of truth for all downstream analysis.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/run-evidence-ledger-builder`
**Run Evidence Ledger Builder** 🔒

Run SA-00: Evidence Ledger Builder. This process catalogs all evidence from completed scraper tasks, creates a structured ledger, and runs the initial Corpus Adequacy Gate (Gate 0).

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `brand_id` | string | Yes | Brand ID being analyzed |
| `batch_website_task_id` | string | No | Website batch ID |
| `batch_social_task_id` | string | No | Social batch ID |

> **Note:** At least one of `batch_website_task_id` or `batch_social_task_id` must be provided.


Run SA-00: Evidence Ledger Builder

This is the foundational step in the Brand OS v2.1 analysis pipeline (Phase 0). It processes raw scraped data from website and social media batch jobs, assigns unique evidence IDs to each content item, and creates a comprehensive evidence ledger. The ledger serves as the single source of truth for all downstream analysis agents and quality gates.

Core Functionality:

Catalogs all evidence from completed scraper tasks with unique IDs (E#####, VE#####, EC##### formats)
Processes website pages, social media posts, comments, and images
Creates structured evidence ledger with metadata and source attribution
Generates corpus manifest with collection statistics and coverage analysis
Automatically runs Corpus Adequacy Gate (Gate 0) validation
Must be executed before any extraction or analysis agents
Prerequisites:

At least one of batch_website_task_id or batch_social_task_id must be provided
Referenced batch jobs must be in "completed" status
Client and brand must exist in the system
Input Parameters (Query Parameters):

client_id (str, required): Unique identifier for the client account (e.g., "client-123")
brand_id (str, required): Primary brand identifier being analyzed (e.g., "brand-456")
batch_website_task_id (str, optional): UUID of completed website scraping batch job
batch_social_task_id (str, optional): UUID of completed social media scraping batch job
Processing Flow:

Validates batch job completion status
Retrieves raw scraped data from batch results
Processes website data: pages → evidence entries, images → visual evidence entries
Processes social data: posts → social_post entries, comments → comment entries
Generates unique evidence IDs for all content items
Creates evidence ledger with full metadata and source attribution
Builds corpus manifest with coverage statistics
Runs automated quality gate evaluation
Stores results in database with engagement context
Output Structure:
**Response:** `200 OK`
```json
{
  "engagement_id": "string (UUID - e.g., 'a1b2c3d4-...')",
  "task_id": "string (UUID of this specific ledger builder task)",
  "evidence_ledger": {
    "schema_version": "2.0.0",
    "generated_at": "2026-01-07T12:40:36.604773",
    "run_id": "engagement-uuid",
    "tenant_id": "client-id",
    "evidence_count": 587,
    "evidence_by_type": {
      "webpage": 6,
      "social_post": 140,
      "comment": 234,
      "image": 207
    },
    "evidence_by_entity": {
      "brand-456": 345,
      "competitor-1": 242
    },
    "evidence": [
      {
        "evidence_id": "E00001",
        "source_type": "webpage",
        "source_channel": "website",
        "source_entity": "brand-456",
        "source_url": "https://example.com/page",
        "source_timestamp": "2026-01-07T12:40:36.604773",
        "content_type": "text",
        "excerpt": "Page content preview (first 200 chars)...",
        "full_content_uri": "https://example.com/page",
        "extraction_date": "2026-01-07T12:40:36.604773",
        "metadata": {
          "word_count": 1250,
          "has_html": true,
          "image_count": 5
        }
      }
    ]
  },
  "corpus_manifest": {
    "schema_version": "2.0.0",
    "generated_at": "2026-01-07T12:40:36.604773",
    "run_id": "engagement-uuid",
    "collection_window": {
      "collection_date": "2026-01-07T12:40:36.604773",
      "social_lookback_start": "2025-12-08T12:40:36.604773",
      "social_lookback_end": "2026-01-07T12:40:36.604773",
      "social_lookback_days": 30
    },
    "coverage_summary": {
      "entities_collected": ["brand-456", "competitor-1"],
      "channels_collected": ["website", "linkedin", "facebook"],
      "website": {
        "brand-456": {
          "pages_crawled": 3,
          "pages_excluded": 0,
          "total_words": 8213,
          "total_images": 215,
          "exclusion_breakdown": {},
          "status": "complete"
        }
      },
      "social": {
        "brand-456": {
          "linkedin": {
            "posts_collected": 7,
            "comments_collected": 0,
            "total_engagement": "0",
            "status": "complete"
          }
        }
      }
    },
    "corpus_adequacy": {
      "overall": "fail",
      "notes": "Collected 587 total evidence items across 2 entities and 7 channels",
      "minimum_thresholds": {
        "website_pages": 50,
        "social_posts_per_channel": 50,
        "comments_per_channel": 100
      },
      "entities_below_threshold": ["brand-456", "competitor-1"]
    }
  },
  "gate_0_result": {
    "gate": "corpus_adequacy",
    "status": "fail",
    "timestamp": "2026-01-07T12:40:36.604773",
    "evaluation_results": {
      "entities_evaluated": ["brand-456", "competitor-1"],
      "channels_found": ["website", "linkedin", "facebook", "youtube"],
      "entity_channel_breakdown": {
        "brand-456_website": {
          "pages": 3,
          "posts": 0,
          "images": 215,
          "comments": 0
        }
      },
      "total_statistics": {
        "total_pages": 6,
        "total_posts": 140,
        "total_images": 441,
        "total_comments": 234
      }
    },
    "warnings": ["brand-456 linkedin: Only 7 posts (minimum: 50)"],
    "failures": ["brand-456 website: Only 3 pages (minimum: 50)"],
    "recommendation": "Expand corpus collection before proceeding"
  }
}
```
Critical Output Fields:

engagement_id: Must be saved and used for all subsequent API calls in this analysis session
evidence_ledger: Complete catalog of all evidence with unique IDs
corpus_manifest: Statistical summary and coverage analysis
gate_0_result: Automated quality assessment results
Usage Example:

POST /run-evidence-ledger-builder?client_id=client-123&brand_id=brand-456&batch_website_task_id=7199595e-91d5-4a5e-b9ef-9f9fb92f3636&batch_social_task_id=947c9968-6350-4beb-b4bc-406ee11201b5
Processing Time:

Varies based on corpus size (typically 30 seconds to 5 minutes)
Large social media datasets may take longer due to comment processing
Error Responses:

400: Invalid batch_id, batch not completed, or no scraped content found
404: Client or brand not found
500: Processing failure, database errors, or quality gate evaluation failure
Next Steps: After successful completion, use the returned engagement_id for:

/get-evidence-ledger - Review evidence catalog
/get-evidence - Examine specific evidence entries
/validate-evidence-ids - Validate evidence references
/calculate-evidence-strength - Assess evidence quality
Subsequent analysis agents (SA-01, SA-02, etc.)
Notes:

This endpoint creates a new analysis engagement context
Evidence IDs are globally unique and persistent
Failed quality gate does not prevent ledger creation (results are still usable)
Social media comments are processed from both string and dict formats
Images from web pages and social posts are automatically cataloged as visual evidence

---

### GET `/get-evidence-ledger`
**Get Evidence Ledger** 🔒

Retrieve the complete evidence ledger for a specific engagement/analysis session.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `engagement_id` | string | Yes | Engagement ID (UUID) |


Retrieve the complete evidence ledger for a specific engagement/analysis session.

This endpoint provides access to the full evidence catalog created by the SA-00 Evidence Ledger Builder. The evidence ledger contains all processed content items (webpages, social posts, comments, images) with their unique evidence IDs, metadata, and source attribution.

Core Functionality:

Fetches the complete evidence ledger from a previous SA-00 execution
Returns structured evidence catalog with all content items
Provides evidence counts and type breakdowns
Validates that the engagement exists and contains evidence data
Prerequisites:

Valid engagement_id from a completed SA-00 Evidence Ledger Builder execution
Client and engagement must exist in the system
SA-00 agent result must be stored in the database
Input Parameters (Query Parameters):

client_id (str, required): Unique identifier for the client account (e.g., "client-123")
engagement_id (str, required): Analysis session identifier returned by /run-evidence-ledger-builder (UUID format)
Output Structure:
**Response:** `200 OK`
```json
{
  "engagement_id": "string (UUID of the analysis session)",
  "evidence_count": 587,
  "evidence_ledger": {
    "schema_version": "2.0.0",
    "generated_at": "2026-01-07T12:40:36.604773",
    "run_id": "engagement-uuid",
    "tenant_id": "client-id",
    "evidence_count": 587,
    "evidence_by_type": {
      "webpage": 6,
      "social_post": 140,
      "comment": 234,
      "image": 207
    },
    "evidence_by_entity": {
      "brand-456": 345,
      "competitor-1": 242
    },
    "evidence": [
      {
        "evidence_id": "E00001",
        "source_type": "webpage",
        "source_channel": "website",
        "source_entity": "brand-456",
        "source_url": "https://example.com/page",
        "source_timestamp": "2026-01-07T12:40:36.604773",
        "content_type": "text",
        "excerpt": "Page content preview (first 200 chars)...",
        "full_content_uri": "https://example.com/page",
        "extraction_date": "2026-01-07T12:40:36.604773",
        "metadata": {
          "word_count": 1250,
          "has_html": true,
          "image_count": 5
        }
      },
      {
        "evidence_id": "EC00001",
        "source_type": "comment",
        "source_channel": "youtube",
        "source_entity": "brand-456",
        "source_url": "https://youtube.com/watch?v=abc123",
        "source_timestamp": "2026-01-07T12:30:00.000000",
        "content_type": "text",
        "excerpt": "Great video! Very informative...",
        "full_content_uri": "https://youtube.com/watch?v=abc123",
        "extraction_date": "2026-01-07T12:40:36.604773",
        "metadata": {
          "post_id": "video-123",
          "parent_evidence_id": "E00002",
          "comment_id": "comment-456",
          "author": "user123"
        }
      }
    ]
  }
}
```
Key Evidence Types:

webpage: Website content with evidence_id format E#####
social_post: Social media posts with evidence_id format E#####
comment: Social media comments with evidence_id format EC#####
image: Visual content with evidence_id format VE#####
Usage Example:

GET /get-evidence-ledger?client_id=client-123&engagement_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890
Performance Notes:

Response size can be large for comprehensive evidence ledgers (500+ items)
Consider using /get-evidence for individual evidence retrieval
Evidence ledger is immutable once created
Error Responses:

404: Engagement not found or no evidence ledger available for the engagement
500: Database retrieval errors or malformed evidence data
Common Use Cases:

Reviewing complete evidence catalog before analysis
Exporting evidence data for reporting
Debugging evidence processing issues
Validating evidence coverage across entities and channels
Related Endpoints:

/run-evidence-ledger-builder - Create the evidence ledger
/get-evidence - Retrieve individual evidence entries
/validate-evidence-ids - Check if specific evidence IDs exist
/calculate-evidence-strength - Assess evidence quality scores



---

### GET `/get-evidence`
**Get Evidence** 🔒

Retrieve a specific evidence entry with full metadata and source trace.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `engagement_id` | string | Yes | Engagement ID |
| `evidence_id` | string | Yes | ID (E#####, VE#####, EC#####) |




Retrieve a specific evidence entry with full metadata and source trace.

This endpoint provides detailed information about a single evidence item from the evidence ledger, including its content, source attribution, metadata, and extraction details. Useful for examining individual pieces of evidence referenced in analysis outputs.

Core Functionality:

Fetches a specific evidence entry by its unique ID
Returns complete evidence metadata and source information
Provides content excerpt and full source URL
Validates evidence ID exists in the ledger
Prerequisites:

Valid engagement_id from a completed SA-00 Evidence Ledger Builder execution
Valid evidence_id that exists in the evidence ledger
Client and engagement must exist in the system
Input Parameters (Query Parameters):

client_id (str, required): Unique identifier for the client account (e.g., "client-123")
engagement_id (str, required): Analysis session identifier (UUID format)
evidence_id (str, required): Unique evidence identifier (formats: E#####, VE#####, EC#####)
Output Structure:
**Response:** `200 OK`
```json
{
  "evidence_id": "E00001",
  "trace": {
    "evidence_id": "E00001",
    "source_type": "webpage",
    "source_channel": "website",
    "source_entity": "brand-456",
    "source_url": "https://example.com/page",
    "extraction_date": "2026-01-07T12:40:36.604773",
    "metadata": {
      "word_count": 1250,
      "has_html": true,
      "image_count": 5
    }
  },
  "full_entry": {
    "evidence_id": "E00001",
    "source_type": "webpage",
    "source_channel": "website",
    "source_entity": "brand-456",
    "source_url": "https://example.com/page",
    "source_timestamp": "2026-01-07T12:40:36.604773",
    "content_type": "text",
    "excerpt": "Page content preview (first 200 chars)...",
    "full_content_uri": "https://example.com/page",
    "extraction_date": "2026-01-07T12:40:36.604773",
    "metadata": {
      "word_count": 1250,
      "has_html": true,
      "image_count": 5
    }
  }
}
```

Evidence ID Formats:

E#####: Text content (webpages, social posts) - e.g., "E00001"
VE#####: Visual content (images) - e.g., "VE00001"
EC#####: Comment content - e.g., "EC00001"
Usage Example:

GET /get-evidence?client_id=client-123&engagement_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890&evidence_id=E00001
Performance Notes:

Fast response time for individual evidence retrieval
Useful for drilling down into specific evidence references
Content excerpts are limited to 200 characters for performance
Error Responses:

404: Engagement not found, evidence ledger not found, or evidence ID does not exist
500: Database retrieval errors
Common Use Cases:

Examining evidence referenced in analysis outputs
Debugging citation validation issues
Reviewing specific content items for quality assessment
Understanding evidence source attribution
Related Endpoints:

/get-evidence-ledger - Get complete evidence catalog
/validate-evidence-ids - Check multiple evidence IDs
/calculate-evidence-strength - Assess evidence quality


---

### GET `/validate-evidence-ids`
**Validate Evidence IDs** 🔒

Validate that a list of evidence IDs exist in the evidence ledger.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `engagement_id` | string | Yes | Engagement ID |
| `evidence_ids` | string | Yes | Comma-separated list |

Validate that a list of evidence IDs exist in the evidence ledger.

This endpoint checks whether specified evidence IDs are present in the evidence ledger for a given engagement. Useful for validating citations in analysis outputs and ensuring referenced evidence actually exists in the corpus.

Core Functionality:

Validates multiple evidence IDs against the evidence ledger
Returns counts of valid vs invalid IDs
Provides separate lists of valid and invalid evidence IDs
Fast validation without retrieving full evidence content
Prerequisites:

Valid engagement_id from a completed SA-00 Evidence Ledger Builder execution
Evidence IDs should follow proper format (E#####, VE#####, EC#####)
Client and engagement must exist in the system
Input Parameters (Query Parameters):

client_id (str, required): Unique identifier for the client account (e.g., "client-123")
engagement_id (str, required): Analysis session identifier (UUID format)
evidence_ids (str, required): Comma-separated list of evidence IDs to validate (e.g., "E00001,E00002,VE00001,EC00001")
Output Structure:
**Response:** `200 OK`
```json
{
  "total_requested": 4,
  "valid_count": 3,
  "invalid_count": 1,
  "valid_ids": ["E00001", "E00002", "VE00001"],
  "invalid_ids": ["EC99999"]
}
```
Validation Rules:

Evidence IDs are case-sensitive
Leading/trailing whitespace is automatically trimmed
Empty strings in the comma-separated list are ignored
Invalid format IDs are treated as non-existent
Usage Example:

GET /validate-evidence-ids?client_id=client-123&engagement_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890&evidence_ids=E00001,E00002,VE00001,EC99999
Performance Notes:

Fast validation operation using set-based lookup
Suitable for validating large numbers of evidence IDs
Does not retrieve full evidence content
Error Responses:

404: Engagement not found or evidence ledger not available
500: Database retrieval errors
Common Use Cases:

Validating citations in generated reports
Checking evidence references in analysis outputs
Debugging citation validation issues
Bulk verification of evidence ID lists
Related Endpoints:

/get-evidence - Retrieve individual evidence entries
/get-evidence-ledger - Get complete evidence catalog
/calculate-evidence-strength - Assess evidence quality scores

---

### POST `/calculate-evidence-strength`
**Calculate Evidence Strength** 🔒

Calculate evidence strength score and quality assessment for a set of evidence IDs.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `engagement_id` | string | Yes | Engagement ID |
| `evidence_ids` | string | Yes | Comma-separated list |

Calculate evidence strength score and quality assessment for a set of evidence IDs.

This endpoint evaluates the collective strength and reliability of multiple evidence items based on their source types, channels, and metadata. The scoring algorithm considers factors like source credibility, content type weighting, and evidence diversity to provide a quality assessment.

Core Functionality:

Calculates weighted strength score for multiple evidence items
Applies source type quality weights (comments < social posts < webpages)
Considers evidence diversity and count with diminishing returns
Returns both numerical score and categorical quality tier
Validates all evidence IDs exist before scoring
Prerequisites:

Valid engagement_id from a completed SA-00 Evidence Ledger Builder execution
All evidence IDs in the list must exist in the evidence ledger
At least one valid evidence ID must be provided
Client and engagement must exist in the system
Input Parameters (Query Parameters):

client_id (str, required): Unique identifier for the client account (e.g., "client-123")
engagement_id (str, required): Analysis session identifier (UUID format)
evidence_ids (str, required): Comma-separated list of evidence IDs to evaluate (e.g., "E00001,E00002,VE00001,EC00001")
Output Structure:
**Response:** `200 OK`
```json
{
  "evidence_ids": ["E00001", "E00002", "VE00001", "EC00001"],
  "strength_score": 0.73,
  "quality_tier": "good",
  "assessment": "good"
}
```
Scoring Algorithm:

Source Type Weights:
About/Company pages: 1.0 (highest credibility)
Product/Solution pages: 0.9
News/Press releases: 0.8
Blog content: 0.7
Social media posts: 0.6
Images/Video: 0.7
Comments: 0.4 (lowest credibility)
Count Factor: More evidence increases score with diminishing returns (max benefit at 5 sources)
Final Score: Weighted average × (0.5 + 0.5 × count_factor)
Quality Tiers:

excellent: Score ≥ 0.80
good: Score ≥ 0.60
adequate: Score ≥ 0.40
insufficient: Score < 0.40
Usage Example:

POST /calculate-evidence-strength?client_id=client-123&engagement_id=a1b2c3d4-e5f6-7890-abcd-ef1234567890&evidence_ids=E00001,E00002,VE00001,EC00001
Performance Notes:

Fast calculation using pre-computed evidence metadata
Suitable for real-time evidence quality assessment
Algorithm is deterministic and reproducible
Error Responses:

404: Engagement not found, evidence ledger not available, or invalid evidence IDs
400: Empty evidence ID list or malformed input
500: Database retrieval errors or calculation failures
Common Use Cases:

Assessing the reliability of evidence supporting a claim
Comparing evidence quality across different sources
Quality validation for generated content citations
Evidence strength analysis for report generation
Related Endpoints:

/validate-evidence-ids - Check if evidence IDs exist before scoring
/get-evidence - Retrieve individual evidence details
/get-evidence-ledger - Access complete evidence catalog

## Evidence Concepts

### ID Formats
- `E#####`: Text content (webpages, social posts)
- `VE#####`: Visual content (images)
- `EC#####`: Comment content

### Strength Scoring
Evidence strength is calculated based on source credibility:

| Source Type | Weight |
|-------------|--------|
| About/Company pages | 1.0 (Highest) |
| Product/Solution pages | 0.9 |
| News/Press releases | 0.8 |
| Blog content | 0.7 |
| Images/Video | 0.7 |
| Social media posts | 0.6 |
| Comments | 0.4 (Lowest) |

---

[← Back to Documentation Index](./index.md)
