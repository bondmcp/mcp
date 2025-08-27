---
description: BondMCP Health AI Platform - CLI and API Documentation
---

# BondMCP - AI Health Answers You Can Trust

## 🚀 **CLI/API Only Platform**

BondMCP is a **command-line and API-only** health AI platform. There is no web-based dashboard, registration, or billing interface.

### Quick Start

1. **Install CLI**: `pip install bondmcp-cli`
2. **Authenticate**: `bondmcp auth login`
3. **Create API Key**: `bondmcp keys create --name "my-app"`
4. **Ask Questions**: `bondmcp ask "What are the benefits of vitamin D?"`

## 📋 **Getting Started**

### CLI Installation
```bash
pip install bondmcp-cli
```

### Authentication
```bash
# Login with credentials
bondmcp auth login

# Or set API key directly
export BONDMCP_API_KEY="your-api-key"
```

### First Health Query
```bash
bondmcp ask "What should I eat for breakfast?"
```

## 🔑 **API Access**

### Direct API Calls
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the benefits of exercise?"}' \
  https://api.bondmcp.com/v1/ask
```

### Using SDKs

#### Python
```bash
pip install bondmcp-python
```

```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
response = client.ask("What are the health benefits of meditation?")
print(response.answer)
```

#### JavaScript
```bash
npm install @bondmcp/sdk
```

```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
const response = await client.ask('What are the health benefits of meditation?');
console.log(response.answer);
```

## 🎯 **Platform Status**

**Current Status**: CLI/API Only - No Web Interface

### ✅ Available
- **CLI Tools**: Full command-line interface
- **REST API**: Direct API access
- **SDKs**: Python, JavaScript, Go, CLI
- **Authentication**: API key based
- **Health AI**: Question answering, analysis, recommendations

### ❌ Not Available
- Web-based user registration
- Browser dashboard
- Online billing interface
- Web-based API key management

## 🧠 **Health AI Capabilities**

### Core Features
- **Health Question Answering**: Get evidence-based answers to health questions
- **Lab Result Analysis**: Interpret blood work and lab results
- **Nutrition Analysis**: Analyze meals and get nutritional insights
- **Supplement Recommendations**: Personalized supplement suggestions
- **Health Risk Assessment**: Evaluate health risks and get recommendations

### API Endpoints
- `/v1/ask` - Health question answering
- `/v1/labs` - Lab result analysis
- `/v1/nutrition` - Nutrition analysis
- `/v1/supplements` - Supplement recommendations
- `/v1/health` - Health status check

## 📚 **Documentation**

- **[Getting Started](getting-started/README.md)** - Quick start guide
- **[API Reference](api-reference/README.md)** - Complete API documentation
- **[SDKs & Tools](sdks/README.md)** - SDK documentation and examples
- **[CLI Documentation](sdks/cli/README.md)** - Command-line interface guide

## 🔧 **CLI Commands**

### Authentication
```bash
bondmcp auth login          # Login with credentials
bondmcp auth logout         # Logout
bondmcp auth status         # Check auth status
```

### API Keys
```bash
bondmcp keys create         # Create new API key
bondmcp keys list           # List all keys
bondmcp keys revoke         # Revoke a key
```

### Health Queries
```bash
bondmcp ask "question"      # Ask health question
bondmcp analyze --data      # Analyze health data
bondmcp labs --file         # Analyze lab results
bondmcp nutrition --meal    # Analyze nutrition
```

### Usage & Billing
```bash
bondmcp usage show          # Show API usage
bondmcp billing status      # Check billing status
```

## 💳 **Pricing**

- **Free Tier**: 1,000 API calls per month
- **Pro Plan**: $29/month for 50,000 calls
- **Enterprise**: Custom pricing for high-volume usage

All billing is managed via CLI - no web interface.

## 🔐 **Security**

- **API Key Authentication**: Secure token-based access
- **HTTPS Only**: All communications encrypted
- **HIPAA Compliant**: Enterprise-grade security
- **Rate Limiting**: Automatic request throttling

## 📞 **Support**

- **CLI Help**: `bondmcp --help`
- **API Status**: [ACTUAL_API_STATUS.md](ACTUAL_API_STATUS.md)
- **Documentation**: Complete guides and examples included

---

**Note**: BondMCP is designed as a developer-first, CLI/API-only platform. All functionality is accessed through command-line tools or direct API calls.
