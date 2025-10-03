# BondMCP Developer Documentation

**Professional Health AI APIs for Healthcare Applications**

BondMCP provides enterprise-grade Health AI APIs that enable developers to build intelligent healthcare applications. Our platform offers 5 specialized endpoints for clinical decision support, medication safety, symptom assessment, and more.

---

## 🚀 Quick Start

Get started in 5 minutes:

1. **Sign up** at [bondmcp.com](https://bondmcp.com)
2. **Get your API key** from the dashboard
3. **Make your first request**:

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/health-ai/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Analyze cardiovascular risk for a 45-year-old patient",
    "analysis_type": "risk_assessment"
  }'
```

👉 **[Read the full Quickstart Guide](getting-started/quickstart-guide.md)**

---

## 🏥 What is BondMCP?

BondMCP is a developer platform that brings advanced AI capabilities to healthcare applications through simple REST APIs and MCP server integration.

### Key Features

✅ **5 Health AI Endpoints**
- Health Risk Analysis
- Medication Interaction Checking
- Symptom Assessment & Triage
- Treatment Recommendations
- Clinical Data Extraction

✅ **Multiple Integration Methods**
- REST API (curl, Python, JavaScript)
- MCP Server (Claude Desktop compatible)
- Python SDK & LangChain integration

✅ **Production-Ready**
- 99.9% uptime SLA (Enterprise plan)
- HIPAA-compliant architecture
- Rate limiting and cost controls
- Comprehensive error handling

✅ **Developer-Friendly**
- Pay-as-you-go pricing
- Clear documentation with examples
- Fast API response times (<500ms average)
- Responsive support team

---

## 📚 Documentation

### Getting Started
- [Quickstart Guide](getting-started/quickstart-guide.md) - Get up and running in 5 minutes
- [Authentication](getting-started/authentication.md) - API keys, JWT tokens, and security
- [Pricing & Plans](getting-started/pricing-and-plans.md) - Pricing tiers and rate limits

### API Reference
- [Health AI APIs](api-reference/health-ai-apis.md) - Complete API documentation with examples

### Integration Guides
- [Python SDK Example](integration-guides/python-sdk-example.md) - Python client with LangChain
- [MCP Server Setup](integration-guides/mcp-server-setup.md) - Connect Claude Desktop to BondMCP

---

## 💡 Use Cases

### Clinical Decision Support
Build AI assistants that help clinicians make evidence-based decisions:
```python
risk_analysis = client.analyze_risk({
    "age": 55,
    "bmi": 28.5,
    "blood_pressure": "145/90",
    "smoking": True
}, analysis_type="cardiovascular")
```

### Medication Safety Checking
Prevent adverse drug interactions in e-prescribing systems:
```python
interactions = client.check_medications([
    {"name": "Warfarin", "dosage": "5mg"},
    {"name": "Aspirin", "dosage": "81mg"}
])
```

### Symptom Triage
Power telehealth platforms with intelligent symptom assessment:
```python
assessment = client.assess_symptoms([
    {"description": "chest pain", "severity": 8},
    {"description": "shortness of breath", "severity": 7}
], age=45)
```

### Clinical Documentation
Extract structured data from unstructured clinical notes:
```python
extracted = client.extract_clinical_data(
    "62 y/o male with progressive dyspnea. PMH: CAD, HTN. Meds: aspirin, atorvastatin..."
)
```

---

## 💰 Pricing

| Plan | Monthly Cost | Included Credits | Rate Limit |
|------|--------------|------------------|------------|
| **Free** | $0 | $5 | 100 req/day |
| **Starter** | $29 | $50 | 1,000 req/day |
| **Professional** | $99 | $200 | 10,000 req/day |
| **Enterprise** | $299 | $500 | Unlimited |

**API Costs**: $0.03 - $0.08 per request depending on endpoint

👉 **[View detailed pricing](getting-started/pricing-and-plans.md)**

---

## 🔌 Integration Options

### REST API
Use our REST API with any programming language:
- [cURL examples](getting-started/quickstart-guide.md#step-3-make-your-first-request)
- [Python examples](integration-guides/python-sdk-example.md)
- JavaScript/TypeScript examples (coming soon)

### MCP Server
Connect AI assistants like Claude Desktop to BondMCP:
```json
{
  "mcpServers": {
    "bondmcp": {
      "url": "https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/.well-known/mcp-configuration",
      "apiKey": "YOUR_API_KEY"
    }
  }
}
```

👉 **[MCP Setup Guide](integration-guides/mcp-server-setup.md)**

### Python SDK
Install our Python client:
```bash
pip install bondmcp-sdk
```

👉 **[Python SDK Documentation](integration-guides/python-sdk-example.md)**

---

## 🛠️ API Endpoints

| Endpoint | Description | Cost |
|----------|-------------|------|
| `POST /health-ai/risk-analysis` | Analyze patient health risks | $0.05/req |
| `POST /health-ai/medication-check` | Check drug interactions | $0.03/req |
| `POST /health-ai/symptom-assessment` | Assess symptoms & triage | $0.04/req |
| `POST /health-ai/treatment-recommendations` | Generate treatment plans | $0.06/req |
| `POST /health-ai/data-extraction` | Extract structured data | $0.08/req |

**Base URL**: `https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp`

👉 **[Full API Reference](api-reference/health-ai-apis.md)**

---

## 📖 Example: Complete Workflow

```python
from bondmcp import BondMCPClient

# Initialize client
client = BondMCPClient(api_key="your_api_key")

# Step 1: Assess symptoms
symptoms = client.assess_symptoms([
    {"description": "chest pain", "severity": 8, "duration": "2 hours"}
], age=55, gender="male")

print(f"Urgency: {symptoms['urgency']}")  # Output: "high"

# Step 2: Analyze risk
risk = client.analyze_risk({
    "age": 55,
    "gender": "male",
    "bmi": 29.0,
    "blood_pressure": "145/90",
    "smoking": True
}, analysis_type="cardiovascular")

print(f"Risk Level: {risk['risk_level']}")  # Output: "high"

# Step 3: Get recommendations
for rec in risk['recommendations']:
    print(f"- {rec}")

# Output:
# - Schedule immediate cardiology consultation
# - Start aspirin 81mg daily
# - Monitor blood pressure twice daily
```

---

## 🔒 Security & Compliance

- **HIPAA Compliant**: Architecture supports HIPAA-compliant deployments
- **Data Privacy**: Patient data is not stored or used for training
- **Encryption**: All data encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Authentication**: JWT tokens and API key authentication
- **Audit Logs**: Complete audit trail of all API requests (Enterprise plan)

---

## 📞 Support

### Get Help

- **Email**: support@bondmcp.com
- **Documentation**: https://docs.bondmcp.com
- **Status Page**: https://status.bondmcp.com
- **Community**: [Discord](https://discord.gg/bondmcp) (coming soon)

### Sales & Enterprise

- **Email**: sales@bondmcp.com
- **Phone**: Available for Enterprise customers
- **Demo**: [Schedule a demo](https://bondmcp.com/demo)

### Response Times

| Plan | Support Channel | Response Time |
|------|----------------|---------------|
| Free | Community | 48-72 hours |
| Starter | Email | 24 hours |
| Professional | Priority Email | 4 hours |
| Enterprise | Phone + Slack | 1 hour |

---

## 🚦 Status & Uptime

**Current Status**: ✅ All Systems Operational

**Uptime** (Last 90 days):
- API: 99.97%
- MCP Server: 99.95%

Check real-time status: [status.bondmcp.com](https://status.bondmcp.com)

---

## 🆕 What's New

**v1.0.0** (December 2024)
- 🎉 Official public launch
- ✨ MCP server integration
- 🚀 5 Health AI endpoints
- 📊 Enhanced dashboard with usage analytics
- 🔐 API key management improvements

[View full changelog](https://bondmcp.com/changelog)

---

## 📜 License & Terms

- **API Terms**: [terms.bondmcp.com](https://bondmcp.com/terms)
- **Privacy Policy**: [privacy.bondmcp.com](https://bondmcp.com/privacy)
- **SLA**: [sla.bondmcp.com](https://bondmcp.com/sla)

---

## 🌟 Ready to Build?

1. [Sign up for free](https://bondmcp.com/signup)
2. [Read the Quickstart Guide](getting-started/quickstart-guide.md)
3. [Explore API Reference](api-reference/health-ai-apis.md)
4. [Join our community](https://discord.gg/bondmcp)

**Questions?** Email us at support@bondmcp.com

---

*Built with ❤️ for healthcare developers*
