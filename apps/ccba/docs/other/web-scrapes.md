# Separate Web Scrapes API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The Separate Web Scrapes API enables individual website crawling operations using diverse scraping engines like Playwright and Spider API.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/website-crawl-asad`
**Scrape Endpoint (Playwright)** 🔒

Scrapes websites based on provided URLs using Playwright. Supports direct URL lists, file paths, or sitemaps.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "urls": ["https://example.com"],
  "limit": 1,
  "concurrency": 2,
  "headles": true
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `urls` | string[] | - | List of URLs to scrape |
| `file_path` | string | - | Path to file containing URLs |
| `sitemap_url` | string | - | URL of sitemap to scrape |
| `filter_keywords` | string[] | - | Keywords to filter content |
| `limit` | integer | 1 | Max URLs to scrape |
| `concurrency` | integer | 2 | Number of concurrent tasks |
| `page_load_timeout` | integer | 5000 | Timeout in ms |
| `mk` | boolean | true | Return markdown |
| `html_flag` | boolean | false | Return HTML |
| `headless` | boolean | true | Run headless browser |
| `get_images` | boolean | false | Extract images |

**Response:** `200 OK`

---

### POST `/website-crawl-spidercrawl`
**Website Crawl (Spider API)** 🔒

Crawl a website using the Spider API directly.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "url": "https://example.com",
  "brand_id": "string",
  "client_id": "string",
  "limit": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | URL to crawl |
| `brand_id` | string | Yes | Brand ID |
| `client_id` | string | Yes | Client ID |
| `limit` | integer | No | Max pages (default: 1) |
| `return_format` | string | No | "markdown" (default) |
| `competitor_id` | string | No | Competitor ID if applicable |

**Response:** `200 OK`

---

### GET `/website-crawl-records`
**Get Single Web Scrapes** 🔒

Retrieve a list of all single web scrape records for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

### GET `/website-crawl-record-results`
**Get Single Web Scrape Results** 🔒

Retrieve all scraped content for a specific single web scrape operation.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |
| `scrape_id` | string | Yes | The ID of the scrape record |

**Response:** `200 OK`

---

## Schemas

### ScrapeRequest (Playwright)
```typescript
interface ScrapeRequest {
  urls?: string[];
  file_path?: string;
  sitemap_url?: string;
  filter_keywords?: string[];
  limit?: number; // default: 1
  concurrency?: number; // default: 2
  page_load_timeout?: number; // default: 5000
  mk?: boolean; // default: true
  html_flag?: boolean; // default: false
  meta_flag?: boolean; // default: false
  headless?: boolean; // default: true
  clean?: boolean; // default: false
  get_images?: boolean; // default: false
  images_xpath?: string;
}
```

### SpiderCrawlRequest
```typescript
interface SpiderCrawlRequest {
  url: string;
  brand_id: string;
  client_id: string;
  limit?: number; // default: 1
  return_format?: string; // default: "markdown"
  batch_id?: string;
  competitor_id?: string;
  name?: string;
  request_timeout?: number; // 5-255 seconds
  metadata?: boolean; // default: false
  request?: string; // default: "smart"
  respect_robots?: boolean; // default: false
  include_html?: boolean; // default: false
}
```

---

[← Back to Documentation Index](./index.md)
