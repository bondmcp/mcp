# BondMCP API Examples

## Authentication Flow

### Register User
```bash
curl -X POST https://api.bondmcp.com/prod/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST https://api.bondmcp.com/prod/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com", 
    "password": "securepassword"
  }'
```

## Health AI Analysis

### Analyze Health Data
```bash
curl -X POST https://api.bondmcp.com/prod/health/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["headache", "fatigue"],
    "duration": "3 days",
    "severity": "moderate"
  }'
```

## MCP Tools

### List Available Tools
```bash
curl -X GET https://api.bondmcp.com/prod/mcp/tools \
  -H "Authorization: Bearer <token>"
```

### Execute MCP Tool
```bash
curl -X POST https://api.bondmcp.com/prod/mcp/execute \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "health_analyzer",
    "parameters": {
      "data": "patient health data"
    }
  }'
```

## Python SDK Example

```python
import requests

class BondMCPClient:
    def __init__(self, api_key):
        self.base_url = "https://api.bondmcp.com/prod"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def analyze_health(self, symptoms, duration="unknown"):
        response = requests.post(
            f"{self.base_url}/health/analyze",
            headers=self.headers,
            json={
                "symptoms": symptoms,
                "duration": duration
            }
        )
        return response.json()

# Usage
client = BondMCPClient("your-jwt-token")
result = client.analyze_health(["headache", "nausea"])
print(result)
```

## JavaScript SDK Example

```javascript
class BondMCPClient {
    constructor(apiKey) {
        this.baseUrl = 'https://api.bondmcp.com/prod';
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
    }
    
    async analyzeHealth(symptoms, duration = 'unknown') {
        const response = await fetch(`${this.baseUrl}/health/analyze`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ symptoms, duration })
        });
        return response.json();
    }
}

// Usage
const client = new BondMCPClient('your-jwt-token');
const result = await client.analyzeHealth(['headache', 'nausea']);
console.log(result);
```
