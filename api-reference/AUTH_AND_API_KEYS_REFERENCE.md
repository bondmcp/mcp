# Authentication and API Keys Reference

**Live API Base URL:** `https://t9xbkyb7mg.us-east-1.awsapprunner.com`  
**API Version:** 2.1.0  
**Last Updated:** 2025-10-03

This document provides complete reference documentation for all authentication and API key management endpoints in the BondMCP Platform.

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
   - [POST /auth/register](#post-authregister)
   - [POST /auth/login](#post-authlogin)
   - [POST /auth/verify](#post-authverify)
   - [POST /auth/refresh](#post-authrefresh)
   - [POST /auth/logout](#post-authlogout)
   - [GET /auth/me](#get-authme)
   - [GET /auth/profile](#get-authprofile)
2. [Auth API Keys Endpoints](#auth-api-keys-endpoints)
   - [GET /auth/api-keys](#get-authapi-keys)
   - [POST /auth/api-keys](#post-authapi-keys)
   - [DELETE /auth/api-keys/{key_id}](#delete-authapi-keyskey_id)
3. [Legacy API Keys Endpoints](#legacy-api-keys-endpoints)
   - [GET /api-keys](#get-api-keys)
   - [POST /api-keys/generate](#post-api-keysgenerate)
4. [V1 API Keys Endpoints](#v1-api-keys-endpoints)
   - [POST /api/v1/api-keys/create](#post-apiv1api-keyscreate)
   - [GET /api/v1/api-keys/list](#get-apiv1api-keyslist)
   - [DELETE /api/v1/api-keys/{key_id}](#delete-apiv1api-keyskey_id)
   - [POST /api/v1/api-keys/{key_id}/regenerate](#post-apiv1api-keyskey_idregenerate)
   - [GET /api/v1/api-keys/usage/{key_id}](#get-apiv1api-keysusakey_id)

---

## Authentication Endpoints

### POST /auth/register

**Description:** Register a new user account.

**Authentication Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body Schema:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "name": "string (required)"
}
```

**Request Example:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJREDACTED_JWT_TOKEN",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-10-03T12:00:00Z"
  }
}
```

**Response Codes:**
- `200` - Success, user created and logged in
- `400` - Invalid request (e.g., weak password, invalid email)
- `409` - User already exists
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

**Notes:**
- Password must meet security requirements (minimum 8 characters, complexity rules)
- Email must be valid and unique
- Returns JWT access token immediately after registration
- User is automatically logged in after successful registration

---

### POST /auth/login

**Description:** Authenticate user and obtain JWT access token.

**Authentication Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body Schema:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Request Example:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJREDACTED_JWT_TOKEN",
  "refresh_token": "eyJREDACTED_JWT_TOKEN",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Response Codes:**
- `200` - Success, authentication successful
- `401` - Invalid credentials
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Notes:**
- Returns both access token (short-lived) and refresh token (long-lived)
- Access token expires in 1 hour (3600 seconds)
- Use refresh token with `/auth/refresh` to get new access token

---

### POST /auth/verify

**Description:** Verify the validity of a JWT access token.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:** Empty or `{}`

**Response (200 OK):**
```json
{
  "valid": true,
  "user_id": "usr_abc123",
  "email": "user@example.com",
  "expires_at": "2025-10-03T13:00:00Z"
}
```

**Response Codes:**
- `200` - Token is valid
- `401` - Token is invalid, expired, or blacklisted
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/verify \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Notes:**
- Checks if token is not expired and not blacklisted
- Use this to validate tokens before processing requests
- Returns user information embedded in the token

---

### POST /auth/refresh

**Description:** Refresh an expired or soon-to-expire access token using a refresh token.

**Authentication Required:** Yes (Bearer Token - Refresh Token)

**Request Headers:**
```
Authorization: Bearer <refresh_token>
Content-Type: application/json
```

**Request Body:** Empty or `{}`

**Response (200 OK):**
```json
{
  "access_token": "eyJREDACTED_JWT_TOKEN",
  "token_type": "bearer",
  "expires_in": 3600
}
```

**Response Codes:**
- `200` - Success, new access token issued
- `401` - Refresh token is invalid or expired
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/refresh \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Notes:**
- Use the refresh token from `/auth/login` response
- Returns a new access token with fresh expiration
- Refresh tokens are long-lived (typically 30 days)
- Old access token is automatically blacklisted

---

### POST /auth/logout

**Description:** Logout user and blacklist the current JWT token to prevent reuse.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:** Empty or `{}`

**Response (200 OK):**
```json
{
  "message": "Successfully logged out",
  "token_blacklisted": true
}
```

**Response Codes:**
- `200` - Success, user logged out
- `401` - Token is invalid
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/logout \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Notes:**
- Blacklists the current access token
- Token cannot be used for any subsequent requests
- Blacklisted tokens are stored until natural expiration
- Client should discard both access and refresh tokens

---

### GET /auth/me

**Description:** Get current authenticated user's profile information.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "usr_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-10-03T12:00:00Z",
  "updated_at": "2025-10-03T12:00:00Z",
  "subscription": {
    "plan": "pro",
    "status": "active",
    "expires_at": "2025-11-03T12:00:00Z"
  }
}
```

**Response Codes:**
- `200` - Success
- `401` - Not authenticated or token invalid
- `422` - Validation error

**cURL Command:**
```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/me \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

**Notes:**
- Returns comprehensive user profile
- Includes subscription information
- Useful for client-side profile display

---

### GET /auth/profile

**Description:** Get current authenticated user's profile (alias of /auth/me).

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "usr_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2025-10-03T12:00:00Z",
  "updated_at": "2025-10-03T12:00:00Z"
}
```

**Response Codes:**
- `200` - Success
- `401` - Not authenticated
- `422` - Validation error

**cURL Command:**
```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/profile \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

**Notes:**
- Functionally identical to `/auth/me`
- Use either endpoint based on preference

---

## Auth API Keys Endpoints

### GET /auth/api-keys

**Description:** List all API keys for the authenticated user.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "api_keys": [
    {
      "id": "key_xyz789",
      "name": "Production API Key",
      "description": "For production environment",
      "key_preview": "sk_live_REDACTED...abcd",
      "created_at": "2025-10-01T10:00:00Z",
      "last_used": "2025-10-03T11:30:00Z",
      "is_active": true
    },
    {
      "id": "key_abc456",
      "name": "Development Key",
      "description": null,
      "key_preview": "sk_test_REDACTED...efgh",
      "created_at": "2025-09-28T14:00:00Z",
      "last_used": null,
      "is_active": true
    }
  ],
  "total": 2
}
```

**Response Codes:**
- `200` - Success
- `401` - Not authenticated
- `422` - Validation error

**cURL Command:**
```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/api-keys \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

**Notes:**
- Returns only active API keys
- Full API key values are never returned (only previews)
- Shows last usage timestamp for each key
- Requires active subscription

---

### POST /auth/api-keys

**Description:** Create a new API key with billing enforcement.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body Schema:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "permissions": ["array of strings (optional)"]
}
```

**Request Example:**
```json
{
  "name": "Production API Key",
  "description": "Key for production environment access",
  "permissions": ["read", "write"]
}
```

**Response (201 Created):**
```json
{
  "id": "key_xyz789",
  "name": "Production API Key",
  "description": "Key for production environment access",
  "api_key": "sk_live_REDACTED",
  "key_preview": "sk_live_REDACTED...wxyz",
  "created_at": "2025-10-03T12:00:00Z",
  "is_active": true,
  "warning": "Store this key securely. It will only be shown once."
}
```

**Response Codes:**
- `201` - Success, API key created
- `400` - Invalid request or subscription required
- `401` - Not authenticated
- `403` - Subscription plan limit reached
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/api-keys \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "description": "Key for production environment access"
  }'
```

**Notes:**
- Full API key value is returned ONLY on creation
- Store the key securely - it cannot be retrieved later
- Requires an active paid subscription
- Number of keys limited by subscription plan
- API key never expires unless manually deleted

---

### DELETE /auth/api-keys/{key_id}

**Description:** Delete (revoke) an API key.

**Authentication Required:** Yes (Bearer Token)

**URL Parameters:**
- `key_id` (string, required) - The ID of the API key to delete

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "API key deleted successfully",
  "key_id": "key_xyz789",
  "deleted_at": "2025-10-03T12:30:00Z"
}
```

**Response Codes:**
- `200` - Success, API key deleted
- `401` - Not authenticated
- `404` - API key not found
- `403` - Not authorized to delete this key
- `422` - Validation error

**cURL Command:**
```bash
curl -X DELETE https://t9xbkyb7mg.us-east-1.awsapprunner.com/auth/api-keys/key_xyz789 \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

**Notes:**
- Immediately revokes the API key
- Key cannot be recovered after deletion
- Any requests using the deleted key will fail with 401
- Soft delete - key remains in database but marked as inactive

---

## Legacy API Keys Endpoints

### GET /api-keys

**Description:** List user's API keys (legacy endpoint).

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "api_keys": [
    {
      "id": "key_xyz789",
      "name": "Production API Key",
      "key_preview": "sk_live_REDACTED...abcd",
      "created_at": "2025-10-01T10:00:00Z",
      "is_active": true
    }
  ]
}
```

**Response Codes:**
- `200` - Success
- `401` - Not authenticated
- `422` - Validation error

**cURL Command:**
```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/api-keys \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

**Notes:**
- Legacy endpoint - use `/auth/api-keys` for new implementations
- Functionally similar to `/auth/api-keys`
- May be deprecated in future versions

---

### POST /api-keys/generate

**Description:** Generate a new API key (legacy endpoint).

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body Schema:**
```json
{
  "name": "string (required)",
  "permissions": ["array of strings (optional, default: ['read'])"]
}
```

**Request Example:**
```json
{
  "name": "Development Key",
  "permissions": ["read", "write"]
}
```

**Response (201 Created):**
```json
{
  "id": "key_abc456",
  "name": "Development Key",
  "api_key": "sk_test_REDACTED",
  "key_preview": "sk_test_REDACTED...0xyz",
  "permissions": ["read", "write"],
  "created_at": "2025-10-03T12:00:00Z"
}
```

**Response Codes:**
- `201` - Success, API key created
- `400` - Invalid request
- `401` - Not authenticated
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/api-keys/generate \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Development Key",
    "permissions": ["read"]
  }'
```

**Notes:**
- Legacy endpoint - use `/auth/api-keys` (POST) for new implementations
- Default permissions is `["read"]` if not specified
- May not enforce billing requirements

---

## V1 API Keys Endpoints

### POST /api/v1/api-keys/create

**Description:** Create a new API key (requires active subscription).

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body Schema:**
```json
{
  "name": "string (required)",
  "description": "string (optional)"
}
```

**Request Example:**
```json
{
  "name": "Mobile App Key",
  "description": "API key for mobile application"
}
```

**Response (200 OK):**
```json
{
  "id": "key_mobile123",
  "name": "Mobile App Key",
  "description": "API key for mobile application",
  "api_key": "sk_live_REDACTED",
  "key_preview": "sk_live_REDACTED...7890",
  "created_at": "2025-10-03T12:00:00Z",
  "is_active": true
}
```

**Response Codes:**
- `200` - Success, API key created
- `400` - Subscription required or invalid request
- `401` - Not authenticated
- `403` - Insufficient permissions or plan limit reached
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/api-keys/create \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mobile App Key",
    "description": "API key for mobile application"
  }'
```

**Notes:**
- Requires active paid subscription
- Full API key only shown once
- Enforces plan-based key limits
- Recommended endpoint for V1 API users

---

### GET /api/v1/api-keys/list

**Description:** List all API keys for the authenticated user.

**Authentication Required:** Yes (Bearer Token)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": "key_mobile123",
    "name": "Mobile App Key",
    "description": "API key for mobile application",
    "key_preview": "sk_live_REDACTED...7890",
    "created_at": "2025-10-03T12:00:00Z",
    "last_used": "2025-10-03T12:15:00Z",
    "is_active": true
  },
  {
    "id": "key_web456",
    "name": "Web Dashboard Key",
    "description": null,
    "key_preview": "sk_live_REDACTED...4567",
    "created_at": "2025-10-02T09:00:00Z",
    "last_used": null,
    "is_active": true
  }
]
```

**Response Codes:**
- `200` - Success
- `401` - Not authenticated
- `422` - Validation error

**cURL Command:**
```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/api-keys/list \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

**Notes:**
- Returns array of API key objects
- Includes usage statistics (last_used timestamp)
- Only shows active keys
- Recommended endpoint for V1 API users

---

### DELETE /api/v1/api-keys/{key_id}

**Description:** Delete (revoke) an API key.

**Authentication Required:** Yes (Bearer Token)

**URL Parameters:**
- `key_id` (string, required) - The ID of the API key to delete

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "API key deleted successfully",
  "key_id": "key_mobile123"
}
```

**Response Codes:**
- `200` - Success, API key deleted
- `401` - Not authenticated
- `403` - Not authorized to delete this key
- `404` - API key not found
- `422` - Validation error

**cURL Command:**
```bash
curl -X DELETE https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/api-keys/key_mobile123 \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

**Notes:**
- Immediately revokes the API key
- Cannot be undone
- Key is soft-deleted (marked inactive in database)
- Requests with deleted key will return 401 Unauthorized

---

### POST /api/v1/api-keys/{key_id}/regenerate

**Description:** Regenerate an API key (requires active subscription).

**Authentication Required:** Yes (Bearer Token)

**URL Parameters:**
- `key_id` (string, required) - The ID of the API key to regenerate

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "id": "key_mobile123",
  "name": "Mobile App Key",
  "description": "API key for mobile application",
  "api_key": "sk_live_REDACTED",
  "key_preview": "sk_live_REDACTED...0xyz",
  "created_at": "2025-10-03T12:00:00Z",
  "regenerated_at": "2025-10-03T13:00:00Z",
  "is_active": true,
  "warning": "Old key has been invalidated. Update your applications immediately."
}
```

**Response Codes:**
- `200` - Success, API key regenerated
- `400` - Subscription required
- `401` - Not authenticated
- `403` - Not authorized
- `404` - API key not found
- `422` - Validation error

**cURL Command:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/api-keys/key_mobile123/regenerate \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Notes:**
- Generates new API key value while keeping same key ID
- Old key value is immediately invalidated
- Useful for key rotation without changing configuration IDs
- New key value shown only once
- Requires active subscription

---

### GET /api/v1/api-keys/usage/{key_id}

**Description:** Get usage statistics for a specific API key.

**Authentication Required:** Yes (Bearer Token)

**URL Parameters:**
- `key_id` (string, required) - The ID of the API key

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "key_id": "key_mobile123",
  "name": "Mobile App Key",
  "usage_stats": {
    "total_requests": 15420,
    "requests_today": 342,
    "requests_this_month": 8756,
    "last_used": "2025-10-03T12:45:00Z",
    "first_used": "2025-10-03T12:01:00Z"
  },
  "rate_limit": {
    "limit": 10000,
    "remaining": 9658,
    "reset_at": "2025-10-04T00:00:00Z"
  },
  "endpoints_used": [
    {
      "endpoint": "/health/bloodwork",
      "count": 234
    },
    {
      "endpoint": "/health/nutrition",
      "count": 108
    }
  ]
}
```

**Response Codes:**
- `200` - Success
- `401` - Not authenticated
- `403` - Not authorized to view this key
- `404` - API key not found
- `422` - Validation error

**cURL Command:**
```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/api-keys/usage/key_mobile123 \
  -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

**Notes:**
- Provides detailed usage analytics
- Shows rate limit status
- Includes endpoint-level breakdown
- Useful for monitoring and debugging
- Statistics may be cached (5-minute delay)

---

## Authentication Methods

### Bearer Token Authentication

Most endpoints require a JWT Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

**Example:**
```bash
curl -H "Authorization: Bearer eyJREDACTED_JWT_TOKEN"
```

### API Key Authentication

Some endpoints support API key authentication via the `X-API-Key` header:

```
X-API-Key: <api_key>
```

**Example:**
```bash
curl -H "X-API-Key: sk_live_REDACTED"
```

---

## Common Response Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request (invalid input) |
| `401` | Unauthorized (invalid or missing auth) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not found |
| `409` | Conflict (e.g., duplicate resource) |
| `422` | Validation error |
| `429` | Too many requests (rate limited) |
| `500` | Internal server error |
| `503` | Service unavailable |

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

**Example:**
```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "The email or password provided is incorrect",
    "details": {
      "hint": "Check your credentials and try again"
    }
  }
}
```

---

## Rate Limiting

All API endpoints are rate-limited based on subscription tier:

| Tier | Rate Limit |
|------|------------|
| Free | 60 requests/minute |
| Standard | 120 requests/minute |
| Pro | 300 requests/minute |
| Enterprise | Custom |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 118
X-RateLimit-Reset: 1696339200
```

When rate limited, you'll receive a `429 Too Many Requests` response.

---

## Best Practices

### Security
1. **Store API keys securely** - Never commit to version control
2. **Use environment variables** - Keep keys out of code
3. **Rotate keys regularly** - Use regenerate endpoint for key rotation
4. **Use HTTPS only** - Never send keys over HTTP
5. **Implement token refresh** - Handle token expiration gracefully
6. **Logout on exit** - Always logout to blacklist tokens

### Performance
1. **Cache tokens** - Don't login on every request
2. **Implement retry logic** - Handle rate limits with exponential backoff
3. **Use appropriate endpoints** - Prefer V1 endpoints for new integrations
4. **Monitor usage** - Track API key usage to optimize

### Development
1. **Use separate keys for dev/prod** - Different keys for different environments
2. **Test with real endpoints** - Validate against live API
3. **Handle errors gracefully** - Implement proper error handling
4. **Log appropriately** - Never log full API keys

---

## OpenAPI Specification

The complete OpenAPI 3.1.0 specification is available at:
```
https://t9xbkyb7mg.us-east-1.awsapprunner.com/openapi.json
```

Interactive API documentation (Swagger UI):
```
https://t9xbkyb7mg.us-east-1.awsapprunner.com/docs
```

---

## Support

For API support:
- **Documentation:** https://t9xbkyb7mg.us-east-1.awsapprunner.com/docs
- **Status Page:** Check service health at `/health` endpoint
- **Issues:** Report via GitHub or support channels

---

## Changelog

### Version 2.1.0 (2025-10-03)
- Initial comprehensive documentation
- 16 endpoints documented with full examples
- Added usage statistics endpoint
- Enhanced error response documentation

---

**Total Endpoints Documented:** 16

**Authentication Endpoints:** 7
- POST /auth/register
- POST /auth/login
- POST /auth/verify
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me
- GET /auth/profile

**Auth API Keys Endpoints:** 3
- GET /auth/api-keys
- POST /auth/api-keys
- DELETE /auth/api-keys/{key_id}

**Legacy API Keys Endpoints:** 2
- GET /api-keys
- POST /api-keys/generate

**V1 API Keys Endpoints:** 5
- POST /api/v1/api-keys/create
- GET /api/v1/api-keys/list
- DELETE /api/v1/api-keys/{key_id}
- POST /api/v1/api-keys/{key_id}/regenerate
- GET /api/v1/api-keys/usage/{key_id}
