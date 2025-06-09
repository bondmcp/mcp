# Rate Limiting

This guide explains BondMCP's rate limiting policies and how to handle rate limits in your applications.

## Rate Limit Overview

BondMCP implements rate limiting to ensure fair usage and system stability. Rate limits are applied on a per-API key basis and vary based on your usage level.

## Rate Limit Headers

All API responses include headers that provide information about your current rate limit status:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum number of requests allowed in the current time window |
| `X-RateLimit-Remaining` | Number of requests remaining in the current time window |
| `X-RateLimit-Reset` | Time in UTC epoch seconds when the rate limit window resets |

## Default Rate Limits

Rate limits are based on your pay-per-call usage level:

| Usage Level | Requests per Minute | Daily Limit |
|-------------|---------------------|------------|
| Standard | 60 | 1,000 |
| Enhanced | 300 | 10,000 |
| Premium | 600 | 50,000 |
| Enterprise | Custom | Custom |

## Handling Rate Limits

When you exceed your rate limit, the API will respond with a `429 Too Many Requests` status code. The response will include a `Retry-After` header indicating the number of seconds to wait before retrying.

### Example Rate Limit Response

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Please retry after 30 seconds.",
    "details": {
      "retry_after": 30
    },
    "request_id": "req_123abc456def"
  }
}
```

### Implementing Backoff Strategies

To handle rate limits gracefully, implement an exponential backoff strategy:

#### JavaScript Example

```javascript
async function makeRequestWithBackoff(url, options, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '1');
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

#### Python Example

```python
import time
import requests

def make_request_with_backoff(url, headers, data=None, max_retries=3):
    retries = 0
    
    while retries < max_retries:
        try:
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', 1))
                print(f"Rate limited. Retrying in {retry_after} seconds...")
                time.sleep(retry_after)
                retries += 1
                continue
                
            return response
        except requests.exceptions.RequestException as e:
            if retries >= max_retries - 1:
                raise e
            retries += 1
            # Exponential backoff for network errors
            time.sleep(2 ** retries)
```

## Rate Limit Optimization Strategies

To make the most efficient use of your rate limits:

1. **Implement caching** for frequently accessed data
2. **Batch requests** when possible instead of making multiple individual calls
3. **Prioritize requests** based on importance to your application
4. **Monitor usage patterns** to identify optimization opportunities
5. **Distribute requests evenly** throughout the day rather than in bursts
6. **Implement client-side throttling** to stay under your limits

## Requesting Rate Limit Increases

If you need higher rate limits, you can:

1. **Increase your usage level** for automatic limit increases
2. **Contact support** at support@bondmcp.com for custom rate limit discussions
3. **Apply for enterprise pricing** for high-volume usage needs

## SDK Rate Limit Handling

Our official SDKs include built-in rate limit handling:

```javascript
// JavaScript SDK with automatic retry
const client = new BondMCPClient({
  apiKey: 'YOUR_API_KEY',
  maxRetries: 3,  // Will automatically handle rate limits with backoff
  retryDelay: 1000  // Base delay in ms before applying exponential backoff
});
```

```python
# Python SDK with automatic retry
client = BondMCPClient(
    api_key="YOUR_API_KEY",
    max_retries=3,  # Will automatically handle rate limits with backoff
    retry_delay=1  # Base delay in seconds before applying exponential backoff
)
```

When the API responds with `429 Too Many Requests`, the client waits for
`retry_delay * 2^attempt` seconds (or the `Retry-After` header if provided)
before retrying up to `max_retries` times.

For more information on SDK configuration, see the [SDK Integration](../sdks/) guides.

## Pay-Per-Call Pricing

BondMCP uses a simple pay-per-call pricing model:

1. **No monthly subscriptions** - You only pay for the API calls you make
2. **No minimum commitments** - Scale up or down based on your actual usage
3. **Volume discounts** - Automatically applied as your usage increases
4. **Transparent billing** - Clear per-call pricing with no hidden fees

For detailed pricing information, visit [bondmcp.com/pricing](https://bondmcp.com/pricing).
