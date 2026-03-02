# Error Handling

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## HTTP Status Codes

The BrandOS API uses standard HTTP status codes to indicate the success or failure of an API request.

| Status Code | Description | Meaning |
|-------------|-------------|---------|
| `200` | OK | The request was successful. |
| `201` | Created | The resource was successfully created. |
| `202` | Accepted | The request has been accepted for processing (async jobs). |
| `204` | No Content | The request was successful but returns no content (e.g., deletion). |
| `400` | Bad Request | The server could not understand the request due to invalid syntax. |
| `401` | Unauthorized | Authentication is required and has failed or has not been provided. |
| `403` | Forbidden | The client does not have access rights to the content. |
| `404` | Not Found | The server can not find the requested resource. |
| `422` | Validation Error | The request was well-formed but was unable to be followed due to semantic errors (e.g., invalid fields). |
| `500` | Internal Server Error | The server has encountered a situation it doesn't know how to handle. |

---

## Validation Errors

When a request fails validation (Status `422`), the API returns a JSON response detailed which fields were invalid.

**Response Structure:**

```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**Example:**
If you try to create a user without an email:
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

---

## Common Error Scenarios

### Authentication Errors (`401`)
- **Missing Token:** No `Authorization` header provided.
- **Invalid Token:** The provided token is invalid or malformed.
- **Expired Token:** The access token has expired. Use the `/refresh-token` endpoint.

### Resource Not Found (`404`)
- **Invalid ID:** The requested `client_id`, `brand_id`, or `batch_id` does not exist.
- **Wrong Endpoint:** The URL path is incorrect.

### Batch Processing Errors
- **Job Failed:** Check the `status` field in the batch status response.
- **Incomplete:** Trying to fetch results before the job status is `Completed`.

---

[← Back to Documentation Index](./index.md)
