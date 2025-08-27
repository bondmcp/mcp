---
description: Complete API endpoints reference with interactive examples
---

# API Endpoints

## Base URL
```
https://api.bondmcp.com
```

## Authentication
All endpoints (except health checks) require Bearer token authentication:
```bash
Authorization: Bearer YOUR_API_KEY
```

## Available Endpoints

### MCP

#### 🔓 `GET /.well-known/mcp-configuration`

**MCP Configuration**

Get MCP configuration with all available capabilities

**Example:**
```bash
curl \
  https://api.bondmcp.com/.well-known/mcp-configuration
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔓 `GET /.well-known/mcp-manifest.json`

**MCP Manifest**

Get MCP manifest with capability integrity hash

**Example:**
```bash
curl \
  https://api.bondmcp.com/.well-known/mcp-manifest.json
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

### System

#### 🔓 `GET /health/live`

**Liveness Probe**

Check if the application is alive and responsive

**Example:**
```bash
curl \
  https://api.bondmcp.com/health/live
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔓 `GET /health/ready`

**Readiness Probe**

Check if the application is ready to handle requests

**Example:**
```bash
curl \
  https://api.bondmcp.com/health/ready
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔓 `GET /health`

**Comprehensive Health Check**

Get comprehensive health status including probes and service info

**Example:**
```bash
curl \
  https://api.bondmcp.com/health
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔓 `GET /info`

**Deployment Info**

Get deployment information

**Example:**
```bash
curl \
  https://api.bondmcp.com/info
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔓 `GET /ready`

**Readiness Check**

Kubernetes-style readiness check

**Example:**
```bash
curl \
  https://api.bondmcp.com/ready
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔓 `GET /config`

**Configuration Info**

Get current configuration information

**Example:**
```bash
curl \
  https://api.bondmcp.com/config
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

### Authentication

#### 🔓 `POST /auth/register`

**Register User**

Register a new user with enhanced validation

**Parameters:**
- `email` (query) ✅ - string
- `password` (query) ✅ - string
- `name` (query) ✅ - string

**Example:**
```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  https://api.bondmcp.com/auth/register
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔓 `POST /auth/login`

**Login User**

Authenticate user and return JWT token with security tracking

**Request Body:**
- Content-Type: `application/json`
- Schema: object

**Example:**
```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"example": "data"}' \
  https://api.bondmcp.com/auth/login
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

### Healthcare

#### 🔒 `POST /healthcare/prescriptions/digital`

**Create Prescription Endpoint**

Create a new digital prescription

**Request Body:**
- Content-Type: `application/json`
- Schema: object

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"example": "data"}' \
  https://api.bondmcp.com/healthcare/prescriptions/digital
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔒 `GET /healthcare/patients/{patient_id}/prescriptions`

**Get Prescriptions Endpoint**

Get all prescriptions for a patient

**Parameters:**
- `patient_id` (path) ✅ - string

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.bondmcp.com/healthcare/patients/{patient_id}/prescriptions
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔒 `POST /healthcare/programs/{program_id}/enroll`

**Enroll Patient Endpoint**

Enroll patient in digital health program

**Parameters:**
- `program_id` (path) ✅ - string

**Request Body:**
- Content-Type: `application/json`
- Schema: object

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"example": "data"}' \
  https://api.bondmcp.com/healthcare/programs/{program_id}/enroll
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔒 `GET /healthcare/programs`

**List Programs Endpoint**

List all available digital health programs

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.bondmcp.com/healthcare/programs
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔒 `GET /healthcare/patients/{patient_id}/digital-summary`

**Get Patient Summary Endpoint**

Get comprehensive digital program summary for patient

**Parameters:**
- `patient_id` (path) ✅ - string

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.bondmcp.com/healthcare/patients/{patient_id}/digital-summary
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

### Vendors

#### 🔒 `POST /vendors/register`

**Register Vendor Endpoint**

Register a new digital health vendor

**Request Body:**
- Content-Type: `application/json`
- Schema: object

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"example": "data"}' \
  https://api.bondmcp.com/vendors/register
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔓 `POST /vendors/{vendor_id}/webhooks`

**Vendor Webhook Endpoint**

Handle vendor webhooks for engagement/metrics data

**Parameters:**
- `vendor_id` (path) ✅ - string
- `signature` (query) ✅ - string

**Request Body:**
- Content-Type: `application/json`
- Schema: object

**Example:**
```bash
curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"example": "data"}' \
  https://api.bondmcp.com/vendors/{vendor_id}/webhooks
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

#### 🔒 `GET /vendors/{vendor_id}/patients/{patient_id}/data`

**Get Vendor Data Endpoint**

Get patient data from specific vendor

**Parameters:**
- `vendor_id` (path) ✅ - string
- `patient_id` (path) ✅ - string

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.bondmcp.com/vendors/{vendor_id}/patients/{patient_id}/data
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---

### API Keys

#### 🔒 `POST /auth/api-keys`

**Create Api Key**

Create a new API key with specified permissions

**Parameters:**
- `name` (query) ✅ - string

**Request Body:**
- Content-Type: `application/json`
- Schema: array

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"example": "data"}' \
  https://api.bondmcp.com/auth/api-keys
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {...}
}
```

---


## Interactive Testing

### Using the GitBook API Explorer
1. Navigate to any endpoint above
2. Click "Try it out" 
3. Fill in required parameters
4. Add your API key in the Authorization header
5. Click "Execute" to test

### Using curl
```bash
# Set your API key
export BONDMCP_API_KEY="your-api-key-here"

# Test health endpoint
curl https://api.bondmcp.com/health

# Test authenticated endpoint
curl -H "Authorization: Bearer $BONDMCP_API_KEY" \
  https://api.bondmcp.com/healthcare/programs
```

### Using Python SDK
```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
response = client.get_programs()
print(response)
```

## Rate Limits
- **Default**: 120 requests per minute
- **Authenticated**: Higher limits based on plan
- **Headers**: Rate limit info in response headers

## Error Handling
All endpoints return consistent error responses:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {...}
  }
}
```

Common error codes:
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (insufficient permissions)
- `429` - Rate limit exceeded
- `500` - Internal server error

---
*Documentation auto-generated from OpenAPI specification*
