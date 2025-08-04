# Interactive API Playground

## 🎮 Live API Testing Interface

Test all BondMCP API endpoints directly from the documentation with our interactive playground.

### 🚀 Quick Start

1. **Get your API key** from the [BondMCP Dashboard](https://bondmcp.com/dashboard)
2. **Select an endpoint** from the categories below
3. **Configure parameters** using the interactive forms
4. **Execute requests** and see real-time responses

---

## 🔐 Authentication Testing

### Test User Registration
```playground
{
  "method": "POST",
  "endpoint": "/auth/register",
  "status": "⚠️ Server Error",
  "description": "Register a new user account",
  "parameters": {
    "email": {
      "type": "string",
      "required": true,
      "example": "user@example.com"
    },
    "password": {
      "type": "string",
      "required": true,
      "example": "SecurePassword123!"
    },
    "firstName": {
      "type": "string",
      "required": true,
      "example": "John"
    },
    "lastName": {
      "type": "string",
      "required": true,
      "example": "Doe"
    }
  },
  "tryItNow": true
}
```

### Test User Login
```playground
{
  "method": "POST",
  "endpoint": "/auth/login",
  "status": "⚠️ Server Error",
  "description": "Authenticate user and receive access token",
  "parameters": {
    "email": {
      "type": "string",
      "required": true,
      "example": "user@example.com"
    },
    "password": {
      "type": "string",
      "required": true,
      "example": "SecurePassword123!"
    }
  },
  "tryItNow": true
}
```

---

## 🏥 Health AI Testing

### Test Health Query
```playground
{
  "method": "POST",
  "endpoint": "/health/ask",
  "status": "✅ Working (19ms)",
  "description": "Query the health AI with medical questions",
  "headers": {
    "X-API-Key": "your-api-key-here"
  },
  "parameters": {
    "question": {
      "type": "string",
      "required": true,
      "example": "What are the symptoms of diabetes?",
      "description": "Your health-related question"
    },
    "context": {
      "type": "string",
      "required": false,
      "example": "For a 45-year-old patient with family history",
      "description": "Additional context for the query"
    },
    "detailed": {
      "type": "boolean",
      "required": false,
      "example": true,
      "description": "Request detailed response with sources"
    },
    "maxSources": {
      "type": "integer",
      "required": false,
      "example": 5,
      "description": "Maximum number of sources to include"
    }
  },
  "expectedResponse": {
    "id": "resp_12345abcde",
    "answer": "Common symptoms of diabetes include increased thirst, frequent urination, increased hunger, weight loss, fatigue, blurred vision, and slow-healing sores...",
    "trustScore": 97,
    "sources": [
      {
        "title": "American Diabetes Association",
        "url": "https://diabetes.org/diabetes/symptoms",
        "snippet": "Common symptoms of diabetes..."
      }
    ],
    "timestamp": "2025-08-04T10:15:30Z"
  },
  "tryItNow": true
}
```

### Test Health Data Analysis
```playground
{
  "method": "POST",
  "endpoint": "/health/analyze",
  "status": "✅ Working",
  "description": "Analyze health data with AI insights",
  "headers": {
    "X-API-Key": "your-api-key-here"
  },
  "parameters": {
    "data": {
      "type": "object",
      "required": true,
      "example": {
        "bloodGlucose": [
          {"value": 120, "unit": "mg/dL", "timestamp": "2025-08-04T08:00:00Z"},
          {"value": 145, "unit": "mg/dL", "timestamp": "2025-08-04T12:00:00Z"}
        ],
        "bloodPressure": [
          {"systolic": 130, "diastolic": 85, "timestamp": "2025-08-04T08:00:00Z"}
        ]
      }
    },
    "includeRecommendations": {
      "type": "boolean",
      "required": false,
      "example": true
    }
  },
  "tryItNow": true
}
```

### Test Symptom Checker
```playground
{
  "method": "POST",
  "endpoint": "/health/symptoms",
  "status": "✅ Working",
  "description": "AI-powered symptom analysis",
  "headers": {
    "X-API-Key": "your-api-key-here"
  },
  "parameters": {
    "symptoms": {
      "type": "array",
      "required": true,
      "example": ["headache", "fever", "fatigue"],
      "description": "List of symptoms"
    },
    "duration": {
      "type": "string",
      "required": false,
      "example": "3 days",
      "description": "How long symptoms have persisted"
    },
    "severity": {
      "type": "string",
      "required": false,
      "example": "moderate",
      "description": "Severity level: mild, moderate, severe"
    }
  },
  "tryItNow": true
}
```

---

## 🔑 API Management Testing

### Test API Key Generation
```playground
{
  "method": "POST",
  "endpoint": "/apikeys/generate",
  "status": "✅ Working",
  "description": "Generate a new API key",
  "headers": {
    "Authorization": "Bearer your-access-token"
  },
  "parameters": {
    "name": {
      "type": "string",
      "required": true,
      "example": "My Health App API Key",
      "description": "Descriptive name for the API key"
    },
    "permissions": {
      "type": "array",
      "required": true,
      "example": ["read", "write"],
      "description": "Permissions for this API key"
    }
  },
  "tryItNow": true
}
```

### Test API Key List
```playground
{
  "method": "GET",
  "endpoint": "/apikeys/list",
  "status": "✅ Working",
  "description": "List all your API keys",
  "headers": {
    "Authorization": "Bearer your-access-token"
  },
  "tryItNow": true
}
```

---

## 💳 Billing Testing

### Test Available Plans
```playground
{
  "method": "GET",
  "endpoint": "/billing/plans",
  "status": "✅ Working",
  "description": "Get all available subscription plans",
  "expectedResponse": {
    "plans": [
      {
        "id": "basic",
        "name": "Basic Plan",
        "price": 29,
        "currency": "USD",
        "interval": "month",
        "features": [
          "100 health queries per month",
          "Basic AI responses",
          "Email support"
        ]
      },
      {
        "id": "premium",
        "name": "Premium Plan",
        "price": 99,
        "currency": "USD",
        "interval": "month",
        "features": [
          "1000 health queries per month",
          "Advanced AI with sources",
          "Priority support",
          "Data export"
        ]
      }
    ]
  },
  "tryItNow": true
}
```

### Test Subscription Creation
```playground
{
  "method": "POST",
  "endpoint": "/billing/subscribe",
  "status": "✅ Working",
  "description": "Subscribe to a plan",
  "headers": {
    "Authorization": "Bearer your-access-token"
  },
  "parameters": {
    "planId": {
      "type": "string",
      "required": true,
      "example": "premium",
      "description": "Plan ID to subscribe to"
    },
    "paymentMethod": {
      "type": "string",
      "required": true,
      "example": "pm_1234567890",
      "description": "Stripe payment method token"
    }
  },
  "tryItNow": true
}
```

---

## 🔬 Research Integration Testing

### Test PubMed Search
```playground
{
  "method": "POST",
  "endpoint": "/research/pubmed",
  "status": "✅ Working",
  "description": "Search PubMed database for medical research",
  "headers": {
    "X-API-Key": "your-api-key-here"
  },
  "parameters": {
    "query": {
      "type": "string",
      "required": true,
      "example": "diabetes treatment 2024",
      "description": "Search query for PubMed"
    },
    "maxResults": {
      "type": "integer",
      "required": false,
      "example": 20,
      "description": "Maximum number of results"
    },
    "includeAbstracts": {
      "type": "boolean",
      "required": false,
      "example": true,
      "description": "Include article abstracts"
    }
  },
  "tryItNow": true
}
```

### Test Clinical Trials Search
```playground
{
  "method": "POST",
  "endpoint": "/research/clinical-trials",
  "status": "✅ Working",
  "description": "Search clinical trials database",
  "headers": {
    "X-API-Key": "your-api-key-here"
  },
  "parameters": {
    "condition": {
      "type": "string",
      "required": true,
      "example": "diabetes",
      "description": "Medical condition to search for"
    },
    "status": {
      "type": "string",
      "required": false,
      "example": "recruiting",
      "description": "Trial status: recruiting, active, completed"
    },
    "location": {
      "type": "string",
      "required": false,
      "example": "United States",
      "description": "Geographic location"
    }
  },
  "tryItNow": true
}
```

---

## 🔧 System Testing

### Test Health Check
```playground
{
  "method": "GET",
  "endpoint": "/health",
  "status": "✅ Working",
  "description": "Check API system health",
  "expectedResponse": {
    "status": "healthy",
    "timestamp": "2025-08-04T10:30:00Z",
    "services": {
      "database": "healthy",
      "ai_models": "healthy",
      "external_apis": "healthy"
    },
    "performance": {
      "responseTime": "19ms",
      "uptime": "99.97%"
    }
  },
  "tryItNow": true
}
```

### Test Root Endpoint
```playground
{
  "method": "GET",
  "endpoint": "/",
  "status": "✅ Working",
  "description": "API root information",
  "expectedResponse": {
    "name": "BondMCP API",
    "version": "1.0.0",
    "status": "operational",
    "uptime": "99.97%",
    "documentation": "https://docs.bondmcp.com",
    "support": "support@bondmcp.com"
  },
  "tryItNow": true
}
```

---

## 🎯 Interactive Features

### Real-Time Response Viewer
- **Syntax Highlighting**: JSON responses with color coding
- **Response Time**: Live performance metrics
- **Status Indicators**: Visual success/error states
- **Copy to Clipboard**: Easy code copying
- **History**: Previous request/response pairs

### Code Generation
Generate code snippets in multiple languages:
- **Python** (requests, httpx)
- **JavaScript** (fetch, axios)
- **Go** (net/http)
- **cURL** commands
- **Postman** collections

### Authentication Helper
- **API Key Validator**: Test your API key
- **Token Generator**: Get test tokens
- **Permission Checker**: Verify endpoint access

---

## 🔍 Advanced Testing

### Batch Testing
Test multiple endpoints simultaneously:
```playground
{
  "batchTest": {
    "endpoints": [
      "/health",
      "/billing/plans",
      "/research/sources",
      "/admin/system"
    ],
    "concurrent": true,
    "reportFormat": "detailed"
  }
}
```

### Performance Testing
Load test endpoints with configurable parameters:
```playground
{
  "loadTest": {
    "endpoint": "/health/ask",
    "requests": 100,
    "concurrency": 10,
    "duration": "30s",
    "rampUp": "5s"
  }
}
```

---

## 📊 Testing Analytics

### Success Rates
- **Overall**: 93.5% (43/46 endpoints)
- **Health AI**: 100% (8/8 endpoints)
- **Billing**: 100% (6/6 endpoints)
- **Authentication**: 50% (3/6 endpoints)

### Performance Metrics
- **Average Response Time**: 19ms
- **99th Percentile**: 72ms
- **Fastest Endpoint**: `/health` (8ms)
- **Slowest Endpoint**: `/health/imaging` (156ms)

### Error Analysis
- **Server Errors (500)**: 3 endpoints
- **Authentication Issues**: AWS Cognito integration
- **Recommended Fix**: Update environment variables

---

## 🚀 Getting Started

1. **Sign up** at [bondmcp.com](https://bondmcp.com)
2. **Get your API key** from the dashboard
3. **Start testing** with the playground above
4. **Integrate** using our SDKs and examples

## 📞 Support

Need help with the API playground?
- **Documentation**: [docs.bondmcp.com](https://docs.bondmcp.com)
- **Email**: support@bondmcp.com
- **Discord**: [BondMCP Community](https://discord.gg/bondmcp)

---

*Interactive playground powered by GitBook API Testing*  
*Last updated: August 4, 2025*

