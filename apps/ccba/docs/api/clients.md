# Clients API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The Clients API manages client organizations within the BrandOS platform. Each client can have multiple brands and competitors associated with them.

**Authorization Required:** All endpoints require a valid Bearer token.

---

## Endpoints

### POST `/clients`
**Create Client** 🔒

Creates a new client organization.

**Authorization Required:** Yes

**Request Body:**
```json
{
  "company_name": "string",
  "contact_email": "string",
  "phone_number": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `company_name` | string | Yes | Company/organization name |
| `contact_email` | string | Yes | Primary contact email |
| `phone_number` | string | No | Contact phone number |

**Response:** `201 Created`
```json
{
  "company_name": "Acme Inc",
  "contact_email": "contact@acme.com",
  "phone_number": "+1-555-123-4567",
  "client_id": "client-abc123"
}
```

**Example:**
```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/clients" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Acme Inc",
    "contact_email": "contact@acme.com",
    "phone_number": "+1-555-123-4567"
  }'
```

---

### GET `/clients`
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
  "company_name": "Acme Inc",
  "contact_email": "contact@acme.com",
  "phone_number": "+1-555-123-4567",
  "client_id": "client-abc123"
}
```

**Example:**
```bash
curl -X GET "https://api-beta.brandos.humanbrand.ai/clients?client_id=client-abc123" \
  -H "Authorization: Bearer <access_token>"
```

---

### GET `/clients/{client_id}/details`
**Get Client Details** 🔒

Retrieves all details for a specific field related to a client. If no field is specified, returns all details.

**Authorization Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | string | Yes | The ID of the client |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `field` | string | No | Specific field to retrieve |

**Available Fields:**
| Field | Description |
|-------|-------------|
| `brand` | Brand information with socials |
| `competitors` | List of competitors |
| `website-batches` | Website scraping batch history |
| `reports` | Generated reports |

**Response (field=brand):** `200 OK`
```json
{
  "id": "brand-xyz789",
  "name": "Acme Brand",
  "website": "https://acme.com",
  "pathway": "A",
  "created_at": "2026-01-07T12:00:00Z",
  "socials": {
    "facebook_url": "https://facebook.com/acme",
    "linkedin_url": "https://linkedin.com/company/acme",
    "x_url": "https://x.com/acme",
    "youtube_url": "https://youtube.com/@acme",
    "instagram_url": "https://instagram.com/acme"
  },
  "website-batches": [
    {
      "batch_id": "batch-123",
      "status": "Completed",
      "created_at": "2026-01-06T10:00:00Z"
    }
  ],
  "reports": {
    "brand_analysis": "report-001",
    "competitor_analysis": "report-002"
  }
}
```

**Response (field=competitors):** `200 OK`
```json
{
  "brand_id": "brand-xyz789",
  "competitors": [
    {
      "competitor_id": "comp-001",
      "name": "Competitor 1",
      "url": "https://competitor1.com",
      "facebook_url": "https://facebook.com/comp1"
    },
    {
      "competitor_id": "comp-002",
      "name": "Competitor 2",
      "url": "https://competitor2.com"
    }
  ]
}
```

**Example:**
```bash
# Get brand details
curl -X GET "https://api-beta.brandos.humanbrand.ai/clients/client-abc123/details?field=brand" \
  -H "Authorization: Bearer <access_token>"

# Get all details
curl -X GET "https://api-beta.brandos.humanbrand.ai/clients/client-abc123/details" \
  -H "Authorization: Bearer <access_token>"
```

---

## Schemas

### ClientCreate
```typescript
interface ClientCreate {
  company_name: string;
  contact_email: string;
  phone_number?: string;
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

### ClientDetails (Brand Field)
```typescript
interface ClientBrandDetails {
  id: string;
  name: string;
  website: string;
  pathway: "A" | "B";
  created_at: string;
  socials: {
    facebook_url?: string;
    linkedin_url?: string;
    x_url?: string;
    youtube_url?: string;
    instagram_url?: string;
  };
  "website-batches": Array<{
    batch_id: string;
    status: string;
    created_at: string;
  }>;
  reports: Record<string, string>;
}
```

---

## Usage in Frontend

### Fetching Client Data

```typescript
async function getClient(clientId: string): Promise<Client> {
  const response = await fetch(`/clients?client_id=${clientId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch client');
  }
  
  return response.json();
}
```

### Creating a New Client

```typescript
async function createClient(data: ClientCreate): Promise<Client> {
  const response = await fetch('/clients', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create client');
  }
  
  return response.json();
}
```

---

[← Back to Documentation Index](./index.md)
