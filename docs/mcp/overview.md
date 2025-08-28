# MCP Overview: Configuration & Capability Discovery

## What is MCP?

Model Control Protocol (MCP) is a standardized discovery and capability management system for BondMCP API. It allows clients to dynamically discover available endpoints, understand their capabilities, and verify system integrity through cryptographic hashes.

## Core Components

### MCP Configuration

The MCP configuration provides comprehensive information about the BondMCP service including:

- **Service Information**: Name, version, and description
- **Authentication Methods**: Supported auth types (API key, bearer tokens)
- **Capabilities**: Complete list of available endpoints with metadata
- **Rate Limits**: Per-minute, per-hour, and per-day limits
- **Contact Information**: Support email and URLs
- **Update Timestamp**: When the configuration was last modified

### MCP Capabilities

Each capability represents an available API endpoint with detailed metadata:

- **Identification**: Unique ID and human-readable name
- **HTTP Details**: Method (GET, POST, etc.) and path
- **Documentation**: Description and usage examples
- **Authentication**: Whether auth is required for this endpoint
- **Rate Limiting**: Tier classification (basic, standard, premium)
- **Versioning**: Capabilities use `:v1` suffix policy for version management
- **Lifecycle**: Deprecation status for planned changes

### MCP Manifest

The manifest provides a cryptographic summary for verification:

- **Version**: Current MCP protocol version
- **Hash**: SHA256 of the capabilities array for integrity verification
- **Generation Time**: When the manifest was created
- **Configuration URL**: Link to the full configuration

## Discovery Flow

### 1. Basic Discovery

```bash
# Get the complete MCP configuration
curl https://api.bondmcp.com/.well-known/mcp-configuration

# Get the lightweight manifest for verification
curl https://api.bondmcp.com/.well-known/mcp-manifest.json
```

### 2. Capability Verification

#### Python Example

```python
import hashlib
import json
import requests

# Fetch configuration and manifest
config_resp = requests.get("https://api.bondmcp.com/.well-known/mcp-configuration")
manifest_resp = requests.get("https://api.bondmcp.com/.well-known/mcp-manifest.json")

config = config_resp.json()
manifest = manifest_resp.json()

# Verify capabilities hash
capabilities_json = json.dumps(config["capabilities"], sort_keys=True, separators=(',', ':'))
calculated_hash = hashlib.sha256(capabilities_json.encode()).hexdigest()

if calculated_hash == manifest["capabilities_sha256"]:
    print("✓ Capabilities verified successfully")
else:
    print("✗ Capabilities hash mismatch - potential tampering detected")
```

#### Node.js Example

```javascript
const crypto = require("crypto");

async function verifyCapabilities() {
  const [configResp, manifestResp] = await Promise.all([
    fetch("https://api.bondmcp.com/.well-known/mcp-configuration"),
    fetch("https://api.bondmcp.com/.well-known/mcp-manifest.json"),
  ]);

  const config = await configResp.json();
  const manifest = await manifestResp.json();

  // Calculate hash of capabilities
  const capabilitiesJson = JSON.stringify(config.capabilities);
  const calculatedHash = crypto
    .createHash("sha256")
    .update(capabilitiesJson)
    .digest("hex");

  if (calculatedHash === manifest.capabilities_sha256) {
    console.log("✓ Capabilities verified successfully");
    return true;
  } else {
    console.log("✗ Capabilities hash mismatch");
    return false;
  }
}
```

## Rate Limiting & Error Handling

### Rate Limit Headers

All MCP and API responses include standard rate limiting headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Handling 429 Responses

When rate limits are exceeded, the API returns a standardized error format:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 60 seconds."
  }
}
```

Example handling:

```python
import time
import requests

def make_request_with_backoff(url, headers):
    response = requests.get(url, headers=headers)

    if response.status_code == 429:
        retry_after = int(response.headers.get('Retry-After', 60))
        print(f"Rate limited. Waiting {retry_after} seconds...")
        time.sleep(retry_after)
        return make_request_with_backoff(url, headers)

    return response
```

## Authentication Patterns

### API Key Authentication

```bash
curl -H "X-API-Key: YOUR_API_KEY" \
     https://api.bondmcp.com/.well-known/mcp-configuration
```

### Bearer Token Authentication

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://api.bondmcp.com/api/v1/health/analyze
```

### Sample Header Usage

```python
# API Key
headers = {"X-API-Key": os.getenv("BOND_API_KEY")}

# Bearer Token
headers = {"Authorization": f"Bearer {jwt_token}"}
```

## Capability Versioning

BondMCP uses a `:v1` suffix policy for capability versioning:

- Current endpoints use implicit `:v1` versioning
- Future versions will be explicitly versioned (`:v2`, `:v3`, etc.)
- Deprecated capabilities are marked in the configuration
- Clients should check the `deprecated` flag before using capabilities

## Security Considerations

### Manifest Verification

Always verify the capabilities hash when building automated clients:

1. Fetch both configuration and manifest
2. Calculate SHA256 of the capabilities array
3. Compare with the manifest's `capabilities_sha256`
4. Reject configurations that don't match

### Environment Variables

Use environment variables for sensitive credentials:

```bash
export BOND_API_KEY="your-api-key-here"
export BOND_JWT_TOKEN="your-jwt-token-here"
```

Never hardcode API keys or tokens in your application code.

## Migration Notes

### From Hardcoded Endpoints to Dynamic Discovery

Before MCP:

```python
# Hardcoded endpoint list
ENDPOINTS = [
    "/api/v1/health",
    "/api/v1/ask",
    "/api/v1/analyze"
]
```

With MCP:

```python
# Dynamic discovery
config = requests.get("/.well-known/mcp-configuration").json()
available_endpoints = [cap["path"] for cap in config["capabilities"]]
```

### Benefits of Migration

- **Future-proof**: Automatically discover new endpoints
- **Resilient**: Handle deprecated endpoints gracefully
- **Efficient**: Understand rate limits and auth requirements upfront
- **Secure**: Verify system integrity with cryptographic hashes
