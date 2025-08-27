# First API Call

Make your first call to the BondMCP API.

## Prerequisites

1. Install CLI: `pip install bondmcp-cli`
2. Authenticate: `bondmcp auth login`
3. Get API key: `bondmcp keys create`

## Health Check

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.bondmcp.com/health
```

## Ask a Health Question

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the benefits of vitamin D?"}' \
  https://api.bondmcp.com/ask
```

## Using SDKs

### Python
```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
response = client.ask("What are the benefits of vitamin D?")
print(response.answer)
```

### JavaScript
```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
const response = await client.ask('What are the benefits of vitamin D?');
console.log(response.answer);
```

## Next Steps

- Explore the [API Reference](../api-reference/README.md)
- Try the [SDK Examples](../sdks/README.md)
- Read the [CLI Documentation](../sdks/cli/README.md)
