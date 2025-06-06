# Quick Start Guide

This guide will help you get started with BondMCP API integration in just a few minutes.

## Step 1: Sign Up

Create an account at [bondmcp.com](https://bondmcp.com) to get access to the API.

## Step 2: Get Your API Key

After signing up, navigate to the API Keys section in your dashboard to generate an API key.

## Step 3: Choose Your Integration Method

### Option A: Use an SDK (Recommended)

We provide SDKs in multiple languages for easy integration:

```bash
# JavaScript/TypeScript
npm install bondmcp

# Python
pip install bondmcp

# Go
go get github.com/bondmcp/bondmcp-go
```

### Option B: Direct API Integration

If you prefer to use the API directly, you can make HTTP requests to our endpoints.

## Step 4: Make Your First API Call

### Using an SDK

```javascript
// JavaScript/TypeScript
import { BondMCPClient } from 'bondmcp';

const client = new BondMCPClient({ apiKey: 'your-api-key' });

// Ask a health question
const response = await client.ask('What are the symptoms of high blood pressure?');
console.log(response.answer);
```

```python
# Python
from bondmcp import BondMCPClient

client = BondMCPClient(api_key='your-api-key')

# Ask a health question
response = client.ask('What are the symptoms of high blood pressure?')
print(response.answer)
```

### Using Direct API

```bash
curl -X POST https://api.bondmcp.com/api/v1/ask \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the symptoms of high blood pressure?"}'
```

## Next Steps

- Explore the [API Reference](./README.md) for detailed endpoint documentation
- Check out our [SDK Documentation](https://docs.bondmcp.com/sdks) for language-specific guides
- See [Examples](https://github.com/bondmcp/mcp/tree/main/examples) for integration patterns
- Join our [Discord Community](https://discord.gg/bondmcp) for support and updates

For complete documentation, visit [docs.bondmcp.com](https://docs.bondmcp.com)
