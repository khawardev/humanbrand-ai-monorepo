# Instagram Scraping API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The Instagram Scraping API facilitates scraping of Instagram profiles and posts. It supports both individual profile scraping and batch operations.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/instagram-scrapper-asad`
**Instagram Scraper** 🔒

Runs the Instagram scraper to extract data from a given profile URL.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "url": "https://instagram.com/brandname",
  "username": "instagram_user",
  "password": "instagram_password",
  "client_id": "string",
  "brand_id": "string",
  "start_date": "2025-01-01",
  "end_date": "2025-02-01"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `url` | string | Yes | - | Profile URL to scrape |
| `username` | string | Yes | - | IG login username |
| `password` | string | Yes | - | IG login password |
| `client_id` | string | Yes | - | Client ID |
| `brand_id` | string | Yes | - | Brand ID |
| `start_date` | string | Yes | - | Scrape start date |
| `end_date` | string | Yes | - | Scrape end date |
| `headless` | boolean | No | true | Run headless |
| `cookies_path` | string | No | "insta_cookies.json" | Cookies file path |

**Response:** `200 OK`

---

### POST `/instagram/batch-scrape`
**Instagram Batch Scrape** 🔒

Starts a batch scraping job for Instagram, processing brand and competitors.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "start_date": "08-15-2025",
  "end_date": "08-25-2025",
  "client_id": "string",
  "brand_id": "string",
  "name": "string"
}
```

**Response:** `200 OK`

---

### GET `/instagram/batch-status/{batch_id}`
**Get Instagram Batch Status** 🔒

Get the status of an Instagram batch job.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/instagram/batch-scrape-results/{batch_id}`
**Get Instagram Batch Scrape Results** 🔒

Retrieve results of a completed Instagram batch scrape.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/instagram/batch-scrapes`
**Get Instagram Batch Scrapes For Brand** 🔒

Retrieves all batch scrapes for a specific brand.

**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

## Schemas

### InstagramScraperRequest
```typescript
interface InstagramScraperRequest {
  url: string;
  username: string;
  password: string;
  client_id: string;
  brand_id: string;
  start_date: string;
  end_date: string;
  is_competitor?: boolean; // default: false
  competitor_id?: string;
  headless?: boolean; // default: true
  use_old_cookies?: boolean; // default: true
  cookies_path?: string; // default: "insta_cookies.json"
  save_new_cookies?: boolean; // default: true
}
```

### InstagramBatchScrapeRequest
```typescript
interface InstagramBatchScrapeRequest {
  start_date: string; // e.g., "08-15-2025"
  end_date: string; // e.g., "08-25-2025"
  client_id: string;
  brand_id: string;
  name?: string;
}
```

---

[← Back to Documentation Index](./index.md)
