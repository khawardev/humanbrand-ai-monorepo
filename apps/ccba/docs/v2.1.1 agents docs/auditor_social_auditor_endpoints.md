# Auditor and Social Auditor API Endpoints Documentation

This document provides comprehensive documentation for all working auditor and social auditor endpoints in the Brand OS system.

## Table of Contents
- [Auditor Endpoints](#auditor-endpoints)
  - [POST /run-auditor-agent](#post-run-auditor-agent)
  - [GET /get-auditor-output](#get-get-auditor-output)
- [Social Auditor Endpoints](#social-auditor-endpoints)
  - [POST /run-social-auditor-agent](#post-run-social-auditor-agent)
  - [GET /get-social-auditor-output](#get-get-social-auditor-output)

---

## Auditor Endpoints

### POST /run-auditor-agent

Runs the Auditor agent to analyze batch website scrape data and extract verbal bedrock information.

**Endpoint:** `POST /run-auditor-agent`

**Purpose:** Processes scraped website content from a completed batch job using an AI agent powered by Claude models on AWS Bedrock. The agent extracts objective verbal data points including narrative data, emergent themes, positioning markers, proof points, audience markers, and calls to action.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `client_id` | string | Yes | - | Unique identifier for the client account. Must be a valid client ID. |
| `brand_id` | string | Yes | - | Unique identifier for the brand being analyzed. Must be a valid brand ID. |
| `batch_id` | string | Yes | - | Unique identifier of the completed batch website scrape job. |
| `model_name` | string | No | "claude-4.5-sonnet" | AI model to use for analysis. Options: claude-4.5-sonnet, claude-3-5-sonnet, claude-3-haiku |
| `analysis_scope` | string | No | "both" | Analysis scope. Options: "brand", "competitors", "both" |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "verbal_bedrock": {
    "verbal_audit_metadata": {
      // Metadata about the audit process
    },
    "corpus_baseline": {
      // Baseline information about the content corpus
    },
    "narrative_data_points": {
      // Key narrative elements extracted
    },
    "emergent_themes": {
      // Themes that emerge from the content
    },
    "positioning_markers": {
      // How the brand positions itself
    },
    "proof_points": {
      // Evidence and proof points
    },
    "audience_markers": {
      // Target audience indicators
    },
    "calls_to_action": {
      // Action-oriented content
    }
  }
}
```

#### Usage Examples

```bash
# Analyze both brand and competitors (default)
POST /run-auditor-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789

# Analyze only brand content
POST /run-auditor-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&analysis_scope=brand

# Analyze only competitor content
POST /run-auditor-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&analysis_scope=competitors

# Use specific model
POST /run-auditor-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&model_name=claude-3-5-sonnet
```

#### Error Responses

- **400**: Invalid batch_id, batch not completed, or no scraped content found
- **500**: Agent processing failure, invalid JSON output, or database save error

#### Notes

- The batch job must be in "Completed" or "CompletedWithErrors" status
- Processing time varies based on scraped content volume and complexity
- Results are stored and can be retrieved via task_id
- Generates a sitemap from scraped URLs and combines content into scraped_corpus.md format
- analysis_scope allows focused analysis on specific entity types
- Content is automatically chunked for large datasets (800k token limit per chunk)

---

### GET /get-auditor-output

Retrieves the processed verbal bedrock output from a completed Auditor agent task.

**Endpoint:** `GET /get-auditor-output`

**Purpose:** Fetches the objective verbal data points that were extracted from the scraped website content in a previous run-auditor-agent request.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client account. Must match the client_id used when creating the task. |
| `brand_id` | string | Yes | Unique identifier for the brand. Must match the brand_id used when creating the task. |
| `task_id` | string | Yes | Unique identifier for the specific Auditor task. Returned from the run-auditor-agent endpoint. |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "client_id": "string",
  "brand_id": "string",
  "verbal_bedrock": {
    "verbal_audit_metadata": {},
    "corpus_baseline": {},
    "narrative_data_points": {},
    "emergent_themes": {},
    "positioning_markers": {},
    "proof_points": {},
    "audience_markers": {},
    "calls_to_action": {}
  },
  "batch_id": "string",
  "scraped_urls_count": "integer",
  "model_used": "string",
  "timestamp": "string (ISO format)",
  "execution_time_seconds": "number"
}
```

#### Usage Example

```bash
GET /get-auditor-output?client_id=client-123&brand_id=brand-456&task_id=550e8400-e29b-41d4-a716-446655440000
```

#### Response Fields

- `task_id`: Unique task identifier
- `client_id`: Client account identifier
- `brand_id`: Brand identifier
- `verbal_bedrock`: Complete verbal bedrock data extracted by the agent
- `batch_id`: The batch scrape ID that was analyzed
- `scraped_urls_count`: Number of URLs that were analyzed
- `model_used`: AI model used for processing
- `timestamp`: ISO timestamp when the task was completed
- `execution_time_seconds`: Time taken to process the content

#### Error Responses

- **404**: Task result not found (invalid client_id, brand_id, or task_id)
- **500**: Database retrieval error

#### Notes

- This is a direct task retrieval endpoint
- Ensure the task has completed successfully before retrieving results
- The verbal_bedrock structure matches the output from run-auditor-agent

---

## Social Auditor Endpoints

### POST /run-social-auditor-agent

Runs the Social Auditor agent to analyze social media channel data and extract emergent brand attributes.

**Endpoint:** `POST /run-social-auditor-agent`

**Purpose:** Processes scraped social media content from a completed batch job using an AI agent powered by Claude 4.5 Sonnet on AWS Bedrock. The agent extracts objective verbal data points including positioning, voice/tone, key themes, and engagement patterns specific to the social channel.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `client_id` | string | Yes | - | Unique identifier for the client account. Must be a valid client ID. |
| `brand_id` | string | Yes | - | Unique identifier for the brand being analyzed. Must be a valid brand ID. |
| `batch_id` | string | Yes | - | Unique identifier of the completed social media batch scrape job. |
| `channel_name` | string | Yes | - | Social media channel name. Options: facebook, instagram, linkedin, x, youtube, tiktok |
| `analysis_scope` | string | No | "both" | Analysis scope. Options: "brand", "competitors", "both" |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "social_audit_report": {
    "audit_metadata": {
      // Metadata about the social audit process
    },
    "profile_snapshot": {
      // Snapshot of the social media profile
    },
    "emergent_brand_attributes": {
      // Brand attributes that emerge from the content
    },
    "channel_specific_insights": {
      // Insights specific to the social media channel
    },
    "engagement_analysis": {
      // Analysis of engagement patterns
    }
  }
}
```

#### Usage Examples

```bash
# Analyze brand's Instagram (default behavior)
POST /run-social-auditor-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&channel_name=instagram

# Explicitly analyze brand's channel
POST /run-social-auditor-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&channel_name=instagram&analysis_scope=brand

# Analyze competitor's channel if brand doesn't have this channel
POST /run-social-auditor-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&channel_name=instagram&analysis_scope=competitors
```

#### Error Responses

- **400**: Invalid batch_id, batch not completed, or no scraped content found for the channel
- **500**: Agent processing failure, invalid JSON output, or database save error

#### Notes

- The batch job must be in "Completed" status
- Processing time varies based on social media content volume and complexity
- Results are stored and can be retrieved via task_id
- Applies channel-specific policies for what attributes can be analyzed
- analysis_scope determines which entity's channel data to use when multiple options exist
- Large datasets are automatically chunked (100k+ characters trigger chunking)

---

### GET /get-social-auditor-output

Retrieves the processed social audit report from a completed Social Auditor agent task.

**Endpoint:** `GET /get-social-auditor-output`

**Purpose:** Fetches the objective verbal data points that were extracted from the scraped social media content in a previous run-social-auditor-agent request.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client account. Must match the client_id used when creating the task. |
| `brand_id` | string | Yes | Unique identifier for the brand. Must match the brand_id used when creating the task. |
| `task_id` | string | Yes | Unique identifier for the specific Social Auditor task. Returned from the run-social-auditor-agent endpoint. |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "client_id": "string",
  "brand_id": "string",
  "social_audit_report": {
    "audit_metadata": {},
    "profile_snapshot": {},
    "emergent_brand_attributes": {},
    "channel_specific_insights": {},
    "engagement_analysis": {}
  },
  "batch_id": "string",
  "channel_name": "string",
  "model_used": "string",
  "timestamp": "string (ISO format)",
  "execution_time_seconds": "number"
}
```

#### Usage Example

```bash
GET /get-social-auditor-output?client_id=client-123&brand_id=brand-456&task_id=550e8400-e29b-41d4-a716-446655440000
```

#### Response Fields

- `task_id`: Unique task identifier
- `client_id`: Client account identifier
- `brand_id`: Brand identifier
- `social_audit_report`: Complete social audit data extracted by the agent
- `batch_id`: The batch scrape ID that was analyzed
- `channel_name`: Social media channel that was analyzed
- `model_used`: AI model used for processing
- `timestamp`: ISO timestamp when the task was completed
- `execution_time_seconds`: Time taken to process the content

#### Error Responses

- **404**: Task result not found (invalid client_id, brand_id, or task_id)
- **500**: Database retrieval error

#### Notes

- This is a direct task retrieval endpoint for social media audits
- Ensure the task has completed successfully before retrieving results
- The social_audit_report structure follows channel-specific policies