# API Overview

Welcome to the BondMCP API - the most comprehensive health AI API available. Our RESTful API provides access to advanced health intelligence, lab analysis, nutrition guidance, and more.

## 🌐 Base URL

```
https://api.bondmcp.com
```

All API requests must be made over HTTPS. HTTP requests will be redirected to HTTPS.

## 🔐 Authentication

BondMCP uses API key authentication. Include your API key in the Authorization header:

```bash
Authorization: Bearer YOUR_API_KEY
```

### Getting Your API Key

1. **Web Dashboard**: Visit [app.bondmcp.com](https://app.bondmcp.com) → Settings → API Keys
2. **CLI**: Run `bondmcp keys create --name "my-app"`
3. **Mobile App**: Go to Settings → Developer → API Keys

## 📊 API Capabilities

### Core Health AI
- **Health Q&A**: Natural language health questions and answers
- **Symptom Analysis**: AI-powered symptom checking and triage
- **Health Risk Assessment**: Comprehensive health risk evaluation
- **Medical Information**: Evidence-based medical information lookup

### Lab & Diagnostics
- **Lab Result Analysis**: AI interpretation of blood work and lab tests
- **Biomarker Tracking**: Monitor health biomarkers over time
- **Reference Ranges**: Compare results to age/gender-specific ranges
- **Trend Analysis**: Identify patterns in lab results

### Nutrition & Lifestyle
- **Nutrition Analysis**: Detailed nutritional breakdown of foods and meals
- **Supplement Recommendations**: Evidence-based supplement advice
- **Diet Planning**: Personalized meal planning and dietary guidance
- **Calorie Tracking**: Advanced calorie and macronutrient tracking

### Medication & Interactions
- **Drug Information**: Comprehensive medication information
- **Interaction Checking**: Drug-drug and drug-food interactions
- **Side Effect Analysis**: Potential side effects and contraindications
- **Dosage Guidance**: Appropriate dosing recommendations

## 🚀 Quick Start Example

Here's a simple example to get you started:

```bash
curl -X POST https://api.bondmcp.com/ask \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the health benefits of omega-3 fatty acids?",
    "context": {
      "user_age": 35,
      "user_gender": "female"
    }
  }'
```

**Response:**
```json
{
  "answer": "Omega-3 fatty acids provide numerous health benefits including...",
  "confidence": 0.95,
  "sources": [
    {
      "title": "Omega-3 Fatty Acids and Health",
      "url": "https://pubmed.ncbi.nlm.nih.gov/...",
      "type": "peer_reviewed"
    }
  ],
  "related_topics": ["heart health", "brain function", "inflammation"]
}
```

## 📋 Core Endpoints

### Health Q&A
```http
POST /ask
```
Ask natural language health questions and get evidence-based answers.

### Lab Analysis
```http
POST /labs/interpret
```
Upload lab results for AI-powered interpretation and insights.

### Nutrition Analysis
```http
POST /nutrition/analyze
```
Analyze foods, meals, or dietary patterns for nutritional insights.

### Supplement Recommendations
```http
POST /supplements/recommend
```
Get personalized supplement recommendations based on health goals.

### Symptom Checking
```http
POST /symptoms/check
```
Analyze symptoms and get potential causes and recommendations.

### Medication Information
```http
POST /medications/check
```
Check drug interactions, side effects, and dosing information.

### Health Assessment
```http
POST /health/assess
```
Comprehensive health risk assessment based on multiple factors.

## 📈 Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  },
  "metadata": {
    "request_id": "req_1234567890",
    "timestamp": "2025-01-28T10:30:00Z",
    "processing_time_ms": 245,
    "api_version": "2.1.0"
  }
}
```

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is missing required parameters",
    "details": {
      "missing_fields": ["question"]
    }
  },
  "metadata": {
    "request_id": "req_1234567890",
    "timestamp": "2025-01-28T10:30:00Z"
  }
}
```

## 🔒 Security Features

### Data Protection
- **End-to-end encryption** for all API communications
- **Zero-knowledge architecture** - we cannot access your health data
- **HIPAA compliance** for healthcare data protection
- **SOC 2 Type II** certified security controls

### Access Control
- **API key rotation** - regularly rotate your API keys
- **Rate limiting** - automatic request throttling
- **IP whitelisting** - restrict access to specific IP addresses
- **Audit logging** - complete audit trail of all API calls

## 📊 Rate Limits

Rate limits vary by subscription tier:

### Free Tier
- **100 requests per month**
- **10 requests per minute**
- **Basic endpoints only**

### Pro Tier ($29/month)
- **5,000 requests per month**
- **100 requests per minute**
- **All endpoints available**

### Enterprise (Custom)
- **Unlimited requests**
- **Custom rate limits**
- **Priority processing**
- **SLA guarantees**

## 🌍 Global Availability

Our API is available globally with data centers in:
- **North America**: US East (Virginia), US West (California)
- **Europe**: EU West (Ireland), EU Central (Frankfurt)
- **Asia Pacific**: Asia Southeast (Singapore), Asia Northeast (Tokyo)

## 📚 SDK Libraries

We provide official SDKs for popular programming languages:

- **Python**: `pip install bondmcp-python`
- **JavaScript/Node.js**: `npm install @bondmcp/sdk`
- **Go**: `go get github.com/bondmcp/go-sdk`
- **CLI**: `pip install bondmcp-cli`

## 🆘 Support & Resources

- **API Documentation**: Complete endpoint reference
- **Code Examples**: Sample implementations in multiple languages
- **Postman Collection**: Ready-to-use API collection
- **Status Page**: Real-time API status and uptime
- **Developer Support**: Technical support for integration questions

## 🔄 API Versioning

We use semantic versioning for our API:
- **Current Version**: 2.1.0
- **Supported Versions**: 2.0.x, 2.1.x
- **Deprecation Policy**: 12 months notice for breaking changes

---

**Ready to build amazing health applications?** Explore our [detailed endpoint documentation](endpoints.md) and start integrating BondMCP's powerful health AI into your applications! 🚀
