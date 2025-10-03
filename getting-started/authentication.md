# Authentication

BondMCP uses JWT (JSON Web Tokens) for secure API authentication. This guide covers registration, token management, and authentication methods.

## Registration

### Create an Account

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "secure_password"
  }'
```

**Response:**

```json
{
  "message": "Registration successful",
  "user_id": "usr_abc123",
  "email": "your@email.com"
}
```

### Email Verification

After registration, verify your email by clicking the link sent to your inbox. This step is required before API access is granted.

## Getting JWT Tokens

### Login to Receive Token

```bash
curl -X POST https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "your_password"
  }'
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

## Authentication Methods

### Method 1: Bearer Token (Recommended)

Use the JWT token from login:

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/health-ai/models \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Method 2: API Key

For server-to-server integrations, use persistent API keys:

1. Log in to your dashboard
2. Go to **Settings → API Keys**
3. Generate a new API key
4. Use it in your requests:

```bash
curl -X GET https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp/health-ai/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Token Expiration and Refresh

### Token Lifetime

- **JWT Tokens**: Expire after 1 hour (3600 seconds)
- **API Keys**: Never expire (until manually revoked)

### Refreshing Tokens

When your JWT token expires, simply login again to receive a new token:

```python
import requests
from datetime import datetime, timedelta

class BondMCPClient:
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.token = None
        self.token_expiry = None
        self.base_url = "https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp"
    
    def login(self):
        response = requests.post(
            f"{self.base_url}/auth/login",
            json={"email": self.email, "password": self.password}
        )
        data = response.json()
        self.token = data["access_token"]
        self.token_expiry = datetime.now() + timedelta(seconds=data["expires_in"])
    
    def ensure_authenticated(self):
        if not self.token or datetime.now() >= self.token_expiry:
            self.login()
    
    def get_headers(self):
        self.ensure_authenticated()
        return {"Authorization": f"Bearer {self.token}"}
```

## Security Best Practices

### DO ✅

- Store API keys in environment variables
- Use HTTPS for all requests
- Rotate API keys regularly
- Use short-lived JWT tokens for client applications
- Use long-lived API keys for server-side integrations

### DON'T ❌

- Commit API keys to version control
- Share API keys in public repositories
- Expose tokens in client-side JavaScript (for web apps)
- Use the same API key across multiple environments

## Example: Secure Python Integration

```python
import os
import requests

# Store in environment variables
API_KEY = os.getenv("BONDMCP_API_KEY")
BASE_URL = "https://t9xbkyb7mg.us-east-1.awsapprunner.com/mcp"

def make_request(endpoint, data):
    response = requests.post(
        f"{BASE_URL}/{endpoint}",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json=data
    )
    response.raise_for_status()
    return response.json()
```

## Error Codes

| Status Code | Error | Solution |
|-------------|-------|----------|
| 401 | Invalid or expired token | Login again or check API key |
| 403 | Insufficient permissions | Upgrade your plan |
| 429 | Rate limit exceeded | Wait or upgrade plan |

## Need Help?

Contact support@bondmcp.com for authentication issues.
