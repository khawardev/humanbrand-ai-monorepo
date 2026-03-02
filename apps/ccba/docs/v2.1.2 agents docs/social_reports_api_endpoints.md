# Social Reports API Endpoints Documentation

This document provides comprehensive documentation for all Social Reports endpoints in the Brand OS system.

## Table of Contents
- [Social Reports Endpoints](#social-reports-endpoints)
  - [POST /run-social-reports-agent](#post-run-social-reports-agent)
  - [GET /get-social-reports-output](#get-get-social-reports-output)
  - [GET /list-social-reports-tasks](#get-list-social-reports-tasks)
  - [DELETE /delete-social-reports-task/{task_id}](#delete-delete-social-reports-task-task_id)

---

## Social Reports Endpoints

### POST /run-social-reports-agent

Runs the Social Reports agent to analyze social media batch data and generate comprehensive reports.

**Endpoint:** `POST /run-social-reports-agent`

**Purpose:** Processes scraped social media content from a completed batch job using an AI agent powered by Claude 4.5 Sonnet on AWS Bedrock. The agent extracts objective verbal data points, positioning, voice/tone, and key themes specific to the social channel. It automatically handles token limits and saves entity identification.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `client_id` | string | Yes | - | Unique identifier for the client account. Must be a valid client ID. |
| `brand_id` | string | Yes | - | Unique identifier for the brand being analyzed. Must be a valid brand ID. |
| `batch_id` | string | Yes | - | Unique identifier of the completed social media batch scrape job. |
| `channel_name` | string | Yes | - | Social media channel name. Options: facebook, instagram, linkedin, x, youtube, tiktok |
| `analysis_scope` | string | No | "brand" | Analysis scope. Options: "brand" (brand data), "competitors" (competitor data) |
| `competitor_id` | string | No | - | Competitor ID (required when analysis_scope is "competitors") |
| `instruction` | string | No | - | Optional custom instructions for the AI analysis |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "social_report": "string (generated social media report)",
  "entity_name": "string (Name of the analyzed entity - Brand or Competitor)",
  "analysis_scope": "string ('brand' or 'competitors')"
}
```

#### Usage Examples

```bash
# Analyze brand's Instagram (default)
POST /run-social-reports-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&channel_name=instagram

# Analyze competitor's Instagram
POST /run-social-reports-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&channel_name=instagram&analysis_scope=competitors&competitor_id=comp-001

# Analyze with custom instructions
POST /run-social-reports-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&channel_name=instagram&instruction=Focus%20on%20visual%20trends
```

#### Error Responses

- **400**: Invalid analysis_scope, missing competitor_id, or unsupported channel
- **404**: Batch job not found or no content available
- **500**: Agent processing failure or database save error

#### Notes

- The batch job must be in "Completed" status
- Data is automatically truncated to fit within 800K token limits
- Entity identification (brand name or competitor name) is determined and saved at runtime for efficient retrieval

---

### GET /get-social-reports-output

Retrieves the processed social reports analysis results from a completed task.

**Endpoint:** `GET /get-social-reports-output`

**Purpose:** Fetches the results of a completed social reports analysis task, including the generated report, metadata, performance metrics, and entity identification.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client account. Must match the client_id used when creating the task. |
| `brand_id` | string | Yes | Unique identifier for the brand. Must match the brand_id used when creating the task. |
| `task_id` | string | Yes | Unique identifier for the specific Social Reports task. Returned from the run-social-reports-agent endpoint. |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "client_id": "string",
  "brand_id": "string",
  "entity_name": "string (Name of the analyzed entity)",
  "analysis_scope": "string ('brand' or 'competitors')",
  "social_report": "string (The complete generated social media report)",
  "batch_id": "string",
  "model_used": "string",
  "timestamp": "string (ISO format)",
  "execution_time_seconds": "number"
}
```

#### Usage Example

```bash
GET /get-social-reports-output?client_id=client-123&brand_id=brand-456&task_id=550e8400-e29b-41d4-a716-446655440000
```

#### Response Fields

- `task_id`: Unique task identifier
- `client_id`: Client account identifier
- `brand_id`: Brand identifier
- `entity_name`: Name of the analyzed brand or competitor
- `analysis_scope`: Scope of the analysis ("brand" or "competitors")
- `social_report`: The generated report content
- `batch_id`: The batch scrape ID that was analyzed
- `model_used`: AI model used for processing (Claude 4.5 Sonnet)
- `timestamp`: ISO timestamp when the task was completed
- `execution_time_seconds`: Time taken to process the content

#### Error Responses

- **404**: Task result not found (invalid client_id, brand_id, or task_id)
- **500**: Database retrieval error

#### Notes

- This endpoint directly retrieves stored entity information without re-querying batch data, ensuring high performance.

---

### GET /list-social-reports-tasks

Lists all social reports tasks for a specific brand.

**Endpoint:** `GET /list-social-reports-tasks`

**Purpose:** Retrieves a list of all social reports analysis tasks that have been run for the specified brand, including metadata and entity identification for each task.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client account. |
| `brand_id` | string | Yes | Unique identifier for the brand. |

#### Output Structure

```json
{
  "tasks": [
    {
      "task_id": "string (UUID)",
      "entity_name": "string (Name of the analyzed entity)",
      "analysis_scope": "string ('brand' or 'competitors')",
      "timestamp": "string (ISO format)",
      "model_used": "string",
      "batch_id": "string",
      "scraped_urls_count": "integer",
      "execution_time_seconds": "number"
    }
  ],
  "count": "integer"
}
```

#### Usage Example

```bash
GET /list-social-reports-tasks?client_id=client-123&brand_id=brand-456
```

#### Response Fields

- `tasks`: Array of task objects with metadata
- `count`: Total number of social reports tasks

#### Error Responses

- **500**: Database retrieval error

#### Notes

- Returns all social reports tasks for the specified brand
- Each task object includes entity identification for easy filtering and display

---

### DELETE /delete-social-reports-task/{task_id}

Deletes a social reports analysis task and all associated results.

**Endpoint:** `DELETE /delete-social-reports-task/{task_id}`

**Purpose:** Permanently removes a social reports task and all associated analysis results from the database. This action cannot be undone.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string (query) | Yes | Unique identifier for the client account. |
| `brand_id` | string (query) | Yes | Unique identifier for the brand. |
| `task_id` | string (path) | Yes | Unique identifier for the social reports task to delete. |

#### Output Structure

```json
{
  "message": "string",
  "task_id": "string"
}
```

#### Usage Example

```bash
DELETE /delete-social-reports-task/550e8400-e29b-41d4-a716-446655440000?client_id=client-123&brand_id=brand-456
```

#### Response Fields

- `message`: Success message with task details
- `task_id`: The ID of the deleted task

#### Error Responses

- **404**: Social reports task not found
- **500**: Database deletion error

#### Notes

- This action permanently deletes the task and all associated data
- Cannot be undone - ensure you want to delete before calling this endpoint

---

## General Notes

### Authentication
All endpoints require authentication via the `Authorization` header with a valid Bearer token.

### Rate Limiting
- Tasks are limited by token processing capacity (800K tokens max)

### Processing Time
- Analysis typically takes 30 seconds to several minutes depending on content volume

### Entity Identification
- **Brand Analysis**: `analysis_scope="brand"`, `entity_name` is the Brand Name
- **Competitor Analysis**: `analysis_scope="competitors"`, `entity_name` is the Competitor Name
- Entity info is saved at run time for efficient retrieval in get/list endpoints

### Error Handling
- All endpoints return appropriate HTTP status codes
- Detailed error messages for troubleshooting
- Batch validation ensures data integrity

### Best Practices
- Always validate batch completion before running analysis
- Use task listing endpoints to track processing history
- Store task IDs for result retrieval
