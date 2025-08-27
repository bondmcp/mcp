# Authentication Setup

BondMCP uses API key authentication for all requests.

## CLI Authentication

### Install CLI
```bash
pip install bondmcp-cli
```

### Login
```bash
bondmcp auth login
```

### Generate API Key
```bash
bondmcp keys create --name "my-app"
```

## API Authentication

### Using API Key
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.bondmcp.com/health
```

### Environment Variable
```bash
export BONDMCP_API_KEY="your-api-key"
```

## SDK Authentication

### Python
```python
from bondmcp import BondMCP

client = BondMCP(api_key="your-api-key")
```

### JavaScript
```javascript
import { BondMCP } from '@bondmcp/sdk';

const client = new BondMCP({ apiKey: 'your-api-key' });
```

## No Web Dashboard

BondMCP does not provide a web-based dashboard. All authentication and key management is done via CLI or API.
