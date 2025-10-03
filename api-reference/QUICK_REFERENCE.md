# BondMCP Platform API - Quick Reference

**Version:** 2.1.0  
**Base URL:** `https://api.bondmcp.com` or `http://localhost:8000`  
**Last Updated:** September 30, 2025

## Authentication

Most endpoints require authentication via JWT token:

```bash
# Get token
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Use token
curl -X GET http://localhost:8000/api/v1/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Quick Links

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI Schema:** http://localhost:8000/openapi.json
- **Health Check:** http://localhost:8000/health

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/verify` | Verify token validity | Yes |
| POST | `/auth/refresh` | Refresh access token | Yes |
| POST | `/auth/logout` | Logout and blacklist token | Yes |

**Example:**
```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass123", "name": "John Doe"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass123"}'
```

---

## 🏥 Patient Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/patients` | List all patients | Yes |
| POST | `/api/v1/patients` | Create new patient | Yes |
| GET | `/api/v1/patients/{id}` | Get patient by ID | Yes |
| GET | `/api/v1/patients/{id}/history` | Get patient medical history | Yes |

**Example:**
```bash
# Create patient
curl -X POST http://localhost:8000/api/v1/patients \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith", "dob": "1985-03-15", "email": "jane@example.com"}'

# Get patient
curl -X GET http://localhost:8000/api/v1/patients/patient_123 \
  -H "Authorization: Bearer TOKEN"
```

---

## 💊 Prescription Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/prescriptions` | List prescriptions | Yes |
| POST | `/api/v1/prescriptions` | Create prescription | Yes |
| PATCH | `/api/v1/prescriptions/{id}` | Update prescription | Yes |
| DELETE | `/api/v1/prescriptions/{id}` | Delete prescription | Yes |
| POST | `/api/v1/prescriptions/{id}/refill` | Request refill | Yes |

**Example:**
```bash
# Create prescription
curl -X POST http://localhost:8000/api/v1/prescriptions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"medication": "Lisinopril", "dosage": "10mg", "frequency": "daily", "patient_id": "patient_123"}'

# Request refill
curl -X POST http://localhost:8000/api/v1/prescriptions/rx_123/refill \
  -H "Authorization: Bearer TOKEN"
```

---

## 📋 Medical Records

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/medical-records` | List medical records | Yes |
| POST | `/api/v1/medical-records` | Create record | Yes |
| GET | `/api/v1/medical-records/{id}` | Get record by ID | Yes |
| POST | `/api/v1/medical-records/{id}/share` | Share record | Yes |
| GET | `/api/v1/medical-records/shared` | Get shared records | Yes |

**Example:**
```bash
# Create medical record
curl -X POST http://localhost:8000/api/v1/medical-records \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "lab_result", "data": {"test": "cholesterol", "value": 185}, "patient_id": "patient_123"}'
```

---

## 📅 Appointment Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/appointments` | List appointments | Yes |
| POST | `/api/v1/appointments` | Create appointment | Yes |
| GET | `/api/v1/appointments/{id}` | Get appointment | Yes |
| DELETE | `/api/v1/appointments/{id}` | Delete appointment | Yes |
| POST | `/api/v1/appointments/{id}/cancel` | Cancel appointment | Yes |
| GET | `/api/v1/appointments/available-slots` | Get available slots | Yes |

**Example:**
```bash
# Create appointment
curl -X POST http://localhost:8000/api/v1/appointments \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-10-15", "time": "10:00", "type": "consultation", "patient_id": "patient_123"}'

# Get available slots
curl -X GET http://localhost:8000/api/v1/appointments/available-slots \
  -H "Authorization: Bearer TOKEN"
```

---

## 💳 Billing & Subscriptions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/billing/setup` | Setup billing | Yes |
| GET | `/api/v1/billing/subscription` | Get subscription | Yes |
| PUT | `/api/v1/billing/plan` | Update plan | Yes |
| GET | `/api/v1/billing/plans` | List available plans | Yes |
| GET | `/api/v1/billing/invoices` | List invoices | Yes |
| POST | `/api/v1/billing/payment-methods` | Add payment method | Yes |
| GET | `/api/v1/billing/payment-methods` | List payment methods | Yes |

**Example:**
```bash
# Setup billing
curl -X POST http://localhost:8000/api/v1/billing/setup \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "premium", "payment_method_id": "pm_123"}'

# Get subscription
curl -X GET http://localhost:8000/api/v1/billing/subscription \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔑 API Key Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api-keys/generate` | Generate API key (old) | Yes |
| POST | `/api/v1/api-keys/create` | Create API key | Yes |
| GET | `/api/v1/api-keys/list` | List API keys | Yes |
| GET | `/api/v1/api-keys/usage/{id}` | Get key usage | Yes |
| DELETE | `/api/v1/api-keys/{id}` | Delete API key | Yes |
| POST | `/api/v1/api-keys/{id}/regenerate` | Regenerate key | Yes |

**Example:**
```bash
# Create API key
curl -X POST http://localhost:8000/api/v1/api-keys/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Integration Key", "description": "For my mobile app"}'
```

**Note:** Requires active subscription!

---

## 🧬 Health AI Analysis

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/health/bloodwork` | Analyze bloodwork with AI | Yes |
| POST | `/health/nutrition` | Analyze nutrition | Yes |
| POST | `/health/fitness` | Analyze fitness activity | Yes |
| POST | `/health/dna` | Analyze DNA data | Yes |
| POST | `/health/risk` | Assess health risks | Yes |

**Example:**
```bash
# Analyze bloodwork
curl -X POST http://localhost:8000/health/bloodwork \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"glucose": 95, "cholesterol": 180, "hdl": 55, "ldl": 100}'

# Analyze nutrition
curl -X POST http://localhost:8000/health/nutrition \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"food_items": ["salmon", "broccoli", "brown rice"], "meal_type": "dinner"}'
```

---

## 🏃 Digital Health Programs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/digital-programs` | List programs | Yes |
| GET | `/api/v1/digital-programs/{id}` | Get program details | Yes |
| POST | `/api/v1/digital-programs/{id}/enroll` | Enroll in program | Yes |

**Example:**
```bash
# List programs
curl -X GET http://localhost:8000/api/v1/digital-programs \
  -H "Authorization: Bearer TOKEN"

# Enroll in program
curl -X POST http://localhost:8000/api/v1/digital-programs/program_1/enroll \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔬 Lab Reference Data

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/reference/labs` | List lab reference values | No |
| GET | `/api/v1/reference/labs/{id}` | Get lab reference | No |

**Example:**
```bash
# Get lab references
curl -X GET http://localhost:8000/api/v1/reference/labs

# Get specific lab
curl -X GET http://localhost:8000/api/v1/reference/labs/lab_1
```

---

## 🏢 Vendor Integrations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/vendors` | List vendors | Yes |
| GET | `/api/v1/vendors/{id}` | Get vendor details | Yes |
| POST | `/api/v1/vendors/{id}/connect` | Connect to vendor | Yes |

**Example:**
```bash
# List vendors
curl -X GET http://localhost:8000/api/v1/vendors \
  -H "Authorization: Bearer TOKEN"

# Connect to vendor
curl -X POST http://localhost:8000/api/v1/vendors/vendor_1/connect \
  -H "Authorization: Bearer TOKEN"
```

---

## 👨‍💼 Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/admin/users` | List all users | Yes (Admin) |
| GET | `/api/v1/admin/analytics` | Get analytics | Yes (Admin) |
| GET | `/api/v1/admin/system-health` | System health | Yes (Admin) |

**Example:**
```bash
# Get analytics
curl -X GET http://localhost:8000/api/v1/admin/analytics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🔧 System & Health Checks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Basic health check | No |
| GET | `/api/v1/health` | Detailed health | No |
| GET | `/api/v1/status` | System status | No |
| GET | `/api/v1/version` | API version | No |
| GET | `/api/v1/ready` | Readiness probe | No |
| GET | `/v2/health` | V2 health check | No |
| GET | `/v2/health/live` | Liveness probe | No |
| GET | `/v2/health/ready` | Readiness probe | No |

**Example:**
```bash
# Basic health check
curl -X GET http://localhost:8000/health

# Detailed health
curl -X GET http://localhost:8000/api/v1/health

# System status
curl -X GET http://localhost:8000/api/v1/status
```

---

## 🪝 Webhooks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/webhooks/stripe` | Stripe webhook handler | No (Signed) |

**Note:** Stripe webhooks are authenticated via signature verification.

---

## 🔌 MCP Protocol

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/mcp/.well-known/mcp-configuration` | MCP configuration | No |
| GET | `/mcp/.well-known/mcp-manifest.json` | MCP manifest | No |

---

## Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or invalid |
| 402 | Payment Required | Subscription required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |
| 503 | Service Unavailable | Service temporarily unavailable |

## Rate Limiting

Default rate limits (development):
- **Public endpoints:** 100 requests/minute
- **Authenticated endpoints:** 500 requests/minute
- **Admin endpoints:** 1000 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696089600
```

## Error Response Format

```json
{
  "detail": "Error message here",
  "error": "error_code",
  "timestamp": "2025-09-30T10:00:00Z"
}
```

## Pagination

For list endpoints that support pagination:

```bash
curl -X GET "http://localhost:8000/api/v1/patients?skip=0&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

Parameters:
- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records to return (default: 100, max: 1000)

---

## Support

- **Documentation:** https://docs.bondmcp.com
- **API Status:** https://status.bondmcp.com
- **Support Email:** support@bondmcp.com
- **GitHub:** https://github.com/bondmcp/platform

