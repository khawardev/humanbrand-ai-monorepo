# BrandOS API Documentation

> **API Version:** 2.1.1  
> **Base URL:** `https://api-beta.brandos.humanbrand.ai`  
> **Last Updated:** January 7, 2026

---

## Overview

BrandOS API is a comprehensive platform for collecting, analyzing, and managing data from websites and social media. The API provides extensive capabilities for:

- **User & Client Management**: Handle authentication, user accounts, and client organizations
- **Brand & Competitor Management**: Organize brands and their competitive landscape
- **Web Scraping**: Automated website content extraction (HTML & Markdown)
- **Social Media Scraping**: Extract data from Facebook, Instagram, YouTube, X (Twitter), and LinkedIn
- **Evidence Management**: Process and catalog scraped data for analysis workflows

---

## Documentation Index

### Core APIs

| Category | Description | Link |
|----------|-------------|------|
| **Authentication** | User login, registration, token management | [View →](./authentication.md) |
| **Clients** | Client organization management | [View →](./clients.md) |
| **Brands** | Brand and competitor management | [View →](./brands.md) |

### Scraping APIs

| Category | Description | Link |
|----------|-------------|------|
| **Batch Processing** | Automated batch scraping for websites and social media | [View →](./batch-processing.md) |
| **Separate Web Scrapes** | Individual website crawling operations | [View →](./web-scrapes.md) |
| **Facebook Scraping** | Facebook posts and comments extraction | [View →](./facebook-scraping.md) |
| **Instagram Scraping** | Instagram profile and posts extraction | [View →](./instagram-scraping.md) |
| **YouTube Scraping** | YouTube channel and video extraction | [View →](./youtube-scraping.md) |
| **X (Twitter) Scraping** | X/Twitter profile and posts extraction | [View →](./x-scraping.md) |
| **LinkedIn Scraping** | LinkedIn company and profile extraction | [View →](./linkedin-scraping.md) |

### Analysis APIs

| Category | Description | Link |
|----------|-------------|------|
| **Evidence Management** | Phase 0 evidence ledger and analysis | [View →](./evidence-management.md) |

### Reference

| Category | Description | Link |
|----------|-------------|------|
| **Schemas** | TypeScript interfaces and data models | [View →](./schemas.md) |
| **Error Handling** | HTTP status codes and error responses | [View →](./error-handling.md) |

---

## Authentication

The API uses **HTTP Bearer (JWT)** authentication. Most endpoints require a valid access token in the `Authorization` header.

```
Authorization: Bearer <access_token>
```

### Token Flow

1. **Login** → POST `/login` with email/password → Receive `access_token` and `refresh_token`
2. **Use Token** → Include `Bearer <access_token>` in Authorization header
3. **Refresh** → POST `/refresh-token` with `refresh_token` → Receive new tokens
4. **Logout** → POST `/logout` with `refresh_token` to revoke tokens

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

## External Links

- **Swagger UI:** [https://api-beta.brandos.humanbrand.ai/docs](https://api-beta.brandos.humanbrand.ai/docs)
- **OpenAPI JSON:** [https://api-beta.brandos.humanbrand.ai/openapi.json](https://api-beta.brandos.humanbrand.ai/openapi.json)
