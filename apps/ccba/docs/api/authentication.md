# Authentication API

> **Base URL:** `https://api-beta.brandos.humanbrand.ai`

---

## Overview

The Authentication API handles user login, registration, token management, and password recovery. The API uses **HTTP Bearer (JWT)** authentication.

### Security Scheme

Most endpoints require a valid access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### Token Response Schema

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

---

## Endpoints

### POST `/login`

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
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Example:**

```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

---

### POST `/refresh-token`

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

**Example:**

```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/refresh-token" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

---

### POST `/register`

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

| Field      | Type    | Required | Description                       |
| ---------- | ------- | -------- | --------------------------------- |
| `email`    | string  | Yes      | User's email address              |
| `name`     | string  | Yes      | User's full name                  |
| `password` | string  | Yes      | User's password                   |
| `is_admin` | boolean | No       | Admin privileges (default: false) |

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

**Example:**

```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com", "name": "John Doe", "password": "securepassword"}'
```

---

### POST `/logout`

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

```json
{
  "message": "Successfully logged out"
}
```

**Example:**

```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/logout" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

---

### GET `/users/me/`

**Get Current User** 🔒

Retrieves the details of the currently authenticated user.

**Authorization Required:** Yes

**Response:** `200 OK`

```json
{
  "user_id": "user-12345",
  "email": "user@example.com",
  "name": "John Doe",
  "client_id": "client-67890",
  "is_admin": false
}
```

**Example:**

```bash
curl -X GET "https://api-beta.brandos.humanbrand.ai/users/me/" \
  -H "Authorization: Bearer <access_token>"
```

---

### POST `/forgot-password`

**Forgot Password**

Initiates password recovery process by sending a reset link to the user's email.

**Request Body:**

```json
{
  "email": "string"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password reset email sent"
}
```

**Example:**

```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

---

### POST `/reset-password`

**Reset Password**

Resets password using the recovery token received via email.

**Request Body:**

```json
{
  "token": "string",
  "new_password": "string"
}
```

| Field          | Type   | Required | Description            |
| -------------- | ------ | -------- | ---------------------- |
| `token`        | string | Yes      | Reset token from email |
| `new_password` | string | Yes      | New password           |

**Response:** `200 OK`

```json
{
  "message": "Password reset successful"
}
```

**Example:**

```bash
curl -X POST "https://api-beta.brandos.humanbrand.ai/reset-password" \
  -H "Content-Type: application/json" \
  -d '{"token": "reset-token-here", "new_password": "newSecurePassword"}'
```

---

### DELETE `/admin/delete-user-data`

**Delete User Data**

Deletes all data for a user by email. Requires password for security verification.

> ⚠️ **Warning:** This permanently deletes ALL data associated with the user's client including brands, competitors, and all scraped data.

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
  "message": "User data deleted successfully"
}
```

**Example:**

```bash
curl -X DELETE "https://api-beta.brandos.humanbrand.ai/admin/delete-user-data" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "userpassword"}'
```

---

## Schemas

### LoginRequest

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### RefreshRequest

```typescript
interface RefreshRequest {
  refresh_token: string;
}
```

### UserCreate

```typescript
interface UserCreate {
  email: string;
  name: string;
  password: string;
  is_admin?: boolean; // default: false
}
```

### User

```typescript
interface User {
  user_id: string;
  email: string;
  name: string;
  client_id: string;
  is_admin?: boolean; // default: false
}
```

### Token

```typescript
interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}
```

### LogoutRequest

```typescript
interface LogoutRequest {
  refresh_token: string;
}
```

### ForgotPasswordRequest

```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

### ResetPasswordRequest

```typescript
interface ResetPasswordRequest {
  token: string;
  new_password: string;
}
```

### DeleteUserRequest

```typescript
interface DeleteUserRequest {
  email: string;
  password: string;
}
```

---

## Token Management Best Practices

1. **Store tokens securely** - Use httpOnly cookies or secure storage
2. **Refresh proactively** - Refresh tokens before they expire
3. **Handle expiration gracefully** - Redirect to login when refresh fails
4. **Clear on logout** - Remove all tokens on logout

### Example Token Refresh Logic

```typescript
async function refreshTokens(refreshToken: string): Promise<Token> {
  const response = await fetch("/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  return response.json();
}
```

---

[← Back to Documentation Index](./index.md)
