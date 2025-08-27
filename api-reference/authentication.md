# Authentication

BondMCP uses API key authentication for all requests.

## API Key Authentication

### Getting an API Key
```bash
# Install CLI
pip install bondmcp-cli

# Login
bondmcp auth login

# Create API key
bondmcp keys create --name "my-app"
```

### Using API Keys

#### HTTP Header
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.bondmcp.com/v1/health
```

#### Environment Variable
```bash
export BONDMCP_API_KEY="your-api-key"
bondmcp ask "What are the benefits of exercise?"
```

### SDK Authentication

#### Python
```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
```

#### JavaScript
```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
```

## Key Management

### Create Keys
```bash
bondmcp keys create --name "production-app"
```

### List Keys
```bash
bondmcp keys list
```

### Revoke Keys
```bash
bondmcp keys revoke --key-id "key-id"
```

## Security Best Practices

1. **Keep keys secure** - Never commit API keys to version control
2. **Use environment variables** - Store keys in environment variables
3. **Rotate keys regularly** - Create new keys and revoke old ones
4. **Use specific key names** - Name keys by application/purpose
5. **Monitor usage** - Check key usage with `bondmcp usage show`

## No Web Interface

All key management is done via CLI. There is no web-based dashboard for API key management.
