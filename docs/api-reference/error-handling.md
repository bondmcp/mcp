# Error Handling

This guide explains how to handle errors when interacting with the BondMCP API.

## Error Response Format

All BondMCP API errors follow a consistent JSON format:

```json
{
  "error": {
    "code": "error_code",
    "message": "A human-readable error message",
    "details": {
      "additional": "error-specific information"
    },
    "request_id": "unique-request-identifier"
  }
}
```

- **code**: A string identifier for the error type
- **message**: A human-readable description of what went wrong
- **details**: Additional context about the error (optional)
- **request_id**: A unique identifier for the request that can be used when contacting support

## Common HTTP Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|--------------|
| 400 | Bad Request | Invalid request parameters or body format |
| 401 | Unauthorized | Missing API key |
| 403 | Forbidden | Invalid API key or insufficient permissions |
| 404 | Not Found | Requested resource doesn't exist |
| 422 | Unprocessable Entity | Request validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side issue |
| 503 | Service Unavailable | Temporary service outage |

## Common Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| `invalid_request` | The request was malformed | Check your request format and parameters |
| `authentication_error` | Authentication failed | Verify your API key is correct and active |
| `permission_denied` | Insufficient permissions | Check your API key permissions |
| `rate_limit_exceeded` | Too many requests | Implement backoff strategy and optimize requests |
| `resource_not_found` | Requested resource not found | Verify resource identifiers |
| `validation_error` | Request validation failed | Check the error details for specific field errors |
| `service_error` | Internal service error | Retry with exponential backoff |

## Handling Errors in Your Code

### JavaScript Example

```javascript
try {
  const response = await fetch('https://api.bondmcp.com/api/ask', {
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
  
  if (!response.ok) {
    // Handle error
    console.error(`Error ${data.error.code}: ${data.error.message}`);
    console.error(`Request ID: ${data.error.request_id}`);
    // Implement appropriate error handling
    return;
  }
  
  // Process successful response
  console.log(data);
} catch (error) {
  // Handle network or parsing errors
  console.error('Network or parsing error:', error);
}
```

### Python Example

```python
import requests

url = "https://api.bondmcp.com/api/ask"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "YOUR_API_KEY"
}
payload = {
    "message": "What are the symptoms of diabetes?",
    "context": "health_consultation"
}

try:
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()  # Raises an exception for 4XX/5XX responses
    data = response.json()
    # Process successful response
    print(data)
except requests.exceptions.HTTPError as e:
    # Handle HTTP errors (4XX/5XX)
    error_data = e.response.json()
    print(f"Error {error_data['error']['code']}: {error_data['error']['message']}")
    print(f"Request ID: {error_data['error']['request_id']}")
    # Implement appropriate error handling
except requests.exceptions.RequestException as e:
    # Handle network errors
    print(f"Network error: {e}")
```

## Rate Limiting and Retries

When encountering `429 Too Many Requests` errors, implement an exponential backoff strategy:

```javascript
// JavaScript example of exponential backoff
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        // Get retry-after header or use exponential backoff
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, retries);
        console.log(`Rate limited. Retrying in ${retryAfter} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        retries++;
        continue;
      }
      
      return response;
    } catch (error) {
      if (retries >= maxRetries - 1) throw error;
      retries++;
      // Exponential backoff for network errors
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
}
```

## SDK Error Handling

Our SDKs provide built-in error handling with typed exceptions:

```javascript
// JavaScript SDK
try {
  const response = await client.ask({
    message: "What are the symptoms of diabetes?",
    context: "health_consultation"
  });
  console.log(response);
} catch (error) {
  if (error instanceof BondMCPAuthError) {
    // Handle authentication errors
  } else if (error instanceof BondMCPRateLimitError) {
    // Handle rate limiting
  } else if (error instanceof BondMCPApiError) {
    // Handle API errors
    console.error(`${error.code}: ${error.message}`);
    console.error(`Request ID: ${error.requestId}`);
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

## Getting Help

If you encounter persistent errors or need assistance:

1. Note the error `code` and `request_id`
2. Check our **Troubleshooting Guide** (CLI/API only)
3. Search the **FAQ** (CLI/API only)
4. Contact support at support@bondmcp.com with the error details

For more information on specific endpoint errors, refer to the individual endpoint documentation.
