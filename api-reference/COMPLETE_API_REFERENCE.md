# 📚 BondMCP Platform - Complete API Reference

**Version:** 2.1.0  
**Base URL:** https://t9xbkyb7mg.us-east-1.awsapprunner.com  
**Total Endpoints:** 76  
**Last Updated:** October 3, 2025

---

## 📖 Documentation Structure

This complete API reference is organized into 5 detailed guides:

### 1. [Authentication & API Keys](./AUTH_AND_API_KEYS_REFERENCE.md)
**16 endpoints** covering user registration, login, token management, and API key generation.

- User Registration & Login
- JWT Token Management (verify, refresh, logout)
- API Key Generation & Management
- User Profile Access

### 2. [Health AI Analysis](./HEALTH_AI_REFERENCE.md)
**17 endpoints** for AI-powered health analysis and data tracking.

- Fitness Activity Analysis
- Nutrition & Meal Analysis
- Bloodwork/Lab Results Analysis
- DNA/Genetic Health Insights
- Health Risk Assessment
- Vitals, Symptoms, Medications, Conditions, Allergies

### 3. [Billing & Subscriptions](./BILLING_REFERENCE.md)
**6 endpoints** for payment processing and subscription management.

- Subscription Plans ($0, $29, $99, $299/month)
- Stripe Customer Setup
- Payment Method Management
- Invoice History
- Subscription Status

### 4. [Healthcare Integration](./HEALTHCARE_INTEGRATION_REFERENCE.md)
**23 endpoints** for EMR integration and healthcare workflows.

- Patient Management
- Medical Records (EHR/EMR)
- Prescription Tracking
- Appointment Scheduling
- Digital Health Programs
- Lab Reference Data
- Vendor Integration

### 5. [System, Admin & MCP](./SYSTEM_ADMIN_MCP_REFERENCE.md)
**14 endpoints** for system monitoring, administration, and MCP protocol.

- System Status & Health Checks
- Platform Analytics
- User Administration
- AI Usage Statistics
- MCP Configuration
- Webhooks (Stripe)

---

## 🚀 Quick Start

### 1. Register & Authenticate

```bash
BASE_URL="https://t9xbkyb7mg.us-east-1.awsapprunner.com"

# Register
curl -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@company.com",
    "password": "SecurePassword123!",
    "name": "Your Name"
  }'

# Response includes access_token
# Use this token in Authorization header for all requests
```

### 2. Generate API Key

```bash
# Using JWT token from registration
curl -X POST ${BASE_URL}/api/v1/api-keys/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Production API Key"}'
```

### 3. Analyze Health Data

```bash
# Fitness analysis
curl -X POST ${BASE_URL}/health/fitness \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "activity": "running",
    "duration": 45,
    "intensity": "high"
  }'

# Returns AI-powered recommendations and calorie estimates
```

### 4. Check Subscription

```bash
curl -X GET ${BASE_URL}/billing/subscription \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔐 Authentication

### Methods

**Bearer Token (JWT)** - Required for most endpoints
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**API Key** - Alternative for programmatic access
```
X-API-Key: bcp_your_api_key_here
```

### Token Lifecycle
- **Expiration:** 24 hours
- **Refresh:** Use `/auth/refresh` to get new token
- **Revocation:** Use `/auth/logout` to blacklist token

---

## 📊 Subscription Tiers

| Plan | Price | API Calls/Month | Features |
|------|-------|-----------------|----------|
| **Free** | $0 | 100 | Basic health endpoints, community support |
| **Basic** | $29 | 1,000 | All health endpoints, email support |
| **Premium** | $99 | 10,000 | Lab analysis, priority support, webhooks |
| **Enterprise** | $299 | Unlimited | Custom integrations, 24/7 support, dedicated manager |

---

## 🎯 Common Use Cases

### Healthcare App Integration
```python
# Example: LangGraph integration
from langchain_core.tools import tool
import requests

@tool
def analyze_patient_health(activity: str, duration: int) -> dict:
    """Analyze patient fitness using BondMCP"""
    response = requests.post(
        "https://t9xbkyb7mg.us-east-1.awsapprunner.com/health/fitness",
        headers={"Authorization": f"Bearer {token}"},
        json={"activity": activity, "duration": duration, "intensity": "moderate"}
    )
    return response.json()
```

### Patient Dashboard
- Register user → `/auth/register`
- Get patient data → `/api/v1/patients`
- View medical records → `/api/v1/medical-records`
- Schedule appointment → `/api/v1/appointments`

### AI Health Coach
- Track vitals → `/health/vitals`
- Analyze meals → `/health/nutrition`
- Check symptoms → `/health/symptoms`
- Get recommendations → AI analysis endpoints

---

## 🔗 Additional Resources

- **Interactive API Docs:** https://t9xbkyb7mg.us-east-1.awsapprunner.com/docs
- **OpenAPI Specification:** https://t9xbkyb7mg.us-east-1.awsapprunner.com/openapi.json
- **MCP Configuration:** https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration

---

## ⚠️ Known Limitations

1. **Endpoint Duplication** - Some endpoints exist in multiple versions (v1, v2, root). Use v1 versions when available.
2. **Mock Data** - Some endpoints (patients, appointments) return mock data for testing.
3. **Consensus Mode** - Multi-LLM consensus system deployed but not yet activated in endpoints.
4. **Payment Methods** - Adding cards requires Stripe.js frontend (cannot be done via API alone).

---

## 📞 Support

- **Documentation Issues:** Open issue at github.com/bondmcp/docs
- **API Bugs:** Open issue at github.com/auroracapital/bondmcp-platform
- **Email:** info@auroracapital.nl

---

**Last Updated:** October 3, 2025  
**API Version:** 2.1.0  
**Status:** ✅ Production Ready
