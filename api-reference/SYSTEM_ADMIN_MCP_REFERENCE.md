# System, Admin, and MCP Endpoints Reference

**Version:** 2.1.0  
**Live API:** https://t9xbkyb7mg.us-east-1.awsapprunner.com  
**Last Updated:** October 3, 2025

This document covers system health endpoints, administrative endpoints, MCP protocol endpoints, vendor integrations, and webhook handlers.

---

## 🔧 System & Health Endpoints

### Root Endpoint

#### `GET /`

**Access:** Public  
**Purpose:** Root API information and service status overview

**Response Example:**
```json
{
  "message": "BondMCP Platform - Hybrid Production",
  "version": "2.1.0",
  "status": "operational",
  "features": "comprehensive"
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/
```

---

### API Documentation

#### `GET /docs`

**Access:** Public  
**Purpose:** Interactive Swagger/OpenAPI documentation interface

**Response:** HTML page with interactive API explorer

**Usage:**
```bash
# Access via browser
open https://t9xbkyb7mg.us-east-1.awsapprunner.com/docs
```

---

### Version Information

#### `GET /version`

**Access:** Public  
**Purpose:** Get API version and build information

**Response Example:**
```json
{
  "version": "2.1.0",
  "git_sha": null,
  "build_time": null,
  "environment": "production"
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/version
```

---

### Readiness Probe

#### `GET /ready`

**Access:** Public  
**Purpose:** Kubernetes/container readiness check (validates if service is ready to accept traffic)

**Response Example:**
```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Response validation failed",
  "correlation_id": "9f5232c1-c348-4117-ba94-0c3c6f0a28ed",
  "details": null,
  "timestamp": "2025-10-03T17:03:14.221912"
}
```

**Note:** Currently experiencing validation issues. Use `/api/v1/ready` instead.

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/ready
```

---

## 🔷 API V1 System Endpoints

### V1 Root

#### `GET /api/v1/`

**Access:** Public  
**Purpose:** API v1 welcome message with quick start guide

**Response Example:**
```json
{
  "message": "Welcome to BondMCP Platform API V2",
  "version": "2.1.0",
  "status": "operational",
  "description": "Comprehensive healthcare AI and MCP platform with enhanced security, billing enforcement, and professional-grade features",
  "endpoints": {
    "health": "/health",
    "status": "/status",
    "version": "/version",
    "ready": "/ready",
    "docs": "/docs",
    "openapi": "/openapi.json"
  },
  "quick_start": {
    "1": "Register: POST /api/v1/auth/register",
    "2": "Login: POST /api/v1/auth/login",
    "3": "Add payment method (required for API keys)",
    "4": "Create API key: POST /api/v1/auth/api-keys",
    "5": "Use API key in X-API-Key header",
    "6": "Explore all endpoints at /docs"
  },
  "features": {
    "billing_enforcement": "Payment method required for API key creation",
    "enhanced_security": "Authentication required for all operations",
    "comprehensive_healthcare": "52+ medical and AI endpoints",
    "professional_grade": "Production-ready with monitoring and validation"
  },
  "support": {
    "website": "https://www.bondmcp.com",
    "documentation": "https://docs.bondmcp.com",
    "contact": "support@bondmcp.com",
    "status_page": "https://status.bondmcp.com"
  }
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/
```

---

### System Status

#### `GET /api/v1/status`

**Access:** Public  
**Purpose:** Comprehensive system health monitoring with dependency status

**Response Example:**
```json
{
  "status": "warning",
  "message": "System health: 80% (4/5 services healthy)",
  "timestamp": "2025-10-03T17:04:36.114330",
  "health_percentage": 80.0,
  "dependencies": {
    "database": {
      "status": "healthy",
      "response_time_ms": 45,
      "connection_pool": "available"
    },
    "cache": {
      "status": "healthy",
      "response_time_ms": 20,
      "memory_usage": "normal"
    },
    "ai_services": {
      "openai": {
        "status": "configured",
        "response_time_ms": 100
      },
      "anthropic": {
        "status": "not_configured",
        "response_time_ms": 95
      }
    },
    "billing": {
      "stripe": {
        "status": "configured",
        "webhook_status": "active"
      }
    }
  },
  "performance": {
    "uptime": "99.9%",
    "avg_response_time_ms": 250,
    "requests_per_minute": 1200,
    "error_rate": "0.1%"
  }
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/status
```

**Status Values:**
- `healthy` - All systems operational
- `warning` - Some non-critical systems degraded
- `critical` - Critical systems unavailable

---

### V1 Version

#### `GET /api/v1/version`

**Access:** Public  
**Purpose:** Detailed version information with feature flags and compatibility

**Response Example:**
```json
{
  "api_version": "2.1.0",
  "platform": "BondMCP Healthcare Platform",
  "environment": "production",
  "build": {
    "git_sha": null,
    "build_time": null,
    "branch": "main"
  },
  "features": {
    "billing_enforcement": "2.1.0",
    "api_versioning": "1.0.0",
    "enhanced_security": "2.1.0",
    "healthcare_ai": "2.0.0"
  },
  "compatibility": {
    "min_client_version": "1.0.0",
    "api_versions_supported": ["v1"],
    "deprecated_versions": []
  }
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/version
```

---

### V1 Ready Check

#### `GET /api/v1/ready`

**Access:** Public  
**Purpose:** Detailed readiness check with individual service validation

**Response Example:**
```json
{
  "ready": true,
  "message": "Service ready for traffic",
  "timestamp": "2025-10-03T17:05:07.175301",
  "checks": [
    {
      "service": "database",
      "ready": true,
      "time_ms": 10
    },
    {
      "service": "authentication",
      "ready": true,
      "time_ms": 5
    },
    {
      "service": "billing",
      "ready": true,
      "time_ms": 5
    },
    {
      "service": "api",
      "ready": true,
      "time_ms": 5
    }
  ],
  "total_checks": 4,
  "passed_checks": 4
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/ready
```

**Use Cases:**
- Kubernetes readiness probes
- Load balancer health checks
- CI/CD pipeline validation
- Deployment verification

---

## 👨‍💼 Admin Endpoints

All admin endpoints require authentication with admin-level permissions.

### AI Usage Statistics

#### `GET /admin/ai-usage`

**Access:** Private (Admin only)  
**Purpose:** Track AI service usage, costs, and token consumption across all users

**Authentication Required:** Yes (Admin JWT token)

**Response Example:**
```json
{
  "detail": "Authentication required"
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/admin/ai-usage \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Expected Response Fields:**
- `total_tokens`: Total AI tokens consumed
- `total_cost`: Total AI service costs
- `by_service`: Breakdown by AI provider (OpenAI, Anthropic, etc.)
- `by_user`: Usage per user
- `period`: Time period for statistics

---

### User Management

#### `GET /api/v1/admin/users`

**Access:** Private (Admin only)  
**Purpose:** List and manage all platform users

**Authentication Required:** Yes (Admin JWT token)

**Query Parameters:**
- `skip` (optional): Number of records to skip (pagination)
- `limit` (optional): Number of records to return (max 1000)
- `status` (optional): Filter by user status (active, inactive, suspended)
- `subscription` (optional): Filter by subscription tier

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/admin/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# With filters
curl "https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/admin/users?status=active&limit=50" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Expected Response Fields:**
- `users`: Array of user objects
- `total_count`: Total number of users
- `active_count`: Number of active users
- `subscription_breakdown`: Users per subscription tier

---

### Analytics Dashboard

#### `GET /api/v1/admin/analytics`

**Access:** Private (Admin only)  
**Purpose:** Platform-wide analytics and metrics

**Authentication Required:** Yes (Admin JWT token)

**Query Parameters:**
- `period` (optional): Time period (day, week, month, year)
- `start_date` (optional): Start date for custom range
- `end_date` (optional): End date for custom range

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/admin/analytics \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Custom date range
curl "https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/admin/analytics?start_date=2025-09-01&end_date=2025-10-01" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Expected Metrics:**
- User growth and retention
- API usage statistics
- Revenue and subscription metrics
- Health AI analysis counts
- Most used features
- Error rates and performance

---

### System Health

#### `GET /api/v1/admin/system-health`

**Access:** Private (Admin only)  
**Purpose:** Detailed system health metrics and diagnostics

**Authentication Required:** Yes (Admin JWT token)

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/admin/system-health \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

**Expected Response Fields:**
- `services`: Status of all microservices
- `database`: Connection pool, query performance, replication lag
- `cache`: Hit rate, memory usage, eviction rate
- `ai_services`: Provider status, response times, error rates
- `billing`: Stripe integration status
- `storage`: Disk usage, backup status
- `security`: Failed login attempts, rate limit violations

---

## 🔬 Reference Data Endpoints

### Lab Reference Values

#### `GET /api/v1/reference/labs`

**Access:** Public  
**Purpose:** Retrieve reference ranges for common lab tests

**Response Example:**
```json
[
  {
    "id": "lab_1",
    "name": "Glucose",
    "normal_range": "70-100",
    "unit": "mg/dL",
    "description": "Blood glucose level"
  },
  {
    "id": "lab_2",
    "name": "Cholesterol",
    "normal_range": "<200",
    "unit": "mg/dL",
    "description": "Total cholesterol"
  },
  {
    "id": "lab_3",
    "name": "Hemoglobin",
    "normal_range": "12-16",
    "unit": "g/dL",
    "description": "Hemoglobin level"
  }
]
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/reference/labs
```

**Use Cases:**
- Display normal ranges in health dashboards
- Validate lab result inputs
- Educational content for users
- AI analysis baseline comparisons

---

### Specific Lab Details

#### `GET /api/v1/reference/labs/{lab_id}`

**Access:** Public  
**Purpose:** Get detailed information about a specific lab test

**Path Parameters:**
- `lab_id`: Lab test identifier (e.g., "lab_1", "lab_2")

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/reference/labs/lab_1
```

**Expected Response:**
```json
{
  "id": "lab_1",
  "name": "Glucose",
  "normal_range": "70-100",
  "unit": "mg/dL",
  "description": "Blood glucose level",
  "category": "Metabolic",
  "clinical_significance": "Elevated glucose may indicate diabetes or prediabetes",
  "related_tests": ["lab_4", "lab_5"],
  "interpretation": {
    "low": "<70: Hypoglycemia",
    "normal": "70-100: Normal range",
    "high": ">100: Hyperglycemia"
  }
}
```

---

## 🏢 Vendor Integration Endpoints

### List Vendors

#### `GET /api/v1/vendors`

**Access:** Private (Authenticated users)  
**Purpose:** List available healthcare vendor integrations

**Authentication Required:** Yes (JWT or API key)

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/vendors \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Expected Response:**
```json
{
  "vendors": [
    {
      "id": "vendor_1",
      "name": "Quest Diagnostics",
      "type": "lab",
      "status": "available",
      "description": "Laboratory testing and diagnostic services"
    },
    {
      "id": "vendor_2",
      "name": "Epic Systems",
      "type": "ehr",
      "status": "available",
      "description": "Electronic health record integration"
    }
  ]
}
```

---

### Vendor Details

#### `GET /api/v1/vendors/{vendor_id}`

**Access:** Private (Authenticated users)  
**Purpose:** Get detailed information about a specific vendor

**Authentication Required:** Yes (JWT or API key)

**Path Parameters:**
- `vendor_id`: Vendor identifier

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/vendors/vendor_1 \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Expected Response:**
```json
{
  "id": "vendor_1",
  "name": "Quest Diagnostics",
  "type": "lab",
  "status": "available",
  "description": "Laboratory testing and diagnostic services",
  "capabilities": ["lab_results", "test_orders", "scheduling"],
  "auth_type": "oauth2",
  "documentation_url": "https://docs.bondmcp.com/vendors/quest",
  "support_email": "integrations@bondmcp.com"
}
```

---

### Connect to Vendor

#### `POST /api/v1/vendors/{vendor_id}/connect`

**Access:** Private (Authenticated users)  
**Purpose:** Initiate connection/authentication with a healthcare vendor

**Authentication Required:** Yes (JWT or API key)

**Path Parameters:**
- `vendor_id`: Vendor identifier

**Request Body:**
```json
{
  "credentials": {
    "username": "user@example.com",
    "password": "secure_password"
  },
  "settings": {
    "auto_sync": true,
    "sync_frequency": "daily"
  }
}
```

**Usage:**
```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/api/v1/vendors/vendor_1/connect \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "credentials": {
      "username": "user@example.com",
      "password": "secure_password"
    },
    "settings": {
      "auto_sync": true
    }
  }'
```

**Expected Response:**
```json
{
  "status": "connected",
  "vendor_id": "vendor_1",
  "connection_id": "conn_abc123",
  "message": "Successfully connected to Quest Diagnostics",
  "next_sync": "2025-10-04T00:00:00Z"
}
```

---

## 🔌 MCP Protocol Endpoints

### MCP Configuration

#### `GET /mcp/.well-known/mcp-configuration`

**Access:** Public  
**Purpose:** Retrieve MCP (Model Context Protocol) configuration for AI agent integration

**Response Example:**
```json
{
  "service": {
    "name": "BondMCP Platform",
    "description": "Comprehensive healthcare AI and MCP platform with advanced analytics, AI-powered health insights, secure data management, and professional integrations",
    "version": "2.1.0",
    "homepage": "https://www.bondmcp.com",
    "terms_url": "https://www.bondmcp.com/terms",
    "privacy_url": "https://www.bondmcp.com/privacy"
  },
  "auth": {
    "primary": [
      {
        "type": "api_key",
        "header": "X-API-Key",
        "scheme": null
      },
      {
        "type": "bearer",
        "header": null,
        "scheme": "JWT"
      }
    ]
  },
  "capabilities": [
    {
      "id": "auth.login:v1",
      "method": "POST",
      "path": "/auth/login",
      "name": "User Login",
      "description": "Authenticate user and return JWT token",
      "auth_required": false,
      "tags": ["Authentication"],
      "input_example": {
        "email": "user@example.com",
        "password": "SecurePass123!"
      },
      "output_example": {
        "access_token": "jwt_token",
        "token_type": "bearer",
        "expires_in": 86400
      },
      "rate_limit_tier": "auth",
      "deprecated": false
    }
  ],
  "rate_limits": {
    "default_window_seconds": 60,
    "default_limit": 120,
    "tiers": {
      "standard": 120,
      "auth": 60,
      "health_analysis": 100,
      "premium": 300
    }
  },
  "contact": {
    "email": "support@bondmcp.com",
    "docs": "https://docs.bondmcp.com",
    "status": "/health"
  },
  "updated_at": "2025-10-03T17:04:36.610388Z"
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration
```

**Purpose:**
- AI agent auto-discovery of API capabilities
- Automated API client generation
- Rate limit awareness
- Authentication method discovery
- Capability enumeration for LLMs

---

### MCP Manifest

#### `GET /mcp/.well-known/mcp-manifest.json`

**Access:** Public  
**Purpose:** MCP manifest with capability SHA and configuration URL

**Response Example:**
```json
{
  "version": "2.1.0",
  "capabilities_sha256": "5eb33d7ffe75bd381151237603e2ecc77572fa9e427e18b299bc38dbd834e26c",
  "generated_at": "2025-10-03T17:04:36.282621Z",
  "configuration_url": "http://t9xbkyb7mg.us-east-1.awsapprunner.com/.well-known/mcp-configuration"
}
```

**Usage:**
```bash
curl https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-manifest.json
```

**Use Cases:**
- Capability change detection via SHA comparison
- Configuration URL discovery
- Version compatibility checking
- Cache invalidation triggers

---

## 🪝 Webhook Endpoints

### Stripe Webhook Handler

#### `POST /webhooks/stripe`

**Access:** Public (Stripe signature verified)  
**Purpose:** Handle incoming Stripe webhook events for payment processing

**Authentication:** Stripe signature header (`Stripe-Signature`) verification

**Supported Events:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_method.attached`
- `payment_method.detached`

**Headers Required:**
- `Stripe-Signature`: Stripe webhook signature for verification

**Request Body:** Stripe event object (JSON)

**Usage:**
```bash
# Configured in Stripe dashboard, not called directly
# Webhook URL: https://t9xbkyb7mg.us-east-1.awsapprunner.com/webhooks/stripe
```

**Response:**
```json
{
  "received": true,
  "event_id": "evt_abc123",
  "processed": true
}
```

**Security:**
- Validates Stripe signature to prevent spoofing
- Idempotent processing (duplicate events ignored)
- Event logging for audit trail
- Automatic retry on processing failures

---

## 📊 Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or invalid |
| 402 | Payment Required | Subscription required |
| 403 | Forbidden | Insufficient permissions (admin required) |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error occurred |
| 503 | Service Unavailable | Service temporarily unavailable |

---

## 🔒 Security Notes

### Admin Endpoints
- Require admin-level JWT token
- Additional IP whitelisting recommended
- All requests logged for audit
- Rate limited to 1000 requests/minute

### MCP Endpoints
- Public for discovery purposes
- Should be cached by clients
- Check SHA before refetching configuration
- Rate limits apply (120 requests/minute)

### Webhook Endpoints
- Signature verification required
- Replay attack protection
- Idempotent processing
- Failed events are retried by provider

---

## 📈 Rate Limiting

### System Endpoints
- **Public endpoints:** 120 requests/minute
- **Admin endpoints:** 1000 requests/minute
- **MCP endpoints:** 120 requests/minute

### Rate Limit Headers
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
X-RateLimit-Reset: 1696089660
```

---

## 🔗 Related Documentation

- [API Quick Reference](./QUICK_REFERENCE.md) - Complete endpoint listing
- [CORS Configuration](./CORS_CONFIGURATION.md) - Cross-origin settings
- [Enabled Routers](./ENABLED_ROUTERS.md) - Router configuration
- [API Documentation](../api_documentation.md) - Full API docs

---

## 📞 Support

- **Documentation:** https://docs.bondmcp.com
- **API Status:** https://status.bondmcp.com
- **Support Email:** support@bondmcp.com
- **Live API:** https://t9xbkyb7mg.us-east-1.awsapprunner.com/docs
