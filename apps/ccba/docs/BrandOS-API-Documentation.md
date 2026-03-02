# BrandOS API Documentation

> **API Version:** 2.1.1  
> **Base URL:** `https://api-beta.brandos.humanbrand.ai`  
> **Last Updated:** January 7, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Authentication](#1-authentication)
   - [Clients](#2-clients)
   - [Brands](#3-brands)
   - [Batch Processing](#4-batch-processing)
   - [Separate Web Scrapes](#5-separate-web-scrapes)
   - [Facebook Scraping](#6-facebook-scraping)
   - [Instagram Scraping](#7-instagram-scraping)
   - [YouTube Scraping](#8-youtube-scraping)
   - [X (Twitter) Scraping](#9-x-twitter-scraping)
   - [LinkedIn Scraping](#10-linkedin-scraping)
   - [Phase 0: Evidence Management](#11-phase-0-evidence-management)
4. [Schemas](#schemas)
5. [Error Handling](#error-handling)

---

## Overview

BrandOS API is a comprehensive platform for collecting, analyzing, and managing data from websites and social media. The API provides extensive capabilities for:

- **User & Client Management**: Handle authentication, user accounts, and client organizations
- **Brand & Competitor Management**: Organize brands and their competitive landscape
- **Web Scraping**: Automated website content extraction (HTML & Markdown)
- **Social Media Scraping**: Extract data from Facebook, Instagram, YouTube, X (Twitter), and LinkedIn
- **Evidence Management**: Process and catalog scraped data for analysis workflows

---

## Authentication

### Security Scheme

The API uses **HTTP Bearer (JWT)** authentication. Most endpoints require a valid access token in the `Authorization` header.

```
Authorization: Bearer <access_token>
```

### Token Flow

1. **Login** → POST `/login` with email/password → Receive `access_token` and `refresh_token`
2. **Use Token** → Include `Bearer <access_token>` in Authorization header
3. **Refresh** → POST `/refresh-token` with `refresh_token` → Receive new tokens
4. **Logout** → POST `/logout` with `refresh_token` to revoke tokens

### Token Response Schema

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

---

## API Endpoints

---

### 1. Authentication

#### POST `/login`

**Login For Access Token**

Authenticates a user and returns access and refresh tokens.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

---

#### POST `/refresh-token`

**Refresh Token**

Refreshes access and refresh tokens using a valid refresh token.

**Request Body:**

```json
{
  "refresh_token": "string"
}
```

**Response:** `200 OK`

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

---

#### POST `/register`

**Create User**

Creates a new user account.

**Request Body:**

```json
{
  "email": "string",
  "name": "string",
  "password": "string",
  "is_admin": false
}
```

**Response:** `201 Created`

```json
{
  "user_id": "string",
  "email": "string",
  "name": "string",
  "client_id": "string",
  "is_admin": false
}
```

---

#### POST `/logout`

**Logout** 🔒

Logs out the user by revoking the access and refresh tokens.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "refresh_token": "string"
}
```

**Response:** `200 OK`

---

#### GET `/users/me/`

**Get Current User** 🔒

Retrieves the details of the currently authenticated user.

**Authorization Required:** Yes

**Response:** `200 OK`

```json
{
  "user_id": "string",
  "email": "string",
  "name": "string",
  "client_id": "string",
  "is_admin": false
}
```

---

#### POST `/forgot-password`

**Forgot Password**

Initiates password recovery process.

**Request Body:**

```json
{
  "email": "string"
}
```

**Response:** `200 OK`

---

#### POST `/reset-password`

**Reset Password**

Resets password using the recovery token.

**Request Body:**

```json
{
  "token": "string",
  "new_password": "string"
}
```

**Response:** `200 OK`

---

#### DELETE `/admin/delete-user-data`

**Delete User Data**

Deletes all data for a user by email. Requires password for security.

> ⚠️ **Warning:** This permanently deletes ALL data associated with the user's client.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`

---

### 2. Clients

#### POST `/clients`

**Create Client** 🔒

Creates a new client.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "company_name": "string",
  "contact_email": "string",
  "phone_number": "string" // optional
}
```

**Response:** `201 Created`

```json
{
  "company_name": "string",
  "contact_email": "string",
  "phone_number": "string",
  "client_id": "string"
}
```

---

#### GET `/clients`

**Read Client** 🔒

Retrieves a client by client_id.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client to retrieve |

**Response:** `200 OK`

```json
{
  "company_name": "string",
  "contact_email": "string",
  "phone_number": "string",
  "client_id": "string"
}
```

---

#### GET `/clients/{client_id}/details`

**Get Client Details** 🔒

Retrieves all details for a specific field related to a client.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `field` | string | No | Field to retrieve: `brand`, `competitors`, `website-batches`, `reports` |

**Response:** `200 OK`

When `field=brand`:

```json
{
  "id": "string",
  "name": "string",
  "website": "string",
  "pathway": "A",
  "created_at": "2026-01-07T12:00:00Z",
  "socials": {
    "facebook_url": "string",
    "linkedin_url": "string",
    "x_url": "string",
    "youtube_url": "string",
    "instagram_url": "string"
  },
  "website-batches": [],
  "reports": {}
}
```

---

### 3. Brands

#### POST `/brands/`

**Add Brand** 🔒

Adds a new brand to the system.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "name": "string",
  "url": "string",
  "pathway": "A", // "A" or "B"
  "facebook_url": "string", // optional
  "linkedin_url": "string", // optional
  "x_url": "string", // optional
  "youtube_url": "string", // optional
  "instagram_url": "string", // optional
  "tiktok_url": "string" // optional
}
```

**Response:** `201 Created`

```json
{
  "client_id": "string",
  "name": "string",
  "url": "string",
  "pathway": "A",
  "facebook_url": "string",
  "linkedin_url": "string",
  "x_url": "string",
  "youtube_url": "string",
  "instagram_url": "string",
  "tiktok_url": "string",
  "brand_id": "string",
  "created_at": "2026-01-07T12:00:00Z"
}
```

---

#### GET `/brands/`

**Get Brands** 🔒

Retrieves brands for a given client.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | No | The ID of a specific brand to retrieve |

**Response:** `200 OK`

```json
[
  {
    "client_id": "string",
    "name": "string",
    "url": "string",
    "pathway": "A",
    "facebook_url": "string",
    "linkedin_url": "string",
    "x_url": "string",
    "youtube_url": "string",
    "instagram_url": "string",
    "tiktok_url": "string",
    "brand_id": "string",
    "created_at": "2026-01-07T12:00:00Z"
  }
]
```

---

#### PUT `/brands`

**Update Brand** 🔒

Updates a brand's information.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand to update |

**Request Body:**

```json
{
  "name": "string", // optional
  "url": "string", // optional
  "pathway": "A", // optional, "A" or "B"
  "facebook_url": "string", // optional
  "linkedin_url": "string", // optional
  "x_url": "string", // optional
  "youtube_url": "string", // optional
  "instagram_url": "string", // optional
  "tiktok_url": "string" // optional
}
```

**Response:** `200 OK`

---

#### DELETE `/brands/`

**Delete Brand Data** 🔒

Deletes a brand, its competitors, and all associated scraped data.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand to delete |

**Response:** `204 No Content`

---

#### POST `/brands/competitors/`

**Add Competitors** 🔒

Bulk add competitors to a brand.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "brand_id": "string",
  "client_id": "string",
  "competitors": [
    {
      "name": "string",
      "url": "string",
      "facebook_url": "string", // optional
      "linkedin_url": "string", // optional
      "x_url": "string", // optional
      "youtube_url": "string", // optional
      "instagram_url": "string", // optional
      "tiktok_url": "string" // optional
    }
  ]
}
```

**Response:** `201 Created`

```json
[
  {
    "name": "string",
    "url": "string",
    "facebook_url": "string",
    "linkedin_url": "string",
    "x_url": "string",
    "youtube_url": "string",
    "instagram_url": "string",
    "tiktok_url": "string",
    "competitor_id": "string"
  }
]
```

---

#### GET `/brands/competitors/`

**Get Competitors For Brand** 🔒

Retrieves a list of competitors for a given brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

```json
{
  "brand_id": "string",
  "competitors": [
    {
      "name": "string",
      "url": "string",
      "facebook_url": "string",
      "linkedin_url": "string",
      "x_url": "string",
      "youtube_url": "string",
      "instagram_url": "string",
      "tiktok_url": "string",
      "competitor_id": "string"
    }
  ]
}
```

---

#### PUT `/brands/competitors/`

**Update Competitor** 🔒

Updates a competitor's information.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |
| `competitor_id` | string | Yes | The ID of the competitor to update |

**Request Body:**

```json
{
  "name": "string", // optional
  "url": "string", // optional
  "facebook_url": "string", // optional
  "linkedin_url": "string", // optional
  "x_url": "string", // optional
  "youtube_url": "string", // optional
  "instagram_url": "string", // optional
  "tiktok_url": "string" // optional
}
```

**Response:** `200 OK`

---

### 4. Batch Processing

#### POST `/batch/website-preview`

**Preview Website Batch Scrape** 🔒

Preview which URLs will be scraped for a batch web scrape without starting the job.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "limit": 100, // optional, default: 100
  "name": "string" // optional
}
```

**Response:** `200 OK`

---

#### POST `/batch/website`

**Start Website Batch Scrape** 🔒

Start a batch web scraping job for a brand and its competitors. Scrapes HTML and markdown content from website URLs, storing them compressed in the database.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "limit": 100, // optional, max pages to scrape per URL
  "name": "string" // optional, name for the batch job
}
```

**Response:** `202 Accepted`

```json
{
  "task_id": "string",
  "status": "Processing started"
}
```

**Usage Flow:**

1. Start batch scrape with `POST /batch/website`
2. Check status with `GET /batch/website-task-status/{batch_id}`
3. Retrieve markdown results with `GET /batch/website-scrape-results`
4. Retrieve HTML results with `GET /batch/website-scrape-html-results`

---

#### GET `/batch/website-task-status/{batch_id}`

**Get Website Batch Status** 🔒

Get the status of a website batch job.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/batch/website-scrapes`

**Get Batch Website Scrapes** 🔒

Retrieve a list of all batch web scrapes for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/batch/website-scrape-results`

**Get Batch Website Scrape Results**

Retrieve all scraped markdown content for a specific batch web scrape.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |
| `batch_id` | string | Yes | The unique ID of the batch job |

**Response:** `200 OK`

```json
{
  "batch_id": "string",
  "status": "Completed",
  "scraped_at": "2026-01-07T12:00:00Z",
  "pages_scraped": 50,
  "brand": {
    "pages": [
      {
        "url": "string",
        "content": "markdown string"
      }
    ]
  },
  "competitors": [
    {
      "competitor_id": "string",
      "name": "string",
      "pages": [
        {
          "url": "string",
          "content": "markdown string"
        }
      ]
    }
  ]
}
```

---

#### GET `/batch/website-scrape-html-results`

**Get Batch Website Scrape HTML Results** 🔒

Retrieve all scraped HTML content for a specific batch web scrape.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |
| `batch_id` | string | Yes | The unique ID of the batch job |

**Response:** `200 OK`

```json
{
  "batch_id": "string",
  "status": "Completed",
  "scraped_at": "2026-01-07T12:00:00Z",
  "pages_scraped": 50,
  "brand": {
    "pages": [
      {
        "url": "string",
        "html_content": "HTML string"
      }
    ]
  },
  "competitors": [
    {
      "competitor_id": "string",
      "name": "string",
      "pages": [
        {
          "url": "string",
          "html_content": "HTML string"
        }
      ]
    }
  ]
}
```

---

#### POST `/batch/social-preview`

**Preview Social Batch Scrape** 🔒

Preview which social media URLs will be scraped without starting the job.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "name": "string", // optional
  "start_date": "string", // optional
  "end_date": "string" // optional
}
```

**Response:** `200 OK`

---

#### POST `/batch/social`

**Start Social Batch Scrape** 🔒

Start a batch social media scraping job for a brand and its competitors.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "name": "string", // optional
  "start_date": "string", // optional
  "end_date": "string" // optional
}
```

**Response:** `202 Accepted`

---

#### GET `/batch/social-task-status/{batch_id}`

**Get Social Batch Status** 🔒

Get the status of a social batch job.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/batch/social-scrapes`

**Get Batch Social Scrapes** 🔒

Retrieve a list of all batch social scrapes for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/batch/social-scrape-results`

**Get Social Scrape Results**

Retrieves all scraped social media content for a given batch.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |
| `batch_id` | string | Yes | The unique ID of the batch job |

**Response:** `200 OK`

---

### 5. Separate Web Scrapes

#### POST `/website-crawl-asad`

**Scrape Endpoint (Playwright)** 🔒

Scrapes websites based on provided URLs using Playwright.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "urls": ["string"], // list of URLs to scrape
  "file_path": "string", // optional, path to file with URLs
  "sitemap_url": "string", // optional, sitemap URL
  "filter_keywords": ["string"], // optional
  "limit": 1, // optional, max URLs to scrape
  "concurrency": 2, // optional, concurrent tasks
  "page_load_timeout": 5000, // optional, ms
  "networkidle_timeout": 5000, // optional, ms
  "mk": true, // optional, markdown output
  "html_flag": false, // optional, include HTML
  "meta_flag": false, // optional, include meta
  "headless": true, // optional
  "clean": false, // optional, clean HTML
  "get_images": false, // optional
  "images_xpath": "string" // optional
}
```

**Response:** `200 OK`

---

#### POST `/website-crawl-spidercrawl`

**Website Crawl (Spider API)** 🔒

Crawl a website using the Spider API.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "url": "string",
  "brand_id": "string",
  "client_id": "string",
  "limit": 1, // optional, default: 1
  "return_format": "markdown", // optional
  "batch_id": "string", // optional
  "competitor_id": "string", // optional
  "name": "string", // optional
  "request_timeout": 30, // optional, 5-255 seconds
  "metadata": false, // optional
  "request": "smart", // optional
  "respect_robots": false, // optional
  "include_html": false // optional
}
```

**Response:** `200 OK`

---

#### GET `/website-crawl-records`

**Get Single Web Scrapes** 🔒

Retrieve a list of all single web scrapes for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/website-crawl-record-results`

**Get Single Web Scrape Results** 🔒

Retrieve all scraped content for a specific single web scrape.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |
| `scrape_id` | string | Yes | The ID of the scrape |

**Response:** `200 OK`

---

### 6. Facebook Scraping

#### POST `/facebook-scrape-apify`

**Facebook Scrape (Apify)** 🔒

Triggers an Apify Facebook Posts Scraper to scrape Facebook posts.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "target_urls": [
    {
      "url": "string",
      "is_competitor": false,
      "competitor_id": "string" // optional
    }
  ],
  "results_limit": 100, // optional
  "only_posts_newer_than": "string", // optional
  "only_posts_older_than": "string" // optional
}
```

**Response:** `200 OK`

---

#### POST `/facebook-comments-scrape-apify`

**Facebook Comments Scrape (Apify)** 🔒

Scrapes comments for specified Facebook posts.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "scrape_for_brand_posts": false, // optional
  "scrape_for_competitor_id": "string", // optional
  "results_limit": 100, // optional
  "include_nested_comments": false, // optional
  "view_option": "RANKED_UNFILTERED" // optional
}
```

**Response:** `200 OK`

---

#### POST `/facebook/batch-scrape`

**Start Facebook Batch Scrape** 🔒

Starts a new batch scraping job for Facebook.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "start_date": "string",
  "end_date": "string",
  "name": "string" // optional
}
```

**Response:** `202 Accepted`

---

#### GET `/facebook/batch-status/{batch_id}`

**Get Facebook Batch Status** 🔒

Get the status of a Facebook batch job.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/facebook/batch-scrapes`

**Get Facebook Batch Scrapes** 🔒

Retrieve a list of all batch Facebook scrapes for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/facebook/batch-scrape-results/{batch_id}`

**Get Facebook Batch Scrape Results** 🔒

Retrieve all scraped content for a specific batch Facebook scrape.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

### 7. Instagram Scraping

#### POST `/instagram-scrapper-asad`

**Instagram Scraper** 🔒

Runs the Instagram scraper to extract data from a given profile.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "url": "string",
  "username": "string",
  "password": "string",
  "client_id": "string",
  "brand_id": "string",
  "start_date": "string",
  "end_date": "string",
  "is_competitor": false, // optional
  "competitor_id": "string", // optional
  "headless": true, // optional
  "use_old_cookies": true, // optional
  "cookies_path": "insta_cookies.json", // optional
  "save_new_cookies": true // optional
}
```

**Response:** `200 OK`

---

#### POST `/instagram/batch-scrape`

**Instagram Batch Scrape** 🔒

Starts a batch scraping job for Instagram.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "start_date": "08-15-2025",
  "end_date": "08-25-2025",
  "client_id": "string",
  "brand_id": "string",
  "name": "string" // optional
}
```

**Response:** `200 OK`

---

#### GET `/instagram/batch-status/{batch_id}`

**Get Instagram Batch Status** 🔒

Get the status of an Instagram batch job.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/instagram/batch-scrape-results/{batch_id}`

**Get Instagram Batch Scrape Results** 🔒

Retrieve results of a completed Instagram batch scrape.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/instagram/batch-scrapes`

**Get Instagram Batch Scrapes For Brand** 🔒

Retrieves all batch scrapes for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

### 8. YouTube Scraping

#### POST `/youtube-scrapper-asad`

**YouTube Scraper** 🔒

Runs the YouTube scraper to extract data from a given channel.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "channal_url": "string",
  "concurrency": 2, // optional
  "transcription": false, // optional
  "headless": true // optional
}
```

**Response:** `200 OK`

---

#### POST `/youtube/batch-scrape`

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
  "name": "Q3 Report Batch Scrape" // optional
}
```

**Response:** `200 OK`

---

#### GET `/youtube/batch-scrapes`

**Get YouTube Batch Scrapes For Brand** 🔒

Retrieves all batch scraping jobs for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/youtube/batch-status/{batch_id}`

**Get YouTube Batch Status** 🔒

Checks the status of a batch scraping job.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/youtube/batch-scrape-results/{batch_id}`

**Get YouTube Batch Scrape Results** 🔒

Retrieves the results of a completed batch scraping job.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

### 9. X (Twitter) Scraping

#### POST `/x-scrapper-asad`

**X (Twitter) Scraper** 🔒

Runs the X (Twitter) scraper to extract data from a given profile.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "email": "string",
  "password": "string",
  "profile_url": "string",
  "start_date": "2025-08-22",
  "end_date": "2025-08-18",
  "cookies_path": "x_cookies.json", // optional
  "headless": false, // optional
  "max_tasks": 2 // optional
}
```

**Response:** `200 OK`

---

#### POST `/x/batch-scrape`

**Start X Batch Scrape** 🔒

Starts a new batch scraping job for X.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "start_date": "string",
  "end_date": "string",
  "name": "string" // optional
}
```

**Response:** `202 Accepted`

---

#### GET `/x/batch-status/{batch_id}`

**Get X Batch Status** 🔒

Get the status of an X batch job.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/x/batch-scrapes`

**Get X Batch Scrapes** 🔒

Retrieve a list of all batch X scrapes for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/x/batch-scrape-results/{batch_id}`

**Get X Batch Scrape Results** 🔒

Retrieve all scraped content for a specific batch X scrape.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

### 10. LinkedIn Scraping

#### POST `/linkedin-scrapper-asad`

**LinkedIn Scraper** 🔒

Runs the LinkedIn scraper to extract data from a given profile.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "email": "example@gmail.com",
  "password": "12345678",
  "profile_url": "https://www.linkedin.com/company/example",
  "end_date": "2025-08-01",
  "cookies_path": "linkedin_cookies.json", // optional
  "headless": true, // optional
  "max_tasks": 3 // optional
}
```

**Response:** `200 OK`

---

#### POST `/linkedin/batch-scrape`

**Start LinkedIn Batch Scrape** 🔒

Starts a new batch scraping job for LinkedIn.

**Authorization Required:** Yes

**Request Body:**

```json
{
  "client_id": "string",
  "brand_id": "string",
  "start_date": "string",
  "end_date": "string",
  "name": "string" // optional
}
```

**Response:** `202 Accepted`

---

#### GET `/linkedin/batch-status/{batch_id}`

**Get LinkedIn Batch Status** 🔒

Get the status of a LinkedIn batch job.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/linkedin/batch-scrapes`

**Get LinkedIn Batch Scrapes** 🔒

Retrieve a list of all batch LinkedIn scrapes for a specific brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

#### GET `/linkedin/batch-scrape-results/{batch_id}`

**Get LinkedIn Batch Scrape Results** 🔒

Retrieve all scraped content for a specific batch LinkedIn scrape.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_id` | string | Yes | The batch job ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand |

**Response:** `200 OK`

---

### 11. Phase 0: Evidence Management

This section covers the foundational analysis pipeline for processing scraped data into structured evidence.

---

#### POST `/run-evidence-ledger-builder`

**Run Evidence Ledger Builder**

Run SA-00: Evidence Ledger Builder - the foundational step in the Brand OS v2.1 analysis pipeline (Phase 0).

**Core Functionality:**

- Catalogs all evidence from completed scraper tasks with unique IDs (E#####, VE#####, EC##### formats)
- Processes website pages, social media posts, comments, and images
- Creates structured evidence ledger with metadata and source attribution
- Generates corpus manifest with collection statistics and coverage analysis
- Automatically runs Corpus Adequacy Gate (Gate 0) validation

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Unique identifier for the client account |
| `brand_id` | string | Yes | The primary brand ID being analyzed |
| `batch_website_task_id` | string | No | Batch website task ID to process |
| `batch_social_task_id` | string | No | Batch social task ID to process |

> **Note:** At least one of `batch_website_task_id` or `batch_social_task_id` must be provided.

**Response:** `200 OK`

```json
{
  "engagement_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "task_id": "string",
  "evidence_ledger": {
    "schema_version": "2.0.0",
    "generated_at": "2026-01-07T12:40:36.604773",
    "run_id": "engagement-uuid",
    "tenant_id": "client-id",
    "evidence_count": 587,
    "evidence_by_type": {
      "webpage": 6,
      "social_post": 140,
      "comment": 234,
      "image": 207
    },
    "evidence_by_entity": {
      "brand-456": 345,
      "competitor-1": 242
    },
    "evidence": [
      {
        "evidence_id": "E00001",
        "source_type": "webpage",
        "source_channel": "website",
        "source_entity": "brand-456",
        "source_url": "https://example.com/page",
        "source_timestamp": "2026-01-07T12:40:36.604773",
        "content_type": "text",
        "excerpt": "Page content preview...",
        "full_content_uri": "https://example.com/page",
        "extraction_date": "2026-01-07T12:40:36.604773",
        "metadata": {
          "word_count": 1250,
          "has_html": true,
          "image_count": 5
        }
      }
    ]
  },
  "corpus_manifest": {
    "schema_version": "2.0.0",
    "generated_at": "2026-01-07T12:40:36.604773",
    "run_id": "engagement-uuid",
    "collection_window": {
      "collection_date": "2026-01-07T12:40:36.604773",
      "social_lookback_start": "2025-12-08T12:40:36.604773",
      "social_lookback_end": "2026-01-07T12:40:36.604773",
      "social_lookback_days": 30
    },
    "coverage_summary": {
      "entities_collected": ["brand-456", "competitor-1"],
      "channels_collected": ["website", "linkedin", "facebook"]
    },
    "corpus_adequacy": {
      "overall": "pass",
      "notes": "Collected 587 total evidence items",
      "minimum_thresholds": {
        "website_pages": 50,
        "social_posts_per_channel": 50,
        "comments_per_channel": 100
      }
    }
  },
  "gate_0_result": {
    "gate": "corpus_adequacy",
    "status": "pass",
    "timestamp": "2026-01-07T12:40:36.604773",
    "evaluation_results": {
      "entities_evaluated": ["brand-456", "competitor-1"],
      "channels_found": ["website", "linkedin", "facebook", "youtube"]
    },
    "warnings": [],
    "failures": [],
    "recommendation": "Proceed with analysis"
  }
}
```

**Evidence ID Formats:**
| Format | Description |
|--------|-------------|
| `E#####` | Text content (webpages, social posts) |
| `VE#####` | Visual content (images) |
| `EC#####` | Comment content |

---

#### GET `/get-evidence-ledger`

**Get Evidence Ledger** 🔒

Retrieve the complete evidence ledger for a specific engagement/analysis session.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `engagement_id` | string | Yes | Engagement/Analysis identifier (UUID) |

**Response:** `200 OK`

```json
{
  "engagement_id": "string",
  "evidence_count": 587,
  "evidence_ledger": {
    "schema_version": "2.0.0",
    "generated_at": "2026-01-07T12:40:36.604773",
    "evidence_count": 587,
    "evidence_by_type": { ... },
    "evidence_by_entity": { ... },
    "evidence": [ ... ]
  }
}
```

---

#### GET `/get-evidence`

**Get Evidence** 🔒

Retrieve a specific evidence entry with full metadata and source trace.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `engagement_id` | string | Yes | Engagement/Analysis identifier |
| `evidence_id` | string | Yes | Evidence ID (E#####, VE#####, EC#####) |

**Response:** `200 OK`

```json
{
  "evidence_id": "E00001",
  "trace": {
    "evidence_id": "E00001",
    "source_type": "webpage",
    "source_channel": "website",
    "source_entity": "brand-456",
    "source_url": "https://example.com/page",
    "extraction_date": "2026-01-07T12:40:36.604773",
    "metadata": {
      "word_count": 1250,
      "has_html": true,
      "image_count": 5
    }
  },
  "full_entry": {
    "evidence_id": "E00001",
    "source_type": "webpage",
    "source_channel": "website",
    "source_entity": "brand-456",
    "source_url": "https://example.com/page",
    "source_timestamp": "2026-01-07T12:40:36.604773",
    "content_type": "text",
    "excerpt": "Page content preview...",
    "full_content_uri": "https://example.com/page",
    "extraction_date": "2026-01-07T12:40:36.604773",
    "metadata": { ... }
  }
}
```

---

#### GET `/validate-evidence-ids`

**Validate Evidence IDs** 🔒

Validate that a list of evidence IDs exist in the evidence ledger.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `engagement_id` | string | Yes | Engagement/Analysis identifier |
| `evidence_ids` | string | Yes | Comma-separated list of evidence IDs |

**Example:**

```
GET /validate-evidence-ids?client_id=client-123&engagement_id=a1b2c3d4...&evidence_ids=E00001,E00002,VE00001,EC99999
```

**Response:** `200 OK`

```json
{
  "total_requested": 4,
  "valid_count": 3,
  "invalid_count": 1,
  "valid_ids": ["E00001", "E00002", "VE00001"],
  "invalid_ids": ["EC99999"]
}
```

---

#### POST `/calculate-evidence-strength`

**Calculate Evidence Strength** 🔒

Calculate evidence strength score and quality assessment for a set of evidence IDs.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | Client identifier |
| `engagement_id` | string | Yes | Engagement/Analysis identifier |
| `evidence_ids` | string | Yes | Comma-separated list of evidence IDs |

**Response:** `200 OK`

```json
{
  "evidence_ids": ["E00001", "E00002", "VE00001", "EC00001"],
  "strength_score": 0.73,
  "quality_tier": "good",
  "assessment": "good"
}
```

**Scoring Algorithm:**

| Source Type            | Weight        |
| ---------------------- | ------------- |
| About/Company pages    | 1.0 (highest) |
| Product/Solution pages | 0.9           |
| News/Press releases    | 0.8           |
| Blog content           | 0.7           |
| Images/Video           | 0.7           |
| Social media posts     | 0.6           |
| Comments               | 0.4 (lowest)  |

**Quality Tiers:**

| Tier         | Score Range |
| ------------ | ----------- |
| Excellent    | ≥ 0.80      |
| Good         | ≥ 0.60      |
| Adequate     | ≥ 0.40      |
| Insufficient | < 0.40      |

---

## Schemas

### Token

```typescript
interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}
```

### User

```typescript
interface User {
  user_id: string;
  email: string;
  name: string;
  client_id: string;
  is_admin?: boolean;
}
```

### UserCreate

```typescript
interface UserCreate {
  email: string;
  name: string;
  password: string;
  is_admin?: boolean;
}
```

### Client

```typescript
interface Client {
  company_name: string;
  contact_email: string;
  phone_number?: string;
  client_id: string;
}
```

### ClientCreate

```typescript
interface ClientCreate {
  company_name: string;
  contact_email: string;
  phone_number?: string;
}
```

### Brand

```typescript
interface Brand {
  client_id: string;
  name: string;
  url: string;
  pathway?: "A" | "B";
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  brand_id: string;
  created_at?: string;
}
```

### BrandCreate

```typescript
interface BrandCreate {
  client_id: string;
  name: string;
  url: string;
  pathway?: "A" | "B";
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
}
```

### BrandUpdate

```typescript
interface BrandUpdate {
  name?: string;
  url?: string;
  pathway?: "A" | "B";
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
}
```

### Competitor

```typescript
interface Competitor {
  name: string;
  url: string;
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  competitor_id?: string;
}
```

### CompetitorCreate

```typescript
interface CompetitorCreate {
  name: string;
  url: string;
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
}
```

### CompetitorUpdate

```typescript
interface CompetitorUpdate {
  name?: string;
  url?: string;
  facebook_url?: string;
  linkedin_url?: string;
  x_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
}
```

### CompetitorResponse

```typescript
interface CompetitorResponse {
  brand_id: string;
  competitors: Competitor[];
}
```

### CompetitorsRequest

```typescript
interface CompetitorsRequest {
  brand_id: string;
  client_id: string;
  competitors: CompetitorCreate[];
}
```

### BatchScrapeRequest (Website)

```typescript
interface BatchScrapeRequest {
  client_id: string;
  brand_id: string;
  limit?: number; // default: 100
  name?: string;
}
```

### BatchSocialScrapeRequest

```typescript
interface BatchSocialScrapeRequest {
  client_id: string;
  brand_id: string;
  name?: string;
  start_date?: string;
  end_date?: string;
}
```

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
  networkidle_timeout?: number; // default: 5000
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
  request_timeout?: number; // 5-255
  metadata?: boolean; // default: false
  request?: string; // default: "smart"
  respect_robots?: boolean; // default: false
  include_html?: boolean; // default: false
}
```

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

### ValidationError

```typescript
interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}
```

### HTTPValidationError

```typescript
interface HTTPValidationError {
  detail: ValidationError[];
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description                             |
| ----------- | --------------------------------------- |
| `200`       | Successful Response                     |
| `201`       | Created Successfully                    |
| `202`       | Accepted (for async operations)         |
| `204`       | No Content (successful deletion)        |
| `400`       | Bad Request - Invalid input             |
| `401`       | Unauthorized - Authentication required  |
| `403`       | Forbidden - Insufficient permissions    |
| `404`       | Not Found - Resource doesn't exist      |
| `422`       | Validation Error - Invalid request body |
| `500`       | Internal Server Error                   |

### Validation Error Response

When a `422` error occurs, the response body contains details about the validation failure:

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Common Error Scenarios

| Scenario                     | Status | Solution                                         |
| ---------------------------- | ------ | ------------------------------------------------ |
| Missing Authorization header | `401`  | Include `Bearer <token>` in Authorization header |
| Expired access token         | `401`  | Use `/refresh-token` to get new tokens           |
| Invalid client_id            | `404`  | Verify client_id exists                          |
| Invalid brand_id             | `404`  | Verify brand_id exists for the client            |
| Batch job not completed      | `400`  | Wait for batch job to complete                   |
| Evidence ID not found        | `404`  | Verify evidence_id exists in the ledger          |

---

## Quick Reference

### Common Workflows

#### 1. Authentication Flow

```
POST /login → Save tokens → Use Bearer token in requests → POST /refresh-token when expired → POST /logout
```

#### 2. Brand Setup Flow

```
POST /clients → POST /brands/ → POST /brands/competitors/
```

#### 3. Website Scraping Flow

```
POST /batch/website → GET /batch/website-task-status/{batch_id} → GET /batch/website-scrape-results
```

#### 4. Social Media Scraping Flow

```
POST /batch/social → GET /batch/social-task-status/{batch_id} → GET /batch/social-scrape-results
```

#### 5. Evidence Analysis Flow

```
POST /run-evidence-ledger-builder → GET /get-evidence-ledger → GET /get-evidence → POST /calculate-evidence-strength
```

---

> **Documentation generated from OpenAPI Specification v3.1.0**  
> **API URL:** https://api-beta.brandos.humanbrand.ai  
> **Swagger UI:** https://api-beta.brandos.humanbrand.ai/docs
