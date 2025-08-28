# Health API Endpoint

The `/api/v1/health` endpoint provides information about the operational status of the BondMCP API and its core dependencies.

## Endpoint

```
GET /api/v1/health
```

## Authentication

No authentication required. This endpoint is publicly accessible.

## Request Format

This endpoint does not require any parameters.

## Response Format

```json
{
  "status": "healthy",
  "version": "1.5.2",
  "timestamp": "2025-06-06T11:16:00.000Z",
  "environment": "production",
  "services": {
    "llm": "healthy",
    "redis": "healthy",
    "database": "healthy"
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Overall status of the API (e.g., "healthy", "degraded", "maintenance") |
| `version` | string | Current API version |
| `timestamp` | string | ISO 8601 timestamp of the health check |
| `environment` | string | Deployment environment (e.g., "production", "staging") |
| `services` | object | Status of key dependent services |
| `services.llm` | string | Status of the AI model service |
| `services.redis` | string | Status of the caching service |
| `services.database` | string | Status of the database service |

## Example Usage

### cURL

```bash
curl -X GET "https://api.bondmcp.com/api/v1/health"
```

### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY' // Not required for health check but SDK may expect it
});

async function checkApiHealth() {
  try {
    const health = await client.health();
    console.log(`API Status: ${health.status}`);
    console.log(`Version: ${health.version}`);
    console.log(`Services:`, health.services);
  } catch (error) {
    console.error("Error checking API health:", error);
  }
}

checkApiHealth();
```

### Python

```python
from bondmcp_sdk.client import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")  # Not required for health check but SDK may expect it

try:
    health = client.health()
    print(f"API Status: {health.status}")
    print(f"Version: {health.version}")
    print("Services:", health.services)
except Exception as e:
    print(f"Error checking API health: {e}")
```

## Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | API is healthy and operational |
| 503 | API is degraded or in maintenance mode |

## Best Practices

1. **Use for monitoring**: Integrate this endpoint into your monitoring systems to track API availability
2. **Health checks before critical operations**: Check API health before performing critical operations
3. **Implement circuit breakers**: Use health status to implement circuit breakers in your applications
4. **Automated alerts**: Set up alerts based on health check responses

## Related Endpoints

- **API Key Management** 
