---
description: Complete API endpoints documentation for BondMCP Healthcare Platform
---

# Endpoints

BondMCP provides a comprehensive REST API for healthcare AI interactions. All endpoints are available at `https://api.bondmcp.com`.

## Base URL
```
https://api.bondmcp.com
```

## Authentication
All API requests require authentication using Bearer tokens. See [Authentication](authentication.md) for details.

## Core Endpoints

### Health Check
**GET** `/health`

Check the API service status and version information.

**Response:**
```json
{
  "status": "healthy",
  "version": "2.1.0",
  "timestamp": "2025-08-28T10:30:00Z",
  "services": {
    "database": "operational",
    "ai_engine": "operational",
    "cache": "operational"
  }
}
```

### Ask Questions
**POST** `/ask`

Submit health-related questions to the AI system.

**Request Body:**
```json
{
  "question": "What are the benefits of vitamin D?",
  "context": "general health inquiry",
  "user_id": "optional-user-identifier"
}
```

**Response:**
```json
{
  "answer": "Vitamin D provides several important health benefits...",
  "confidence": 0.95,
  "sources": ["medical-journal-1", "clinical-study-2"],
  "timestamp": "2025-08-28T10:30:00Z"
}
```

## MCP Discovery Endpoints

### MCP Configuration
**GET** `/.well-known/mcp-configuration`

Retrieve complete MCP (Model Context Protocol) service configuration.

**Response:**
```json
{
  "name": "BondMCP Healthcare Platform",
  "version": "2.1.0",
  "description": "AI-powered healthcare information platform",
  "capabilities": {
    "tools": ["health_query", "symptom_analysis"],
    "resources": ["medical_database", "clinical_studies"],
    "prompts": ["health_assessment", "treatment_guidance"]
  },
  "endpoints": {
    "ask": "/ask",
    "health": "/health"
  }
}
```

### MCP Manifest
**GET** `/.well-known/mcp-manifest.json`

Lightweight manifest with service verification.

**Response:**
```json
{
  "name": "BondMCP",
  "version": "2.1.0",
  "mcp_version": "1.0",
  "capabilities": ["tools", "resources", "prompts"],
  "verification": {
    "signature": "sha256:abc123...",
    "timestamp": "2025-08-28T10:30:00Z"
  }
}
```

## Rate Limiting

All endpoints are subject to rate limiting:
- **Free tier**: 100 requests per hour
- **Pro tier**: 1,000 requests per hour
- **Enterprise**: Custom limits

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693228800
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is missing required parameters",
    "details": {
      "missing_fields": ["question"]
    }
  },
  "timestamp": "2025-08-28T10:30:00Z"
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `429` - Rate Limited
- `500` - Internal Server Error

## Interactive API Testing

For interactive API testing, use the [OpenAPI Specification](openapi-specification-cli-api-only.md) with tools like:
- Postman
- curl
- HTTPie
- Insomnia

## SDK Support

Use our official SDKs for easier integration:
- [Python SDK](../sdks/python/README.md)
- [JavaScript SDK](../sdks/javascript/README.md)
- [CLI Tools](../sdks/cli/README.md)
- [Go SDK](../sdks/go/README.md)

---

**Next:** [Authentication](authentication.md) | **Previous:** [API Overview](api-overview-cli-api-only.md)
