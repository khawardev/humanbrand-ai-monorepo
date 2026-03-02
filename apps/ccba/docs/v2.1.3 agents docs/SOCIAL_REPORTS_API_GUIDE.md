# Social Reports API Documentation

This document provides comprehensive guidance on using the Social Reports API endpoints for generating AI-powered social media analysis reports.

## Overview

The Social Reports API provides endpoints for analyzing social media data from various platforms and generating comprehensive reports using AI models. The system supports multiple social platforms and includes dynamic configuration injection for personalized insights.

## Supported Platforms

- **Facebook**
- **Instagram**
- **LinkedIn**
- **X (Twitter)**
- **YouTube**
- **TikTok**

## API Endpoints

### 1. POST /run-social-reports-agent

**Description**: Run social reports agent on batch data using Universal Module v3 framework.

This endpoint processes social media data from a specific channel and generates comprehensive AI-powered reports with dynamic CLIENT CONFIGURATION injection.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client |
| `brand_id` | string | Yes | Unique identifier for the brand |
| `batch_id` | string | Yes | ID of the social media batch to analyze |
| `channel_name` | string | Yes | Social platform name (facebook, instagram, linkedin, x, youtube, tiktok) |
| `analysis_scope` | string | No | Analysis scope: 'brand' for brand data, 'competitors' for competitor data (default: 'brand') |
| `competitor_id` | string | No | Competitor ID (required when analysis_scope is 'competitors') |
| `priority_regions` | array | No | Priority regions for analysis (e.g., ["North America", "Europe", "Asia"]) |
| `analysis_priority` | string | No | Analysis priority: employer_brand, product_marketing, thought_leadership, community, balanced (default: 'balanced') |
| `mandated_drivers` | string | No | JSON string of mandated drivers configuration |
| `instruction` | string | No | Optional custom instructions for the AI analysis |

#### Example Request

```bash
curl -X POST "https://api.example.com/run-social-reports-agent?client_id=client-123&brand_id=brand-456&batch_id=947c9968-6350-4beb-b4bc-406ee11201b5&channel_name=facebook&analysis_scope=brand&priority_regions=North%20America&priority_regions=Europe&analysis_priority=product_marketing&mandated_drivers=%5B%7B%22driver_name%22%3A%22Sustainability%22%2C%22definition%22%3A%22Environmental%20responsibility%22%7D%5D" \
  -H "Authorization: Bearer your_token_here"
```

#### Response Format

```json
{
    "task_id": "550e8400-e29b-41d4-a716-446655440000",
    "social_report": "## Brand Summary\nFacebook performance analysis shows...",
    "entity_name": "AudioControl",
    "analysis_scope": "brand",
    "channel_name": "facebook",
    "universal_config": {
        "client_name": "Audio Control Test",
        "channel_account_name": "",
        "analysis_window": "All available data",
        "priority_regions": ["North America", "Europe", "Asia"],
        "mandated_drivers": [
            {
                "driver_name": "Sustainability",
                "definition": "Environmental responsibility in audio products",
                "include_keywords": ["eco", "green"],
                "include_phrases": ["carbon neutral"],
                "exclude_keywords": ["pollution"]
            }
        ]
    }
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `task_id` | string | Unique identifier for the analysis task |
| `social_report` | string | The generated social media report |
| `entity_name` | string | Name of the analyzed entity (brand or competitor) |
| `analysis_scope` | string | Scope of analysis ("brand" or "competitors") |
| `channel_name` | string | Social media platform analyzed |
| `universal_config` | object | Extracted Universal Module configuration |

### 2. GET /get-social-reports-output

**Description**: Retrieve social reports analysis results.

This endpoint fetches the results of a completed social reports analysis task, including the generated report, metadata, and performance metrics.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client |
| `brand_id` | string | Yes | Unique identifier for the brand |
| `task_id` | string | Yes | Unique identifier for the social reports task |

#### Example Request

```bash
curl -X GET "https://api.example.com/get-social-reports-output?client_id=client-123&brand_id=brand-456&task_id=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer your_token_here"
```

#### Response Format

```json
{
    "task_id": "550e8400-e29b-41d4-a716-446655440000",
    "client_id": "client-123",
    "brand_id": "brand-456",
    "entity_name": "AudioControl",
    "analysis_scope": "brand",
    "channel_name": "facebook",
    "universal_config": {
        "client_name": "Audio Control Test",
        "channel_account_name": "",
        "analysis_window": "All available data",
        "priority_regions": ["North America", "Europe", "Asia"],
        "mandated_drivers": [...]
    },
    "social_report": "## Brand Summary\nFacebook performance analysis shows...",
    "batch_id": "947c9968-6350-4beb-b4bc-406ee11201b5",
    "model_used": "claude-sonnet-4.5",
    "timestamp": "2025-01-01T00:00:00Z",
    "execution_time_seconds": 120.5
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `task_id` | string | Unique identifier for the analysis task |
| `client_id` | string | Client identifier |
| `brand_id` | string | Brand identifier |
| `entity_name` | string | Name of the analyzed entity (brand or competitor) |
| `analysis_scope` | string | Scope of analysis ("brand" or "competitors") |
| `channel_name` | string | Social media platform analyzed |
| `universal_config` | object | Extracted Universal Module configuration |
| `social_report` | string | The complete generated social media report |
| `batch_id` | string | ID of the analyzed social batch |
| `model_used` | string | AI model used for analysis |
| `timestamp` | string | ISO timestamp of when analysis was completed |
| `execution_time_seconds` | number | Time taken to complete analysis |

### 3. GET /list-social-reports-tasks

**Description**: List all social reports tasks for a brand.

This endpoint returns a list of all social reports analysis tasks that have been run for the specified brand, including metadata about each task.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client |
| `brand_id` | string | Yes | Unique identifier for the brand |

#### Example Request

```bash
curl -X GET "https://api.example.com/list-social-reports-tasks?client_id=client-123&brand_id=brand-456" \
  -H "Authorization: Bearer your_token_here"
```

#### Response Format

```json
{
    "tasks": [
        {
            "task_id": "task-facebook-001",
            "entity_name": "AudioControl",
            "analysis_scope": "brand",
            "channel_name": "facebook",
            "timestamp": "2025-01-01T00:00:00Z",
            "model_used": "claude-sonnet-4.5",
            "batch_id": "947c9968-6350-4beb-b4bc-406ee11201b5",
            "scraped_urls_count": 50,
            "execution_time_seconds": 120.5
        },
        {
            "task_id": "task-instagram-001",
            "entity_name": "AudioControl",
            "analysis_scope": "brand",
            "channel_name": "instagram",
            "timestamp": "2025-01-01T01:00:00Z",
            "model_used": "claude-sonnet-4.5",
            "batch_id": "947c9968-6350-4beb-b4bc-406ee11201b5",
            "scraped_urls_count": 30,
            "execution_time_seconds": 95.2
        }
    ],
    "count": 2
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `tasks` | array | Array of task objects |
| `tasks[].task_id` | string | Unique identifier for the task |
| `tasks[].entity_name` | string | Name of the analyzed entity (brand or competitor) |
| `tasks[].analysis_scope` | string | Analysis scope ("brand" or "competitors") |
| `tasks[].channel_name` | string | Social media platform analyzed |
| `tasks[].timestamp` | string | ISO timestamp of when task was created |
| `tasks[].model_used` | string | AI model used for analysis |
| `tasks[].batch_id` | string | ID of the analyzed social batch |
| `tasks[].scraped_urls_count` | number | Number of URLs analyzed |
| `tasks[].execution_time_seconds` | number | Time taken for analysis |
| `count` | number | Total number of tasks |

### 4. DELETE /delete-social-reports-task/{task_id}

**Description**: Delete a social reports analysis task.

This endpoint permanently removes a social reports task and all associated analysis results from the database.

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client |
| `brand_id` | string | Yes | Unique identifier for the brand |
| `task_id` | string | Yes | Unique identifier for the social reports task to delete |

#### Example Request

```bash
curl -X DELETE "https://api.example.com/delete-social-reports-task/task-123?client_id=client-123&brand_id=brand-456" \
  -H "Authorization: Bearer your_token_here"
```

#### Response Format

```json
{
    "message": "Social reports task task-123 deleted successfully",
    "task_id": "task-123"
}
```

## Usage Examples

### Complete Workflow Example

1. **Run Analysis for Facebook**

```bash
curl -X POST "https://api.example.com/run-social-reports-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&channel_name=facebook&analysis_scope=brand" \
  -H "Authorization: Bearer your_token_here"
```

2. **Retrieve Results**

```bash
curl -X GET "https://api.example.com/get-social-reports-output?client_id=client-123&brand_id=brand-456&task_id=550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer your_token_here"
```

3. **List All Tasks**

```bash
curl -X GET "https://api.example.com/list-social-reports-tasks?client_id=client-123&brand_id=brand-456" \
  -H "Authorization: Bearer your_token_here"
```

### Advanced Configuration Example

```bash
curl -X POST "https://api.example.com/run-social-reports-agent?client_id=client-123&brand_id=brand-456&batch_id=batch-789&channel_name=instagram&analysis_scope=brand&priority_regions=North%20America&priority_regions=Europe&analysis_priority=product_marketing&mandated_drivers=%5B%7B%22driver_name%22%3A%22Sustainability%22%2C%22definition%22%3A%22Environmental%20responsibility%22%7D%5D&instruction=Focus%20on%20user%20engagement%20metrics" \
  -H "Authorization: Bearer your_token_here"
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
    "detail": "analysis_scope must be 'brand' or 'competitors'"
}
```

#### 404 Not Found
```json
{
    "detail": "Social reports task not found"
}
```

#### 500 Internal Server Error
```json
{
    "detail": "Social reports failed: [error details]"
}
```

## Best Practices

### 1. Task Management
- Always store the `task_id` returned from the POST endpoint
- Use the task_id to retrieve results later
- List tasks to monitor progress across multiple analyses

### 2. Configuration
- Use `priority_regions` to focus analysis on specific geographic areas
- Configure `mandated_drivers` for industry-specific analysis
- Set `analysis_priority` based on your business focus

### 3. Error Handling
- Implement retry logic for transient failures
- Handle 404 errors when tasks are not yet complete
- Monitor execution times for performance optimization

### 4. Security
- Always use proper authentication tokens
- Validate client_id and brand_id permissions
- Secure sensitive configuration data

## Integration Examples

### Python Example

```python
import requests
import json

def run_social_report(client_id, brand_id, batch_id, channel_name):
    url = "https://api.example.com/run-social-reports-agent"
    params = {
        'client_id': client_id,
        'brand_id': brand_id,
        'batch_id': batch_id,
        'channel_name': channel_name,
        'analysis_scope': 'brand'
    }
    
    headers = {
        'Authorization': 'Bearer your_token_here',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, params=params, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Task created: {result['task_id']}")
        return result['task_id']
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def get_report_results(client_id, brand_id, task_id):
    url = "https://api.example.com/get-social-reports-output"
    params = {
        'client_id': client_id,
        'brand_id': brand_id,
        'task_id': task_id
    }
    
    headers = {
        'Authorization': 'Bearer your_token_here'
    }
    
    response = requests.get(url, params=params, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None
```

### JavaScript Example

```javascript
async function runSocialReport(clientId, brandId, batchId, channelName) {
    const url = new URL('https://api.example.com/run-social-reports-agent');
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('brand_id', brandId);
    url.searchParams.append('batch_id', batchId);
    url.searchParams.append('channel_name', channelName);
    url.searchParams.append('analysis_scope', 'brand');
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer your_token_here',
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        const result = await response.json();
        console.log(`Task created: ${result.task_id}`);
        return result.task_id;
    } else {
        const error = await response.text();
        console.error(`Error: ${response.status} - ${error}`);
        return null;
    }
}

async function getReportResults(clientId, brandId, taskId) {
    const url = new URL('https://api.example.com/get-social-reports-output');
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('brand_id', brandId);
    url.searchParams.append('task_id', taskId);
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer your_token_here'
        }
    });
    
    if (response.ok) {
        return await response.json();
    } else {
        const error = await response.text();
        console.error(`Error: ${response.status} - ${error}`);
        return null;
    }
}
```

## Support

For additional support or questions about the Social Reports API:

- Contact: [support@example.com](mailto:support@example.com)
- Documentation: [https://docs.example.com/social-reports](https://docs.example.com/social-reports)
- Status: [https://status.example.com](https://status.example.com)

## Version Information

- **API Version**: v3 (Universal Module Framework)
- **Last Updated**: April 2026
- **Compatibility**: Backward compatible with existing workflows