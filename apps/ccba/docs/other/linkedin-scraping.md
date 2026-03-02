# LinkedIn Scraping API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The LinkedIn Scraping API enables scraping of LinkedIn company or personal profiles.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/linkedin-scrapper-asad`
**LinkedIn Scraper** 🔒

Runs the LinkedIn scraper to extract data from a given profile.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "email": "example@gmail.com",
  "password": "12345678",
  "profile_url": "https://www.linkedin.com/company/example",
  "end_date": "2025-08-01"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `email` | string | Yes | - | LinkedIn email |
| `password` | string | Yes | - | LinkedIn password |
| `profile_url` | string | Yes | - | Profile URL |
| `end_date` | string | Yes | - | Scrape end date |
| `headless` | boolean | No | true | Run headless |
| `max_tasks` | number | No | 3 | Max tasks |

**Response:** `200 OK`

---

### POST `/linkedin/batch-scrape`
**Start LinkedIn Batch Scrape** 🔒

Starts a new batch scraping job for LinkedIn.

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

### GET `/linkedin/batch-status/{batch_id}`
**Get LinkedIn Batch Status** 🔒

Get the status of a LinkedIn batch job.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/linkedin/batch-scrapes`
**Get LinkedIn Batch Scrapes** 🔒

Retrieve a list of all batch LinkedIn scrapes for a specific brand.

**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/linkedin/batch-scrape-results/{batch_id}`
**Get LinkedIn Batch Scrape Results** 🔒

Retrieve all scraped content for a specific batch LinkedIn scrape.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

## Schemas

### LinkedInScraperRequest
```typescript
interface LinkedInScraperRequest {
  email: string;
  password: string;
  profile_url: string;
  end_date: string; // e.g., "2025-08-01"
  cookies_path?: string; // default: "linkedin_cookies.json"
  headless?: boolean; // default: true
  max_tasks?: number; // default: 3
}
```

### LinkedInBatchScrapeRequest
```typescript
interface LinkedInBatchScrapeRequest {
  client_id: string;
  brand_id: string;
  start_date: string;
  end_date: string;
  name?: string;
}
```

---

[← Back to Documentation Index](./index.md)
