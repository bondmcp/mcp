# BondMCP API Overview

This document provides an overview of the BondMCP public API for developers integrating healthcare AI capabilities into their applications.

**Base URL**: `https://api.bondmcp.com`  
**Authentication**: API Key required in header: `X-API-Key: your-api-key`

## Core Endpoints

### Health Chat

Query the AI with health-related questions and receive medically-informed responses with consensus verification.

```
POST /api/v1/ask
```

**Request Body**:

```json
{
  "question": "What are the symptoms of diabetes?",
  "context": "For a 45-year-old patient with family history",
  "detailed": true,
  "maxSources": 5
}
```

**Response**:

```json
{
  "id": "resp_12345abcde",
  "answer": "Common symptoms of diabetes include increased thirst, frequent urination...",
  "trustScore": 97,
  "sources": [
    {
      "title": "American Diabetes Association",
      "url": "https://diabetes.org/diabetes/symptoms",
      "snippet": "Common symptoms of diabetes..."
    }
  ],
  "timestamp": "2025-06-13T10:15:30Z"
}
```

### Health Data Analysis

Analyze health data and receive insights with consensus verification.

```
POST /api/v1/health-data/analyze
```

**Request Body**:

```json
{
  "data": {
    "bloodGlucose": [
      { "value": 120, "unit": "mg/dL", "timestamp": "2025-06-10T08:00:00Z" },
      { "value": 145, "unit": "mg/dL", "timestamp": "2025-06-10T12:00:00Z" }
    ],
    "bloodPressure": [
      { "systolic": 130, "diastolic": 85, "timestamp": "2025-06-10T08:00:00Z" }
    ],
    "medications": [
      { "name": "Metformin", "dosage": "500mg", "frequency": "twice daily" }
    ]
  },
  "detailed": true,
  "includeRecommendations": true
}
```

**Response**:

```json
{
  "id": "analysis_67890fghij",
  "analysis": {
    "bloodGlucose": {
      "average": 132.5,
      "status": "elevated",
      "interpretation": "Blood glucose levels are slightly elevated..."
    },
    "bloodPressure": {
      "status": "elevated",
      "interpretation": "Blood pressure is slightly elevated..."
    }
  },
  "trustScore": 95,
  "recommendations": [
    {
      "category": "Lifestyle",
      "text": "Consider increasing physical activity to help lower blood glucose levels.",
      "priority": "medium"
    },
    {
      "category": "Monitoring",
      "text": "Monitor blood glucose more frequently to establish patterns.",
      "priority": "high"
    }
  ],
  "timestamp": "2025-06-13T10:20:15Z"
}
```

### Trust Verification

Get detailed trust score information for a previous response.

```
GET /api/v1/trust-score/{responseId}
```

**Parameters**:

- `responseId` (path): ID of the response to get the trust score for

**Response**:

```json
{
  "responseId": "resp_12345abcde",
  "score": 97,
  "breakdown": {
    "consensus": 98,
    "sourceReliability": 95,
    "clinicalValidation": 97
  },
  "models": ["GPT-4", "Claude", "Gemini", "MedicalLLM-v2"],
  "timestamp": "2025-06-13T10:15:35Z"
}
```

### User Management

Create and manage user accounts.

```
POST /api/v1/users
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "organization": "Medical Center Inc."
}
```

**Response**:

```json
{
  "id": "user_12345abcde",
  "email": "user@example.com",
  "name": "John Doe",
  "organization": "Medical Center Inc.",
  "createdAt": "2025-06-13T10:25:00Z"
}
```

### API Keys

Create and manage API keys for authentication.

```
POST /api/v1/api-keys
```

**Request Body**:

```json
{
  "name": "New Project Key",
  "expiresIn": 90
}
```

**Response**:

```json
{
  "id": "key_abcde12345",
  "name": "New Project Key",
  "key": "pk_abcde12345_FULL_KEY_ONLY_SHOWN_ONCE",
  "prefix": "pk_abcde",
  "createdAt": "2025-06-13T10:30:00Z",
  "expiresAt": "2025-09-11T10:30:00Z"
}
```

### Medical Knowledge

Search the medical knowledge base.

```
GET /api/v1/medical-knowledge/search
```

**Parameters**:

- `query` (query): Search query
- `limit` (query): Maximum number of results to return (default: 10)
- `offset` (query): Number of results to skip (default: 0)

**Response**:

```json
{
  "results": [
    {
      "id": "kb_12345abcde",
      "title": "Type 2 Diabetes: Symptoms and Diagnosis",
      "snippet": "Type 2 diabetes is characterized by insulin resistance...",
      "source": "American Diabetes Association",
      "url": "https://diabetes.org/diabetes/type-2",
      "trustScore": 98
    }
  ],
  "total": 156,
  "limit": 10,
  "offset": 0
}
```

## Rate Limits

- Free tier: 100 requests/day
- Pro tier: 10,000 requests/day
- Enterprise: Custom limits

## Error Handling

All errors return standard HTTP status codes with JSON error details:

```json
{
  "error": "Invalid API key",
  "code": "INVALID_AUTH",
  "timestamp": "2025-06-13T10:45:00Z"
}
```

## Getting Started

1. Sign up at [bondmcp.com](https://bondmcp.com)
2. Get your API key from the dashboard
3. Install one of our SDKs or use the REST API directly
4. Start building healthcare AI applications

For complete API documentation with interactive examples, visit [docs.bondmcp.com](https://docs.bondmcp.com) or see the [ENDPOINTS.md](../api-reference/endpoints/README.md) file for detailed endpoint documentation.

---

**Disclaimer**: BondMCP is for informational purposes only and does not constitute medical advice.
