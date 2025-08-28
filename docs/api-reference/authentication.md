# Authentication

BondMCP uses API keys for secure authentication. This guide explains how to obtain, use, and manage your API keys.

## Obtaining an API Key

API keys can be obtained through the [BondMCP Developer Portal](https://bondmcp.com/developers). After creating an account and agreeing to the terms of service, you can generate API keys for your projects.

## Using Your API Key

Include your API key in the `X-API-Key` header with each request to authenticated endpoints:

```
X-API-Key: YOUR_API_KEY
```

### Example Request (cURL)

```bash
curl -X POST "https://api.bondmcp.com/api/v1/ask" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "message": "What are the symptoms of diabetes?",
    "context": "health_consultation"
  }'
```

### Example Request (JavaScript)

```javascript
const response = await fetch('https://api.bondmcp.com/api/v1/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'What are the symptoms of diabetes?',
    context: 'health_consultation'
  })
});

const data = await response.json();
console.log(data);
```

### Example Request (Python)

```python
import requests

url = "https://api.bondmcp.com/api/v1/ask"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "YOUR_API_KEY"
}
payload = {
    "message": "What are the symptoms of diabetes?",
    "context": "health_consultation"
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print(data)
```

## API Key Security Best Practices

1. **Never expose your API key** in client-side code or public repositories
2. **Use environment variables** to store your API key in your applications
3. **Create separate API keys** for different environments (development, staging, production)
4. **Implement key rotation** periodically for enhanced security
5. **Set appropriate permissions** for each API key based on your needs

## Managing API Keys

You can manage your API keys through the [BondMCP Developer Portal](https://bondmcp.com/developers):

- **View** your active API keys and their usage statistics
- **Create** new API keys with specific permissions
- **Revoke** compromised or unused API keys
- **Set usage limits** to control API consumption

## Error Responses

If authentication fails, you'll receive one of these error responses:

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 401 | Unauthorized | No API key was provided in the request |
| 403 | Forbidden | The provided API key is invalid or has been revoked |
| 429 | Too Many Requests | The API key has exceeded its rate limit |

For more information on handling errors, see the **Error Handling** (CLI/API only) guide.

## SDK Authentication

When using our official SDKs, authentication is handled automatically once you initialize the client with your API key:

```javascript
// JavaScript SDK
const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});
```

```python
# Python SDK
client = BondMCPClient(api_key="YOUR_API_KEY")
```

For more information on using our SDKs, see the **SDK Integration** (CLI/API only) guides.
