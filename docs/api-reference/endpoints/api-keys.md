# API Key Management

The `/api/v1/keys` endpoints allow you to create, list, and revoke API keys for your BondMCP account.

## Endpoints

### List API Keys

```
GET /api/v1/keys
```

#### Authentication

Requires API key authentication via the `X-API-Key` header.

#### Response Format

```json
{
  "api_keys": [
    {
      "id": "key_123abc456def",
      "name": "Production API Key",
      "created_at": "2025-05-01T10:00:00.000Z",
      "last_used_at": "2025-06-06T09:30:00.000Z",
      "permissions": ["ask", "labs", "health_data", "supplement"],
      "status": "active"
    },
    {
      "id": "key_789ghi012jkl",
      "name": "Development API Key",
      "created_at": "2025-05-15T14:30:00.000Z",
      "last_used_at": "2025-06-05T16:45:00.000Z",
      "permissions": ["ask", "labs"],
      "status": "active"
    }
  ]
}
```

### Create API Key

```
POST /api/v1/keys
```

#### Authentication

Requires API key authentication via the `X-API-Key` header.

#### Request Format

```json
{
  "name": "New Development Key",
  "permissions": ["ask", "labs"],
  "expires_at": "2026-06-06T00:00:00.000Z"
}
```

##### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | A descriptive name for the API key |
| `permissions` | array | No | List of specific permissions to grant (defaults to all available permissions) |
| `expires_at` | string | No | ISO 8601 timestamp when the key should expire (defaults to no expiration) |

#### Response Format

```json
{
  "api_key": {
    "id": "key_345mno678pqr",
    "name": "New Development Key",
    "key": "bmc_sk_345mno678pqr",
    "created_at": "2025-06-06T11:17:00.000Z",
    "expires_at": "2026-06-06T00:00:00.000Z",
    "permissions": ["ask", "labs"],
    "status": "active"
  }
}
```

**Important**: The full API key (`key` field) is only returned once upon creation. Store it securely as you won't be able to retrieve it again.

### Revoke API Key

```
DELETE /api/v1/keys/{key_id}
```

#### Authentication

Requires API key authentication via the `X-API-Key` header.

#### Path Parameters

| Parameter | Description |
|-----------|-------------|
| `key_id` | The ID of the API key to revoke |

#### Response Format

```json
{
  "id": "key_789ghi012jkl",
  "status": "revoked",
  "revoked_at": "2025-06-06T11:17:30.000Z"
}
```

## Example Usage

### List API Keys

#### cURL

```bash
curl -X GET "https://api.bondmcp.com/api/v1/keys" \
  -H "X-API-Key: YOUR_API_KEY"
```

#### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function listApiKeys() {
  try {
    const response = await client.keys.list();
    console.log("API Keys:", response.api_keys);
  } catch (error) {
    console.error("Error listing API keys:", error);
  }
}

listApiKeys();
```

#### Python

```python
from bondmcp_sdk import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.keys.list()
    print("API Keys:", response.api_keys)
except Exception as e:
    print(f"Error listing API keys: {e}")
```

### Create API Key

#### cURL

```bash
curl -X POST "https://api.bondmcp.com/api/v1/keys" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "name": "New Development Key",
    "permissions": ["ask", "labs"]
  }'
```

#### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function createApiKey() {
  try {
    const response = await client.keys.create({
      name: "New Development Key",
      permissions: ["ask", "labs"]
    });
    
    console.log("New API Key:", response.api_key.key);
    console.log("Key ID:", response.api_key.id);
    
    // Store this key securely - you won't be able to retrieve it again
  } catch (error) {
    console.error("Error creating API key:", error);
  }
}

createApiKey();
```

#### Python

```python
from bondmcp_sdk import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    response = client.keys.create(
        name="New Development Key",
        permissions=["ask", "labs"]
    )
    
    print("New API Key:", response.api_key.key)
    print("Key ID:", response.api_key.id)
    
    # Store this key securely - you won't be able to retrieve it again
except Exception as e:
    print(f"Error creating API key: {e}")
```

### Revoke API Key

#### cURL

```bash
curl -X DELETE "https://api.bondmcp.com/api/v1/keys/key_789ghi012jkl" \
  -H "X-API-Key: YOUR_API_KEY"
```

#### JavaScript

```javascript
import { BondMCPClient } from '@bondmcp/sdk';

const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY'
});

async function revokeApiKey() {
  try {
    const keyId = "key_789ghi012jkl";
    const response = await client.keys.revoke(keyId);
    console.log(`API Key ${keyId} revoked at ${response.revoked_at}`);
  } catch (error) {
    console.error("Error revoking API key:", error);
  }
}

revokeApiKey();
```

#### Python

```python
from bondmcp_sdk import BondMCPClient

client = BondMCPClient(api_key="YOUR_API_KEY")

try:
    key_id = "key_789ghi012jkl"
    response = client.keys.revoke(key_id)
    print(f"API Key {key_id} revoked at {response.revoked_at}")
except Exception as e:
    print(f"Error revoking API key: {e}")
```

## Available Permissions

| Permission | Description |
|------------|-------------|
| `ask` | Access to the health question answering endpoint |
| `labs` | Access to lab result interpretation endpoints |
| `health_data` | Access to health data analysis endpoints |
| `supplement` | Access to supplement recommendation endpoints |
| `import` | Access to data import endpoints |
| `insights` | Access to health insights endpoints |

## Best Practices

1. **Use descriptive names** for your API keys to easily identify their purpose
2. **Create separate keys** for different environments (development, staging, production)
3. **Limit permissions** to only what each application needs
4. **Set expiration dates** for temporary access or integration testing
5. **Regularly audit** your API keys and revoke unused ones
6. **Never share** API keys in public repositories or client-side code
7. **Store keys securely** using environment variables or a secrets manager

## Error Responses

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `invalid_request` | Invalid request parameters |
| 401 | `authentication_error` | Missing API key |
| 403 | `permission_denied` | Invalid API key or insufficient permissions |
| 404 | `key_not_found` | The specified API key ID was not found |
| 429 | `rate_limit_exceeded` | Rate limit exceeded |

For more details on error handling, see the [Error Handling Guide](../error-handling.md).

## Related Endpoints

- [Health Check](./health.md)
