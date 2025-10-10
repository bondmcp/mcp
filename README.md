# 🏥 BondMCP Platform - Developer Documentation

**The Health AI API Platform for Developers**

---

## 🚀 Get Started in 5 Minutes

```bash
# 1. Sign up
curl -X POST https://api.bondmcp.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@company.com","password":"YourPass123!","name":"Your Name"}'

# 2. Use your access token to generate an API key
curl -X POST https://api.bondmcp.com/api-keys/generate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Production Key"}'

# 3. Make your first AI health analysis
curl -X POST https://api.bondmcp.com/health/fitness \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"activity":"running","duration":30,"intensity":"moderate"}'
```

**[Full Quickstart Guide →](./getting-started/quickstart-guide.md)**

---

## 📚 Documentation

### Getting Started
- [Quickstart Guide](./getting-started/quickstart-guide.md) - 5-minute integration
- [Authentication](./getting-started/authentication.md) - JWT tokens & API keys
- [Pricing & Plans](./getting-started/pricing-and-plans.md) - $0 to $299/month

### API Reference
- [Health AI APIs](./api-reference/health-ai-apis.md) - 5 AI-powered endpoints
- [Complete API Reference](./api-reference/COMPLETE_API_REFERENCE.md) - All 76 endpoints
- [Multi-LLM Consensus](./api-reference/CONSENSUS_SYSTEM.md) - How our AI works

### Integration Guides
- [Python SDK](./integration-guides/python-sdk-example.md) - LangChain/LangGraph ready
- [MCP Server Setup](./integration-guides/mcp-server-setup.md) - Claude Desktop integration

### Platform
- [Production Status](./PRODUCTION_STATUS.md) - Live platform status
- [Deployment Guide](./deployment/PRODUCTION_DEPLOYMENT_GUIDE.md) - Technical details

---

## 🌐 Live Platform

### API & Services
- **API Endpoint:** https://api.bondmcp.com
- **Dashboard:** https://app.bondmcp.com
- **Interactive Docs:** https://api.bondmcp.com/docs
- **OpenAPI Spec:** https://api.bondmcp.com/openapi.json
- **MCP Server:** https://api.bondmcp.com/mcp/

### Status
- **Uptime:** 99.9%
- **Response Time:** <200ms avg
- **Version:** 2.1.0
- **Health:** https://api.bondmcp.com/health

---

## 💡 Key Features

### Health AI Analysis
- **Fitness Activity** - Calorie burn estimates and workout recommendations
- **Nutrition** - Meal analysis and dietary guidance
- **Bloodwork** - Lab result interpretation
- **DNA/Genetics** - Health predisposition analysis
- **Risk Assessment** - Comprehensive health risk scoring

### Multi-LLM Consensus
- Combines Claude 3.5, GPT-4o, and Groq Llama 3.3
- Eliminates AI hallucinations
- Provides trust certificates
- 85%+ consensus threshold

### Developer Tools
- RESTful API with JWT authentication
- API key management
- MCP server for Claude Desktop
- Webhook support
- Rate limiting by tier

---

## 💰 Pricing

| Plan | Price | API Calls | Features |
|------|-------|-----------|----------|
| **Free** | $0/mo | 100/month | Basic endpoints, community support |
| **Basic** | $29/mo | 1,000/month | All endpoints, email support |
| **Premium** | $99/mo | 10,000/month | Priority support, webhooks |
| **Enterprise** | $299/mo | Unlimited | 24/7 support, custom SLA |

**[View detailed pricing →](./getting-started/pricing-and-plans.md)**

---

## 🔐 Security & Compliance

- **Authentication:** JWT tokens with 24-hour expiration
- **Encryption:** SSL/TLS for all connections
- **Data Storage:** Encrypted PostgreSQL database
- **Token Revocation:** Logout blacklists tokens
- **Rate Limiting:** Tier-based API limits

---

## 🛠️ SDKs & Integrations

### Python
```python
import requests

def analyze_fitness(activity, duration):
    response = requests.post(
        "https://api.bondmcp.com/health/fitness",
        headers={"Authorization": f"Bearer {your_token}"},
        json={"activity": activity, "duration": duration, "intensity": "moderate"}
    )
    return response.json()
```

**[Full Python SDK Guide →](./integration-guides/python-sdk-example.md)**

### MCP (Claude Desktop)
```json
{
  "mcpServers": {
    "bondmcp": {
      "url": "https://api.bondmcp.com/mcp/",
      "apiKey": "YOUR_API_KEY"
    }
  }
}
```

**[MCP Setup Guide →](./integration-guides/mcp-server-setup.md)**

---

## 📞 Support

- **Email:** info@auroracapital.nl
- **Status Page:** https://api.bondmcp.com/health
- **API Issues:** Check our health endpoint first

---

## 🚀 Quick Links

- [Sign Up](https://app.bondmcp.com/signup) - Create free account
- [API Playground](https://api.bondmcp.com/docs) - Interactive testing
- [View Pricing](./getting-started/pricing-and-plans.md) - Plans & features
- [Quickstart](./getting-started/quickstart-guide.md) - 5-minute integration

---

**BondMCP Platform** - Reliable Health AI for Developers  
Version 2.1.0 | Production Ready | [View Status](./PRODUCTION_STATUS.md)
