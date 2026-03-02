# Facebook Scraping API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The Facebook Scraping API allows you to scrape posts and comments from Facebook pages and posts using Apify integrations.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/facebook-scrape-apify`
**Facebook Scrape (Apify)** 🔒

Triggers an Apify Facebook Posts Scraper Actor to scrape Facebook posts for specified URLs.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "target_urls": [
    {
      "url": "string",
      "is_competitor": false
    }
  ],
  "results_limit": 100
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `client_id` | string | Yes | Client ID |
| `brand_id` | string | Yes | Brand ID |
| `target_urls` | array | Yes | List of URLs to scrape |
| `results_limit` | number | No | Max results to retrieve |
| `only_posts_newer_than` | string | No | Filter by date |

**Response:** `200 OK`

---

### POST `/facebook-comments-scrape-apify`
**Facebook Comments Scrape (Apify)** 🔒

Scrapes comments for specific Facebook posts and updates the database records.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "scrape_for_brand_posts": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `client_id` | string | Yes | Client ID |
| `brand_id` | string | Yes | Brand ID |
| `scrape_for_brand_posts` | boolean | No | Scrape comments for brand posts |
| `scrape_for_competitor_id` | string | No | Scrape comments for competitor |
| `include_nested_comments` | boolean | No | Include replies (default: false) |

**Response:** `200 OK`

---

### POST `/facebook/batch-scrape`
**Start Facebook Batch Scrape** 🔒

Starts a new batch scraping job for Facebook, covering brand and competitors.

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "start_date": "2025-01-01",
  "end_date": "2025-02-01"
}
```

**Response:** `202 Accepted`

---

### GET `/facebook/batch-status/{batch_id}`
**Get Facebook Batch Status** 🔒

Get the status of a Facebook batch job.

**Path Parameters:** `batch_id`

**Response:** `200 OK`

---

### GET `/facebook/batch-scrapes`
**Get Facebook Batch Scrapes** 🔒

Retrieve a list of all batch Facebook scrapes for a specific brand.

**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/facebook/batch-scrape-results/{batch_id}`
**Get Facebook Batch Scrape Results** 🔒

Retrieve all scraped content for a specific batch Facebook scrape.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

## Schemas

### FacebookScrapeRequest
```typescript
interface FacebookScrapeRequest {
  client_id: string;
  brand_id: string;
  target_urls: FacebookTargetUrl[];
  results_limit?: number;
  only_posts_newer_than?: string;
  only_posts_older_than?: string;
}

interface FacebookTargetUrl {
  url: string;
  is_competitor?: boolean; // default: false
  competitor_id?: string;
}
```

### FacebookCommentsScrapeRequest
```typescript
interface FacebookCommentsScrapeRequest {
  client_id: string;
  brand_id: string;
  scrape_for_brand_posts?: boolean; // default: false
  scrape_for_competitor_id?: string;
  results_limit?: number;
  include_nested_comments?: boolean; // default: false
  view_option?: string; // default: "RANKED_UNFILTERED"
}
```

### FacebookBatchScrapeRequest
```typescript
interface FacebookBatchScrapeRequest {
  client_id: string;
  brand_id: string;
  start_date: string;
  end_date: string;
  name?: string;
}
```

---

[← Back to Documentation Index](./index.md)
