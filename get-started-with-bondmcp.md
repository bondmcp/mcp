# Get started with BondMCP

## 🚀 Power your app with trusted health answers (LIVE & OPERATIONAL)

BondMCP is a **comprehensive health AI platform** that provides validated medical advice through a sophisticated multi-model consensus system. The platform is **fully operational** and accessible via a comprehensive REST API with 52 endpoints across 11 categories.

> **🎉 LIVE STATUS**: The BondMCP platform is **fully deployed and operational** at api.bondmcp.com with all 52 endpoints working. The complete API infrastructure is live on AWS Lambda with API Gateway integration.

### Quick Start

1. **API Access**: [api.bondmcp.com/prod](https://api.bondmcp.com/prod) - **LIVE & OPERATIONAL**
2. **Web Platform**: [app.bondmcp.com](https://app.bondmcp.com) - **LIVE & OPERATIONAL**
3. **Documentation**: [docs.bondmcp.com](https://docs.bondmcp.com) - Complete API docs
4. **Mobile Apps**: iOS and Android apps (Planned for Q4 2025)

## 📋 **Getting Started**

### Web Platform (LIVE)

The web platform is available at [app.bondmcp.com](https://app.bondmcp.com) to:

- Create your account
- Access the full dashboard
- Manage your health data
- Get AI-powered insights

> **✅ Status**: Web platform is **LIVE and operational**.

### CLI Installation (Coming Soon)

```bash
# Available soon
pip install bondmcp-cli
```

### Authentication (LIVE)

```bash
# Register at app.bondmcp.com to get your API key
export BONDMCP_API_KEY="your-api-key"
```

### First Health Query (LIVE)

```bash
# Live API endpoint
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "What should I eat for breakfast?"}' \
  https://api.bondmcp.com/prod/health/ask
```

## 🔑 **API Access (LIVE)**

### Direct API Calls

```bash
# Live API endpoint - fully operational
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the benefits of exercise?"}' \
  https://api.bondmcp.com/prod/health/ask
```

> **✅ Status**: api.bondmcp.com/prod is **LIVE with 52 operational endpoints**.

### Using SDKs (In Development)

#### Python SDK (Coming Soon)

```bash
# Available soon
pip install bondmcp-python
```

```python
# Planned API interface
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
response = client.health.ask("What are the health benefits of meditation?")
print(response.answer)
```

#### JavaScript SDK (Coming Soon)

```bash
# Available soon
npm install @bondmcp/sdk
```

```javascript
// Planned API interface
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
const response = await client.health.ask('What are the health benefits of meditation?');
console.log(response.answer);
```

## 🎯 **Platform Access Methods**

### ✅ Live Access Methods

- **Web Platform**: Full-featured web application at [app.bondmcp.com](https://app.bondmcp.com) - **LIVE**
- **REST API**: Direct API access for integrations at [api.bondmcp.com/prod](https://api.bondmcp.com/prod) - **LIVE**

### 🔄 Coming Soon

- **Mobile Apps**: iOS and Android applications (Planned Q4 2025)
- **CLI Tools**: Command-line interface for developers (Coming Soon)
- **SDKs**: Python, JavaScript, Go, and CLI libraries (In Development)

### 🌟 Platform Features (LIVE)

- **Interactive Dashboard**: Visual health insights and analytics
- **Health Data Management**: Comprehensive health record management
- **AI-Powered Analysis**: Advanced health AI with personalized recommendations
- **Multi-Device Sync**: Access your data across all devices
- **Team Collaboration**: Share insights with healthcare providers

## 🧠 **Health AI Capabilities (LIVE)**

### Core Features - All Operational

- **Health Question Answering**: Get evidence-based answers to health questions ✅
- **Lab Result Analysis**: Interpret blood work and lab results with AI insights ✅
- **Nutrition Analysis**: Analyze meals and get personalized nutritional guidance ✅
- **Supplement Recommendations**: AI-powered supplement suggestions ✅
- **Health Risk Assessment**: Comprehensive health risk evaluation ✅
- **Symptom Checker**: AI-powered symptom analysis and recommendations ✅
- **Medication Interactions**: Check drug interactions and side effects ✅

### Live API Endpoints (52 Total)

- `/health/ask` - Health question answering ✅ **LIVE**
- `/health/labs/interpret` - Lab result analysis ✅ **LIVE**
- `/health/nutrition/analyze` - Nutrition analysis ✅ **LIVE**
- `/health/supplements/recommend` - Supplement recommendations ✅ **LIVE**
- `/health/status` - Health status check ✅ **LIVE**
- `/health/symptoms/check` - Symptom analysis ✅ **LIVE**
- `/health/medications/check` - Medication interaction checking ✅ **LIVE**
- **+45 more endpoints** across 11 categories ✅ **ALL LIVE**

> **✅ Status**: All 52 endpoints are **deployed and operational** at api.bondmcp.com/prod.

## 📚 **Documentation**

- [**Getting Started**](/) - Complete platform guide
- [**API Reference**](/api-reference) - Full API documentation
- [**SDKs & Tools**](/sdks-and-tools) - SDK documentation and examples
- [**Web Platform Guide**](/web-platform) - Web application documentation
- [**Authentication**](/authentication) - Authentication setup guide

## 💳 **Pricing (LIVE)**

- **Free Tier**: 1,000 API calls per month + basic web access ✅ **AVAILABLE**
- **Pro Plan**: $29/month for 50,000 calls + premium features ✅ **AVAILABLE**
- **Enterprise**: Custom pricing for organizations and healthcare providers ✅ **AVAILABLE**

Billing is available through the web dashboard at [app.bondmcp.com](https://app.bondmcp.com).

## 🔐 **Security & Compliance**

- **HIPAA Compliant**: Enterprise-grade security and privacy
- **SOC 2 Type II**: Comprehensive security controls
- **End-to-End Encryption**: All data encrypted in transit and at rest
- **Zero-Trust Architecture**: Advanced security model
- **Regular Security Audits**: Continuous security monitoring

## 🚀 **Get Started Now**

1. **Visit**: [app.bondmcp.com](https://app.bondmcp.com) to create your account
2. **Generate**: API keys from your dashboard
3. **Integrate**: Use our live API at [api.bondmcp.com/prod](https://api.bondmcp.com/prod)
4. **Build**: Amazing health AI applications

**The BondMCP platform is LIVE and ready for production use!**
