# Brands API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The Brands API manages brands and their competitors within the BrandOS platform. Each brand belongs to a client and can have multiple competitors.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/brands/`
**Add Brand** 🔒

Adds a new brand to the system. The `brand_id` and `created_at` fields are automatically generated.

**Authorization Required:** Yes

**Request Body:**
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
  "tiktok_url": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `client_id` | string | Yes | Client ID this brand belongs to |
| `name` | string | Yes | Brand name |
| `url` | string | Yes | Brand website URL |
| `pathway` | string | No | Pathway identifier ("A" or "B") |
| `facebook_url` | string | No | Facebook page URL |
| `linkedin_url` | string | No | LinkedIn company URL |
| `x_url` | string | No | X (Twitter) profile URL |
| `youtube_url` | string | No | YouTube channel URL |
| `instagram_url` | string | No | Instagram profile URL |
| `tiktok_url` | string | No | TikTok profile URL |

**Response:** `201 Created`
```json
{
  "client_id": "client-abc123",
  "name": "Acme Brand",
  "url": "https://acme.com",
  "pathway": "A",
  "facebook_url": "https://facebook.com/acme",
  "linkedin_url": "https://linkedin.com/company/acme",
  "x_url": "https://x.com/acme",
  "youtube_url": "https://youtube.com/@acme",
  "instagram_url": "https://instagram.com/acme",
  "tiktok_url": null,
  "brand_id": "brand-xyz789",
  "created_at": "2026-01-07T12:00:00Z"
}
```

**Example:**
```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/brands/" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "client-abc123",
    "name": "Acme Brand",
    "url": "https://acme.com",
    "pathway": "A",
    "facebook_url": "https://facebook.com/acme",
    "linkedin_url": "https://linkedin.com/company/acme"
  }'
```

---

### GET `/brands/`
**Get Brands** 🔒

Retrieves brands for a given client. If `brand_id` is provided, retrieves a single brand.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | No | Specific brand ID to retrieve |

**Response (all brands):** `200 OK`
```json
[
  {
    "client_id": "client-abc123",
    "name": "Acme Brand",
    "url": "https://acme.com",
    "pathway": "A",
    "facebook_url": "https://facebook.com/acme",
    "linkedin_url": "https://linkedin.com/company/acme",
    "x_url": "https://x.com/acme",
    "youtube_url": "https://youtube.com/@acme",
    "instagram_url": "https://instagram.com/acme",
    "tiktok_url": null,
    "brand_id": "brand-xyz789",
    "created_at": "2026-01-07T12:00:00Z"
  }
]
```

**Example:**
```bash
# Get all brands for a client
curl -X GET "https://api-beta.brandos.humanbrand.ai/brands/?client_id=client-abc123" \
  -H "Authorization: Bearer <access_token>"

# Get specific brand
curl -X GET "https://api-beta.brandos.humanbrand.ai/brands/?client_id=client-abc123&brand_id=brand-xyz789" \
  -H "Authorization: Bearer <access_token>"
```

---

### PUT `/brands`
**Update Brand** 🔒

Updates a brand's information. Only provided fields will be updated.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand to update |

**Request Body:**
```json
{
  "name": "string",
  "url": "string",
  "pathway": "A",
  "facebook_url": "string",
  "linkedin_url": "string",
  "x_url": "string",
  "youtube_url": "string",
  "instagram_url": "string",
  "tiktok_url": "string"
}
```

All fields are optional. Only include fields you want to update.

**Response:** `200 OK`
```json
{
  "client_id": "client-abc123",
  "name": "Updated Brand Name",
  "url": "https://acme.com",
  "pathway": "B",
  "facebook_url": "https://facebook.com/acme",
  "linkedin_url": "https://linkedin.com/company/acme",
  "x_url": "https://x.com/acme",
  "youtube_url": "https://youtube.com/@acme",
  "instagram_url": "https://instagram.com/acme",
  "tiktok_url": null,
  "brand_id": "brand-xyz789",
  "created_at": "2026-01-07T12:00:00Z"
}
```

**Example:**
```bash
curl -X PUT "https://api-beta.brandos.humanbrand.ai/brands?client_id=client-abc123&brand_id=brand-xyz789" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Brand Name",
    "pathway": "B"
  }'
```

---

### DELETE `/brands/`
**Delete Brand Data** 🔒

Deletes a brand, its competitors, and all associated scraped data.

> ⚠️ **Warning:** This action is irreversible. All data associated with this brand will be permanently deleted.

**Authorization Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |
| `brand_id` | string | Yes | The ID of the brand to delete |

**Response:** `204 No Content`

**Example:**
```bash
curl -X DELETE "https://api-beta.brandos.humanbrand.ai/brands/?client_id=client-abc123&brand_id=brand-xyz789" \
  -H "Authorization: Bearer <access_token>"
```

---

## Competitor Endpoints

### POST `/brands/competitors/`
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
      "facebook_url": "string",
      "linkedin_url": "string",
      "x_url": "string",
      "youtube_url": "string",
      "instagram_url": "string",
      "tiktok_url": "string"
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `brand_id` | string | Yes | Brand to add competitors to |
| `client_id` | string | Yes | Client ID |
| `competitors` | array | Yes | Array of competitor objects |
| `competitors[].name` | string | Yes | Competitor name |
| `competitors[].url` | string | Yes | Competitor website URL |
| `competitors[].*_url` | string | No | Social media URLs |

**Response:** `201 Created`
```json
[
  {
    "name": "Competitor One",
    "url": "https://competitor1.com",
    "facebook_url": "https://facebook.com/comp1",
    "linkedin_url": null,
    "x_url": null,
    "youtube_url": null,
    "instagram_url": null,
    "tiktok_url": null,
    "competitor_id": "comp-001"
  },
  {
    "name": "Competitor Two",
    "url": "https://competitor2.com",
    "facebook_url": null,
    "linkedin_url": "https://linkedin.com/company/comp2",
    "x_url": null,
    "youtube_url": null,
    "instagram_url": null,
    "tiktok_url": null,
    "competitor_id": "comp-002"
  }
]
```

**Example:**
```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/brands/competitors/" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "brand-xyz789",
    "client_id": "client-abc123",
    "competitors": [
      {
        "name": "Competitor One",
        "url": "https://competitor1.com",
        "facebook_url": "https://facebook.com/comp1"
      },
      {
        "name": "Competitor Two",
        "url": "https://competitor2.com",
        "linkedin_url": "https://linkedin.com/company/comp2"
      }
    ]
  }'
```

---

### GET `/brands/competitors/`
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
  "brand_id": "brand-xyz789",
  "competitors": [
    {
      "name": "Competitor One",
      "url": "https://competitor1.com",
      "facebook_url": "https://facebook.com/comp1",
      "linkedin_url": null,
      "x_url": null,
      "youtube_url": null,
      "instagram_url": null,
      "tiktok_url": null,
      "competitor_id": "comp-001"
    },
    {
      "name": "Competitor Two",
      "url": "https://competitor2.com",
      "facebook_url": null,
      "linkedin_url": "https://linkedin.com/company/comp2",
      "x_url": null,
      "youtube_url": null,
      "instagram_url": null,
      "tiktok_url": null,
      "competitor_id": "comp-002"
    }
  ]
}
```

**Example:**
```bash
curl -X GET "https://api-beta.brandos.humanbrand.ai/brands/competitors/?client_id=client-abc123&brand_id=brand-xyz789" \
  -H "Authorization: Bearer <access_token>"
```

---

### PUT `/brands/competitors/`
**Update Competitor** 🔒

Updates a competitor's information. Only provided fields will be updated.

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
  "name": "string",
  "url": "string",
  "facebook_url": "string",
  "linkedin_url": "string",
  "x_url": "string",
  "youtube_url": "string",
  "instagram_url": "string",
  "tiktok_url": "string"
}
```

All fields are optional. Only include fields you want to update.

**Response:** `200 OK`
```json
{
  "name": "Updated Competitor Name",
  "url": "https://competitor1.com",
  "facebook_url": "https://facebook.com/comp1-updated",
  "linkedin_url": null,
  "x_url": "https://x.com/comp1",
  "youtube_url": null,
  "instagram_url": null,
  "tiktok_url": null,
  "competitor_id": "comp-001"
}
```

**Example:**
```bash
curl -X PUT "https://api-beta.brandos.humanbrand.ai/brands/competitors/?client_id=client-abc123&brand_id=brand-xyz789&competitor_id=comp-001" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Competitor Name",
    "x_url": "https://x.com/comp1"
  }'
```

---

## Schemas

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

---

[← Back to Documentation Index](./index.md)
