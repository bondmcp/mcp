# BondMCP API Overview

This document provides an overview of the BondMCP public API for developers integrating healthcare AI capabilities into their applications.

**Base URL**: `https://api.bondmcp.com`

**Authentication**: API Key required in header: `X-API-Key: your-api-key`

## Core Endpoints

### Health Chat
Query the AI with health-related questions and receive medically-informed responses.

```
POST /api/v1/ask
```

**Request Body**:
```json
{
  "message": "What are the symptoms of high blood pressure?",
  "context": "general-health"
}
```

**Response**:
```json
{
  "answer": "High blood pressure symptoms include...",
  "confidence": 0.96,
  "sources": ["AHA", "Mayo Clinic"],
  "timestamp": "2024-06-04T04:45:00Z"
}
```

### Health Data Analysis
Analyze health data and receive AI-powered insights.

```
POST /api/v1/analyze
```

**Request Body**:
```json
{
  "data_type": "lab_results",
  "data": {
    "glucose": 120,
    "cholesterol": 180
  }
}
```

**Response**:
```json
{
  "analysis": "Your glucose levels are slightly elevated...",
  "recommendations": ["Consider reducing sugar intake"],
  "risk_factors": ["diabetes"],
  "confidence": 0.94
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
  "timestamp": "2024-06-04T04:45:00Z"
}
```

## Getting Started

1. Sign up at [bondmcp.com](https://bondmcp.com)
2. Get your API key from the dashboard
3. Install one of our SDKs or use the REST API directly
4. Start building healthcare AI applications

For complete API documentation with interactive examples, visit [docs.bondmcp.com](https://docs.bondmcp.com)

---

**Disclaimer**: BondMCP is for informational purposes only and does not constitute medical advice.
