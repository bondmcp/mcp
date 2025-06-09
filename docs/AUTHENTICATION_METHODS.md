# Authentication Methods Alignment

## Current Issues
- OpenAPI spec shows `X-API-Key` for authentication
- SDK implementation uses `Authorization: Bearer {api_key}`
- No consistent error handling examples for authentication failures

## Standardized Authentication

### API Key Authentication
All SDKs should use the following header format:
```
Authorization: Bearer {api_key}
```

### Authentication Error Handling
All SDKs should implement consistent error handling for:
- Invalid API key
- Expired API key
- Rate limiting
- Permission denied

## Implementation Guide

### Python SDK
```python
def handle_auth_error(response):
    if response.status_code == 401:
        raise AuthenticationError("Invalid API key")
    elif response.status_code == 403:
        raise PermissionError("Insufficient permissions")
    elif response.status_code == 429:
        raise RateLimitError("Rate limit exceeded")
```

### TypeScript SDK
```typescript
function handleAuthError(error) {
  if (error.status === 401) {
    throw new AuthenticationError("Invalid API key");
  } else if (error.status === 403) {
    throw new PermissionError("Insufficient permissions");
  } else if (error.status === 429) {
    throw new RateLimitError("Rate limit exceeded");
  }
}
```

## Security Best Practices
- Never hardcode API keys in your code
- Store API keys in environment variables
- Rotate API keys regularly
- Use different API keys for development and production
- Implement proper error handling for authentication failures
