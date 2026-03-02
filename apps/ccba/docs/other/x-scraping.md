# X (Twitter) Scraping API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The X (Twitter) Scraping API allows for extraction of profile information and posts from X.com.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/x-scrapper-asad`
**X (Twitter) Scraper** 🔒

Runs the X (Twitter) scraper to extract data from a given profile URL.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "profile_url": "https://x.com/username",
  "start_date": "2025-01-01",
  "end_date": "2025-02-01"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `email` | string | Yes | - | X login email |
| `password` | string | Yes | - | X login password |
| `profile_url` | string | Yes | - | Profile URL |
| `start_date` | string | Yes | - | Start date |
| `end_date` | string | Yes | - | End date |
| `max_tasks` | number | No | 2 | Max tasks |
| `headless` | boolean | No | false | Run headless |

**Response:** `200 OK`

---

### POST `/x/batch-scrape`
**Start X Batch Scrape** 🔒

Starts a new batch scraping job for X.

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "start_date": "string",
  "end_date": "string",
  "name": "string"
}
```

**Response:** `202 Accepted`

---

### GET `/x/batch-status/{batch_id}`
**Get X Batch Status** 🔒

Get the status of an X batch job.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/x/batch-scrapes`
**Get X Batch Scrapes** 🔒

Retrieve a list of all batch X scrapes for a specific brand.

**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/x/batch-scrape-results/{batch_id}`
**Get X Batch Scrape Results** 🔒

Retrieve all scraped content for a specific batch X scrape.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

## Schemas

### XScraperRequest
```typescript
interface XScraperRequest {
  email: string;
  password: string;
  profile_url: string;
  start_date: string; // e.g., "2025-08-22"
  end_date: string; // e.g., "2025-08-18"
  cookies_path?: string; // default: "x_cookies.json"
  headless?: boolean; // default: false
  max_tasks?: number; // default: 2
}
```

### XBatchScrapeRequest
```typescript
interface XBatchScrapeRequest {
  client_id: string;
  brand_id: string;
  start_date: string;
  end_date: string;
  name?: string;
}
```

---

[← Back to Documentation Index](./index.md)
