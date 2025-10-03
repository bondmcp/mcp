# Quickstart Guide

Get started with BondMCP in 5 minutes. This guide will walk you through your first API request.

## Step 1: Sign Up

1. Visit [BondMCP Dashboard](https://bondmcp.com)
2. Create your account with email and password
3. Verify your email address

## Step 2: Get Your API Key

1. Log in to your dashboard
2. Navigate to **Settings → API Keys**
3. Click **Generate New API Key**
4. Copy and securely store your API key

## Step 3: Make Your First Request

### Using cURL

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/health-ai/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Analyze cardiovascular risk factors for a 45-year-old patient",
    "analysis_type": "risk_assessment"
  }'
```

### Using Python

```python
import requests

API_KEY = "your_api_key_here"
BASE_URL = "https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp"

response = requests.post(
    f"{BASE_URL}/health-ai/analyze",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "prompt": "Analyze cardiovascular risk factors for a 45-year-old patient",
        "analysis_type": "risk_assessment"
    }
)

print(response.json())
```

### Using JavaScript

```javascript
const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp';

const response = await fetch(`${BASE_URL}/health-ai/analyze`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Analyze cardiovascular risk factors for a 45-year-old patient',
    analysis_type: 'risk_assessment'
  })
});

const data = await response.json();
console.log(data);
```

## Expected Response

```json
{
  "analysis": "Based on the patient profile...",
  "confidence_score": 0.92,
  "recommendations": [
    "Monitor blood pressure regularly",
    "Consider lipid panel screening"
  ],
  "cost": 0.05
}
```

## Next Steps

- [Authentication](./authentication.md) - Learn about JWT tokens and security
- [Pricing & Plans](./pricing-and-plans.md) - Explore available tiers
- [Health AI APIs](../api-reference/health-ai-apis.md) - Discover all 5 health AI endpoints

## Need Help?

- Email: support@bondmcp.com
- Documentation: https://docs.bondmcp.com
