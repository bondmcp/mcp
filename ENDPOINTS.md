# BondMCP API Endpoints

This document provides a comprehensive list of all available BondMCP API endpoints. The information is automatically generated from our OpenAPI specification.

## Base URL

All endpoints are relative to: `https://api.bondmcp.com`

## Authentication

Most endpoints require authentication using an API key. Include your API key in the request header:

```
X-API-Key: your-api-key
```

## Available Endpoints

### Health Chat

#### POST /api/v1/ask

Ask a health-related question and receive a verified response with consensus from multiple AI models.

**Request Body:**
```json
{
  "question": "What are the symptoms of diabetes?",
  "context": "For a 45-year-old patient with family history",
  "detailed": true,
  "maxSources": 5
}
```

**Response:**
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

#### POST /api/v1/health-data/analyze

Analyze health data and receive insights with consensus verification.

**Request Body:**
```json
{
  "data": {
    "bloodGlucose": [
      {"value": 120, "unit": "mg/dL", "timestamp": "2025-06-10T08:00:00Z"},
      {"value": 145, "unit": "mg/dL", "timestamp": "2025-06-10T12:00:00Z"}
    ],
    "bloodPressure": [
      {"systolic": 130, "diastolic": 85, "timestamp": "2025-06-10T08:00:00Z"}
    ],
    "medications": [
      {"name": "Metformin", "dosage": "500mg", "frequency": "twice daily"}
    ]
  },
  "detailed": true,
  "includeRecommendations": true
}
```

**Response:**
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

#### GET /api/v1/trust-score/{responseId}

Get detailed trust score information for a previous response.

**Parameters:**
- `responseId` (path): ID of the response to get the trust score for

**Response:**
```json
{
  "responseId": "resp_12345abcde",
  "score": 97,
  "breakdown": {
    "consensus": 98,
    "sourceReliability": 95,
    "clinicalValidation": 97
  },
  "models": [
    "GPT-4",
    "Claude",
    "Gemini",
    "MedicalLLM-v2"
  ],
  "timestamp": "2025-06-13T10:15:35Z"
}
```

### User Management

#### POST /api/v1/users

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "organization": "Medical Center Inc."
}
```

**Response:**
```json
{
  "id": "user_12345abcde",
  "email": "user@example.com",
  "name": "John Doe",
  "organization": "Medical Center Inc.",
  "createdAt": "2025-06-13T10:25:00Z"
}
```

#### GET /api/v1/users/me

Get the current user's profile information.

**Response:**
```json
{
  "id": "user_12345abcde",
  "email": "user@example.com",
  "name": "John Doe",
  "organization": "Medical Center Inc.",
  "createdAt": "2025-06-13T10:25:00Z",
  "subscription": {
    "plan": "professional",
    "status": "active",
    "expiresAt": "2026-06-13T10:25:00Z"
  }
}
```

### API Keys

#### GET /api/v1/api-keys

List all API keys for the current user.

**Response:**
```json
{
  "apiKeys": [
    {
      "id": "key_12345abcde",
      "name": "Production Key",
      "prefix": "pk_1234",
      "createdAt": "2025-06-01T10:00:00Z",
      "lastUsed": "2025-06-13T09:45:00Z"
    },
    {
      "id": "key_67890fghij",
      "name": "Development Key",
      "prefix": "pk_5678",
      "createdAt": "2025-06-05T14:30:00Z",
      "lastUsed": "2025-06-12T16:20:00Z"
    }
  ]
}
```

#### POST /api/v1/api-keys

Create a new API key.

**Request Body:**
```json
{
  "name": "New Project Key",
  "expiresIn": 90 // days
}
```

**Response:**
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

#### GET /api/v1/medical-knowledge/search

Search medical knowledge base.

**Parameters:**
- `query` (query): Search query
- `limit` (query): Maximum number of results to return (default: 10)
- `offset` (query): Number of results to skip (default: 0)

**Response:**
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
    },
    {
      "id": "kb_67890fghij",
      "title": "Managing Diabetes: Diet and Exercise",
      "snippet": "Diet and exercise play crucial roles in managing diabetes...",
      "source": "Mayo Clinic",
      "url": "https://mayoclinic.org/diabetes-management",
      "trustScore": 97
    }
  ],
  "total": 156,
  "limit": 10,
  "offset": 0
}
```

### Usage Statistics

#### GET /api/v1/usage

Get usage statistics for the current user.

**Parameters:**
- `startDate` (query): Start date for usage statistics (format: YYYY-MM-DD)
- `endDate` (query): End date for usage statistics (format: YYYY-MM-DD)

**Response:**
```json
{
  "totalCalls": 1250,
  "totalCost": 625.50,
  "byEndpoint": {
    "/api/v1/ask": {
      "calls": 850,
      "cost": 425.00
    },
    "/api/v1/health-data/analyze": {
      "calls": 400,
      "cost": 200.50
    }
  },
  "byDay": [
    {
      "date": "2025-06-01",
      "calls": 42,
      "cost": 21.00
    },
    {
      "date": "2025-06-02",
      "calls": 38,
      "cost": 19.00
    }
  ]
}
```

### Webhooks

#### POST /api/v1/webhooks

Create a new webhook subscription.

**Request Body:**
```json
{
  "url": "https://example.com/webhook",
  "events": ["response.created", "analysis.completed"],
  "secret": "whsec_your_webhook_secret"
}
```

**Response:**
```json
{
  "id": "wh_12345abcde",
  "url": "https://example.com/webhook",
  "events": ["response.created", "analysis.completed"],
  "status": "active",
  "createdAt": "2025-06-13T10:35:00Z"
}
```

#### GET /api/v1/webhooks

List all webhook subscriptions.

**Response:**
```json
{
  "webhooks": [
    {
      "id": "wh_12345abcde",
      "url": "https://example.com/webhook",
      "events": ["response.created", "analysis.completed"],
      "status": "active",
      "createdAt": "2025-06-13T10:35:00Z"
    }
  ]
}
```

### Health Check

#### GET /api/v1/health

Check the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.5.2",
  "uptime": 1209600, // seconds (14 days)
  "services": {
    "database": "healthy",
    "cache": "healthy",
    "ai": "healthy"
  }
}
```

## Contact Information

For support or questions about the API:

**US Office:**  
111 NE 1st St, STE 89079, 33132, Miami, Florida  
Phone: +1 855 512 5310

**Hong Kong Office:**  
144-151 Connaught Road West, Unit 4005, 40/F, Sai Ying Pun, Hong Kong

**Company:** Lifecycle Innovations Limited (Brand: BondMCP)
