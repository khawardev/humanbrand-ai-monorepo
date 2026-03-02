# Web Auditor API Endpoints Documentation

This document provides comprehensive documentation for all web auditor endpoints in the Brand OS system.

## Table of Contents
- [Web Extraction Endpoints](#web-extraction-endpoints)
  - [POST /run-web-extraction-agent](#post-run-web-extraction-agent)
  - [GET /get-web-extraction-output](#get-get-web-extraction-output)
  - [GET /list-web-extraction-tasks](#get-list-web-extraction-tasks)
  - [DELETE /delete-web-extraction-task/{task_id}](#delete-delete-web-extraction-task-task_id)
- [Web Synthesis Endpoints](#web-synthesis-endpoints)
  - [POST /run-web-synthesis-agent](#post-run-web-synthesis-agent)
  - [GET /get-web-synthesis-output](#get-get-web-synthesis-output)
  - [GET /list-web-synthesis-tasks](#get-list-web-synthesis-tasks)
  - [DELETE /delete-web-synthesis-task/{task_id}](#delete-delete-web-synthesis-task-task_id)

---

## Web Extraction Endpoints

### POST /run-web-extraction-agent

Runs the Web Extraction agent to analyze website scrape data and extract structured information.

**Endpoint:** `POST /run-web-extraction-agent`

**Purpose:** Processes scraped website content from a completed batch job using an AI agent powered by Claude 4.5 Sonnet on AWS Bedrock. The agent extracts structured information from website content, automatically handling token limits and maintaining sitemap context for analysis.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `client_id` | string | Yes | - | Unique identifier for the client account. Must be a valid client ID. |
| `brand_id` | string | Yes | - | Unique identifier for the brand being analyzed. Must be a valid brand ID. |
| `batch_website_task_id` | string | Yes | - | Unique identifier of the completed batch website scrape job. |
| `analysis_scope` | string | No | "brand" | Analysis scope. Options: "brand" (brand websites), "competitors" (competitor websites) |
| `competitor_id` | string | No | - | Competitor ID (required when analysis_scope is "competitors") |
| `instruction` | string | No | - | Optional custom instructions for the extraction agent |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "extraction_output": "string (raw AI-generated extraction results)",
  "entity_name": "string (Name of the analyzed entity - Brand or Competitor)",
  "analysis_scope": "string ('brand' or 'competitors')"
}
```

#### Usage Examples

```bash
# Extract information from brand websites (default)
POST /run-web-extraction-agent?client_id=client-123&brand_id=brand-456&batch_website_task_id=batch-789

# Extract information from competitor websites
POST /run-web-extraction-agent?client_id=client-123&brand_id=brand-456&batch_website_task_id=batch-789&analysis_scope=competitors&competitor_id=comp-001

# Extract with custom instructions
POST /run-web-extraction-agent?client_id=client-123&brand_id=brand-456&batch_website_task_id=batch-789&instruction=Focus%20on%20product%20features%20and%20pricing
```

#### Error Responses

- **400**: Invalid analysis_scope, missing competitor_id, or batch not completed
- **404**: Batch website task not found or no content available
- **500**: Agent processing failure or database save error

#### Notes

- The batch job must be in "Completed" or "CompletedWithErrors" status
- Content is automatically truncated to fit within 800K token limits
- Sitemap information is preserved even when content is truncated
- Entity identification is determined and saved at runtime for efficient retrieval

---

### GET /get-web-extraction-output

Retrieves the processed web extraction output from a completed Web Extraction agent task.

**Endpoint:** `GET /get-web-extraction-output`

**Purpose:** Fetches the raw extraction results that were generated from the scraped website content in a previous run-web-extraction-agent request.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client account. Must match the client_id used when creating the task. |
| `brand_id` | string | Yes | Unique identifier for the brand. Must match the brand_id used when creating the task. |
| `task_id` | string | Yes | Unique identifier for the specific Web Extraction task. Returned from the run-web-extraction-agent endpoint. |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "client_id": "string",
  "brand_id": "string",
  "extraction_output": "string (raw AI-generated extraction results)",
  "entity_name": "string (Name of the analyzed entity)",
  "analysis_scope": "string ('brand' or 'competitors')",
  "batch_id": "string",
  "scraped_urls_count": "integer",
  "model_used": "string",
  "timestamp": "string (ISO format)",
  "execution_time_seconds": "number"
}
```

#### Usage Example

```bash
GET /get-web-extraction-output?client_id=client-123&brand_id=brand-456&task_id=550e8400-e29b-41d4-a716-446655440000
```

#### Response Fields

- `task_id`: Unique task identifier
- `client_id`: Client account identifier
- `brand_id`: Brand identifier
- `extraction_output`: Raw AI-generated extraction results
- `entity_name`: Name of the analyzed brand or competitor
- `analysis_scope`: Scope of the analysis ("brand" or "competitors")
- `batch_id`: The batch website task ID that was analyzed
- `scraped_urls_count`: Number of URLs that were processed
- `model_used`: AI model used for processing (Claude 4.5 Sonnet)
- `timestamp`: ISO timestamp when the task was completed
- `execution_time_seconds`: Time taken to process the content

#### Error Responses

- **404**: Task result not found (invalid client_id, brand_id, or task_id)
- **500**: Database retrieval error

#### Notes

- This is a direct task retrieval endpoint for web extraction results
- Uses stored entity information for high performance

---

### GET /list-web-extraction-tasks

Lists all web extraction tasks for a specific brand.

**Endpoint:** `GET /list-web-extraction-tasks`

**Purpose:** Retrieves a list of all web extraction analysis tasks that have been run for the specified brand, including metadata and entity identification about each extraction task.

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
      "execution_time_seconds": "number"
    }
  ],
  "count": "integer"
}
```

#### Usage Example

```bash
GET /list-web-extraction-tasks?client_id=client-123&brand_id=brand-456
```

#### Response Fields

- `tasks`: Array of task objects with metadata
- `count`: Total number of web extraction tasks

#### Error Responses

- **500**: Database retrieval error

#### Notes

- Returns all web extraction tasks for the specified brand
- Each task includes entity identification for easy filtering

---

### DELETE /delete-web-extraction-task/{task_id}

Deletes a web extraction analysis task and all associated results.

**Endpoint:** `DELETE /delete-web-extraction-task/{task_id}`

**Purpose:** Permanently removes a web extraction task and all associated raw extraction results from the database. This action cannot be undone.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string (query) | Yes | Unique identifier for the client account. |
| `brand_id` | string (query) | Yes | Unique identifier for the brand. |
| `task_id` | string (path) | Yes | Unique identifier for the web extraction task to delete. |

#### Output Structure

```json
{
  "message": "string",
  "task_id": "string"
}
```

#### Usage Example

```bash
DELETE /delete-web-extraction-task/550e8400-e29b-41d4-a716-446655440000?client_id=client-123&brand_id=brand-456
```

#### Response Fields

- `message`: Success message with task details
- `task_id`: The ID of the deleted task

#### Error Responses

- **404**: Web extraction task not found
- **500**: Database deletion error

#### Notes

- This action permanently deletes the task and all associated data
- Cannot be undone - ensure you want to delete before calling this endpoint

---

## Web Synthesis Endpoints

### POST /run-web-synthesis-agent

Runs the Web Synthesis agent to generate comprehensive reports from extraction results.

**Endpoint:** `POST /run-web-synthesis-agent`

**Purpose:** Takes the raw output from a completed web extraction task and generates a comprehensive, synthesized analysis report. The agent processes the extracted information to create actionable insights, summaries, and structured analysis in markdown format.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client account. Must be a valid client ID. |
| `brand_id` | string | Yes | Unique identifier for the brand being analyzed. Must be a valid brand ID. |
| `extraction_task_id` | string | Yes | Unique identifier of the completed web extraction task to synthesize. |
| `instruction` | string | No | Optional custom instructions for the synthesis agent. |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "synthesis_report": "string (complete synthesized analysis report in markdown)",
  "entity_name": "string (Name of the analyzed entity - Brand or Competitor)",
  "analysis_scope": "string ('brand' or 'competitors')"
}
```

#### Usage Examples

```bash
# Synthesize extraction results
POST /run-web-synthesis-agent?client_id=client-123&brand_id=brand-456&extraction_task_id=550e8400-e29b-41d4-a716-446655440000

# Synthesize with custom instructions
POST /run-web-synthesis-agent?client_id=client-123&brand_id=brand-456&extraction_task_id=550e8400-e29b-41d4-a716-446655440000&instruction=Focus%20on%20competitive%20analysis%20and%20market%20positioning
```

#### Error Responses

- **404**: Extraction task not found
- **500**: Agent processing failure or database save error

#### Notes

- Requires a completed web extraction task as input
- Inherits entity identification from the extraction task automatically
- Outputs comprehensive analysis reports in markdown format
- Uses Claude 4.5 Sonnet for high-quality synthesis

---

### GET /get-web-synthesis-output

Retrieves the processed web synthesis report from a completed Web Synthesis agent task.

**Endpoint:** `GET /get-web-synthesis-output`

**Purpose:** Fetches the final synthesized analysis report that was generated from the web extraction results in a previous run-web-synthesis-agent request.

#### Input Parameters (Query Parameters)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client account. Must match the client_id used when creating the task. |
| `brand_id` | string | Yes | Unique identifier for the brand. Must match the brand_id used when creating the task. |
| `task_id` | string | Yes | Unique identifier for the specific Web Synthesis task. Returned from the run-web-synthesis-agent endpoint. |

#### Output Structure

```json
{
  "task_id": "string (UUID)",
  "client_id": "string",
  "brand_id": "string",
  "synthesis_report": "string (complete synthesized analysis report in markdown)",
  "entity_name": "string (Name of the analyzed entity)",
  "analysis_scope": "string ('brand' or 'competitors')",
  "batch_id": "string",
  "model_used": "string",
  "timestamp": "string (ISO format)",
  "execution_time_seconds": "number"
}
```

#### Usage Example

```bash
GET /get-web-synthesis-output?client_id=client-123&brand_id=brand-456&task_id=660e8400-e29b-41d4-a716-446655440001
```

#### Response Fields

- `task_id`: Unique task identifier
- `client_id`: Client account identifier
- `brand_id`: Brand identifier
- `synthesis_report`: Complete synthesized analysis report in markdown
- `entity_name`: Name of the analyzed brand or competitor
- `analysis_scope`: Scope of the analysis ("brand" or "competitors")
- `batch_id`: The original batch website task ID
- `model_used`: AI model used for processing (Claude 4.5 Sonnet)
- `timestamp`: ISO timestamp when the task was completed
- `execution_time_seconds`: Time taken to process the content

#### Error Responses

- **404**: Task result not found (invalid client_id, brand_id, or task_id)
- **500**: Database retrieval error

#### Notes

- This is a direct task retrieval endpoint for web synthesis reports
- Uses stored entity information for high performance

---

### GET /list-web-synthesis-tasks

Lists all web synthesis tasks for a specific brand.

**Endpoint:** `GET /list-web-synthesis-tasks`

**Purpose:** Retrieves a list of all web synthesis analysis tasks that have been run for the specified brand, including metadata and entity identification about each task.

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
      "execution_time_seconds": "number"
    }
  ],
  "count": "integer"
}
```

#### Usage Example

```bash
GET /list-web-synthesis-tasks?client_id=client-123&brand_id=brand-456
```

#### Response Fields

- `tasks`: Array of task objects with metadata
- `count`: Total number of web synthesis tasks

#### Error Responses

- **500**: Database retrieval error

#### Notes

- Returns all web synthesis tasks for the specified brand
- Each task object includes entity identification

---

### DELETE /delete-web-synthesis-task/{task_id}

Deletes a web synthesis analysis task and all associated reports.

**Endpoint:** `DELETE /delete-web-synthesis-task/{task_id}`

**Purpose:** Permanently removes a web synthesis task and all associated synthesized analysis reports from the database. This action cannot be undone.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string (query) | Yes | Unique identifier for the client account. |
| `brand_id` | string (query) | Yes | Unique identifier for the brand. |
| `task_id` | string (path) | Yes | Unique identifier for the web synthesis task to delete. |

#### Output Structure

```json
{
  "message": "string",
  "task_id": "string"
}
```

#### Usage Example

```bash
DELETE /delete-web-synthesis-task/660e8400-e29b-41d4-a716-446655440001?client_id=client-123&brand_id=brand-456
```

#### Response Fields

- `message`: Success message with task details
- `task_id`: The ID of the deleted task

#### Error Responses

- **404**: Web synthesis task not found
- **500**: Database deletion error

#### Notes

- This action permanently deletes the task and all associated data
- Cannot be undone - ensure you want to delete before calling this endpoint

---

## General Notes

### Authentication
All endpoints require authentication via the `Authorization` header with a valid Bearer token.

### Rate Limiting
- Web extraction tasks: Limited by token processing capacity (800K tokens max)
- Web synthesis tasks: Limited by extraction task completion status

### Processing Time
- Web extraction: 30 seconds to several minutes depending on content volume
- Web synthesis: 1-5 minutes depending on extraction complexity

### Entity Identification
- **Brand Analysis**: `analysis_scope="brand"`, `entity_name` is the Brand Name
- **Competitor Analysis**: `analysis_scope="competitors"`, `entity_name` is the Competitor Name
- Entity info is saved at run time for efficient retrieval in get/list endpoints

### Data Flow
1. **Web Extraction**: Raw website content → Structured extraction
2. **Web Synthesis**: Extraction results → Comprehensive analysis report

### Token Management
- Content is automatically truncated to fit within 800K token limits
- Sitemap information is preserved during truncation
- Processing is optimized for large datasets

### Error Handling
- All endpoints return appropriate HTTP status codes
- Detailed error messages for troubleshooting
- Batch validation ensures data integrity

### Best Practices
- Always validate batch completion before running extraction
- Use task listing endpoints to track processing status
- Implement proper error handling for API calls
- Store task IDs for result retrieval
