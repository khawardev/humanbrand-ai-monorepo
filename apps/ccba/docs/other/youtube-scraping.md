# YouTube Scraping API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The YouTube Scraping API provides tools to scrape channel data and videos, including optional transcription services.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/youtube-scrapper-asad`
**YouTube Scraper** 🔒

Runs the YouTube scraper to extract data from a given channel.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "channal_url": "https://youtube.com/@channelname",
  "concurrency": 2,
  "transcription": false,
  "headless": true
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `channal_url` | string | Yes | - | Channel URL |
| `concurrency` | number | No | 2 | Concurrent tasks |
| `transcription`| boolean | No | false | Process transcripts |
| `headless` | boolean | No | true | Run headless |

**Response:** `200 OK`

---

### POST `/youtube/batch-scrape`
**Start YouTube Batch Scrape** 🔒

Starts a batch scraping job for a brand and its competitors.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "client_id": "string",
  "brand_id": "string",
  "start_date": "07-18-2025",
  "end_date": "09-18-2025",
  "name": "Q3 Report Batch Scrape"
}
```

**Response:** `200 OK`

---

### GET `/youtube/batch-scrapes`
**Get YouTube Batch Scrapes For Brand** 🔒

Retrieves all batch scraping jobs for a specific brand.

**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/youtube/batch-status/{batch_id}`
**Get YouTube Batch Status** 🔒

Checks the status of a batch scraping job.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

### GET `/youtube/batch-scrape-results/{batch_id}`
**Get YouTube Batch Scrape Results** 🔒

Retrieves the results of a completed batch scraping job.

**Path Parameters:** `batch_id`
**Query Parameters:** `client_id`, `brand_id`

**Response:** `200 OK`

---

## Schemas

### YouTubeScraperRequest
```typescript
interface YouTubeScraperRequest {
  channal_url: string;
  concurrency?: number; // default: 2
  transcription?: boolean; // default: false
  headless?: boolean; // default: true
}
```

### YouTubeBatchScrapeRequest
```typescript
interface YouTubeBatchScrapeRequest {
  client_id: string;
  brand_id: string;
  start_date: string; // e.g., "07-18-2025"
  end_date: string; // e.g., "09-18-2025"
  name?: string;
}
```

---

[← Back to Documentation Index](./index.md)
